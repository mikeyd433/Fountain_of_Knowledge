import { useCallback, useEffect, useState } from 'react';
import {
  Link,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { files, tree } from './lib/content.js';
import TreeNode from './components/TreeNode.jsx';
import SearchBar from './components/SearchBar.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import MarkdownView from './components/MarkdownView.jsx';
import Landing from './components/Landing.jsx';
import DropZone from './components/DropZone.jsx';

const EXPAND_KEY = 'fok-expanded';

// Collect every folder path, used to default-expand the tree on first run.
function allFolderPaths(node, acc = []) {
  for (const f of node.folders) {
    acc.push(f.path);
    allFolderPaths(f, acc);
  }
  return acc;
}

function loadExpanded() {
  try {
    const raw = localStorage.getItem(EXPAND_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch (e) {}
  return new Set(allFolderPaths(tree));
}

function Sidebar() {
  const location = useLocation();
  const currentRoute = decodeURIComponent(location.pathname);
  const [expanded, setExpanded] = useState(loadExpanded);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(EXPAND_KEY, JSON.stringify([...expanded]));
    } catch (e) {}
  }, [expanded]);

  const toggle = useCallback((path) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
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
        />
      </nav>
      <div className="sidebar-hint">＋ Drag <code>.md</code> files here to import</div>
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
  useEffect(() => {
    document.title = `${file.title} · Fountain of Knowledge`;
    window.scrollTo(0, 0);
    return () => {
      document.title = 'Fountain of Knowledge';
    };
  }, [file]);

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
      </div>
      <MarkdownView body={file.body} />
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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Landing />} />
        {files.map((f) => (
          <Route
            key={f.route}
            path={f.route.slice(1)}
            element={<FileView file={f} />}
          />
        ))}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
