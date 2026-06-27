// Inline tooltips: hovering (or focusing) a marked word reveals a note.
//
// Authoring syntax:
//   {{term|tooltip text}}   inline — "term" shows, "tooltip text" pops up
//   {{term}}                reference — gloss pulled from the glossary by `term`
//   {{label|@key}}          reference — gloss pulled from the glossary by `key`,
//                           shown under a different `label`
//
// Glossary entries are defined in ```glossary blocks and collected library-wide
// (see content.js → buildLibrary). A reference that doesn't resolve is left as
// literal text, so a typo'd key stays visible.
//
// Implemented as a remark plugin that rewrites matching text into a <span>
// carrying the tip in a `data-tip` attribute — the bubble itself is pure CSS
// (see `.tooltip-term` in index.css), so no React component is needed.

import { slugify } from './slug.js';

// term/label: no braces or pipe. The "|tip" part is optional (bare reference).
const TIP_RE = /\{\{\s*([^{}|]+?)\s*(?:\|\s*([^{}]+?)\s*)?\}\}/g;
// A reference target: "@key" with a slug-like key and nothing else.
const REF_RE = /^@([\w-]+)$/;

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

// Resolve one regex match to a tooltip node, or null to leave it literal.
function resolveMatch(m, glossary) {
  const term = m[1].trim();
  const rhs = m[2] != null ? m[2].trim() : null;

  if (rhs == null) {
    // Bare {{term}} → look the gloss up by the term itself.
    const gloss = glossary && glossary[slugify(term)];
    return gloss ? tooltipNode(term, gloss) : null;
  }
  const ref = REF_RE.exec(rhs);
  if (ref) {
    // {{label|@key}} → look the gloss up by an explicit key.
    const gloss = glossary && glossary[slugify(ref[1])];
    return gloss ? tooltipNode(term, gloss) : null;
  }
  // {{term|tip}} → inline tooltip text.
  return tooltipNode(term, rhs);
}

// Split one text value into a run of text/tooltip nodes. Returns null when no
// tooltip is produced (so the caller keeps the original node untouched). Matches
// that don't resolve are left as literal text.
function splitText(value, glossary) {
  const re = new RegExp(TIP_RE.source, 'g');
  const out = [];
  const pushText = (s) => {
    if (!s) return;
    const tail = out[out.length - 1];
    if (tail && tail.type === 'text') tail.value += s;
    else out.push({ type: 'text', value: s });
  };

  let last = 0;
  let m;
  let produced = false;
  while ((m = re.exec(value))) {
    const node = resolveMatch(m, glossary);
    if (!node) continue; // unresolved/literal — fold back in via the text slices
    pushText(value.slice(last, m.index));
    out.push(node);
    last = m.index + m[0].length;
    produced = true;
  }
  if (!produced) return null;
  pushText(value.slice(last));
  return out;
}

function walk(node, glossary) {
  if (!node || !Array.isArray(node.children)) return;
  let changed = false;
  const next = [];
  for (const child of node.children) {
    // Leave code spans/blocks alone; only mark prose text.
    if (child.type === 'text' && child.value.includes('{{')) {
      const parts = splitText(child.value, glossary);
      if (parts) {
        changed = true;
        next.push(...parts);
      } else {
        next.push(child);
      }
    } else {
      if (child.type !== 'inlineCode' && child.type !== 'code') walk(child, glossary);
      next.push(child);
    }
  }
  if (changed) node.children = next;
}

export function remarkTooltips(options = {}) {
  const glossary = options.glossary || null;
  return (tree) => walk(tree, glossary);
}
