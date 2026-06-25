---
title: Shortcut Reference
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 20
---
A consolidated reference for every shortcut used across this guide, grouped by task, with the conventions that make them make sense.

## How Shortcuts Work in Blender

Blender shortcuts are **context-sensitive** — the same key does different things depending on which editor your **mouse is hovering over** and what mode you're in. `Tab` toggles Edit Mode over the viewport but enters a node group over the Shader Editor; `X` deletes in the viewport but cuts links over nodes. So the rule is: **hover the panel you want to act on, then press the key.**

## Essential Conventions

- **Transform + axis + number** — press `G`/`S`/`R` to move/scale/rotate, then tap `X`, `Y`, or `Z` to lock to an axis, then type a number for an exact amount, then `Enter`. (`Shift`+axis locks to the *other two* axes — `S` `Shift+Z` scales width but not height.)
- **The operator panel** — right after an action, a panel appears in the **bottom-left** of the viewport (e.g. "Add Cylinder"). Click to expand and adjust settings like vertex count. Press `F9` to reopen it if it closed.
- **Search anything** — `F3` opens a search box; type a command name to run it without hunting through menus. Invaluable when you forget where something lives.
- **Repeat last** — `Shift+R` repeats your last action (great for scattering screws or duplicating at a fixed offset).

```shortcuts
Search for any command | F3
Reopen last operator panel | F9
Repeat last action | Shift+R
```

## Object Mode

```shortcuts
Add menu (mesh, light, camera, curve, text) | Shift+A
Delete | X
Move / Scale / Rotate | G / S / R
Lock to axis (after G/S/R) | X / Y / Z, then a number
Lock to other two axes | Shift+X / Shift+Y / Shift+Z
Duplicate in place | Shift+D then Esc
Apply scale/rotation (before bevel/boolean) | Ctrl+A
Join selected into one object | Ctrl+J
Parent selected to active | Ctrl+P
Toggle Edit / Object mode | Tab
Mode pie menu | Ctrl+Tab
Proportional Editing toggle | O
Hide selected / unhide all | H / Alt+H
Hide everything except selected | Shift+H
```

## Edit Mode (Modeling)

```shortcuts
Vertex / Edge / Face select mode | 1 / 2 / 3
Extrude | E
Inset face | I
Loop cut | Ctrl+R
Bevel selected edges (scroll = segments) | Ctrl+B
Knife (custom cuts) | K
Fill selection with a face | F
Merge selected | M
Separate selection into new object | P
Select all / deselect all | A / Alt+A
Loop select | Alt+Click
```

## Viewport & Camera

```shortcuts
Orbit / Pan / Zoom | MMB / Shift+MMB / Scroll
Frame all / frame selected | Home / Numpad.
Front / Right / Top ortho view | Numpad1 / Numpad3 / Numpad7
Toggle camera view | Numpad0
Snap camera to current view | Ctrl+Alt+Numpad0
Place 3D cursor | Shift+RMB
Recenter cursor + frame all | Shift+C
Toggle snapping | Shift+Tab
Isolate selected (local view) | /
Side panel (Item/View tabs) | N
Shading mode pie | Z
```

## Shading / Nodes

```shortcuts
Make node group | Ctrl+G
Edit / exit node group | Tab
Frame all nodes | Home
Cut links | Ctrl+RMB drag
```

## Animation / Render / File

```shortcuts
Insert keyframe (hover the value) | I
Render image | F12
Render animation (filmstrip frames) | Ctrl+F12
Save | Ctrl+S
Save As | Ctrl+Shift+S
Undo / Redo | Ctrl+Z / Ctrl+Shift+Z
```

## A Few Modeling Power Moves

- **`Ctrl+R` Loop Cut** — adds a ring of edges around a mesh; hover to aim it, scroll to add more cuts, click to place, then move or right-click to centre. The main way to add geometry where you need detail (seams, control edges).
- **`Ctrl+B` Edge Bevel** — rounds *selected* edges only (vs the Bevel modifier, which does all of them). Scroll while dragging to add segments for a smoother round.
- **`I` Inset then `E` `Z` Extrude** — the recess combo: Inset shrinks a face inward to make a rim, Extrude pushes it down to sink a well. This pair builds every socket, screen recess, and dish.
- **`O` Proportional Editing** — makes a transform fall off smoothly to nearby geometry, so moving one vertex drags its neighbours along. Scroll to size the falloff. The key to organic, hand-made shapes.
