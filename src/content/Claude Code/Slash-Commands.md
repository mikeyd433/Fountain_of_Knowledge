---
title: Slash Commands
category: Claude Code
order: 1
icon: ⚡
tags: [claude, cli, commands, productivity]
---

## Built-in commands

```shortcuts
Clear conversation   | /clear
Compact context      | /compact
Show help            | /help
Configure settings   | /config
Review a PR          | /review
```

## Keyboard

```shortcuts
Newline in prompt    | Shift+Enter
Cancel current turn  | Esc
Submit               | Enter
```

> [!tip] Type `/` at the start of a message to see every available command,
> including project-specific skills.

## Custom skills

Drop a markdown file into `.claude/skills/` and it becomes a `/command`.

```bash
mkdir -p .claude/skills
$EDITOR .claude/skills/my-skill.md
```

> [!note] Skills are just markdown with frontmatter — the same authoring idea as
> this reader.
