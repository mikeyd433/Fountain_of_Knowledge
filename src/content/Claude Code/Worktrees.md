---
title: Worktrees
category: Claude Code
order: 2
icon: 🌳
tags: [git, worktrees, parallel, branches]
---

## Why worktrees

A git worktree is a second working directory backed by the same repository. It
lets you run an agent on an isolated branch without disturbing your main
checkout — perfect for parallel changes.

## Create one

```bash
git worktree add ../feature-x -b feature-x
cd ../feature-x
```

## List and remove

```shortcuts
List worktrees       | git worktree list
Remove a worktree    | git worktree remove ../feature-x
Prune stale entries  | git worktree prune
```

> [!warning] You cannot check out the same branch in two worktrees at once. Give
> each worktree its own branch.

> [!tip] Pair worktrees with separate terminal tabs so each agent has its own
> isolated directory and shell.
