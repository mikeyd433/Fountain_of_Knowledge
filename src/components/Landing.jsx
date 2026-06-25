import { Link } from 'react-router-dom';
import { useLibrary } from '../lib/library.js';

export default function Landing() {
  const { categories: cats, files } = useLibrary();

  return (
    <div className="landing">
      <header className="landing-head">
        <h1>
          <span className="landing-mark">⛲</span> Fountain of Knowledge
        </h1>
        <p className="landing-sub">
          Your private reader for shortcuts, workflows, and reference notes.
          {files.length > 0 && (
            <> {files.length} {files.length === 1 ? 'entry' : 'entries'} across {cats.length} {cats.length === 1 ? 'category' : 'categories'}.</>
          )}
        </p>
      </header>

      {cats.length === 0 ? (
        <div className="landing-empty">
          <p>No reference files yet.</p>
          <p>
            Drag a <code>.md</code> file anywhere onto this window to import it —
            or drop one into <code>src/content/</code> directly.
          </p>
        </div>
      ) : (
        <div className="card-grid">
          {cats.map((c) => (
            <Link
              key={c.path}
              to={c.firstRoute || '/'}
              className="cat-card"
            >
              <div className="cat-card-icon">{c.icon || '📁'}</div>
              <div className="cat-card-name">{c.name}</div>
              <div className="cat-card-count">
                {c.count} {c.count === 1 ? 'entry' : 'entries'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
