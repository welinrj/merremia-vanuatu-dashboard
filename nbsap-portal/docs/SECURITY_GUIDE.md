# Security Guide

## Current Security Model (GitHub Pages)

### Authentication

- **Method:** Client-side passphrase with SHA-256 hashing
- **Storage:** Hash in `localStorage` key `nbsap_admin_hash`
- **Session:** Memory only — clears on page reload
- **Default passphrase:** `vanuatu2024`

### Important Limitations

This is a **UI gate only** — not cryptographic security. Because the entire app runs client-side:

1. Browser DevTools can bypass the passphrase check
2. localStorage hash is visible to anyone with physical access
3. No server-side authorization — all data is accessible in IndexedDB
4. No audit trail enforcement (client can skip audit logging)

**This is acceptable for:** Demo deployments, internal use, non-sensitive data

**This is NOT suitable for:** Public government data management, sensitive data

### Mitigations

- All data is stored locally per browser — not shared across users
- No server calls to protect — no attack surface for API abuse
- Data export requires explicit admin action

## Migration to Secure Auth

### Step 1: Enable API Backend

Set in `src/config/env.js`:
```js
authProvider: 'api-token',
apiBaseUrl: 'https://api.secure.gov.vu',
storageBackend: 'api'
```

### Step 2: Implement JWT Authentication

Replace `authApiTokenStub.js` with a real JWT implementation:
1. Server issues JWT on login
2. Token stored in memory (not localStorage)
3. Token attached to all API requests
4. Server validates token on every request
5. Token expiration + refresh flow

### Step 3: Server-Side Authorization

All API endpoints should verify:
- Valid JWT token
- User has appropriate role (admin for write operations)
- Request matches user's permissions

### Swap Path

1. Change `authProvider` in env.js from `'local-passphrase'` to `'api-token'`
2. Implement `authApiTokenStub.js` methods with real HTTP calls
3. Add token management (storage, refresh, expiration)
4. Move passphrase validation to server side

## Data Security

### Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Browser data loss | Data deleted if browser storage cleared | Regular backups via Export |
| Cross-tab access | Other browser tabs can read IndexedDB | No sensitive PII in data |
| Physical access | Anyone at the computer can view data | Use server-side auth for production |
| Export data leak | Exported files contain all layer data | Admin-only export control |

### Recommendations for Government Deployment

1. **Use HTTPS** — All traffic must be encrypted
2. **Server-side auth** — Implement JWT with proper session management
3. **Role-based access** — Viewer, Editor, Admin roles
4. **Server-side storage** — PostGIS database, not browser storage
5. **Audit logging** — Server-enforced, tamper-resistant audit trail
6. **Regular backups** — Automated database backups
7. **Access controls** — Restrict admin access to authorized personnel
8. **Content Security Policy** — Set CSP headers to prevent XSS

## OWASP Considerations

| Threat | Status |
|--------|--------|
| XSS | Low risk — no user content rendered as HTML without sanitization |
| CSRF | N/A — no server-side state changes in static mode |
| SQL Injection | N/A — no SQL database in static mode |
| Auth bypass | Known limitation — client-side only, mitigate with server auth |
| Data exposure | Data in IndexedDB is browser-local only |
| File upload | Shapefile parsing is sandboxed in browser; validated by pipeline |
