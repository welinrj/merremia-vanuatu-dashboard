# GitHub Token Configuration Guide

## 🚨 URGENT SECURITY ACTIONS REQUIRED

### Tokens to Revoke Immediately

**TWO GitHub tokens have been compromised and must be revoked NOW:**

1. **Token shared in chat** (starts with `github_pat_11AP6W56Q0Wt7...`)
2. **Token hardcoded in field-collector** (starts with `github_pat_11AP6W56Q0Rse...`)

Both tokens are now publicly exposed and could be misused by unauthorized users.

---

## Step 1: Revoke Compromised Tokens

1. **Go to GitHub Settings:**
   - Visit: https://github.com/settings/tokens
   - Or: Click your profile → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Find and Delete:**
   - Look for tokens starting with `github_pat_11AP6W56Q0...`
   - Click the **Delete** button next to each one
   - Confirm deletion

3. **Verify:**
   - Ensure both tokens are removed from the list
   - Check "Revoked" tab to confirm they're disabled

---

## Step 2: Create New Token (Secure)

### Generate Token

1. **Create new token:**
   - Visit: https://github.com/settings/tokens/new
   - Or click: "Generate new token" → "Generate new token (classic)"

2. **Configure token settings:**
   ```
   Note: Merremia Dashboard & Field Collector
   Expiration: 90 days (recommended) or custom

   Scopes to select:
   ☑️ repo (Full control of private repositories)
      ☑️ repo:status
      ☑️ repo_deployment
      ☑️ public_repo
      ☑️ repo:invite
   ```

