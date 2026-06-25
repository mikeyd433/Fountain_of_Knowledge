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

1. Save the output into `src/content/<Category>/<Name>.md`.
2. It appears in the sidebar automatically.

> [!tip] Use the `order` field if you want a specific file to sit at the top of
> its group instead of alphabetical order.
