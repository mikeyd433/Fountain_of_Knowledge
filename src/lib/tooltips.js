// Inline tooltips: hovering (or focusing) a marked word reveals a note.
//
// Authoring syntax:  {{term|tooltip text}}
//   "term" is what's shown in the prose; "tooltip text" pops up on hover.
//
// Implemented as a remark plugin that rewrites matching text into a <span>
// carrying the tip in a `data-tip` attribute — the bubble itself is pure CSS
// (see `.tooltip-term` in index.css), so no React component is needed.

// term: no braces or pipe; tip: no braces. Both trimmed. Non-greedy.
const TIP_RE = /\{\{\s*([^{}|]+?)\s*\|\s*([^{}]+?)\s*\}\}/g;

function tooltipNode(term, tip) {
  // Reuse a known mdast node type (emphasis) and override its hast output via
  // data.hName/hProperties, so mdast-util-to-hast emits exactly the span we want.
  return {
    type: 'emphasis',
    data: {
      hName: 'span',
      hProperties: {
        className: ['tooltip-term'],
        'data-tip': tip,
        tabIndex: 0,
        'aria-label': tip,
      },
    },
    children: [{ type: 'text', value: term }],
  };
}

// Split one text value into a run of text/tooltip nodes. Returns null when there
// is no tooltip to mark (so the caller keeps the original node untouched). Note
// a sole "{{term|tip}}" — e.g. a whole link label — yields a single tooltip node,
// which must still count as a match.
function splitText(value) {
  const re = new RegExp(TIP_RE.source, 'g');
  const out = [];
  let last = 0;
  let m;
  let matched = false;
  while ((m = re.exec(value))) {
    matched = true;
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
    out.push(tooltipNode(m[1].trim(), m[2].trim()));
    last = m.index + m[0].length;
  }
  if (!matched) return null;
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
  return out;
}

function walk(node) {
  if (!node || !Array.isArray(node.children)) return;
  let changed = false;
  const next = [];
  for (const child of node.children) {
    // Leave code spans/blocks alone; only mark prose text.
    if (child.type === 'text' && child.value.includes('{{')) {
      const parts = splitText(child.value);
      if (parts) {
        changed = true;
        next.push(...parts);
      } else {
        next.push(child);
      }
    } else {
      if (child.type !== 'inlineCode' && child.type !== 'code') walk(child);
      next.push(child);
    }
  }
  if (changed) node.children = next;
}

export function remarkTooltips() {
  return (tree) => walk(tree);
}
