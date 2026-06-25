---
title: Modifiers in Depth
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 9
---
Modifiers are non-destructive operations applied to a whole object — they reshape it live, on top of the actual mesh, without committing until you choose to. They're the backbone of this aesthetic (rounding, repeating, carving, lathing), and understanding the **stack** — what they are, what order they run in, and when to apply them — pays off on every single asset. They live in the **wrench icon** (Modifier Properties).

## What a Modifier Is

A modifier sits *above* your base mesh and changes how it looks without altering the underlying vertices. Because it's live, you can tweak its settings anytime — raise a bevel, change an array count — or toggle it off to see the original. Nothing is permanent until you **Apply** it (which bakes the result into real geometry).

## Reading & Managing the Stack

You can add several modifiers; they form a **stack** that evaluates **top to bottom**. Order matters — a Bevel then a Subdivision looks different from a Subdivision then a Bevel.

Each modifier in the panel has controls:
- A **dropdown** (the v) to **Apply**, **Duplicate**, or **Delete**.
- Toggle icons to show/hide it in the **viewport** and in the **render** independently.
- A handle to **drag and reorder** it in the stack.

> [!tip]
> Keep modifiers live as long as you can — that's the whole point. Only Apply when you need to edit the resulting geometry directly (e.g. before a manual cut into a beveled shape) or before exporting.

## Bevel

Rounds the edges of the whole object. The core of the soft-plastic look.

- **Amount** — how far the rounding reaches in from each edge.
- **Segments** — how many faces make the curve (2–3 = a chamfer; 6–8 = a smooth round).
- **Limit Method** — **Angle** beveled only sharp edges (leaves flat areas alone); **Weight** bevels only edges you've tagged. Angle is the usual choice.
- **Clamp Overlap** — keeps the bevel from overrunning itself on small shapes; leave on.

Remember: **Apply scale (`Ctrl+A`) first**, or the bevel comes out uneven.

## Subdivision Surface

Smooths and inflates by repeatedly subdividing each face and averaging — turns a blocky cube into a rounded, organic form.

- **Levels Viewport** vs **Render** — keep viewport lower (1–2) for speed, render higher (2–3) for smoothness.
- With **no supporting edges**, a cube inflates into a pillow; add loop cuts (`Ctrl+R`) near an edge to *tighten* the surface there, controlling how round each region gets. This control-edge trick is how you get a shape that's soft in some places and crisp in others.

## Mirror

Builds symmetry: model one half, and Mirror reflects it live across an axis. Halves your work for anything symmetrical.

- Set the **Axis** (X/Y/Z) to mirror across.
- **Clipping** stops vertices crossing the centre line (prevents a gap or overlap at the seam).
- **Merge** welds the two halves at the centre so it's one continuous surface.

Model on one side of the origin; the mirror handles the rest.

## Array

Repeats the object in a line or a pattern — fins, ridges, dot grids, chain links.

- **Count** — number of copies, or use **Fit Length** to fill a distance.
- **Relative Offset** — spacing as a multiple of the object's own size (clean default).
- **Constant Offset** — spacing in fixed units.
- **Object Offset** — offset by *another object's* transform. Point it at an **Empty** at the centre and rotate the Empty, and the copies fan **radially** — the way to make knurls, gear teeth, and anything arranged in a circle.
- Stack **two Arrays** (one X, one Y) to build a full grid (dot-matrix, perforations).

## Boolean

Combines two objects by volume — the way to carve holes and merge solids.

- **Difference** — subtracts the cutter object's volume (bore a socket, cut a channel, engrave text).
- **Union** — fuses two objects into one solid.
- **Intersect** — keeps only the overlapping volume.
- **Solver** — **Exact** is accurate (use it); **Fast** is quicker but messier.
- Workflow: position a **cutter** object overlapping the target, select the target, add Boolean ▸ Difference ▸ pick the cutter, **Apply**, then delete the cutter.

> [!warning]
> Booleans need clean, closed (manifold) meshes and applied scale, or they produce holes and artifacts. After applying a Boolean, do a cleanup pass (Merge by Distance, Limited Dissolve) — booleans leave messy topology.

## Solidify

Gives thickness to a surface that has none — a flat plane, a curved sheet, a 2D-filled curve. **Thickness** sets how thick; **Even Thickness** keeps corners uniform. Essential after bending a plane (it has no depth until you solidify) or for turning a flat outline into a real slab.

## Screw

Lathes a profile around an axis — sweeps a drawn cross-section into a round, symmetrical solid (knobs, nuts, bottle-like forms). Set it to a full 360° for a solid of revolution. Crucially, give it a **Screw** height value plus multiple **Iterations** and it spirals into a **helix** — that's how you make springs and threads. The **Axis** setting and which side of centre your profile sits on both matter, so expect to nudge it.

## Simple Deform

Bends, twists, tapers, or stretches a whole object. **Bend** curves a flat panel into a wraparound; **Taper** narrows one end; **Twist** spirals it. The deform happens around the object's origin and needs enough geometry (loop cuts) to bend smoothly.

## Cast

Pushes a shape toward a target form — **Sphere**, Cylinder, or Cuboid — by a **Factor**. A low Factor toward Sphere gently *inflates* a shape (puffing a pillow); a high Factor snaps it close to that primitive. A quick way to round or balloon something.

## Lattice (brief)

A **Lattice** is a simple cage you wrap around a complex object; deforming the cage smoothly deforms everything inside it. Useful for gently reshaping a finished, detailed model without editing its geometry directly.

## Shrinkwrap (brief)

Projects one object's surface onto another — sticks a sticker, label, or detail mesh perfectly onto a curved surface so it follows the contour.

## Apply Order & Gotchas

- **Apply scale (`Ctrl+A`) before** Bevel or Boolean — always.
- **Mirror** usually goes near the top (build the half, then other modifiers act on the mirrored whole).
- **Subdivision** usually goes near the **bottom** (smooth the final form, including beveled/boolean detail) — but a Bevel *after* a Subdivision gives crisper edges; experiment.
- **Boolean before Bevel** when you want the new boolean edges rounded too.
- Booleans want clean meshes; do cleanup after applying.

## Apply vs Keep Live

Keep modifiers live while iterating (you'll re-tweak constantly). **Apply** when you must: before manually editing the resulting geometry, before certain exports, or when stacking a manual operation that needs the modifier's output as real vertices. Applying is one-way — save a version first if unsure.
