import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// App version, read from package.json and surfaced in the UI so you can confirm
// a rebuilt/updated app is actually running the new code.
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

// Dev-only endpoint: accepts markdown dropped in the browser and writes it
// into src/content/ so it becomes a permanent part of the library.
// Shared content-folder operations, also implemented in electron/main.cjs.
function makeContentOps(contentRoot) {
  function writeOne(f) {
    const rel = String(f.relPath || '').replace(/\\/g, '/');
    const segs = rel
      .split('/')
      .map((s) => s.trim())
      .filter((s) => s && s !== '.' && s !== '..');
    if (segs.length === 0) throw new Error('bad path');
    const dest = path.resolve(contentRoot, segs.join('/'));
    if (dest !== contentRoot && !dest.startsWith(contentRoot + path.sep)) {
      throw new Error('path outside content folder');
    }
    if (!dest.toLowerCase().endsWith('.md')) {
      throw new Error('only .md files are allowed');
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, String(f.content ?? ''), 'utf8');
    return path.relative(contentRoot, dest).replace(/\\/g, '/');
  }

  function listAllMd() {
    const out = [];
    (function walk(dir, rel) {
      let entries = [];
      try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        const abs = path.join(dir, e.name);
        const r = rel ? rel + '/' + e.name : e.name;
        if (e.isDirectory()) walk(abs, r);
        else if (/\.md$/i.test(e.name)) out.push(r);
      }
    })(contentRoot, '');
    return out;
  }

  function removeEmptyDirs(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.isDirectory()) {
        const d = path.join(dir, e.name);
        removeEmptyDirs(d);
        try {
          if (fs.readdirSync(d).length === 0) fs.rmdirSync(d);
        } catch {
          /* ignore */
        }
      }
    }
  }

  function importFiles(files) {
    if (!Array.isArray(files) || files.length === 0) throw new Error('no files');
    return { ok: true, written: files.map(writeOne) };
  }

  function deleteFiles(paths) {
    if (!Array.isArray(paths) || paths.length === 0) throw new Error('no paths');
    const deleted = [];
    for (const rel0 of paths) {
      const rel = String(rel0 || '').replace(/\\/g, '/');
      const segs = rel
        .split('/')
        .map((s) => s.trim())
        .filter((s) => s && s !== '.' && s !== '..');
      if (segs.length === 0) continue;
      const target = path.resolve(contentRoot, segs.join('/'));
      if (target === contentRoot || !target.startsWith(contentRoot + path.sep)) continue;
      if (!target.toLowerCase().endsWith('.md')) continue;
      try {
        fs.rmSync(target);
        deleted.push(segs.join('/'));
      } catch {
        /* ignore */
      }
    }
    removeEmptyDirs(contentRoot);
    return { ok: true, deleted };
  }

  function syncLibrary({ files, mode, preserve }) {
    if (!Array.isArray(files)) throw new Error('no files');
    const written = files.map(writeOne);
    const writtenSet = new Set(written);
    let deleted = [];
    if (mode === 'mirror') {
      const prefixes = (preserve || []).map(
        (p) => String(p).replace(/\\/g, '/').replace(/\/+$/, '') + '/'
      );
      for (const rel of listAllMd()) {
        if (writtenSet.has(rel)) continue;
        if (prefixes.some((pre) => rel.startsWith(pre))) continue;
        try {
          fs.rmSync(path.join(contentRoot, rel));
          deleted.push(rel);
        } catch {
          /* ignore */
        }
      }
      removeEmptyDirs(contentRoot);
    }
    return { ok: true, written, deleted };
  }

  return { importFiles, syncLibrary, deleteFiles };
}

function contentImporter() {
  const ops = makeContentOps(path.resolve(__dirname, 'src/content'));

  function jsonPost(server, route, handler) {
    server.middlewares.use(route, (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('POST only');
        return;
      }
      let body = '';
      req.setEncoding('utf8');
      req.on('data', (c) => {
        body += c;
        if (body.length > 16_000_000) req.destroy(); // ~16MB guard
      });
      req.on('end', () => {
        res.setHeader('Content-Type', 'application/json');
        try {
          res.end(JSON.stringify(handler(JSON.parse(body || '{}'))));
        } catch (e) {
          res.statusCode = 400;
          res.end(JSON.stringify({ ok: false, error: String((e && e.message) || e) }));
        }
      });
    });
  }

  return {
    name: 'fok-content-importer',
    configureServer(server) {
      jsonPost(server, '/__import', (data) => ops.importFiles(data.files));
      jsonPost(server, '/__sync', (data) => ops.syncLibrary(data));
      jsonPost(server, '/__delete', (data) => ops.deleteFiles(data.paths));
    },
  };
}

export default defineConfig({
  // Relative asset paths so the built app also works from file:// inside Electron.
  base: './',
  plugins: [react(), contentImporter()],
  define: {
    global: 'globalThis',
    __APP_VERSION__: JSON.stringify(pkg.version),
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
