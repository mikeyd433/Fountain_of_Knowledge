// Shared helpers for turning dropped/replaced markdown into library files:
// path derivation, bundle expansion, and in-batch collision de-duplication.
// Used by both the drop importer (DropZone) and per-page replace (SectionActions).

import matter from 'gray-matter';

// Strip characters that are illegal in Windows paths/filenames.
export function cleanSeg(s) {
  return String(s)
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Normalize a `section` value (array or "/"-separated string) into levels.
export function sectionLevels(section) {
  if (Array.isArray(section)) return section.map(cleanSeg).filter(Boolean);
  if (typeof section === 'string') return section.split('/').map(cleanSeg).filter(Boolean);
  return [];
}

// Decide where a dropped file lands: <category>/<...section levels>/<name>.md
// Category/section come from the file's own frontmatter; default to "Imported".
export function deriveRelPath(fileName, raw) {
  let data = {};
  try {
    data = matter(raw).data || {};
  } catch {
    data = {};
  }
  const category = cleanSeg(data.category || 'Imported') || 'Imported';
  const levels = sectionLevels(data.section);
  let name = cleanSeg(fileName) || 'untitled.md';
  if (!/\.md$/i.test(name)) name += '.md';
  return [category, ...levels, name].filter(Boolean).join('/');
}

// A "bundle" is one file that defines several pages. Marked with `bundle: true`
// in frontmatter; each top-level `# Heading` becomes its own page, inheriting
// category/section/icon/tags from the file's frontmatter. Returns null if the
// file isn't a bundle.
export function expandBundle(raw) {
  let parsed;
  try {
    parsed = matter(raw);
  } catch {
    return null;
  }
  const fm = parsed.data || {};
  const isBundle = fm.bundle === true || fm.split === 'h1' || fm.multipage === true;
  if (!isBundle) return null;

  const lines = parsed.content.split('\n');
  const pages = [];
  let cur = null;
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    const m = !inFence && /^#\s+(.+?)\s*$/.exec(line); // single-# H1 only
    if (m) {
      if (cur) pages.push(cur);
      cur = { title: m[1].replace(/[#*`]/g, '').trim(), body: [] };
    } else if (cur) {
      cur.body.push(line);
    }
    // Any text before the first H1 is ignored.
  }
  if (cur) pages.push(cur);
  if (pages.length === 0) return null;

  const baseOrder = typeof fm.order === 'number' ? fm.order : 0;
  const baseSection = sectionLevels(fm.section); // file-level section path
  return pages.map((pg, i) => {
    // A heading may itself be a path ("Modeling/Edit Mode/Extrude") to nest
    // deeper; the last segment is the page title, the rest extend the section.
    const headParts = pg.title.split('/').map((s) => s.trim()).filter(Boolean);
    const pageTitle = headParts.length ? headParts[headParts.length - 1] : pg.title;
    const extra = headParts.slice(0, -1);
    const levels = [...baseSection, ...extra];

    const pageFm = { title: pageTitle };
    if (fm.category) pageFm.category = fm.category;
    if (levels.length) pageFm.section = levels.join('/');
    if (fm.icon) pageFm.icon = fm.icon;
    if (Array.isArray(fm.tags)) pageFm.tags = fm.tags;
    pageFm.order = baseOrder + i + 1;
    const content = matter.stringify(pg.body.join('\n').trim() + '\n', pageFm);
    return { relPath: deriveRelPath(pageTitle + '.md', content), content };
  });
}

// Turn one dropped file into one or more page entries (expanding bundles).
export function fileToEntries(name, raw) {
  const expanded = expandBundle(raw);
  if (expanded && expanded.length) return expanded;
  return [{ relPath: deriveRelPath(name, raw), content: raw }];
}

// Guard against two entries in the SAME batch resolving to the same file (e.g.
// two pages with the same title under the same section): the later one would
// silently overwrite the earlier. Append a "-N" suffix so both survive. Matches
// case-insensitively for Windows filesystems. Returns { entries, renamed }.
export function dedupeRelPaths(entries) {
  const used = new Set();
  let renamed = 0;
  const out = entries.map((e) => {
    let rel = e.relPath;
    if (used.has(rel.toLowerCase())) {
      renamed++;
      const m = /^(.*?)(\.md)$/i.exec(rel);
      const base = m ? m[1] : rel;
      const ext = m ? m[2] : '';
      let i = 2;
      while (used.has(`${base}-${i}${ext}`.toLowerCase())) i++;
      rel = `${base}-${i}${ext}`;
    }
    used.add(rel.toLowerCase());
    return rel === e.relPath ? e : { ...e, relPath: rel };
  });
  return { entries: out, renamed };
}
