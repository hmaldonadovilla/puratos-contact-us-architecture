import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    fs: {
      allow: [appRoot, path.resolve(appRoot, '..')],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
