const { app, BrowserWindow, ipcMain, shell, protocol, net } = require('electron');
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

// On first run, seed the user's content folder from the bundled defaults.
function ensureContent() {
  let empty = true;
  try {
    empty = !fs.existsSync(contentDir) || fs.readdirSync(contentDir).length === 0;
  } catch {
    empty = true;
  }
  if (empty) {
    const src = defaultContentDir();
    if (fs.existsSync(src)) copyDir(src, contentDir);
    else fs.mkdirSync(contentDir, { recursive: true });
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
function importFiles(files) {
  if (!Array.isArray(files) || files.length === 0) {
    return { ok: false, error: 'no files' };
  }
  const written = [];
  try {
    for (const f of files) {
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
      written.push(path.relative(contentDir, dest).replace(/\\/g, '/'));
    }
    return { ok: true, written };
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
ipcMain.handle('content:reveal', () => {
  shell.openPath(contentDir);
  return true;
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
