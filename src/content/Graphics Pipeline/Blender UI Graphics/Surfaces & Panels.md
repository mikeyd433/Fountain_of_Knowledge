---
title: Surfaces & Panels
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 14
---
Surfaces are the structure your controls mount onto — backplates, consoles, bezels, housings — plus the structural and connective detail that makes a flat layout read as a real device. Most are **static** (they don't change at runtime, so you render them once as a single sprite). The recurring techniques: **Bevel** (rounding edges), **recessing a face** (Inset then Extrude down to sink wells and trays), **Boolean Difference** (carving holes and channels), **Array** (repeating holes/slots), **Solidify** (giving a flat plane thickness), and **Metaballs** (organic blobs). Finish with right-click ▸ Shade Smooth.

## Flat Backplate

**Use:** the simplest mounting surface — a rounded rectangular slab buttons sit on.

1. `Shift+A` ▸ Mesh ▸ **Cube**.
2. Scale to a panel: `S` `X` `3` `Enter` (wide), `S` `Y` `2` `Enter` (deep), then flatten `S` `Z` `0.15` `Enter` (thin).
3. Round it: add a **Bevel** modifier (Segments 4–6, moderate Amount) to soften the corners and edges into a friendly slab.
4. Right-click ▸ Shade Smooth; **Plastic** or a neutral material. Static — render once.

## Soft Console Blob (Metaball)

**Use:** the gooey, organic console the Nubby's buttons nestle into — an irregular blobby slab.

1. Add a metaball: `Shift+A` ▸ Metaball ▸ **Ball**. Metaballs are special objects that *merge* when they get close, flowing into one smooth surface.
2. Duplicate it (`Shift+D`) and scatter 3–5 in a loose cluster; as they overlap they melt together into one organic mass. Scale individual balls (`S`) to push the silhouette into an irregular shape.
3. Freeze it into a normal mesh: Object ▸ Convert To ▸ **Mesh** — metaballs can't be edited or used like normal geometry until converted.
4. Flatten into a console slab: `S` `Z` `0.3` `Enter`; right-click ▸ Shade Smooth; **Plastic**.

- **Tip:** irregularity is the goal — resist making it symmetrical.

## Soft Console (Beveled Slab)

**Use:** a simpler console than the metaball route — a heavily rounded, slightly irregular slab.

1. `Shift+A` ▸ Mesh ▸ **Cube**; scale to the console footprint (`S` `X`, `S` `Y`), then flatten `S` `Z`.
2. Round it heavily: add a **Bevel** modifier (high Segments + Amount) plus a light **Subdivision Surface** modifier for a pillowy, organic feel.
3. Add hand-made irregularity: enter Edit Mode `Tab`, turn on Proportional Editing `O`, nudge a few vertices with `G` so the outline isn't perfectly symmetrical; `O` off; `Tab` out.
4. Right-click ▸ Shade Smooth; **Plastic**.

## Button Socket / Recess

**Use:** a round well that a button sits down into — it's what makes a pressed button read as sinking into the surface.

1. Make the cutter: `Shift+A` ▸ Mesh ▸ **Cylinder**, slightly wider than the button, partly sunk into the panel where the button will sit.
2. Carve it: select the **panel**, Modifier Properties ▸ Add Modifier ▸ Generate ▸ **Boolean**, Operation **Difference**, Object = the cylinder. Boolean Difference subtracts the cylinder's volume, leaving a clean circular well.
3. **Apply** the modifier, then delete the cylinder (`X`).
4. Round the well's lip: enter Edit Mode `Tab`, `Alt+Click` the lip edge loop, `Ctrl+B` for a small bevel; `Tab` out.

## Recessed Tray / Well

**Use:** a larger rectangular recess that holds a whole group of controls.

1. On a panel, enter Edit Mode `Tab` and select the top face.
2. **Inset** it inward with `I` to make the tray's border, then **Extrude** it down with `E` `Z` to sink the tray; `Tab` out.
3. Round the inner edges: `Alt+Click` the inner loop, `Ctrl+B`; right-click ▸ Shade Smooth.

## Bezel / Frame

**Use:** a frame around a screen or the whole panel — like the picture frame in the reference.

1. `Shift+A` ▸ Mesh ▸ **Cube**; scale to the frame size; flatten a little.
2. Enter Edit Mode `Tab`; select the top face; **Inset** it with `I` to create an inner border.
3. Either **Extrude** the inner face down (`E` `Z`) for a recessed centre, or delete it (`X`) for a see-through frame; `Tab` out.
4. Add a **Bevel** modifier; right-click ▸ Shade Smooth; **Plastic** or **Metal**.

## Cartridge / Device Body

**Use:** a larger housing — the tall capsule "device" that carries jacks and LEDs on its face.

1. Body: `Shift+A` ▸ Mesh ▸ **Cube**; stretch tall with `S` `Z` `3` `Enter` and `S` `X` `1.4` `Enter`; add a **Bevel** modifier (Segments 8, high Amount) so it reads as a rounded capsule housing; right-click ▸ Shade Smooth. Scale the whole thing up (`S`) to device size.
2. Sockets: for each port, place a Cylinder where it sits, select the body, **Boolean** ▸ Difference ▸ the cylinder, apply, delete the cutter (`X`).
3. Dress the face with jacks, LEDs, and screws as separate objects placed on top.

## Rounded Pod / Capsule Housing

**Use:** a plump pod-shaped housing, often split into two shells.

1. Pod body: `Shift+A` ▸ Mesh ▸ **Cube**; fatten with `S` `X` `1.5`, `S` `Y` `1.2`; add a **Bevel** modifier (Segments 8, high Amount) so it reads as a plump capsule; right-click ▸ Shade Smooth.
2. Seam: enter Edit Mode `Tab`, add a loop around the middle with `Ctrl+R` (click to place), and optionally `Ctrl+B` it for a visible two-shell split line; `Tab` out.

## Raised Boss / Pedestal

**Use:** a small platform that lifts a control proudly off the panel.

1. `Shift+A` ▸ Mesh ▸ **Cylinder** (or Cube), short and wide.
2. Round the top edge: `Tab`, `Alt+Click` the top loop, `Ctrl+B`; `Tab` out.
3. Right-click ▸ Shade Smooth; place a control on top with `G` `Z`.

## Channel / Groove

**Use:** a recessed track — for sliders, or just decorative routing lines.

1. Cutter: `Shift+A` ▸ Mesh ▸ **Cube**, scaled into a long thin bar, sunk into the panel's top.
2. Carve: select the panel, **Boolean** ▸ Difference ▸ the cutter; apply; delete the cutter (`X`).
3. Round the lip: `Alt+Click` the channel's edge, `Ctrl+B`.

## Nameplate / Label Plate

**Use:** a small plate proud of the panel for engraved or printed labels.

1. Plate: `Shift+A` ▸ Mesh ▸ **Cube**; flatten `S` `Z` `0.05` and scale to a label bar; add a small **Bevel** modifier; right-click ▸ Shade Smooth. Metal or contrasting Plastic.
2. Engrave a label: `Shift+A` ▸ **Text**, type it, `Tab` out, Object Data ▸ Geometry ▸ Extrude; sink it into the plate face with `G`; select the plate, **Boolean** ▸ Difference ▸ the text, apply — recessed lettering. (Or paint the label in Krita and apply as a texture.)

## Layered / Tiered Panels

**Use:** a built-up, multi-level device face with depth from stacked plates.

1. Make a backplate: `Shift+A` ▸ Mesh ▸ **Cube** → scale (`S` `X` `3`, `S` `Y` `2`, `S` `Z` `0.15`) → **Bevel** modifier (Segments 4) → right-click ▸ Shade Smooth.
2. Duplicate it (`Shift+D` `Esc`) twice; scale each copy a bit smaller (`S`); raise each on `G` `Z` so they stack at different heights. The gaps between layers cast soft shadows that add depth.

## Split-Seam Panel

**Use:** a panel with a visible seam line running across it, suggesting two assembled halves.

1. Make a backplate: `Shift+A` ▸ Mesh ▸ **Cube** → scale (`S` `X` `3`, `S` `Y` `2`, `S` `Z` `0.15`) → **Bevel** modifier → right-click ▸ Shade Smooth.
2. Enter Edit Mode `Tab`; add a loop across the middle with `Ctrl+R` (click); select the faces of one half and split them into a separate object with `P` ▸ **Selection**; `Tab` out.
3. Nudge one half apart slightly with `G` so a visible seam runs across the panel.

## Curved / Wraparound Panel

**Use:** a panel that curves, for a console face that wraps toward the viewer.

1. `Shift+A` ▸ Mesh ▸ **Plane**; scale to size; enter Edit Mode `Tab` and add several loop cuts (`Ctrl+R`) so it has enough geometry to bend smoothly; `Tab` out.
2. Bend it: add a **Simple Deform** modifier (Modifier Properties ▸ Add ▸ Deform ▸ Simple Deform), set the mode to **Bend**, and dial the angle.
3. Give it thickness: add a **Solidify** modifier — it turns the flat sheet into a slab with real depth.
4. Right-click ▸ Shade Smooth; **Plastic**.

## Corner Bracket

**Use:** an industrial L-shaped framing piece for panel corners.

1. Make two boxes: `Shift+A` ▸ Mesh ▸ **Cube** for one arm; duplicate (`Shift+D`) and rotate (`R`) for the perpendicular arm, positioned to form an L.
2. Combine with a **Boolean** Union (or `Ctrl+J`); add a small **Bevel**; right-click ▸ Shade Smooth.
3. Add a small screw on top for credibility. Metal.

## Handle / Tab / Grip

**Use:** a grab handle standing off the panel, or a finger-tab cut into an edge — sells "physical device."

1. Drawer-pull handle: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 16) for a rounded bar; raise it on two short posts (small cylinders) so it stands off the surface; `Ctrl+J` to join.
2. Or a finger-tab: on a panel edge, enter Edit Mode `Tab`, select an edge face, **Inset** `I` and **Extrude** inward `E` to carve a thumb notch; `Tab` out.
3. Right-click ▸ Shade Smooth; **Plastic** or **Rubber**.