3. **Generate token:**
   - Click "Generate token" at the bottom
   - **COPY THE TOKEN IMMEDIATELY** (shown only once!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Security Best Practices

⚠️ **NEVER do these:**
- ❌ Post tokens in chat, email, or messaging apps
- ❌ Commit tokens to git repositories
- ❌ Share tokens in screenshots
- ❌ Hardcode tokens in HTML/JavaScript files
- ❌ Store tokens in plain text files

✅ **ALWAYS do these:**
- ✅ Store tokens in browser localStorage only
- ✅ Use environment variables for server-side apps
- ✅ Set expiration dates (30-90 days)
- ✅ Revoke immediately if exposed
- ✅ Use minimal required scopes

---

## Step 3: Configure Token in Applications

### Option A: Dashboard-Live.html (Recommended for Most Users)

1. **Open dashboard:**
   - URL: https://welinrj.github.io/merremia-vanuatu-dashboard/dashboard-live.html

2. **Enter token:**
   - Look for "GitHub Token (optional):" field in the header
   - Paste your token: `ghp_xxxxxxxxxxxx...`
   - Click "Load Data"

3. **Verify:**
   - Should show: "10 records — live" (or current count)
   - Map should display all markers
   - Console (F12) should show: "Fetched X records"

4. **Token storage:**
   - Automatically saved to browser localStorage
   - Persists across page reloads
   - Only accessible from your browser

### Option B: Using Browser Console (All Dashboards)

**For dashboard-live.html, dashboard.html, or test-dashboard-connection.html:**

1. **Open dashboard** (any of the three above)

2. **Open browser console:**
   - Press `F12` or `Ctrl+Shift+J` (Windows/Linux)
   - Or `Cmd+Option+J` (Mac)

3. **Paste this code** (replace `YOUR_TOKEN` with your actual token):

```javascript
// For dashboard-live.html
localStorage.setItem('merremia_live_cfg', JSON.stringify({
  owner: 'welinrj',
  repo: 'merremia-field-data',
  token: 'YOUR_TOKEN_HERE'
}));
location.reload();
```

```javascript
// For dashboard.html or test-dashboard-connection.html
localStorage.setItem('merremia_connector_token', 'YOUR_TOKEN_HERE');
location.reload();
```

4. **Press Enter**
   - Page will reload automatically
   - Token is now configured

### Option C: Field Collector Setup

**For field-collector/index.html:**

1. **Open field collector:**
   - URL: https://welinrj.github.io/merremia-vanuatu-dashboard/field-collector/

2. **Open Settings:**
   - Click the ⚙️ Settings icon (top right)

3. **Configure GitHub sync:**
   ```
   Owner: welinrj
   Repo: merremia-field-data
   Token: [paste your token here]
   ```

4. **Save settings:**
   - Click "Save Settings"
   - Settings persist in localStorage

5. **Test sync:**
   - Create a test observation
   - Click "Sync to GitHub"
   - Should show: "Synced successfully!"

---

## Step 4: Verify Configuration

### Test 1: Check Rate Limits

Open browser console (F12) on any dashboard and run:

```javascript
// Check current rate limit status
connector.checkRateLimit().then(limit => {
  console.log('Rate Limit Info:', limit);
  console.log(`Remaining: ${limit.remaining} of ${limit.limit}`);
  console.log(`Resets at: ${limit.resetTime}`);
});
```

**Expected results:**
- **Without token:** Limit: 60, Remaining: ~55-60
- **With token:** Limit: 5000, Remaining: ~4990-5000

### Test 2: Verify Data Loading

1. Open dashboard-live.html
2. Should auto-load within 1-2 seconds
3. Status should show: "X records — live" (green pulsing dot)
4. Map should show all observation markers
5. Console should show: "Fetched 10 records" (or current total)

### Test 3: Test Field Collector Sync

1. Open field-collector/index.html
2. Create a test observation:
   - Category: Merremia
   - Island: Efate
   - Species: M. peltata
   - Count: 1
3. Click "Save & Sync"
4. Should show: "Saving..." → "Synced successfully!"
5. Check dashboard-live.html - new record should appear within 2 seconds

---

## Troubleshooting

### Issue: "No records found" on Dashboard

**Possible causes:**
1. Token not configured
2. Token expired or revoked
3. Network connectivity issue
4. GitHub API rate limit exceeded

**Solutions:**
1. Verify token is entered correctly (check for extra spaces)
2. Generate new token if expired
3. Check internet connection
4. Wait for rate limit to reset (see countdown in error message)

### Issue: Field Collector Sync Fails

**Symptoms:**
- "Sync failed" error message
- Network error in console
- 403 Forbidden response

**Solutions:**
1. Check token has `repo` scope enabled
2. Verify token hasn't expired
3. Check repository name is correct: `welinrj/merremia-field-data`
4. Try clearing browser cache and reconfiguring

### Issue: Rate Limit Exceeded

**Symptoms:**
- Dashboard shows: "Rate limit exceeded"
- Console error: "403 API rate limit exceeded"

**Solutions:**
1. **With token:** Should have 5,000/hour - unlikely to hit limit
2. **Without token:** Only 60/hour - add token to increase limit
3. **Wait for reset:** Check error message for reset time
4. **Reduce polling frequency:** Change from 2s to 5s or 10s intervals

### Issue: Token Keeps Getting Cleared

**Possible causes:**
1. Browser in private/incognito mode (localStorage cleared on exit)
2. Browser settings clearing data automatically
3. Browser extension interfering
4. localStorage quota exceeded

**Solutions:**
1. Use normal browser mode (not private/incognito)
2. Check browser privacy settings
3. Disable extensions temporarily
4. Clear old cached data to free space

---

## Portal-by-Portal Configuration

| Portal | Token Required? | Configuration Method | Storage Location |
|--------|-----------------|---------------------|------------------|
| **dashboard-live.html** | Optional (recommended) | Password input field OR console | `merremia_live_cfg` |
| **dashboard.html** | Optional | Browser console only | `merremia_connector_token` |
| **field-collector** | **REQUIRED** for sync | Settings panel (⚙️) | `field_collector_settings` |
| **test-dashboard-connection.html** | Optional | Browser console only | `merremia_connector_token` |
| **gis-portal** | Not applicable | Manual file upload | None |
| **nbsap-portal** | Not applicable | Local processing | None |

---

## Security Checklist

Before deploying to production, verify:

- [ ] All old/compromised tokens revoked
- [ ] New token created with minimal scopes
- [ ] Token NOT committed to git repository
- [ ] Token NOT hardcoded in any files
- [ ] Token expiration set (30-90 days)
- [ ] Token stored in localStorage only
- [ ] HTTPS used for all requests
- [ ] Rate limit warnings enabled
- [ ] Error handling implemented
- [ ] Audit trail enabled in GitHub settings

---

## Rate Limit Reference

### Unauthenticated Requests (No Token)
- **Limit:** 60 requests per hour
- **Suitable for:** Occasional viewing, testing
- **Use case:** Public dashboards with infrequent updates

### Authenticated Requests (With Token)
- **Limit:** 5,000 requests per hour
- **Suitable for:** Real-time monitoring, field collection
- **Use case:** Production dashboards, active field campaigns

### Polling Frequency Recommendations

| Update Interval | Requests/Hour | Token Required? | Use Case |
|-----------------|---------------|-----------------|----------|
| 2 seconds | 1,800 | **Yes** | Real-time field campaigns |
| 5 seconds | 720 | **Yes** | Active monitoring |
| 30 seconds | 120 | **Yes** | Regular updates |
| 5 minutes | 12 | No | Periodic checks |
| 30 minutes | 2 | No | Daily summaries |

---

## Next Steps After Configuration

1. **Test all portals** with new token
2. **Verify data sync** works in field collector
3. **Monitor rate limits** for first 24 hours
4. **Set calendar reminder** for token expiration (88 days)
5. **Document token location** for team members
6. **Create backup token** for redundancy

---

## Support & Resources

- **GitHub Token Documentation:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- **API Rate Limits:** https://docs.github.com/en/rest/rate-limit
- **Repository:** https://github.com/welinrj/merremia-field-data
- **Dashboard URL:** https://welinrj.github.io/merremia-vanuatu-dashboard/

---

## Related Documentation

- `REALTIME-DASHBOARD.md` - Technical details on real-time updates
- `PR-DESCRIPTION.md` - Recent changes and features
- `README.md` - Project overview (if available)

---

**Last Updated:** 2026-02-15
**Version:** 1.0
**Maintainer:** DEPC Vanuatu
