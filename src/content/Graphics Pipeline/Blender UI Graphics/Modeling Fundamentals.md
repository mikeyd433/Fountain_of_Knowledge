---
title: Modeling Fundamentals
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 7
---
Before the shape catalogs, this page covers the bedrock every build stands on: how a mesh is actually made of, the primitives you start from, the difference between the two modes you'll live in, and the origin/pivot/scale concepts that quietly decide whether a model behaves or fights you. Read this once and the per-shape recipes stop feeling like magic incantations.

## The Modeling Approach Here

Every asset in this guide follows the same arc, and it's worth holding in your head as a loop:

1. **Block out** with a primitive — start from the closest basic shape (a cube, sphere, cylinder).
2. **Refine** with modifiers (non-destructive, adjustable) and Edit Mode operations (direct geometry edits).
3. **Smooth** the surface (Shade Smooth) so it reads as molded, not faceted.
4. **Material** it (the shared Plastic group, or Metal/Rubber/etc.).
5. **Render** from the locked rig, plus any states.

You'll repeat this loop for every element. The catalog pages are just specific block-out-and-refine sequences; the fundamentals here, the Edit Mode toolkit, and the modifier reference are the general moves those sequences are built from.

## Mesh Anatomy

A mesh — the 3D object you're shaping — is made of three things:

- **Vertices** — points in space (the corners). Everything else hangs off these.
- **Edges** — straight lines connecting two vertices.
- **Faces** — flat surfaces filling a loop of edges. Faces are what actually get shaded and rendered.

Faces come in three kinds, and the distinction matters for how cleanly a surface shades:

- **Quad** (4 sides) — the gold standard. Quads subdivide and smooth predictably, so most modeling aims to keep faces as quads.
- **Triangle** (3 sides) — fine in flat areas; the renderer ultimately triangulates everything anyway.
- **N-gon** (5+ sides) — a face with many sides. Convenient, but on curved or to-be-smoothed surfaces they cause shading artifacts (pinches, smudges). Avoid n-gons anywhere the surface curves.

You don't need perfect topology for UI sprites — they're seen from one fixed angle — but knowing why a smooth dome sometimes shades weird (an n-gon, or uneven faces) saves a lot of head-scratching.

## Object Mode vs Edit Mode

You constantly toggle between two modes with `Tab`:

- **Object Mode** — you manipulate whole objects: move/scale/rotate them as units, add modifiers, assign materials, position them in the scene. This is where you arrange a composition.
- **Edit Mode** — you manipulate the *geometry inside* one object: its vertices, edges, and faces. This is where you carve recesses, extrude, bevel specific edges, and reshape.

Rule of thumb: arranging *objects* → Object Mode; reshaping *one object's surface* → Edit Mode. In Edit Mode, switch what you're selecting with `1` (vertices), `2` (edges), `3` (faces).

## The Object Origin

Every object has an **origin** — a small dot (usually orange) that is its reference point. It matters more than beginners expect:

- Rotations and scales pivot around the origin by default. A knob whose origin isn't at its centre will rotate *off-axis* and wobble.
- The origin is what "Location" in the N-panel actually reports.

To fix or set an origin: Object ▸ **Set Origin** ▸ choose **Origin to Geometry** (centre of the mesh), **Origin to 3D Cursor** (wherever the cursor is — useful for setting a deliberate pivot like a key's hinge edge), or **Origin to Center of Mass**.

> [!tip]
> Before animating any rotation (knobs, levers, rockers), set the origin to exactly where the part should pivot. This one habit prevents most "why is my knob wobbling" problems.

## The 3D Cursor

The **3D cursor** is the little red-and-white target in the viewport. It does two jobs:

- **Spawn point** — new objects (`Shift+A`) appear wherever the cursor is.
- **Pivot / snap target** — you can set the pivot point to the 3D cursor, or snap geometry to it.

Place it with `Shift+RMB`. Reset it to world centre and frame everything with `Shift+C`. If your new objects keep appearing in odd places, your 3D cursor has drifted — reset it.

## Pivot Points

The **pivot-point dropdown** in the top header decides what `S` and `R` rotate/scale *around*:

- **Median Point** (default) — the centre of your selection.
- **3D Cursor** — around the cursor; the way to rotate around an arbitrary point (a hinge, a panel centre).
- **Individual Origins** — each selected object spins around its own origin (great for arrays of identical parts).
- **Active Element** — around the last-selected item.

Switching pivot is often the difference between a clean rotation and a frustrating one.

## Applying Transforms

When you move, rotate, or scale an object in Object Mode, that transform is stored *on top of* the mesh rather than baked in. Mostly fine — but two modifiers (**Bevel** and **Boolean**) and several operations misbehave when an object has **non-uniform scale** (different scale on X/Y/Z).

The fix is **Apply**: `Ctrl+A` ▸ **Scale** (or All Transforms). This bakes the current size/rotation into the mesh so the object's scale reads 1,1,1 again.

> [!warning]
> Always `Ctrl+A` ▸ Scale **before** adding a Bevel or Boolean modifier. Skip it and bevels come out uneven and booleans produce garbage. This is the single most common modeling gotcha.

## Units & Scale Sanity

Blender works in metres by default. For UI sprites the absolute size doesn't matter — but **consistency** does. Keep your master shapes at sane, similar sizes (a button roughly 1–2 units across) so that:

- A shared light and camera frame them all the same way.
- Bevel "Amount" and Array "offset" values mean roughly the same thing from one asset to the next.
- Mixing assets into a composition doesn't require wild rescaling.

If something imported or built at a crazy scale, fix it and `Ctrl+A` ▸ Scale to lock it in.

## Organising Your File

- The **Outliner** (top-right) lists every object. Double-click a name to rename it — name things (`btn_dome`, `knob_skirt`) so you can find them, especially once a composition has dozens of parts.
- **Collections** are folders for objects (right-click in the Outliner ▸ New Collection). Group a device's parts into a collection so you can hide/show or move them together.
- Eye icons hide/show; this is also how you isolate a single element to render it alone.

## Saving & Versioning

- `Ctrl+S` saves; `Ctrl+Shift+S` is Save As.
- **Always Save As off the template first** — never model directly in `_button_template.blend`, or you overwrite the shared rig.
- Save incrementally (File ▸ Save As ▸ the **+** button bumps a number) so you can roll back. Modeling is iterative and a clean earlier version is cheap insurance.

## The Modeling Loop, as a Checklist

For any new asset:

```
1. Save As a new file off the template
2. Block out with the nearest primitive (set its operator-panel options)
3. Apply scale (Ctrl+A) before bevel/boolean
4. Refine: modifiers + Edit Mode ops
5. Set the origin (especially if it rotates)
6. Clean up: recalc normals, merge by distance
7. Shade Smooth (or leave flat for faceted shapes)
8. Assign material
9. Frame in camera, render normal + states
10. Mark as Asset for reuse
```

Everything else in this guide is a variation on these ten steps.
