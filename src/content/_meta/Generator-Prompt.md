---
title: Generator Prompt
category: Authoring Kit
order: 2
icon: 🪄
tags: [authoring, prompt, claude, generator]
---

## Reusable prompt

Paste this whole block into a fresh chat, fill in the topic at the bottom, and
it returns ready-to-drop markdown for this reader. It describes the entire file
structure, so the chat doesn't need anything else.

````text
You are writing reference notes for "Fountain of Knowledge", a markdown reader.
Output ONLY markdown in a single code block I can copy, following this exact
file structure:

1. Start with YAML frontmatter:
   ---
   title: <Page Title>      # required
   category: <Group>        # required — top-level sidebar group
   section: <Subgroup>      # optional — nests under the category
   icon: <emoji>            # optional — shown by the title
   tags: [a, b, c]          # optional — feeds search
   order: <number>          # optional — sort position within its group
   ---

2. Use "## " for section headings inside the page (not "# ").

3. Keyboard shortcuts: inline code of keys joined with "+", e.g. `Ctrl+Shift+P`.
   These auto-render as keycaps. Plain inline code like `config.ini` is left alone.

4. Lists of shortcuts: a fenced block tagged shortcuts, one "Action | Keys"
   per line:
   ```shortcuts
   Open action list     | Ctrl+Shift+P
   Split item at cursor | S
   ```

5. Callouts: blockquotes starting with [!tip], [!note], [!warning], or [!danger]:
   > [!tip] Helpful aside.

6. Commands/code go in normal fenced code blocks (```bash, ```lua, etc.); they
   get an automatic copy button.

Keep it terse and scannable — a cheat sheet, not prose.

MULTI-PAGE OPTION: if I ask for multiple pages, instead add `bundle: true` to
the frontmatter and start EACH page with a "# Page Title" heading (still using
"## " for sub-sections within a page). All pages share the same
category/section/icon/tags. One bundle file expands into one page per "# " heading.

Topic: <TOPIC>
Pages (only if multiple): <PAGE 1>, <PAGE 2>, <PAGE 3>
````

## Then

1. Save Claude's output as a `.md` file (the name is up to you).
2. **Drag it onto this window** — it's filed automatically by its `category` /
   `section` frontmatter and the new page opens.

That's it. (You can also drop it straight into the content folder — see the
Authoring Guide for where that lives.)

> [!tip] Use the `order` field if you want a specific file to sit at the top of
> its group instead of alphabetical order. For several pages from one file, fill
> in the **Pages** line — see **Multi-page files** in the Authoring Guide.

## Explaining nesting to a chat

Paste this block if you want the chat to nest pages into deep sections:

````text
This reader has TWO separate kinds of nesting:

1) Inside a page — Markdown headings ##, ###, … up to ######. These structure
   content WITHIN one page and do NOT create sidebar entries.

2) The sidebar tree (navigable folders) — set by frontmatter, and it can be
   arbitrarily deep. Two ways to nest it:

   a) Single page: make `section` a path — a "/"-separated string or a list:
        section: Workflows/Routing/Advanced
        section: [Workflows, Routing, Advanced]
      With `category: REAPER` that page lands at:
        REAPER › Workflows › Routing › Advanced › <title>

   b) Bundle file (many pages in one file): add `bundle: true`, then start each
      page with a "# Heading". A heading may itself be a path — the LAST segment
      is the page title, earlier segments add folders (appended after the file's
      `section`):
        # Modeling/Edit Mode/Extrude   → …/Modeling/Edit Mode/Extrude
        # Rendering                    → …/Rendering
      Use "## " for sub-sections inside each page.

Rules: "#" starts a page (in a bundle); "##"+ are in-page sections. Avoid a
literal "/" in a page title, since "/" means "nest". Depth is effectively
unlimited (bounded only by OS path length).
````
