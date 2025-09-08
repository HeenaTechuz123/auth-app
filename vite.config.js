import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  base: process.env.NODE_ENV === 'production' ? '/auth-app/' : '/',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          :root {
            --containerWidth: 1200px;
          }
        `
      }
    }
  },
  define: {
    // Replace process.env with import.meta.env for Vite
    'process.env': {}
  }
})