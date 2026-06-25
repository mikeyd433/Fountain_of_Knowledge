import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// gray-matter expects a Node-style `Buffer` global; provide it for the browser.
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    // shiki's oniguruma wasm is a single large chunk by design; this is a
    // local-only reader, so the size warning isn't actionable.
    chunkSizeWarningLimit: 1024,
  },
  // Fixed port so the desktop shortcut always targets the same URL.
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
});
