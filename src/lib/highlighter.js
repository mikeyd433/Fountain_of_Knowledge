import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

// Fine-grained imports so only these grammars/themes are bundled,
// instead of shiki's full language registry.
import githubLight from 'shiki/themes/github-light.mjs';
import githubDark from 'shiki/themes/github-dark.mjs';

const LANG_LOADERS = {
  bash: () => import('shiki/langs/bash.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  jsx: () => import('shiki/langs/jsx.mjs'),
  tsx: () => import('shiki/langs/tsx.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  lua: () => import('shiki/langs/lua.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  ini: () => import('shiki/langs/ini.mjs'),
  diff: () => import('shiki/langs/diff.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
};

const THEMES = { light: 'github-light', dark: 'github-dark' };

let highlighterPromise = null;
const loadedLangs = new Set();

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubLight, githubDark],
      langs: [],
      engine: createOnigurumaEngine(import('shiki/wasm')),
    });
  }
  return highlighterPromise;
}

const aliases = {
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  yml: 'yaml',
  md: 'markdown',
};

function resolveLang(lang) {
  const norm = aliases[lang] || lang;
  return LANG_LOADERS[norm] ? norm : null;
}

export async function highlight(code, lang) {
  const hl = await getHighlighter();
  const resolved = resolveLang(lang);

  if (!resolved) {
    // Unknown language: render as plain, escaped text in a shiki-styled block.
    return hl.codeToHtml(code, {
      lang: 'text',
      themes: THEMES,
      defaultColor: false,
    });
  }

  if (!loadedLangs.has(resolved)) {
    const mod = await LANG_LOADERS[resolved]();
    await hl.loadLanguage(mod.default);
    loadedLangs.add(resolved);
  }

  return hl.codeToHtml(code, {
    lang: resolved,
    themes: THEMES,
    defaultColor: false,
  });
}
