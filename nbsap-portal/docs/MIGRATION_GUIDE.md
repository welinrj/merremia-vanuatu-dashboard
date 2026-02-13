# Migration Guide

## Overview

The portal is designed to run on GitHub Pages (static) now and migrate later to:
1. Vanuatu Government server (Nginx/Apache/IIS)
2. DEPC website as a subpath (e.g., `https://depc.gov.vu/nbsap-portal/`)

## Current: GitHub Pages (Static)

- All data stored in browser IndexedDB
- Auth via client-side passphrase hash
- No backend required
- Served as static files from `dist/`

## Migration Path 1: Government Server (Root)

### Step 1: Build

```bash
npm run build
```

### Step 2: Deploy to Nginx (Linux)

```bash
# Copy dist/ contents to web root
sudo cp -r dist/* /var/www/nbsap/

# Use the provided nginx config
sudo cp server_stub/nginx.conf /etc/nginx/sites-available/nbsap
sudo ln -s /etc/nginx/sites-available/nbsap /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### Step 3: Deploy to Apache

Create `/etc/apache2/sites-available/nbsap.conf`:
```apache
<VirtualHost *:80>
    ServerName nbsap.gov.vu
    DocumentRoot /var/www/nbsap

    <Directory /var/www/nbsap>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # SPA routing
    FallbackResource /index.html
</VirtualHost>
```

### Step 4: Deploy to IIS (Windows)

1. Copy `dist/` contents to `C:\inetpub\wwwroot\nbsap`
2. Add `web.config` for URL rewriting:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="SPA" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## Migration Path 2: DEPC Website Subpath

### Step 1: Update base path

In `vite.config.js`:
```js
export default defineConfig({
  base: '/nbsap-portal/',
  ...
});
```

In `src/config/env.js`:
```js
basePath: '/nbsap-portal/',
```

### Step 2: Build and deploy

```bash
npm run build
# Copy dist/ contents to /var/www/depc/nbsap-portal/
```

### Step 3: Configure Nginx subpath

See the commented section in `server_stub/nginx.conf` for subpath configuration.

## Migration Path 3: Full Backend

### Step 1: Set up the backend

```bash
cd server_stub
npm install
node server.js
```

Or use Docker:
```bash
docker-compose up -d
```

### Step 2: Update frontend config

In `src/config/env.js`:
```js
storageBackend: 'api',
apiBaseUrl: 'https://api.nbsap.gov.vu',
authProvider: 'api-token',
```

### Step 3: Rebuild

```bash
npm run build
```

### Step 4: Replace the API stub

Replace `server_stub/server.js` with a production implementation using:
- Express/Fastify + PostgreSQL/PostGIS
- Proper JWT authentication
- File upload handling with server-side GIS processing (GDAL/PostGIS)

### API endpoints to implement

See `docs/API_SPEC.md` for the full endpoint specification.

## Data Migration

### Export from static version

1. Open the portal
2. Login as admin
3. Click **Export Backup** — downloads JSON bundle with all layers

### Import to new deployment

1. Deploy the new version
2. Login as admin
3. Click **Import Backup** — upload the JSON bundle
4. All layers, audit logs, and settings are restored

## Checklist

- [ ] Update `basePath` in env.js for deployment URL
- [ ] Update `apiBaseUrl` if using backend
- [ ] Update `storageBackend` and `authProvider`
- [ ] Run `npm run build`
- [ ] Copy `dist/` to server
- [ ] Configure server (Nginx/Apache/IIS) for SPA routing
- [ ] Test all features in new environment
- [ ] Import backup data from previous deployment
