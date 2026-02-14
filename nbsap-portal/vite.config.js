import { defineConfig } from 'vite';

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
    rollupOptions: {
      output: {
        manualChunks: {
          turf: ['@turf/turf'],
          leaflet: ['leaflet']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
