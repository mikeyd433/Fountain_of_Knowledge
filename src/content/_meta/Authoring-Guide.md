---
title: Authoring Guide
category: Authoring Kit
order: 1
icon: 📐
tags: [authoring, conventions, markdown, reference]
---

## How content works

Your notes are markdown files in a content folder. The folder structure **is**
the navigation tree — nested folders become nested sidebar sections, no manifest
to edit.

```
content/
  REAPER/
    Shortcuts.md
    Workflows/
      Routing.md
  Claude Code/
    Worktrees.md
```

### Adding notes

**Drag and drop** — drop one or more `.md` files anywhere onto the window. They're
saved into your library permanently and the new page opens automatically. The
target folder comes from each file's `category` / `section` frontmatter (files
without a `category` land under **Imported**).

**Edit the folder directly** — or manage files yourself:

- **Desktop app:** `%APPDATA%\Fountain of Knowledge\content`
  (paste that path into File Explorer's address bar).
- **Web / dev mode:** the project's `src/content/` folder; saving a file
  hot-reloads it live.

> [!note] The desktop app's content folder persists across app updates and
> reinstalls, so your notes are safe.

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
