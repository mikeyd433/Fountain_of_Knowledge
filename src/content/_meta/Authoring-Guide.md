---
title: Authoring Guide
category: Authoring Kit
order: 1
icon: 📐
tags: [authoring, conventions, markdown, reference]
---

## How content works

The folder `src/content/` **is** the navigation tree. Drop a `.md` file in, and
it shows up in the sidebar — no manifest to edit. Nested folders become nested
sidebar sections.

```
src/content/
  REAPER/
    Shortcuts.md
    Workflows/
      Routing.md
  Claude Code/
    Worktrees.md
```

In dev (`npm run dev`), saving a new file hot-reloads it live.

## Frontmatter

Every file starts with YAML frontmatter. Only `title` is required.

```yaml
---
title: REAPER Routing          # required — display name
category: REAPER               # optional — overrides folder
section: Workflows             # optional — overrides subfolder
order: 3                       # optional — sort within group
icon: 🎛️                       # optional — shown in the tree
tags: [routing, sends, busses] # optional — feeds search
---
```

## Conventions

### Keycaps

Inline code that looks like a key combo renders as physical keycaps. Plain inline
code is left alone.

Press `Ctrl+Shift+P` to open the action list. The file `reaper.ini` stays plain.

### Shortcut tables

A fenced block tagged `shortcuts` becomes a styled two-column table. One
`Action | Keys` per line:

```shortcuts
Open action list     | Ctrl+Shift+P
Split item at cursor | S
Toggle repeat        | R
```

### Callouts

Start a blockquote with `[!type]` to get a colored box. Types: `tip`, `note`,
`warning`, `danger`.

> [!tip] This is a tip callout.

> [!warning] This is a warning callout.

### Copy-able commands

Any fenced code block gets an automatic copy button:

```bash
npm run dev
```

> [!note] Keep the tone terse and scannable — this is a cheat sheet, not prose.
