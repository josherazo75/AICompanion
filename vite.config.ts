import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'client', // 👈 Tells Vite where the frontend lives
  plugins: [react()],
  build: {
    outDir: '../dist/public', // 👈 Output the build to your backend's public folder
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client'),
    },
  },
});
