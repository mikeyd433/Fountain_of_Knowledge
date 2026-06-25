---
title: The Edit Mode Toolkit
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 8
---
Edit Mode is where raw primitives become real shapes — recesses, bevels, tapers, holes. This page is a reference for every Edit Mode operation used across the catalogs, explained in full so you know not just the key but *what it does to the geometry* and *when to reach for it*. Enter Edit Mode with `Tab`; switch selection type with `1` / `2` / `3` (vertices / edges / faces).

## Selecting Geometry

You can't edit what you can't select, and good selection is half of modeling.

- **Click** — select one item; `Shift+Click` adds/removes.
- **Box select** — `B`, then drag a rectangle.
- **Circle select** — `C`, then paint over geometry (scroll to size the brush); right-click or `Esc` to finish.
- **Lasso** — `Ctrl+RMB` drag a freehand loop.
- **Select All / None** — `A` / `Alt+A`.
- **Loop select** — `Alt+Click` on an edge selects the whole continuous ring of edges around the form. The workhorse for grabbing a rim to bevel.
- **Ring select** — `Ctrl+Alt+Click` selects the parallel ring (across, not along).
- **Select Linked** — hover and press `L` to grab everything connected (a whole separate piece); `Ctrl+L` grows from current selection.
- **Grow / Shrink** — `Ctrl+Numpad+` / `Ctrl+Numpad-` expand or contract the selection outward.

## Extrude — `E`

The single most important operation. **Extrude** pulls the selected face/edge/vertices outward, creating new connecting geometry as it goes — like pulling taffy. Press `E`, then move (often `Z` to lock vertical), then click.

- Extruding a **face** pushes it out and walls in the sides — this is how you raise a boss, sink a well (extrude *down*), or add a stalk.
- `E` then `Esc` leaves the new geometry in place (a duplicate ring you can then scale) — handy, but usually you move it.
- Variants: **Extrude Along Normals** (Alt+E menu) pushes faces out along their own facing — good for inflating irregular shapes evenly.

## Inset — `I`

**Inset** creates a smaller copy of a face *inside* the original, adding a border ring around it. Press `I`, drag inward, click. Inset then Extrude-down is THE recess combo — it builds every socket, screen well, dish, and tray. Press `I` `I` (twice) to inset each selected face individually rather than as a group.

## Bevel Edges — `Ctrl+B`

Rounds the **selected edges only** (unlike the Bevel *modifier*, which rounds all of them). Press `Ctrl+B`, drag to set the width, and **scroll the mouse wheel** to add segments (more = smoother round). Use it to soften a specific rim — a knob's top edge, a socket's lip — without affecting the rest.

## Loop Cut — `Ctrl+R`

Adds a new ring of edges around the mesh. Hover so the yellow preview line runs the direction you want, **scroll** to add multiple parallel cuts, click to confirm, then move the mouse to slide the cut (or right-click to drop it dead-centre). Loop cuts are how you add geometry where you need detail — a seam line, a control edge to tighten a subdivision, a place to split a panel.

## Knife — `K`

Cut custom edges by hand: press `K`, click to place points across faces, `Enter` to confirm (`Esc` cancels). Hold `C` while cutting to constrain angles. For freeform cuts a loop cut can't make.

## Merge — `M`

Combines selected vertices into one. The menu offers **At Center**, **At Cursor**, **At First/Last**, and **Collapse**. Use **At Center** to pull a face down to a single point (a gem tip, a cone). Use **By Distance** (also called "remove doubles") to weld vertices that are stacked on top of each other — essential cleanup after joining or booleans.

## Bridge Edge Loops

Connects two separate edge loops with a band of faces. Select two open loops (e.g. the open ends of two tubes) ▸ Edge menu ▸ **Bridge Edge Loops**. The way to join two rings into a smooth connecting surface — handles, tube junctions, linking two profiles.

## Spin

A manual lathe: it sweeps the selected geometry around an axis in a circle, like the Screw modifier but as a one-shot operation. Select a profile ▸ Mesh menu ▸ **Spin**, set steps/angle/axis in the operator panel. Good for a quick round form from a drawn profile when you don't want a live modifier.

## Fill & Grid Fill — `F`

`F` fills the selected boundary (a loop of edges) with a face — caps an open hole. **Grid Fill** (Face menu) is smarter: it fills a closed loop with a clean grid of quads rather than one messy n-gon, which shades far better — use it to cap cylinders and tubes neatly.

## Separate & Join — `P` / `Ctrl+J`

- **Separate** (`P` ▸ Selection) splits the selected geometry off into its own object — used to break a half off a panel for a seam, or peel a part away.
- **Join** (`Ctrl+J`, in Object Mode) merges multiple objects into one. Used constantly to weld a multi-part build (knob + skirt + pointer) into a single asset.

## Delete & Dissolve — `X`

The `X` menu offers more than plain delete:

- **Vertices / Edges / Faces** — remove geometry (leaves a hole if you delete faces).
- **Dissolve Edges / Faces** — removes the edge/face but *keeps the surrounding surface intact*, merging neighbours. Use Dissolve to clean up unneeded edges (e.g. tidying messy boolean cuts) without punching holes.
- **Limited Dissolve** (in the menu) — automatically removes coplanar/redundant edges across a whole selection; a fast cleanup after booleans.

## Proportional Editing — `O`

Toggle with `O`. When on, transforming one vertex drags its neighbours along with a smooth falloff, so you can pull organic, rounded forms instead of spiky ones. **Scroll the wheel** during the move to grow/shrink the falloff radius. Change the falloff shape (Smooth, Sphere, Random…) in the header dropdown. This is the key to teardrops, pebbles, blobs, and any hand-made wonkiness. Turn it back **off** (`O`) when you're done, or later edits will smear unexpectedly.

## Shrink / Fatten & Push / Pull — `Alt+S`

Moves selected faces along their own normals (in/out from the surface) rather than along a world axis. **Shrink/Fatten** (`Alt+S`) is great for thickening or thinning a region evenly, like puffing a surface.

## Smooth Vertices

Mesh ▸ **Smooth Vertices** relaxes selected geometry, evening out lumps. A gentle way to take the harshness off a rough region without rebuilding it.

## A Few Composite Moves

- **Round a corner:** select the edge (`Alt+Click` for the loop), `Ctrl+B`, scroll for segments.
- **Make a hole through a face:** Inset (`I`), then delete the inner face (`X` ▸ Faces) — or Boolean a cylinder for a clean round bore.
- **Sink a well:** select top face, `I` inset, `E` `Z` extrude down.
- **Taper a shape:** select one end, scale it down (`S`) — smaller at one end, full at the other.
- **Add a controlled crease for subdivision:** loop-cut (`Ctrl+R`) a supporting edge near where you want the subdivided surface to stay tight.
