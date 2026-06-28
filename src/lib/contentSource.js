// Where content comes from at runtime.
//
// - Desktop (Electron): read from the user's writable content folder via IPC,
//   so notes persist across app updates.
// - Web/dev: use the markdown bundled at build time via Vite's glob.

const bundled = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function bundledRaw() {
  const out = {};
  for (const [p, raw] of Object.entries(bundled)) {
    const rel = p.replace(/^.*\/content\//, '');
    out[rel] = raw;
  }
  return out;
}

export function isDesktop() {
  return typeof window !== 'undefined' && !!window.fokAPI;
}

// POST JSON to a dev-server content endpoint, degrading gracefully. Returns the
// parsed result, or { ok:false, error:'no-server' } when the endpoint isn't
// reachable (e.g. a baked static build with no backend) so callers can show a
// "needs the running app" message instead of a cryptic failure.
async function postJSON(route, body) {
  let res;
  try {
    res = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    return { ok: false, error: 'no-server' };
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    if (data && data.ok !== undefined) return data;
    // 404/405 → the import endpoints aren't mounted (no dev server).
    return { ok: false, error: res.status === 404 || res.status === 405 ? 'no-server' : 'HTTP ' + res.status };
  }
  return res.json().catch(() => ({ ok: false, error: 'bad response' }));
}

// True when an error/result indicates the content backend isn't available.
export function isNoServer(e) {
  const s = String((e && e.message) || e || '');
  return /no-server|Failed to fetch|NetworkError|bad response/i.test(s);
}

// One-liner the UI can show when an action needs the running app.
export const NEEDS_APP_MSG =
  'This needs the running app — use the desktop app or `npm run dev`.';

// Returns a { relPath: rawMarkdown } map.
export async function loadRawFiles() {
  if (isDesktop() && window.fokAPI.listContent) {
    const list = await window.fokAPI.listContent(); // [{ relPath, raw }]
    const out = {};
    for (const f of list) out[f.relPath] = f.raw;
    return out;
  }
  return bundledRaw();
}

// Persist imported files. Returns { ok, written, error }.
export async function importFiles(payload) {
  if (isDesktop() && window.fokAPI.importFiles) {
    return window.fokAPI.importFiles(payload);
  }
  // Web/dev fallback: the Vite dev-server endpoint.
  return postJSON('/__import', { files: payload });
}

// Mirror/merge the library from a batch of files. Returns { ok, written, deleted }.
export async function syncLibrary(files, opts = {}) {
  const body = {
    files,
    mode: opts.mode || 'mirror',
    preserve: opts.preserve || ['_meta'],
  };
  if (isDesktop() && window.fokAPI.syncLibrary) {
    return window.fokAPI.syncLibrary(body);
  }
  return postJSON('/__sync', body);
}

// Delete specific files by relPath (e.g. a whole branch). Returns { ok, deleted }.
export async function deleteFiles(paths) {
  if (isDesktop() && window.fokAPI.deleteFiles) {
    return window.fokAPI.deleteFiles(paths);
  }
  return postJSON('/__delete', { paths });
}

// Export (download / save) a markdown file. Returns { ok, canceled?, error? }.
export async function exportFile(name, content) {
  if (isDesktop() && window.fokAPI.exportFile) {
    return window.fokAPI.exportFile(name, content);
  }
  // Web/dev fallback: trigger a browser download.
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String((e && e.message) || e) };
  }
}

// Open the content folder in the OS file manager (desktop only).
export async function revealContentFolder() {
  if (isDesktop() && window.fokAPI.revealContentFolder) {
    return window.fokAPI.revealContentFolder();
  }
  return false;
}
