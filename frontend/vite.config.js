import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // <-- expose to network
    port: 5173,
    allowedHosts: [
      'villagecrunch.onrender.com',  // <-- add your Render domain here
      'localhost'
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
