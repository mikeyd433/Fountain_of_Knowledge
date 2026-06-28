import { useCallback, useEffect, useState } from 'react';
import { Link, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { settleScrollTo } from './lib/slug.js';
import { buildLibrary } from './lib/content.js';
import { loadRawFiles, deleteFiles } from './lib/contentSource.js';
import { createSearch } from './lib/search.js';
import { LibraryContext, useLibrary } from './lib/library.js';
import TreeNode from './components/TreeNode.jsx';
import SearchBar from './components/SearchBar.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import MarkdownView from './components/MarkdownView.jsx';
import Landing from './components/Landing.jsx';
import DropZone from './components/DropZone.jsx';
import SectionActions from './components/SectionActions.jsx';

const EXPAND_KEY = 'fok-expanded';

// Reset to the top of a page. The scroll container is `.content` (not the
// window), so reset both to cover desktop and the stacked mobile layout.
function scrollTop() {
  window.scrollTo(0, 0);
  const c = document.querySelector('.content');
  if (c) c.scrollTop = 0;
}

function allFolderPaths(node, acc = []) {
  for (const f of node.folders) {
    acc.push(f.path);
    allFolderPaths(f, acc);
  }
  return acc;
}

function Sidebar() {
  const { tree } = useLibrary();
  const location = useLocation();
  const currentRoute = decodeURIComponent(location.pathname);
  const [expanded, setExpanded] = useState(() => {
    try {
      const raw = localStorage.getItem(EXPAND_KEY);
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) {}
    return new Set(allFolderPaths(tree));
  });

  useEffect(() => {
    try {
      localStorage.setItem(EXPAND_KEY, JSON.stringify([...expanded]));
    } catch (e) {}
  }, [expanded]);

  // Always reveal the current page: expand every folder on the way to it.
  // (This also opens a freshly-imported section the app navigates to.)
  useEffect(() => {
    const segs = currentRoute.split('/').filter(Boolean);
    if (segs.length < 2) return; // need at least one ancestor folder
    const ancestors = [];
    for (let i = 1; i < segs.length; i++) {
      ancestors.push(segs.slice(0, i).join('/'));
    }
    setExpanded((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const a of ancestors) if (!next.has(a)) { next.add(a); changed = true; }
      return changed ? next : prev;
    });
  }, [currentRoute]);

  const toggle = useCallback((path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  // Delete a branch (folder) or a single page, then refresh.
  const onDelete = useCallback(async (paths, label, count) => {
    if (!paths || paths.length === 0) return;
    // The built-in Authoring Kit can't be deleted.
    const deletable = paths.filter((p) => !String(p).startsWith('_meta/'));
    if (deletable.length === 0) {
      window.alert('The built-in Authoring Kit can’t be deleted.');
      return;
    }
    const ok = window.confirm(
      `Delete "${label}"${count > 1 ? ` and its ${count} pages` : ''}?\n\n` +
        `This permanently removes the file(s) and can't be undone.`
    );
    if (!ok) return;
    const res = await deleteFiles(deletable);
    // The backend now reports what actually went; treat a partial/failed delete
    // as an error instead of silently "succeeding" while files remain.
    if (!res || !res.ok) {
      const failed = res && res.failed;
      const detail =
        failed && failed.length
          ? `${failed.length} item(s) couldn't be removed (${failed[0].error}). ` +
            `A file may be open in another program.`
          : (res && res.error) || 'unknown error';
      window.alert('Delete failed: ' + detail);
      return;
    }
    window.location.hash = '#/';
    window.location.reload();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <Link to="/" className="brand">
          <span className="brand-mark">⛲</span>
          <span className="brand-name">Fountain of Knowledge</span>
        </Link>
        <ThemeToggle />
      </div>
      <SearchBar />
      <nav className="tree" aria-label="Contents">
        <TreeNode
          node={tree}
          depth={0}
          expanded={expanded}
          toggle={toggle}
          currentRoute={currentRoute}
          onDelete={onDelete}
        />
      </nav>
      <div className="sidebar-hint">
        ＋ Drag <code>.md</code> files to add · a folder to replace all
      </div>
      <div className="app-version">v{__APP_VERSION__}</div>
    </aside>
  );
}

function Layout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <Outlet />
      </main>
      <DropZone />
    </div>
  );
}

function FileView({ file }) {
  const location = useLocation();
  const { glossary } = useLibrary();
  useEffect(() => {
    document.title = `${file.title} · Fountain of Knowledge`;
    // A cross-page deep-link carries the target heading in the route hash, e.g.
    // #/cat/page#section. Scroll to it; otherwise (plain page link) start at top.
    const target = location.hash ? decodeURIComponent(location.hash.slice(1)) : '';
    // settleScrollTo keeps the heading pinned through async reflow; if the
    // heading isn't found (or there's none), just start at the top.
    const cleanup = target ? settleScrollTo(target) : null;
    if (!cleanup) scrollTop();
    return () => {
      if (cleanup) cleanup();
      document.title = 'Fountain of Knowledge';
    };
  }, [file, location.pathname, location.hash]);

  return (
    <article className="doc">
      <Breadcrumb file={file} />
      <div className="doc-head">
        <h1 className="doc-title">
          {file.icon && <span className="doc-icon">{file.icon}</span>}
          {file.title}
        </h1>
        {file.tags.length > 0 && (
          <div className="doc-tags">
            {file.tags.map((t) => (
              <span key={t} className="doc-tag">
                #{t}
              </span>
            ))}
          </div>
        )}
        <SectionActions file={file} />
      </div>
      <MarkdownView body={file.body} glossary={glossary} />
    </article>
  );
}

function NotFound() {
  return (
    <div className="notfound">
      <h1>Not found</h1>
      <p>That page doesn’t exist.</p>
      <Link to="/" className="back-link">
        ← Back to start
      </Link>
    </div>
  );
}

function Splash({ children }) {
  return (
    <div className="splash">
      <div className="splash-mark">⛲</div>
      <div className="splash-text">{children}</div>
    </div>
  );
}

export default function App() {
  const [lib, setLib] = useState(null);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setError(null);
    loadRawFiles()
      .then((rawMap) => {
        const built = buildLibrary(rawMap);
        built.search = createSearch(built.files);
        setLib(built);
      })
      .catch((e) => setError(String(e?.message || e)));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  if (error) return <Splash>Couldn’t load your library: {error}</Splash>;
  if (!lib) return <Splash>Loading your library…</Splash>;

  return (
    <LibraryContext.Provider value={{ ...lib, reload }}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          {lib.files.map((f) => (
            <Route
              key={f.route}
              path={f.route.slice(1)}
              element={<FileView file={f} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </LibraryContext.Provider>
  );
}
