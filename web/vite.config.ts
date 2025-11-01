import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 55173, // high port to avoid conflicts
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:58087',
        changeOrigin: true,
      },
      '/mcp': {
        target: 'http://127.0.0.1:58087',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:58087',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
