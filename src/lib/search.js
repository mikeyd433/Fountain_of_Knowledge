import Fuse from 'fuse.js';

// Build a short snippet around the best body match.
function snippet(result) {
  const bodyMatch = (result.matches || []).find((m) => m.key === 'body');
  const body = result.item.body || '';
  if (!bodyMatch || !bodyMatch.indices.length) {
    return body.slice(0, 120).replace(/\s+/g, ' ').trim();
  }
  const [start] = bodyMatch.indices.sort((a, b) => b[1] - b[0] - (a[1] - a[0]))[0];
  const from = Math.max(0, start - 40);
  const to = Math.min(body.length, start + 80);
  return (
    (from > 0 ? '…' : '') +
    body.slice(from, to).replace(/\s+/g, ' ').trim() +
    (to < body.length ? '…' : '')
  );
}

// Create a search function bound to a specific set of files.
export function createSearch(files) {
  const fuse = new Fuse(files, {
    includeMatches: true,
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.4,
    minMatchCharLength: 2,
    keys: [
      { name: 'title', weight: 0.45 },
      { name: 'tags', weight: 0.25 },
      { name: 'headings', weight: 0.18 },
      { name: 'body', weight: 0.12 },
    ],
  });

  return function search(query) {
    if (!query || !query.trim()) return [];
    return fuse.search(query.trim(), { limit: 12 }).map((r) => ({
      file: r.item,
      snippet: snippet(r),
      score: r.score,
    }));
  };
}