## Perforated Panel

**Use:** a panel pierced with a grid of holes — for speaker grilles or ventilation.

1. Hole cutter: `Shift+A` ▸ Mesh ▸ **Cylinder**, small.
2. Grid the cutter: add two **Array** modifiers (one Factor X offset, one Factor Y offset) so the single hole becomes a full grid of cutters.
3. Carve: select the panel, **Boolean** ▸ Difference ▸ the arrayed cutter; apply; delete the cutter.
4. Right-click ▸ Shade Smooth.

## Grille / Vent

**Use:** a row or grid of slots — speaker grille or vent detail.

1. One slot: `Shift+A` ▸ Mesh ▸ **Cube**, scaled into a thin slot bar.
2. Repeat: add an **Array** modifier with a Count and offset to make a row (add a second Array for a grid).
3. Either keep the array as raised ribs, or use it as a Boolean cutter to slot a panel (select the panel, **Boolean** ▸ Difference ▸ the array; apply).
4. Right-click ▸ Shade Smooth.

## Hinged Lid

**Use:** a lid with hinge knuckles along one edge — for openable cartridge bodies.

1. Lid: `Shift+A` ▸ Mesh ▸ **Cube**; flatten `S` `Z` `0.1`; add a **Bevel**; right-click ▸ Shade Smooth.
2. Hinge knuckles: along one edge, add 3–4 short **Cylinders** (Vertices 16) lying sideways (`R` `X` `90`), alternating with gaps; run a thin **Cylinder** pin through all of them.
3. Join the knuckles to the lid with `Ctrl+J`. Metal pin, Plastic lid.

