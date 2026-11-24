import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Project-site hosting: https://darrssh.github.io/FASTENERS/
  // All absolute asset URLs + router basename derive from this.
  base: '/FASTENERS/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false,
    proxy: {
      '/api': {
        // Port 8001 keeps the API reachable even when another service uses 8000.
        // Start it with: cd backend && .venv/Scripts/python.exe -m uvicorn app.main:app --port 8001
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
  preview: { port: 4173 },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
  },
});
