import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          turf: ['@turf/turf'],
          leaflet: ['leaflet'],
          shpjs: ['shpjs']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
