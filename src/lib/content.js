import matter from 'gray-matter';

// Load every markdown file under ./content as raw text at app start.
// Dev: HMR picks up new files. Build: baked into a static snapshot.
const rawFiles = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

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

// Parse one file into a normalized record.
function parseFile(globPath, raw) {
  const { data, content } = matter(raw);

  // "../content/REAPER/Workflows/Routing.md" -> "REAPER/Workflows/Routing.md"
  const rel = globPath.replace(/^.*\/content\//, '');
  const parts = rel.split('/');
  const fileName = parts.pop().replace(/\.md$/i, '');
  const folders = parts; // intermediate folders

  const title = data.title || fileName;
  const category = data.category || folders[0] || 'General';
  // section / deeper folders feed the nesting beneath the category
  const subFolders = data.section ? [data.section] : folders.slice(1);

  const treePath = [category, ...subFolders];
  const route = '/' + [...treePath, title].map(slug).join('/');

  return {
    globPath,
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

export const files = Object.entries(rawFiles)
  .map(([p, raw]) => parseFile(p, raw))
  .sort(byOrderThenTitle);

function byOrderThenTitle(a, b) {
  const ao = a.order ?? Infinity;
  const bo = b.order ?? Infinity;
  if (ao !== bo) return ao - bo;
  return a.title.localeCompare(b.title);
}

// Build a nested tree: { name, path, folders:[], files:[] }
export function buildTree(fileList) {
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

  // Convert Maps -> sorted arrays.
  function finalize(node) {
    const folders = [...node.folders.values()]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(finalize);
    const leaves = [...node.files].sort(byOrderThenTitle);
    return { name: node.name, path: node.path, folders, files: leaves };
  }

  return finalize(root);
}

export const tree = buildTree(files);

export const fileByRoute = new Map(files.map((f) => [f.route, f]));

// Top-level categories with counts, for the landing page.
export function categories() {
  return tree.folders.map((c) => ({
    name: c.name,
    path: c.path,
    count: countFiles(c),
    firstRoute: firstLeafRoute(c),
    icon: firstIcon(c),
  }));
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

export const firstRoute = files.length ? files[0].route : null;

// Compute the route a dropped file will have once written, using the exact
// same derivation as the loader so we can navigate straight to it.
export function routeForDropped(relPath, raw) {
  return parseFile('../content/' + relPath, raw).route;
}
