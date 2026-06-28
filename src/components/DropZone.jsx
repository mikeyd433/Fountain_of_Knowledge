import { useEffect, useRef, useState } from 'react';
import { routeForDropped } from '../lib/content.js';
import { importFiles as persistFiles, syncLibrary } from '../lib/contentSource.js';
import { fileToEntries, dedupeRelPaths } from '../lib/importing.js';
import { useLibrary } from '../lib/library.js';

function dragHasFiles(e) {
  return Array.from(e.dataTransfer?.types || []).includes('Files');
}

// Recursively collect all .md File objects from a dropped filesystem entry.
async function collectEntry(entry, out) {
  if (!entry) return;
  if (entry.isFile) {
    if (/\.(md|markdown)$/i.test(entry.name)) {
      const file = await new Promise((res, rej) => entry.file(res, rej));
      out.push(file);
    }
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    // readEntries returns results in batches; call until it returns none.
    let batch;
    do {
      batch = await new Promise((res, rej) => reader.readEntries(res, rej));
      for (const e of batch) await collectEntry(e, out);
    } while (batch.length > 0);
  }
}

export default function DropZone() {
  const { files: currentFiles } = useLibrary();
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const depth = useRef(0);
  // Keep the latest file list reachable from the (stable) drop handler.
  const filesRef = useRef(currentFiles);
  filesRef.current = currentFiles;

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

      // Capture filesystem entries synchronously (the dataTransfer is cleared
      // once this handler returns) to detect a folder drop.
      const entries = [];
      const items = e.dataTransfer.items;
      if (items) {
        for (const it of items) {
          const en = it.webkitGetAsEntry && it.webkitGetAsEntry();
          if (en) entries.push(en);
        }
      }
      const hasDir = entries.some((en) => en && en.isDirectory);

      if (hasDir) {
        await mirrorFromEntries(entries);
        return;
      }

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
      const raw0 = [];
      for (const f of droppedFiles) {
        const raw = await f.text();
        raw0.push(...fileToEntries(f.name, raw));
      }
      // Keep same-batch title collisions from silently overwriting each other.
      const { entries: payload, renamed } = dedupeRelPaths(raw0);

      let firstRoute = null;
      for (const entry of payload) {
        if (firstRoute) break;
        try {
          firstRoute = routeForDropped(entry.relPath, entry.content);
        } catch {
          /* ignore route derivation issues */
        }
      }

      const data = await persistFiles(payload);
      if (!data || !data.ok) throw new Error((data && data.error) || 'import failed');

      const n = data.written.length;
      const note = renamed > 0 ? ` (${renamed} renamed to avoid duplicate titles)` : '';
      setToast({ type: 'ok', msg: `Imported ${n} file${n > 1 ? 's' : ''}${note}. Refreshing…` });
      if (firstRoute) window.location.hash = '#' + firstRoute;
      // Full reload so the library re-reads and picks up the new file(s).
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

  // Folder drop → mirror the whole library to match the folder's .md files.
  async function mirrorFromEntries(entries) {
    try {
      const fileObjs = [];
      for (const en of entries) await collectEntry(en, fileObjs);
      if (fileObjs.length === 0) {
        setToast({ type: 'err', msg: 'No .md files found in that folder.' });
        return;
      }

      const raw0 = [];
      for (const f of fileObjs) {
        const raw = await f.text();
        raw0.push(...fileToEntries(f.name, raw));
      }
      const { entries: payload, renamed } = dedupeRelPaths(raw0);

      // Estimate how many existing pages would be removed (excludes _meta).
      const keep = new Set(payload.map((p) => p.relPath));
      const removing = filesRef.current.filter(
        (f) => !f.relPath.startsWith('_meta/') && !keep.has(f.relPath)
      ).length;

      const ok = window.confirm(
        `Replace your library with the ${payload.length} page(s) in this folder?\n\n` +
          `• ${payload.length} page(s) will be added or updated\n` +
          (renamed > 0
            ? `• ${renamed} had duplicate titles and were renamed to avoid overwriting\n`
            : '') +
          `• ${removing} existing page(s) not in the folder will be removed\n` +
          `• The built-in Authoring Kit is kept\n\n` +
          `This can't be undone.`
      );
      if (!ok) return;

      setToast({ type: 'ok', msg: `Replacing library with ${payload.length} page(s)…` });
      const data = await syncLibrary(payload, { mode: 'mirror', preserve: ['_meta'] });
      if (!data || !data.ok) throw new Error((data && data.error) || 'mirror failed');

      let firstRoute = null;
      try {
        firstRoute = routeForDropped(payload[0].relPath, payload[0].content);
      } catch {
        /* ignore */
      }
      window.location.hash = firstRoute ? '#' + firstRoute : '#/';
      setTimeout(() => window.location.reload(), 800);
    } catch (e) {
      setToast({ type: 'err', msg: 'Replace failed: ' + (e.message || e) });
    }
  }

  return (
    <>
      {dragging && (
        <div className="dropzone-overlay">
          <div className="dropzone-card">
            <div className="dropzone-icon">📥</div>
            <div className="dropzone-title">Drop markdown</div>
            <div className="dropzone-sub">
              Files are added to your library · a whole folder replaces it
            </div>
          </div>
        </div>
      )}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
