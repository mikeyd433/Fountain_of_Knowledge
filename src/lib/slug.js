// Turn heading text into a URL-safe anchor slug.
// Lowercased, spaces → hyphens, punctuation stripped — close to GitHub's scheme
// so links like [jump](#my-heading) line up with a "## My Heading".
export function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // drop punctuation/emoji
    .replace(/\s+/g, '-') // spaces → hyphens
    .replace(/-+/g, '-') // collapse repeats
    .replace(/^-+|-+$/g, ''); // trim stray hyphens
}

// Collect the visible text of a hast element (for slugging a heading).
function hastText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.value || '';
  if (!node.children) return '';
  return node.children.map(hastText).join('');
}

// A local rehype plugin that gives every heading a stable, unique `id`,
// so intra-page links can target it. No external dependency.
export function rehypeHeadingIds() {
  return (tree) => {
    const seen = new Set();
    const unique = (base) => {
      const root = base || 'section';
      let id = root;
      let i = 1;
      while (seen.has(id)) id = `${root}-${i++}`;
      seen.add(id);
      return id;
    };

    const walk = (node) => {
      if (!node) return;
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        if (!node.properties) node.properties = {};
        if (!node.properties.id) {
          node.properties.id = unique(slugify(hastText(node)));
        } else {
          seen.add(node.properties.id);
        }
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}
