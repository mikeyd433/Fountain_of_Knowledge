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
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
});
