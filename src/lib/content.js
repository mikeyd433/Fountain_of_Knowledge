import matter from 'gray-matter';

function slug(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(body) {
  const out = [];
  const lines = body.split('\n');
  let inFence = false;
  for (const line of lines) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) out.push(m[2].replace(/[#*`]/g, '').trim());
  }
  return out;
}

// Collect glossary entries from a ```glossary fenced block: one "Term | gloss"
// per line. The lookup key is the slugged term, so `{{Term}}` resolves to it.
function extractGlossary(body) {
  const out = {};
  const lines = body.split('\n');
  let inGloss = false;
  for (const line of lines) {
    const fence = /^\s*```(\w*)/.exec(line);
    if (fence) {
      if (!inGloss && fence[1] === 'glossary') inGloss = true;
      else if (inGloss) inGloss = false;
      continue;
    }
    if (!inGloss) continue;
    const t = line.trim();
    if (!t || /^[-|\s]+$/.test(t)) continue;
    const idx = t.indexOf('|');
    if (idx === -1) continue;
    const term = t.slice(0, idx).trim();
    const gloss = t.slice(idx + 1).trim();
    if (term && gloss) out[slug(term)] = gloss;
  }
  return out;
}

// Normalize a `section` value into an ordered list of nesting levels.
// Accepts an array (["A","B"]) or a "/"-separated string ("A/B"); empty/missing
// falls back to the provided default (on-disk subfolders).
function sectionParts(section, fallback = []) {
  if (Array.isArray(section)) {
    return section.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof section === 'string') {
    const parts = section.split('/').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts;
  }
  return fallback;
}

// Parse one file into a normalized record. `relPath` may be either a bare
// content-relative path ("REAPER/Shortcuts.md") or a glob path
// ("../content/REAPER/Shortcuts.md"); both are handled.
function parseFile(relPath, raw) {
  const { data, content } = matter(raw);

  const rel = String(relPath).replace(/^.*\/content\//, '').replace(/^\/+/, '');
  const parts = rel.split('/');
  const fileName = parts.pop().replace(/\.md$/i, '');
  const folders = parts;

  const title = data.title || fileName;
  const category = data.category || folders[0] || 'General';
  // `section` may be a path for arbitrary nesting: a "/"-separated string or
  // an array of levels. Falls back to on-disk subfolders.
  const subFolders = sectionParts(data.section, folders.slice(1));

  const treePath = [category, ...subFolders];
  const route = '/' + [...treePath, title].map(slug).join('/');

  return {
    relPath: rel,
    raw, // original markdown (frontmatter + body), for exact export
    route,
    title,
    category,
    section: subFolders.length ? subFolders.join(' / ') : null,
    treePath,
    order: typeof data.order === 'number' ? data.order : null,
    icon: data.icon || null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    headings: extractHeadings(content),
    frontmatter: data,
    body: content,
  };
}

function byOrderThenTitle(a, b) {
  const ao = a.order ?? Infinity;
  const bo = b.order ?? Infinity;
  if (ao !== bo) return ao - bo;
  return a.title.localeCompare(b.title);
}

// Build a nested tree: { name, path, folders:[], files:[] }
function buildTree(fileList) {
  const root = { name: '', path: '', folders: new Map(), files: [] };

  for (const f of fileList) {
    let node = root;
    let acc = [];
    for (const seg of f.treePath) {
      acc = [...acc, seg];
      if (!node.folders.has(seg)) {
        node.folders.set(seg, {
          name: seg,
          path: acc.map(slug).join('/'),
          folders: new Map(),
          files: [],
        });
      }
      node = node.folders.get(seg);
    }
    node.files.push(f);
  }

  function finalize(node) {
    const folders = [...node.folders.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(finalize);
    const leaves = [...node.files].sort(byOrderThenTitle);
    return { name: node.name, path: node.path, folders, files: leaves };
  }

  return finalize(root);
}

function countFiles(node) {
  return node.files.length + node.folders.reduce((n, f) => n + countFiles(f), 0);
}

function firstLeafRoute(node) {
  if (node.files.length) return node.files[0].route;
  for (const f of node.folders) {
    const r = firstLeafRoute(f);
    if (r) return r;
  }
  return null;
}

function firstIcon(node) {
  const f = node.files.find((x) => x.icon);
  if (f) return f.icon;
  for (const sub of node.folders) {
    const i = firstIcon(sub);
    if (i) return i;
  }
  return null;
}

function topCategories(tree) {
  return tree.folders.map((c) => ({
    name: c.name,
    path: c.path,
    count: countFiles(c),
    firstRoute: firstLeafRoute(c),
    icon: firstIcon(c),
  }));
}

// Assemble a full library from a { relPath: rawMarkdown } map.
export function buildLibrary(rawMap) {
  const files = Object.entries(rawMap)
    .map(([p, raw]) => parseFile(p, raw))
    .sort(byOrderThenTitle);
  const tree = buildTree(files);
  const fileByRoute = new Map(files.map((f) => [f.route, f]));
  const categories = topCategories(tree);
  const firstRoute = files.length ? files[0].route : null;
  // Merge every page's ```glossary entries into one library-wide map of
  // key → gloss text, so reference tooltips ({{term}}, {{x|@key}}) resolve
  // from any page. Later files win on duplicate keys.
  const glossary = {};
  for (const f of files) Object.assign(glossary, extractGlossary(f.body));
  return { files, tree, fileByRoute, categories, firstRoute, glossary };
}

// Route a dropped file will get once written — same derivation as the loader.
export function routeForDropped(relPath, raw) {
  return parseFile(relPath, raw).route;
}
