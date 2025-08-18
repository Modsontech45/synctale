import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  server: {
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // forward API calls to your backend
    },
  },
    proxy: {
      '/api': 'http://localhost:5000', // forward API calls to your backend
    },
  },
});
