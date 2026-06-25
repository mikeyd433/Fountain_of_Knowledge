# ⛲ Fountain of Knowledge

A private, local-only, browsable reader for your program shortcuts, workflows,
and reference notes. Content is authored as markdown, dropped into a folder, and
rendered in a nested, searchable, cheat-sheet-aware interface.

No deployment, no auth, no hosting — runs on your machine with `npm run dev`.

## Quick start

```bash
npm install
npm run dev        # open the printed localhost URL
npm run host       # serve on your LAN (read it from a phone/tablet)
npm run build      # bake a static snapshot into dist/
```

## Adding content

The directory `src/content/` **is** the navigation tree. Drop a `.md` file in and
it appears in the sidebar automatically. In dev mode, saving a file hot-reloads
it live.

```
src/content/
  REAPER/
    Shortcuts.md
    Workflows/
      Routing.md
  Claude Code/
    Worktrees.md
```

Each file starts with YAML frontmatter (`title` required; the rest optional):

```yaml
---
title: REAPER Routing
category: REAPER
section: Workflows
order: 3
icon: 🎛️
tags: [routing, sends, busses]
---
```

## Authoring conventions

- **Keycaps** — inline code that looks like a combo, e.g. `Ctrl+Shift+P`,
  renders as physical keycaps. Plain inline code is left alone.
- **Shortcut tables** — a fenced `shortcuts` block with `Action | Keys` lines
  renders as a styled two-column table.
- **Callouts** — `> [!tip]`, `> [!note]`, `> [!warning]`, `> [!danger]`
  blockquotes render as colored boxes.
- **Copy buttons** — every fenced code block gets one automatically.

The full guide and a reusable Claude generator prompt live inside the reader
itself, under **Authoring Kit** (`src/content/_meta/`).

## Stack

React + Vite · react-router-dom · gray-matter · react-markdown + remark-gfm ·
rehype-raw · shiki · fuse.js
