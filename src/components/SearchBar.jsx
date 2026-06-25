import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { search } from '../lib/search.js';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => search(query), [query]);

  // "/" focuses search from anywhere.
  useEffect(() => {
    function onKey(e) {
      if (
        e.key === '/' &&
        !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    function onClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => setActive(0), [query]);

  function choose(file) {
    navigate(file.route);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e) {
    if (!results.length) {
      if (e.key === 'Escape') inputRef.current?.blur();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[active].file);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  return (
    <div className="search" ref={boxRef}>
      <input
        ref={inputRef}
        type="text"
        className="search-input"
        placeholder="Search…  ( / )"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {open && query.trim() && (
        <div className="search-results">
          {results.length === 0 ? (
            <div className="search-empty">No matches</div>
          ) : (
            results.map((r, i) => (
              <button
                key={r.file.route}
                className={`search-result${i === active ? ' active' : ''}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(r.file)}
              >
                <div className="search-result-title">
                  {r.file.icon && <span>{r.file.icon} </span>}
                  {r.file.title}
                </div>
                <div className="search-result-crumb">
                  {[r.file.category, r.file.section].filter(Boolean).join(' › ')}
                </div>
                {r.snippet && (
                  <div className="search-result-snippet">{r.snippet}</div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
