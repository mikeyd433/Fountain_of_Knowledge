---
title: Fusion Shortcuts
category: DaVinci Resolve
order: 1
icon: 🎬
tags: [resolve, fusion, compositing, nodes]
---

## Node editor

```shortcuts
Add node             | Shift+Space
Connect to viewer 1  | 1
Connect to viewer 2  | 2
Disconnect node      | Ctrl+T
Group selected nodes | Ctrl+G
```

## Playback

```shortcuts
Play forward         | Space
Step one frame       | →
Step back one frame  | ←
Go to render range in | Home
```

> [!tip] Press `Shift+Space` to open the node selector — type the first few
> letters of any tool to add it without leaving the keyboard.

## Common tools

| Tool      | Purpose                          |
| --------- | -------------------------------- |
| Merge     | Layer two images with alpha      |
| Transform | Move / scale / rotate            |
| ColorCorrector | Per-node grading            |

> [!note] Fusion is node-based, not layer-based — signal flows left to right
> through the node graph into the **MediaOut** node.
