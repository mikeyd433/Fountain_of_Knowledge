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

**Drag and drop files** — drop one or more `.md` files anywhere onto the window.
They're saved into your library permanently and the new page opens automatically.
The target folder comes from each file's `category` / `section` frontmatter (files
without a `category` land under **Imported**).

**Drag and drop a folder** — drop a whole folder to **mirror** your library to it:
matching pages are updated, new ones added, and pages *not* in the folder are
removed. You'll be asked to confirm first, and the Authoring Kit is always kept.
Use this when the folder is your single source of truth.

**Edit the folder directly** — or manage files yourself:

- **Desktop app:** `%APPDATA%\Fountain of Knowledge\content`
  (paste that path into File Explorer's address bar).
- **Web / dev mode:** the project's `src/content/` folder; saving a file
  hot-reloads it live.

> [!note] The desktop app's content folder persists across app updates and
> reinstalls, so your notes are safe.

### Editing a page

Every page has two buttons under its title:

- **⬇ Export .md** — downloads this page's exact markdown file. Drop that file
  into a new Claude chat to revise it.
- **⤴ Replace…** — click to pick (or drop a `.md` file onto the box) to overwrite
  *this* page with the new version. The page reloads with your changes.

So the round-trip is: **Export → edit with Claude → Replace.**

### Deleting

Hover any item in the sidebar and click the 🗑 icon:

- on a **category or section** — removes that whole branch and every page in it,
- on a single **page** — removes just that page.

You'll be asked to confirm first. This is handy for clearing out a section so you
can re-import it totally fresh.

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

### Nesting as deep as you like

There are **two separate kinds of nesting** — don't mix them up:

- **Inside a page:** Markdown headings `##`, `###` … `######` (up to 6 levels).
  These structure the content *within* one page; they do **not** create sidebar
  entries.
- **The sidebar tree:** driven by `category` + `section`. This is the navigable
  folder structure, and it can go **arbitrarily deep** (limited only by your
  OS's path length).

To nest the tree, make `section` a **path** — a `/`-separated string or a list:

```yaml
section: Workflows/Routing/Advanced      # Category › Workflows › Routing › Advanced › <page>
# or:
section: [Workflows, Routing, Advanced]
```

(Bundles can nest per-page via their headings too — see below.)

## Multi-page files (bundles)

Want several pages in a section but only want to manage **one** file? Add
`bundle: true` to the frontmatter. Then every top-level `# Heading` becomes its
own page, and they all share the file's `category` / `section` / `icon` / `tags`.

```markdown
---
category: REAPER
section: Workflows
bundle: true
icon: 🎛️
tags: [reaper]
---

# Routing

## Sends
Use `Ctrl+Alt+S` to add a send.

# Recording

## Arming tracks
Press `R` to arm.

# Comping

Take lanes and how to flatten them.
```

That single file produces three pages — **Routing**, **Recording**, **Comping** —
all under REAPER › Workflows, in the order written. Inside each page, use `##`
for its sub-sections as usual.

> [!tip] Drop the bundle file like any other. Re-dropping an edited version
> overwrites the same pages (the titles drive where they land), so it stays in
> sync — no duplicates.

A bundle heading can itself be a **path** to nest a page deeper than the file's
`section`. The last segment is the page title; the rest extend the path:

```markdown
# Modeling/Edit Mode/Extrude     → …/Modeling/Edit Mode/Extrude
# Modeling/Edit Mode/Bevel       → …/Modeling/Edit Mode/Bevel
# Rendering                      → …/Rendering
```

> [!note] Because `/` means "nest", avoid literal slashes in a page title — use
> a different character (e.g. "TCP-IP") if you need one.

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

### Linking between parts of a page

Every heading is an anchor. Link to one from anywhere in the **same page** with a
standard markdown link whose target is `#` plus the heading's *slug* — the title
lowercased, with spaces turned into hyphens and punctuation dropped:

```markdown
See [Shortcut tables](#shortcut-tables) below, or jump to [Callouts](#callouts).
```

So `## Shortcut tables` is reachable at `#shortcut-tables`. Clicking the link
smooth-scrolls to that heading and flashes it briefly. Hover any heading to reveal
a `#` handle that points at itself.

> [!tip] Two headings with the same text get numbered slugs — the first is
> `#setup`, the next `#setup-1`, and so on.

Heading anchors only resolve **within the page you're on** (slugs are per-page, so
two pages can each have their own `#overview`).

### Linking to another page

To link from one page to another, target that page's **route** — `#/` followed by
its slugged location (`category / section… / title`, each lowercased with spaces
as hyphens). For a bundle, the page's title is the **last** segment of its `#`
heading:

```markdown
See the [Routing](#/reaper/workflows/routing) page.
```

Add a `#heading` on the end to land on a specific section of that page:

```markdown
Jump straight to [Routing › Sends](#/reaper/workflows/routing#sends).
```

> [!note] A bare `#slug` link stays on the current page; a `#/…` link navigates to
> another page. The page's own title heading isn't an anchor, so a plain
> `#/…/page` link (no trailing `#heading`) lands at the top.

### Tooltips

Mark a word so a note pops up when you hover (or keyboard-focus) it. Write
`{{term|tooltip text}}` — the part before the `|` is shown in the text, the part
after is the tooltip:

The {{transport|the strip with play, stop and record}} runs along the top.

```markdown
The {{transport|the strip with play, stop and record}} runs along the top.
```

Inline code is never touched, so a literal `{{x|y}}` inside backticks stays as-is.
The tip is plain text — markdown, links and line breaks inside it won't render, so
keep it to a short phrase.

A term can be **both** a link and a tooltip — wrap the `{{…}}` in a normal link.
Here the word is a tooltip *and* jumps to the [Tooltips](#tooltips) heading:

[{{transport|the strip with play, stop and record}}](#tooltips) — hover it, then click it.

```markdown
See [{{Boolean|a truthy/falsy value}}](#/recipes/booleans#what-is-a-bool).
```

> [!note] Tooltips don't work inside GFM table cells — the `|` splits the cell,
> and even an escaped `\|` won't render the tooltip. Keep them in regular prose,
> lists, and callouts.

### Glossary (reference tooltips)

Rather than repeating the same tip everywhere, define a term **once** in a fenced
`glossary` block — one `Term | definition` per line — and reference it anywhere.
The block renders as a table *and* registers each term for tooltips across the
whole library:

```glossary
Transport | the strip with play, stop and record
Bus       | a channel that other tracks are routed into
Sample rate | how many audio samples are captured per second
```

Then reference an entry two ways:

- **Bare** `{{Transport}}` — looks the gloss up by the term itself.
- **Keyed** `{{label|@sample-rate}}` — shows your own *label* but pulls the gloss
  by key (the key is the term lowercased with spaces as hyphens).

Both resolve from that one definition: a {{Transport}} bar, the playback {{rate|@sample-rate}},
and a {{Bus}} for grouping.

> [!tip] Define the block on a dedicated **Glossary** page and it's available
> everywhere — references work across pages, not just the page that defines them.
> An unresolved reference (typo'd key) is left as literal `{{…}}` so you can spot it.

### Copy-able commands

Any fenced code block gets an automatic copy button:

```bash
npm run dev
```

> [!note] Keep the tone terse and scannable — this is a cheat sheet, not prose.

## Updating the app

Pull the latest changes and relaunch. Open PowerShell and run:

```bash
cd $HOME\Fountain_of_Knowledge
git restore package-lock.json
git pull
npm install
npm run app:dev
```

To rebuild the installable app instead of running it from the terminal, use
`npm run app:build` (in place of `npm run app:dev`), then run the installer at
`dist-app\Fountain of Knowledge Setup 0.2.3.exe`.

> [!tip] `git restore package-lock.json` just clears the change `npm install`
> leaves behind so `git pull` won't complain. For routine updates later (no new
> dependencies) you can skip `npm install` — `git pull` then `npm run app:dev`
> is enough.

> [!warning] If `git pull` reports a conflict on a file you didn't expect, stop
> and check it rather than forcing the update — your notes live outside the
> project folder, so they're not affected, but local code edits could be.
