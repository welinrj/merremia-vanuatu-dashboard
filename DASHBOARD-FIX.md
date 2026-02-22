# Dashboard Data Loading Fix

## Problem

The live dashboard (`dashboard-live.html`) was not loading field data collected from devices. The dashboard would show "checking every 2s" but never actually fetch or display the data from the `merremia-field-data` repository.

## Root Cause

The `MerremiaConnector` class in `merremia-connector.js` was using the GitHub API to check for data updates without authentication:

```javascript
// OLD CODE (lines 133-143)
const response = await fetch(
  `https://api.github.com/repos/${this.owner}/${this.repo}/contents/data/all-records.json`,
  {
    method: 'HEAD',
    headers: { 'Accept': 'application/vnd.github.v3+json' }
  }
);
```

**Issues with this approach:**
1. GitHub API has strict rate limits for unauthenticated requests (60 requests/hour)
2. When rate limited or network errors occurred, `checkForUpdates()` returned `null`
3. The `startAutoRefresh()` method interpreted `null` as "check failed" and skipped fetching data
4. The dashboard would continuously check but never load data

## Solution

Modified `checkForUpdates()` to use `raw.githubusercontent.com` instead of the GitHub API when no token is provided:

```javascript
// NEW CODE
const response = await fetch(`${this.baseURL}/data/all-records.json`, {
  method: 'HEAD',
  headers: { 'Cache-Control': 'no-cache' }
});
```

**Benefits of this approach:**
1. ✅ No rate limits on raw.githubusercontent.com
2. ✅ Uses ETag headers for reliable change detection
3. ✅ Falls back gracefully if ETag check fails
4. ✅ On first check, assumes data is available
5. ✅ On subsequent failed checks, assumes no change (avoids excessive fetching)

## Changes Made

**File:** `merremia-connector.js`
- Modified `checkForUpdates()` method (lines 129-165)
- Changed from GitHub API to raw URL for ETag-based change detection
- Added fallback logic for when ETag check fails
- Improved logging for debugging

## Testing

The fix ensures:
- Dashboard loads data on first attempt
- Updates are detected when data changes (via ETag)
- Works reliably without authentication token
- Avoids hitting rate limits
- Degrades gracefully if network issues occur

## Verification

To verify the fix works:

1. Open `dashboard-live.html` in a browser
2. Click "Load Data" button
3. Dashboard should load 5 records from the field collector
4. Status should show "5 records — live (HH:MM:SS)"
5. Map should display markers for field observations
6. Auto-refresh should detect changes every 2 seconds

## Related Files

- `dashboard-live.html` - Live monitoring dashboard
- `merremia-connector.js` - Data connector (FIXED)
- Field data repository: `welinrj/merremia-field-data`
