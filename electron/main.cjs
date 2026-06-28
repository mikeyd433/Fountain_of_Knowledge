const { app, BrowserWindow, ipcMain, shell, protocol, net, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

const isDev = !app.isPackaged;

// Serve the built SPA over a real (standard, secure) scheme. Loading the app
// over file:// breaks ES-module/dynamic-import/wasm loading; a custom protocol
// behaves like a normal web origin so everything works.
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true },
  },
]);

const distDir = path.join(__dirname, '..', 'dist');

function registerAppProtocol() {
  protocol.handle('app', (request) => {
    let rel = decodeURIComponent(new URL(request.url).pathname);
    if (!rel || rel === '/') rel = '/index.html';
    const filePath = path.normalize(path.join(distDir, rel));
    // Never serve outside the dist folder.
    if (filePath !== distDir && !filePath.startsWith(distDir + path.sep)) {
      return new Response('forbidden', { status: 403 });
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });
}

// Writable folder where the user's notes live (persists across app updates).
const contentDir = path.join(app.getPath('userData'), 'content');

// Where the bundled default/sample notes ship.
function defaultContentDir() {
  return isDev
    ? path.join(__dirname, '..', 'src', 'content')
    : path.join(process.resourcesPath, 'defaultContent');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// On first run, seed the user's content folder from the bundled defaults. A
// marker file records that seeding has happened, so emptying the library later
// (deleting everything) never silently re-adds the sample notes.
function ensureContent() {
  const marker = path.join(app.getPath('userData'), '.fok-seeded');
  if (fs.existsSync(marker)) return;
  let empty = true;
  try {
    empty = !fs.existsSync(contentDir) || fs.readdirSync(contentDir).length === 0;
  } catch {
    empty = true;
  }
  // Only seed a genuinely empty folder; an existing library (upgrading user) is
  // just marked as initialized without re-copying anything.
  if (empty) {
    const src = defaultContentDir();
    if (fs.existsSync(src)) copyDir(src, contentDir);
    else fs.mkdirSync(contentDir, { recursive: true });
  }
  try {
    fs.mkdirSync(path.dirname(marker), { recursive: true });
    fs.writeFileSync(marker, new Date().toISOString());
  } catch {
    /* non-fatal: worst case we re-check next launch */
  }
}

// Recursively list every .md file as { relPath, raw }.
function listContent() {
  const out = [];
  function walk(dir, rel) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      const r = rel ? rel + '/' + entry.name : entry.name;
      if (entry.isDirectory()) walk(abs, r);
      else if (/\.md$/i.test(entry.name)) {
        try {
          out.push({ relPath: r, raw: fs.readFileSync(abs, 'utf8') });
        } catch {
          /* skip unreadable file */
        }
      }
    }
  }
  walk(contentDir, '');
  return out;
}

// Write imported files, guarding against escaping the content folder.
function writeOne(f) {
  const rel = String(f.relPath || '').replace(/\\/g, '/');
  const segs = rel
    .split('/')
    .map((s) => s.trim())
    .filter((s) => s && s !== '.' && s !== '..');
  if (segs.length === 0) throw new Error('bad path');
  const dest = path.resolve(contentDir, segs.join('/'));
  if (dest !== contentDir && !dest.startsWith(contentDir + path.sep)) {
    throw new Error('path outside content folder');
  }
  if (!dest.toLowerCase().endsWith('.md')) {
    throw new Error('only .md files are allowed');
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, String(f.content ?? ''), 'utf8');
  return path.relative(contentDir, dest).replace(/\\/g, '/');
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
  })(contentDir, '');
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
  if (!Array.isArray(files) || files.length === 0) {
    return { ok: false, error: 'no files' };
  }
  try {
    return { ok: true, written: files.map(writeOne) };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e) };
  }
}

// Delete specific .md files (e.g. a whole branch of the tree).
function deleteFiles(paths) {
  if (!Array.isArray(paths) || paths.length === 0) {
    return { ok: false, error: 'no paths' };
  }
  const deleted = [];
  const failed = [];
  try {
    for (const rel0 of paths) {
      const rel = String(rel0 || '').replace(/\\/g, '/');
      const segs = rel
        .split('/')
        .map((s) => s.trim())
        .filter((s) => s && s !== '.' && s !== '..');
      if (segs.length === 0) {
        failed.push({ path: rel, error: 'bad path' });
        continue;
      }
      // The built-in Authoring Kit is protected from deletion.
      if (segs[0] === '_meta') continue;
      const target = path.resolve(contentDir, segs.join('/'));
      if (target === contentDir || !target.startsWith(contentDir + path.sep)) {
        failed.push({ path: rel, error: 'outside content folder' });
        continue;
      }
      if (!target.toLowerCase().endsWith('.md')) {
        failed.push({ path: rel, error: 'not a .md file' });
        continue;
      }
      try {
        fs.rmSync(target);
        deleted.push(segs.join('/'));
      } catch (e) {
        // Already gone counts as deleted (idempotent); anything else is a real
        // failure (e.g. the file is locked/open elsewhere on Windows).
        if (e && e.code === 'ENOENT') deleted.push(segs.join('/'));
        else failed.push({ path: rel, error: (e && e.code) || String((e && e.message) || e) });
      }
    }
    removeEmptyDirs(contentDir);
    return { ok: failed.length === 0, deleted, failed };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e), deleted, failed };
  }
}

// Mirror: write all given files, then delete any existing .md not in the set
// (except preserved prefixes such as _meta). Merge: just write.
function syncLibrary({ files, mode, preserve }) {
  if (!Array.isArray(files)) return { ok: false, error: 'no files' };
  try {
    const written = files.map(writeOne);
    const writtenSet = new Set(written);
    const deleted = [];
    if (mode === 'mirror') {
      const prefixes = (preserve || []).map(
        (p) => String(p).replace(/\\/g, '/').replace(/\/+$/, '') + '/'
      );
      for (const rel of listAllMd()) {
        if (writtenSet.has(rel)) continue;
        if (prefixes.some((pre) => rel.startsWith(pre))) continue;
        try {
          fs.rmSync(path.join(contentDir, rel));
          deleted.push(rel);
        } catch {
          /* ignore */
        }
      }
      removeEmptyDirs(contentDir);
    }
    return { ok: true, written, deleted };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e) };
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 720,
    minHeight: 480,
    backgroundColor: '#0f1216',
    autoHideMenuBar: true,
    title: 'Fountain of Knowledge',
    icon: path.join(__dirname, '..', 'scripts', 'fountain.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadURL('app://bundle/index.html');
  }

  // Open external links in the system browser, not inside the app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//.test(url)) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });
}

ipcMain.handle('content:list', () => listContent());
ipcMain.handle('content:import', (_e, files) => importFiles(files));
ipcMain.handle('content:sync', (_e, body) => syncLibrary(body));
ipcMain.handle('content:delete', (_e, paths) => deleteFiles(paths));
ipcMain.handle('content:reveal', () => {
  shell.openPath(contentDir);
  return true;
});
ipcMain.handle('content:export', async (_e, { name, content }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: name || 'note.md',
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (canceled || !filePath) return { ok: false, canceled: true };
    fs.writeFileSync(filePath, String(content ?? ''), 'utf8');
    return { ok: true, path: filePath };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e) };
  }
});

app.whenReady().then(() => {
  ensureContent();
  registerAppProtocol();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
