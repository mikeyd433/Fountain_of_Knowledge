import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Dev-only endpoint: accepts markdown dropped in the browser and writes it
// into src/content/ so it becomes a permanent part of the library.
function contentImporter() {
  const contentRoot = path.resolve(__dirname, 'src/content');
  return {
    name: 'fok-content-importer',
    configureServer(server) {
      server.middlewares.use('/__import', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('POST only');
          return;
        }
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (c) => {
          body += c;
          if (body.length > 8_000_000) req.destroy(); // ~8MB guard
        });
        req.on('end', () => {
          try {
            const { files } = JSON.parse(body || '{}');
            if (!Array.isArray(files) || files.length === 0) {
              throw new Error('no files');
            }
            const written = [];
            for (const f of files) {
              const rel = String(f.relPath || '').replace(/\\/g, '/');
              const segs = rel
                .split('/')
                .map((s) => s.trim())
                .filter((s) => s && s !== '.' && s !== '..');
              if (segs.length === 0) throw new Error('bad path');
              const dest = path.resolve(contentRoot, segs.join('/'));
              // Never allow writes outside the content folder.
              if (dest !== contentRoot && !dest.startsWith(contentRoot + path.sep)) {
                throw new Error('path outside content folder');
              }
              if (!dest.toLowerCase().endsWith('.md')) {
                throw new Error('only .md files are allowed');
              }
              fs.mkdirSync(path.dirname(dest), { recursive: true });
              fs.writeFileSync(dest, String(f.content ?? ''), 'utf8');
              written.push(path.relative(contentRoot, dest).replace(/\\/g, '/'));
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, written }));
          } catch (e) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: String((e && e.message) || e) }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  // Relative asset paths so the built app also works from file:// inside Electron.
  base: './',
  plugins: [react(), contentImporter()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
  build: {
    // shiki's oniguruma wasm is a single large chunk by design; this is a
    // local-only reader, so the size warning isn't actionable.
    chunkSizeWarningLimit: 1024,
  },
  // Fixed port so the desktop shortcut always targets the same URL.
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
