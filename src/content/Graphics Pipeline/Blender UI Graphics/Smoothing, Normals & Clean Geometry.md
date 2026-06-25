---
title: 'Smoothing, Normals & Clean Geometry'
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 10
---
This page covers the finishing craft that decides whether a model reads as smooth molded plastic or a lumpy mess: how smoothing works, what normals are and why flipped ones create dark patches, the quad/tri/n-gon distinction in practice, and a cleanup checklist to run before marking any asset. Most "why does my render look wrong" problems trace back to something here.

## Shade Smooth vs Shade Flat

By default a mesh renders **faceted** — every face is visibly flat, so a sphere looks like a disco ball. **Shade Smooth** (right-click ▸ Shade Smooth) tells the renderer to *interpolate* across faces, blending them into a continuous curved surface. **Shade Flat** reverts to faceted.

- Use **Shade Smooth** on anything curved and molded: domes, knobs, capsules, pipes.
- *Keep* **Shade Flat** (skip smoothing) on shapes whose facets are the point: hex buttons, faceted gems, low-poly retro forms.

Smoothing changes only how the surface is *shaded*, not its actual geometry — a low-poly sphere with Shade Smooth still has a chunky silhouette, so smooth *and* enough segments work together.

## Smooth by Angle / Weighted Normals

Plain Shade Smooth smooths *everything*, which rounds edges you wanted crisp (the flat top of a beveled button can look soft and muddy). The fix is to **smooth only across shallow angles and keep sharp edges sharp**:

- Recent Blender: right-click ▸ **Shade Auto Smooth** (or **Shade Smooth by Angle**) and set an **angle threshold** — faces meeting at a sharper angle than that stay crisp; gentler ones smooth.
- For the cleanest highlights on hard-surface plastic, a **Weighted Normal** modifier evens out the shading across faces of different sizes, killing the subtle smudges beveled shapes sometimes show.

This is the trick to a button that's smoothly domed *and* has a crisp, clean rim.

## What Normals Are

Every face has a **normal** — an invisible arrow pointing out of its "front" side. Normals tell the renderer which way a surface faces, which drives how light hits it and whether the surface even appears solid. They also control how Booleans interpret inside-vs-outside.

When a normal is **flipped** (pointing inward), that face shades wrong — typically a **dark or black patch** that won't light correctly, or a face that looks see-through.

## Checking & Fixing Normals

- **See them:** turn on the **Face Orientation** overlay (the overlays dropdown) — front-facing shows blue, back-facing shows red. A model should be all blue from outside. Any red means flipped normals.
- **Fix them:** in Edit Mode, select all (`A`) ▸ Mesh ▸ Normals ▸ **Recalculate Outside** (`Shift+N`). This points everything outward in one move.
- **Flip manually:** select the offending faces ▸ Mesh ▸ Normals ▸ **Flip**.

If a freshly-rendered button has an inexplicable dark area, suspect a flipped normal first.

## Quads, Tris & N-gons in Practice

- **Quads** smooth and subdivide predictably — aim for these on curved surfaces.
- **Triangles** are fine on flat areas and unavoidable in places; not a problem there.
- **N-gons** (5+ sided faces) often look fine when flat but **pinch and smudge** once curved or subdivided. The classic culprit: filling a round hole with `F` creates one big n-gon that shades badly — use **Grid Fill** instead for clean quads.

You don't need textbook topology for a fixed-angle sprite, but if a smooth surface shows a weird crease, an n-gon or an uneven face is usually why.

## Common Shading Artifacts & Their Causes

- **Dark smudges / patches** → flipped normals (recalc), or an n-gon on a curve (retopologize the area or Grid Fill).
- **Pinching at a point** → too many edges converging (a pole); spread them out or relax with Smooth Vertices.
- **Faceted look after Shade Smooth** → not enough segments in the base primitive; rebuild with higher counts.
- **Muddy, soft edges where you wanted crisp** → over-smoothing; use Auto Smooth by angle or a Weighted Normal.
- **Flickering/overlapping surfaces (z-fighting)** → two faces occupying the same space; move one or merge duplicates.

## Merge by Distance (Remove Doubles)

Joining objects (`Ctrl+J`) and Booleans frequently leave **duplicate vertices** stacked on each other, which break smoothing and create seams. Clean them: Edit Mode ▸ select all (`A`) ▸ Mesh ▸ **Merge** ▸ **By Distance**. It welds vertices closer than a small threshold into one. Run this after any join or boolean.

## Non-Manifold Geometry

A mesh is **manifold** if it's a clean, watertight solid — every edge borders exactly two faces, no holes, no internal faces, no edges shared by three faces. **Non-manifold** geometry (holes, stray edges, doubled internal faces) breaks Booleans, confuses normals, and can choke the glTF/visualizer export.

Find it: Edit Mode ▸ deselect all (`Alt+A`) ▸ Select ▸ All by Trait ▸ **Non Manifold**. Whatever highlights is the problem area to fix (fill holes with `F`/Grid Fill, delete stray geometry, merge doubles).

## Boolean Cleanup

Booleans are powerful but leave messy results: long thin triangles, redundant edges, occasional doubles. After applying a Boolean:

1. **Merge by Distance** (weld any doubles).
2. **Limited Dissolve** (`X` ▸ Limited Dissolve) to remove redundant coplanar edges and simplify.
3. Check **normals** (`Shift+N`) — booleans sometimes flip them.
4. Re-check shading; Grid Fill any ugly n-gon caps.

## The Pre-Asset Cleanup Checklist

Before you Shade Smooth, material, and Mark as Asset, run this pass so the asset is clean for every future reuse and for the visualizer pipeline:

```
□ Apply scale (Ctrl+A ▸ Scale)
□ Merge by Distance (weld stray doubles)
□ Recalculate Normals Outside (Shift+N)
□ Check Face Orientation overlay — all blue
□ Select Non-Manifold — nothing stray
□ Grid Fill any open round caps (no big n-gons on curves)
□ Shade Smooth (or Auto Smooth by angle for crisp+smooth)
□ Set origin (centre, or the pivot if it rotates)
```

A model that passes this list will shade cleanly, boolean reliably, export to glTF without surprises, and behave the same every time you drag it back in.
