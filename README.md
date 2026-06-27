# ⛲ Fountain of Knowledge

A private, local-only, browsable reader for your program shortcuts, workflows,
and reference notes. Content is authored as markdown, dropped into a folder, and
rendered in a nested, searchable, cheat-sheet-aware interface.

No deployment, no auth, no hosting. Runs as a native desktop app, or as a
local web app for LAN/phone access.

## Desktop app (Windows) — recommended

Build a real, self-contained Windows app: its own `.exe`, Start-Menu and
Desktop entries, no terminal, no localhost, no browser.

```bash
npm install
npm run app:build
```

This produces an installer at **`dist-app/Fountain of Knowledge Setup <version>.exe`**.
Run it once to install; then launch **Fountain of Knowledge** like any other app.

Your notes live in a writable folder that **persists across app updates**:
`%APPDATA%\Fountain of Knowledge\content`. On first launch it's seeded with the
sample content. Drag `.md` files onto the window to add more (see below).

### Run the desktop app in development

```bash
npm run app:dev    # starts Vite + Electron with hot reload
```

## Web app (LAN / phone)

Prefer a browser, or want to read it from your phone on the same network?

```bash
npm run dev        # open the printed localhost URL
npm run host       # serve on your LAN (read it from a phone/tablet)
npm run build      # bake a static snapshot into dist/
```

There's also a one-click Windows launcher for this mode: double-click
`scripts/install-shortcut.bat` once to put a Desktop shortcut that starts the
local server and opens a clean app-style browser window.

## Adding content

Drag `.md` files anywhere onto the window to import them — they're saved to your
library permanently. You can also edit the content folder directly:

- **Desktop app:** `%APPDATA%\Fountain of Knowledge\content`
- **Web/dev:** `src/content/` (saving a file hot-reloads it live)

The folder structure **is** the navigation tree.

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
- **Section links** — every heading is an anchor. Link within the same page with
  `[text](#heading-slug)` (slug = title lowercased, spaces → hyphens); it
  smooth-scrolls. Link to another page by its route, `[text](#/category/title)`,
  optionally with a trailing `#heading` to land on a section. Hover a heading for
  its `#` handle.
- **Tooltips** — `{{term|tooltip text}}` shows *term* in the prose and pops the
  plain-text tooltip up on hover or keyboard focus (not inside table cells).
- **Copy buttons** — every fenced code block gets one automatically.

The full guide and a reusable Claude generator prompt live inside the reader
itself, under **Authoring Kit** (`src/content/_meta/`).

## Stack

Electron · React + Vite · react-router-dom · gray-matter ·
react-markdown + remark-gfm · rehype-raw · shiki · fuse.js
