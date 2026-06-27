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

// Scroll the heading with this id into view. Returns true if it was found.
export function scrollToHeading(id, smooth = false) {
  const el = id && document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  return true;
}

// Briefly flash a heading so the reader's eye lands on it.
export function flashHeading(id) {
  const el = id && document.getElementById(id);
  if (!el) return;
  el.classList.add('anchor-target');
  window.setTimeout(() => el.classList.remove('anchor-target'), 1600);
}

// In-page anchor click: smooth-scroll to the heading and flash it. Content is
// already laid out, so a single scroll is enough.
export function flashScrollTo(id) {
  if (!scrollToHeading(id, true)) return false;
  flashHeading(id);
  return true;
}

// Cross-page deep-link arrival: scroll to the heading and KEEP it pinned while
// the page reflows — code blocks highlight asynchronously (shiki) and can grow
// the content above the target well after mount, especially on a cold load. We
// re-assert on every resize and consider the page "settled" once the layout has
// been quiet for a beat, then flash. The reader scrolling/typing cancels it, and
// a hard cap guarantees we stop. Returns a cleanup fn, or null if not found.
export function settleScrollTo(id) {
  if (!scrollToHeading(id)) return null;

  let stopped = false;
  let quietTimer;
  const stop = (flash) => {
    if (stopped) return;
    stopped = true;
    if (ro) ro.disconnect();
    clearTimeout(quietTimer);
    clearTimeout(capTimer);
    window.removeEventListener('wheel', cancel, true);
    window.removeEventListener('touchstart', cancel, true);
    window.removeEventListener('keydown', cancel, true);
    if (flash) flashHeading(id);
  };
  const cancel = () => stop(false);
  const settled = () => stop(true);
  const onResize = () => {
    if (stopped) return;
    scrollToHeading(id);
    clearTimeout(quietTimer);
    quietTimer = setTimeout(settled, 400); // layout quiet → settled
  };

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null;
  const article = document.querySelector('.doc');
  if (ro && article) ro.observe(article); // fires once immediately, kicking onResize
  quietTimer = setTimeout(settled, 400); // covers the no-reflow case
  const capTimer = setTimeout(settled, 8000); // hard safety cap

  // The reader taking over cancels the auto-pin (no flash).
  window.addEventListener('wheel', cancel, { passive: true, capture: true });
  window.addEventListener('touchstart', cancel, { passive: true, capture: true });
  window.addEventListener('keydown', cancel, true);

  return cancel;
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
