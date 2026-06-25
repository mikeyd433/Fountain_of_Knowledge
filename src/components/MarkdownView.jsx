import { Children } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Keycap from './Keycap.jsx';
import ShortcutTable from './ShortcutTable.jsx';
import Callout from './Callout.jsx';
import CodeBlock from './CodeBlock.jsx';
import { isKeyCombo } from '../lib/keys.js';

const ALERT_RE = /^\s*\[!(tip|note|warning|danger)\]\s?/i;

// Pull the plain text out of a hast node (for alert detection).
function nodeText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (!node.children) return '';
  return node.children.map(nodeText).join('');
}

// Remove a leading "[!type]" marker from rendered React children.
function stripMarker(children) {
  let done = false;
  const walk = (nodes) =>
    Children.map(nodes, (child) => {
      if (done) return child;
      if (typeof child === 'string') {
        if (ALERT_RE.test(child)) {
          done = true;
          return child.replace(ALERT_RE, '');
        }
        return child;
      }
      if (child && child.props && child.props.children != null) {
        const newChildren = walk(child.props.children);
        return { ...child, props: { ...child.props, children: newChildren } };
      }
      return child;
    });
  return walk(children);
}

const components = {
  // Make <pre> transparent; the code component renders the full block.
  pre({ children }) {
    return <>{children}</>;
  },

  code({ node, className, children, ...props }) {
    const match = /language-([\w-]+)/.exec(className || '');
    const text = String(children).replace(/\n$/, '');

    if (match) {
      const lang = match[1];
      if (lang === 'shortcuts') return <ShortcutTable source={text} />;
      return <CodeBlock code={text} lang={lang} />;
    }

    // Inline code: render as keycaps when it looks like a key combo.
    const inline = String(children);
    if (isKeyCombo(inline)) return <Keycap value={inline.trim()} />;
    return (
      <code className="inline-code" {...props}>
        {children}
      </code>
    );
  },

  blockquote({ node, children }) {
    const text = nodeText(node);
    const m = ALERT_RE.exec(text);
    if (m) {
      const type = m[1].toLowerCase();
      return <Callout type={type}>{stripMarker(children)}</Callout>;
    }
    return <blockquote>{children}</blockquote>;
  },

  a({ node, href, children, ...props }) {
    const external = href && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export default function MarkdownView({ body }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}
