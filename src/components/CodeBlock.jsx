import { useEffect, useRef, useState } from 'react';
import { highlight } from '../lib/highlighter.js';

// A fenced code block with shiki highlighting and a copy button.
export default function CodeBlock({ code, lang }) {
  const [html, setHtml] = useState(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    let active = true;
    highlight(code, lang)
      .then((out) => {
        if (active) setHtml(out);
      })
      .catch(() => {
        if (active) setHtml(null);
      });
    return () => {
      active = false;
    };
  }, [code, lang]);

  useEffect(() => () => clearTimeout(timer.current), []);

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1400);
    });
  }

  return (
    <div className="codeblock">
      <div className="codeblock-bar">
        {lang ? <span className="codeblock-lang">{lang}</span> : <span />}
        <button className="copy-btn" onClick={copy} aria-label="Copy code">
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      {html ? (
        <div className="shiki-wrap" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="shiki-fallback">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