## Stone / Slate Background

**Use:** the dark rocky backdrop for full-scene hero renders (not needed for transparent-alpha sprites).

1. `Shift+A` ▸ Mesh ▸ **Plane**; scale it large so it fills the frame behind everything.
2. Apply the **Stone** material: dark Base Colour, Roughness ~0.8, a Noise Texture into Base Colour, and a Bump node for surface relief.

- **Note:** individual button sprites render on transparent alpha, so you skip this; it's only for composed scene shots.

## The Boolean Panel Workflow

> [!note]
> Booleans, Array, and the cleanup steps below are covered in full on **Modifiers in Depth** and **Smoothing, Normals & Clean Geometry**.

Panels live and die by clean Booleans (sockets, channels, vents, ports). A workflow that stays sane:

1. Name every **cutter** clearly (`cut_socket_1`) and keep them in their own collection so you can hide them.
2. **Apply scale** on the panel before any boolean.
3. Cut **one feature at a time**, applying each Boolean before the next, so a problem is easy to trace.
4. After each cut, **Merge by Distance** and check **normals** (`Shift+N`).
5. Shade Smooth only once all cuts are done.

For many identical holes, **Array the cutter first**, then a single Boolean does the whole grid at once.

## Troubleshooting Surfaces

- **Boolean did nothing** → the cutter didn't overlap, or its normals point inward; ensure overlap and Recalculate Normals.
- **Boolean left jagged or dark geometry** → switch the solver to **Exact**, then Limited Dissolve + recalc normals to tidy.
- **Panel bevel is lopsided** → non-uniform scale; `Ctrl+A` ▸ Scale first.
- **Metaball console won't edit** → it must be frozen: Object ▸ Convert To ▸ **Mesh**.
- **Stacked-panel shadows look flat** → layer gaps too small or the light too frontal; raise the layer offsets and angle the key light.
