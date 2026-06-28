import { useRef, useState } from 'react';
import { importFiles as persistFiles, exportFile, deleteFiles, isNoServer, NEEDS_APP_MSG } from '../lib/contentSource.js';
import { routeForDropped } from '../lib/content.js';
import { expandBundle, dedupeRelPaths } from '../lib/importing.js';

function basename(rel) {
  const b = (rel || 'note.md').split('/').pop();
  return /\.md$/i.test(b) ? b : b + '.md';
}

// Per-page actions: download the current .md, or replace this page with a new
// .md file (by click-to-pick or drag-and-drop onto the button).
export default function SectionActions({ file }) {
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);

  function flash(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast((t) => (t && t.msg === msg ? null : t)), 3500);
  }

  async function doExport() {
    try {
      const r = await exportFile(basename(file.relPath), file.raw ?? '');
      if (r && r.canceled) return;
      if (!r || r.ok === false) throw new Error((r && r.error) || 'export failed');
      flash('ok', `Exported ${basename(file.relPath)}`);
    } catch (e) {
      flash('err', 'Export failed: ' + (e.message || e));
    }
  }

  async function doReplace(f) {
    if (!f) return;
    if (!/\.(md|markdown)$/i.test(f.name)) {
      flash('err', 'Pick a .md file');
      return;
    }
    setBusy(true);
    try {
      const raw = await f.text();
      const bundle = expandBundle(raw);
      let route;
      if (bundle && bundle.length) {
        // Replacing one page with a bundle: import all its pages, then drop the
        // original if it isn't among them, so it's a true replace (no orphan).
        const { entries } = dedupeRelPaths(bundle);
        const res = await persistFiles(entries);
        if (!res || !res.ok) throw new Error((res && res.error) || 'replace failed');
        const keep = new Set(entries.map((e) => e.relPath));
        if (!keep.has(file.relPath)) await deleteFiles([file.relPath]);
        route = routeForDropped(entries[0].relPath, entries[0].content);
      } else {
        // Single page: overwrite this file in place.
        const res = await persistFiles([{ relPath: file.relPath, content: raw }]);
        if (!res || !res.ok) throw new Error((res && res.error) || 'replace failed');
        // The new file may change its own route via frontmatter; go there.
        route = routeForDropped(file.relPath, raw);
      }
      window.location.hash = '#' + route;
      window.location.reload();
    } catch (e) {
      setBusy(false);
      flash('err', isNoServer(e) ? NEEDS_APP_MSG : 'Replace failed: ' + (e.message || e));
    }
  }

  return (
    <div className="section-actions">
      <button
        type="button"
        className="sec-btn"
        onClick={doExport}
        title="Download this page's markdown file"
      >
        ⬇ Export .md
      </button>

      <label
        className={'sec-btn sec-drop' + (drag ? ' over' : '')}
        title="Replace this page — pick or drop a .md file"
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          setDrag(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDrag(false);
          doReplace(e.dataTransfer.files[0]);
        }}
      >
        {busy ? 'Updating…' : drag ? 'Drop to replace' : '⤴ Replace…'}
        <input
          ref={inputRef}
          type="file"
          accept=".md,.markdown"
          hidden
          onChange={(e) => {
            const f = e.target.files[0];
            e.target.value = '';
            doReplace(f);
          }}
        />
      </label>

      {toast && <span className={'sec-toast sec-' + toast.type}>{toast.msg}</span>}
    </div>
  );
}
