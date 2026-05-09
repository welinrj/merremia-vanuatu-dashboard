import { defineConfig } from 'vite';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      buffer: 'buffer/'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Strip console.log calls from production builds — keeps internal layer
    // counts and Firestore operation details out of the browser console.
    // console.warn and console.error are preserved for runtime diagnostics.
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log']
    },
    rollupOptions: {
      output: {
        manualChunks: {
          turf: ['@turf/turf'],
          leaflet: ['leaflet'],
          firebase: ['firebase/app', 'firebase/firestore'],
          'export-tools': ['jszip', 'sql.js']
        }
      }
    }
  },
  optimizeDeps: {
    exclude: ['sql.js']
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp'
    }
  }
});
