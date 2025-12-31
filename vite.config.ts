import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        // Entry 1: The Side Panel HTML
        main: resolve(__dirname, 'index.html'),
        // Entry 2: The Background Service Worker
        background: resolve(__dirname, 'background.ts'),
        // Entry 3: The Content Script
        content: resolve(__dirname, 'content.ts')
      },
      output: {
        // Ensure content.js and background.js have fixed names (no hash)
        // so manifest.json can reference them reliably.
        entryFileNames: (chunkInfo) => {
          return '[name].js';
        },
        // Put assets (css, images) in an assets folder
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
      }
    }
  }
});