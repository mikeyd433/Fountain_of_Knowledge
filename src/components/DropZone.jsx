import { useEffect, useRef, useState } from 'react';
import matter from 'gray-matter';
import { routeForDropped } from '../lib/content.js';

// Strip characters that are illegal in Windows paths/filenames.
function cleanSeg(s) {
  return String(s)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Decide where a dropped file lands: src/content/<category>/<section>/<name>.md
// Category/section come from the file's own frontmatter; default to "Imported".
function deriveRelPath(fileName, raw) {
  let data = {};
  try {
    data = matter(raw).data || {};
  } catch {
    data = {};
  }
  const category = cleanSeg(data.category || 'Imported') || 'Imported';
  const section = data.section ? cleanSeg(data.section) : null;
  let name = cleanSeg(fileName) || 'untitled.md';
  if (!/\.md$/i.test(name)) name += '.md';
  return [category, section, name].filter(Boolean).join('/');
}

function dragHasFiles(e) {
  return Array.from(e.dataTransfer?.types || []).includes('Files');
}

export default function DropZone() {
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const depth = useRef(0);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    function onEnter(e) {
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      depth.current += 1;
      setDragging(true);
    }
    function onOver(e) {
      if (!dragHasFiles(e)) return;
      e.preventDefault(); // required so the drop event fires
    }
    function onLeave() {
      depth.current -= 1;
      if (depth.current <= 0) {
        depth.current = 0;
        setDragging(false);
      }
    }
    async function onDrop(e) {
      if (!dragHasFiles(e)) return;
      e.preventDefault();
      depth.current = 0;
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files).filter((f) =>
        /\.(md|markdown)$/i.test(f.name)
      );
      if (dropped.length === 0) {
        setToast({ type: 'err', msg: 'Only .md files can be imported.' });
        return;
      }
      await importFiles(dropped);
    }

    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

  async function importFiles(droppedFiles) {
    try {
      const payload = [];
      let firstRoute = null;
      for (const f of droppedFiles) {
        const raw = await f.text();
        const relPath = deriveRelPath(f.name, raw);
        payload.push({ relPath, content: raw });
        if (!firstRoute) {
          try {
            firstRoute = routeForDropped(relPath, raw);
          } catch {
            /* ignore route derivation issues */
          }
        }
      }

      const res = await fetch('/__import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: payload }),
      });
      const data = await res.json().catch(() => ({ ok: false, error: 'bad response' }));
      if (!res.ok || !data.ok) throw new Error(data.error || 'HTTP ' + res.status);

      const n = data.written.length;
      setToast({ type: 'ok', msg: `Imported ${n} file${n > 1 ? 's' : ''}. Refreshing…` });
      if (firstRoute) window.location.hash = '#' + firstRoute;
      // Full reload so the Vite content glob picks up the new file(s).
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      const networkish = /Failed to fetch|NetworkError|bad response/i.test(String(e));
      setToast({
        type: 'err',
        msg: networkish
          ? 'Import needs the running app (the desktop shortcut / npm run dev).'
          : 'Import failed: ' + (e.message || e),
      });
    }
  }

  return (
    <>
      {dragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-card">
            <div className="dropzone-icon">📥</div>
            <div className="dropzone-title">Drop markdown to import</div>
            <div className="dropzone-sub">.md files are added to your library</div>
          </div>
        </div>
      )}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
