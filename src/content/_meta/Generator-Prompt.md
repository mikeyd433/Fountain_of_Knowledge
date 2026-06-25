---
title: Generator Prompt
category: Authoring Kit
order: 2
icon: 🪄
tags: [authoring, prompt, claude, generator]
---

## Reusable prompt

Paste this into a fresh chat with Claude, fill in the topic, and it returns a
ready-to-drop `.md` file for this reader.

````text
Write a reference section for my Fountain of Knowledge reader as a single
markdown file. Start with YAML frontmatter: title, category, optional section,
order, icon, tags. Use "## " for section headings. Render keyboard shortcuts as
inline code joined with + (e.g. `Ctrl+S`). For shortcut lists, use a fenced
```shortcuts block with "Action | Keys" lines. Use > [!tip] / > [!warning] /
> [!note] / > [!danger] callouts where useful. Put commands in fenced code
blocks. Keep the tone terse and scannable — this is a cheat sheet, not prose.
Topic: <TOPIC>
````

## Then

1. Save Claude's output as a `.md` file (the name is up to you).
2. **Drag it onto this window** — it's filed automatically by its `category` /
   `section` frontmatter and the new page opens.

That's it. (You can also drop it straight into the content folder — see the
Authoring Guide for where that lives.)

> [!tip] Use the `order` field if you want a specific file to sit at the top of
> its group instead of alphabetical order.

## Want a whole section in one file?

Ask for a **bundle** and you'll get several pages from a single file:

````text
Make it a single bundle file: add `bundle: true` to the frontmatter and start
each page with a `# Page Title` heading (use `## ` for sub-sections within a
page). All pages share the same category/section/icon/tags.
Topic: <TOPIC>  Pages: <PAGE 1>, <PAGE 2>, <PAGE 3>
````

Drop that one file and it expands into all those pages. See **Multi-page files**
in the Authoring Guide for details.
