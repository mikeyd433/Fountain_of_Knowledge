---
title: Buttons & Keys
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 11
---
Every button here is a master shape you build once, finish, give a material, and Mark as Asset for reuse. Two finishing steps recur on almost all of them: **Shade Smooth** (right-click ▸ Shade Smooth) blends the flat facets of a mesh into a smooth molded surface so curves don't look low-poly, and the **Plastic** material gives the glossy toy finish. Add all primitives with `Shift+A` ▸ Mesh.

> [!tip]
> When you add a primitive, a small operator panel appears in the **bottom-left corner** of the viewport ("Add UV Sphere", "Add Cylinder", etc.). Click it to expand and set things like vertex count or segments — several of these can only be set at creation time, so adjust them before doing anything else.

## Dome / Popper

**Use:** the default soft fidget button — the round, pillowy popper that's the signature shape of this whole aesthetic. Reach for it first for any primary action.

1. Add a sphere: `Shift+A` ▸ Mesh ▸ **UV Sphere**. It arrives as a full ball. In the bottom-left "Add UV Sphere" panel, raise **Segments** to 48 and **Rings** to 24 — these are the vertical and horizontal divisions; more divisions make the surface smoother so it won't look faceted once flattened.
2. Flatten it into a dome: press `S` (scale), then `Z` (lock to the vertical axis), type `0.4`, and `Enter`. This squashes the ball to 40% of its height for the gentle pillow shape. `S` starts scaling, `Z` constrains it so only height changes, the number is the exact factor, `Enter` confirms.
3. Smooth it: right-click ▸ **Shade Smooth**. Without this the dome looks like a faceted disco ball; with it, the renderer reads the surface as smooth molded plastic.
4. Apply the **Plastic** material in a saturated colour.

- **Watch for:** still faceted after Shade Smooth means your Segments/Rings were too low — rebuild with higher values.
- **State:** pressed = duplicate the shape, squash to ~0.8, darken the colour slightly.

## Tall Dome / Bubble

**Use:** a proud, rounder popper for when you want the button to bulge up more, like a bubble about to pop. More playful and tactile than the standard dome.

1. Add a sphere: `Shift+A` ▸ Mesh ▸ **UV Sphere** (Segments 48, Rings 24 in the operator panel).
2. Flatten only slightly: `S` `Z` `0.6` `Enter`. At 60% height it keeps far more of its roundness than the standard dome, so it sits taller and bubblier.
3. Right-click ▸ **Shade Smooth**.
4. **Plastic** material — a glossy enamel finish (Roughness ~0.15) especially suits the bubble look.

- **Watch for:** very tall domes can clip the top of frame — check through the camera (`Numpad0`) and leave margin.

## Squircle / Rounded Key

**Use:** the chunky soft-square key — a rounded square between a button and a keyboard key. Great for grids of equal buttons.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Flatten into a slab: `S` `Z` `0.3` `Enter` — 30% height turns the cube into a low square tile.
3. Round the edges with a modifier: **Modifier Properties** (the wrench icon) ▸ Add Modifier ▸ Generate ▸ **Bevel**. The Bevel modifier rounds the sharp edges without altering the underlying cube, so it stays adjustable.
4. In the Bevel settings, raise **Segments** to 6–8 (the number of small faces forming the rounded edge — more = smoother) and **Amount** to ~0.2 (how far the rounding reaches in). Crank the Amount until the corners look pillowy.
5. Right-click ▸ **Shade Smooth**; **Plastic** material.

- **Tip:** because the rounding is a live modifier, reopen it anytime to dial the squishiness up or down.

## Arcade Puck

**Use:** the flat disc button with a rounded rim, like a real arcade button you slap. Good for big, satisfying primary actions.

1. Add a cylinder: `Shift+A` ▸ Mesh ▸ **Cylinder**. In the operator panel set **Vertices** to 48 so the round edge is smooth, not polygonal.
2. Flatten into a low disc: `S` `Z` `0.25` `Enter`.
3. Add a **Bevel** modifier (Modifier Properties ▸ Add ▸ Generate ▸ Bevel).
4. Keep the bevel *modest*: **Segments** 4–6, **Amount** ~0.05–0.1. Unlike the squircle, you only want to soften the top and bottom rim into a gentle lip, not balloon the whole shape — too much Amount turns the puck into a pillow.
5. Right-click ▸ **Shade Smooth**; **Plastic**.

- **Tip:** pucks read best shot from a slightly *lower* camera angle so the rounded rim catches a bright glossy band.

## Capsule / Pill (Lozenge)

**Use:** the stadium/lozenge button — a long shape with fully rounded ends. Good for wide labelled actions and as the body of larger devices.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Stretch it long: `S` `X` `2` `Enter` (twice as wide along X). Then flatten: `S` `Z` `0.35` `Enter`.
3. Add a **Bevel** modifier.
4. Set **Segments** to ~8 and raise **Amount** until the short ends round all the way into half-circles — for a true pill, Amount must be large enough that the rounding from each side meets, leaving no flat on the ends.
5. Right-click ▸ **Shade Smooth**; **Plastic**.

- **Watch for:** flat ends mean Amount is too low; a collapsing middle means it's too high — back off slightly.

## Rectangular Key (Piano-Style)

**Use:** a long, low rectangular key with only lightly softened edges — for key beds, piano rows, and crisp rectangular buttons.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Shape it like a key: `S` `Y` `2.5` `Enter` (long front-to-back), then `S` `Z` `0.4` `Enter` (low). Adjust X scale if you want it narrower.
3. Add a **Bevel** modifier, but keep it crisp: **Segments** 2–3, **Amount** small (~0.05). You want the edges *just* taken off the sharp, not rounded into a pillow — keys should read as defined rectangles.
4. Right-click ▸ **Shade Smooth**; **Plastic** (or a matte rubber for a soft-touch bed).

- **Tip:** duplicate (`Shift+D`) and line several up for a key row; toggle snapping (`Shift+Tab`) to keep spacing even.

## Dished / Concave

**Use:** a button with a scooped-in top — reads as already pressed, or as a distinct "set into the surface" control.

1. Build the base as an arcade puck *before* any bevel: cylinder (Vertices 48), `S` `Z` `0.25` `Enter`.
2. Enter Edit Mode: `Tab`. This edits the actual geometry rather than the whole object. Select the **top face** (click it).
3. Inset the face: press `I`, drag inward a little, click. **Inset** makes a smaller copy of the face inside the original, giving a rim around a central area.
4. Push the centre down: press `E` (Extrude), then `Z` to lock vertical, and drag the inner face *downward* to scoop a dish; click to set. Extrude pulls the face out creating new side walls — here it sinks the centre.
5. Leave Edit Mode `Tab`. Add a small **Bevel** modifier to soften the rim; right-click ▸ **Shade Smooth**; **Plastic**.

- **Watch for:** don't push the centre so deep it pokes through the bottom — keep the dish shallow.

## Hex / Faceted

**Use:** a six-sided retro-tech button. The flat facets give a deliberately mechanical, low-poly look.

1. Add a cylinder: `Shift+A` ▸ Mesh ▸ **Cylinder**, but set **Vertices** to **6** in the operator panel — a 6-sided cylinder is a hexagonal prism.
2. Flatten: `S` `Z` `0.3` `Enter`.
3. Add a small **Bevel** modifier to take the hard edges off slightly.
4. **Leave Shade Smooth OFF.** Here you *want* the flat facets to read — smoothing would blur the hexagon's defining angles. The chunky faceted look is the point.
5. **Plastic** material.

- **Tip:** the same approach with Vertices 3, 5, or 8 gives triangular, pentagonal, or octagonal buttons.

## Ring / Torus

**Use:** a ring/donut button, or a halo accent placed around another button.

1. Add a torus: `Shift+A` ▸ Mesh ▸ **Torus**. In the operator panel set the **Major Radius** (overall ring size) and **Minor Radius** (tube thickness) — a small Minor Radius gives a thin, delicate ring.
2. Squash it slightly: `S` `Z` `0.6` `Enter` so it sits low against the panel rather than as a fat donut.
3. Right-click ▸ **Shade Smooth**; **Plastic** — or an **Emission** material if it's a lit indicator ring.

- **State:** as a lit ring, render `_on`/`_off` by toggling Emission Strength.

## Concentric Ring Button

**Use:** a button sitting inside a ring — e.g. a press-button with a glowing status halo (selector + light ring).

1. Outer ring: `Shift+A` ▸ Mesh ▸ **Torus** (small Minor Radius for a thin ring); squash `S` `Z` `0.6` `Enter`; right-click ▸ Shade Smooth.
2. Inner dome: `Shift+A` ▸ Mesh ▸ **UV Sphere**; flatten `S` `Z` `0.4` `Enter`; scale it (`S`) to fit inside the ring's hole; raise it (`G` `Z`) to sit flush; Shade Smooth.
3. Give the ring an **Emission** material (Strength ~3) so it glows as a halo, and keep the dome on **Plastic**.

- **State:** combine a pressed dome state with an on/off ring state for a rich, layered control.

## Triangle / Play

**Use:** a play/skip glyph button.

1. Add a cylinder: `Shift+A` ▸ Mesh ▸ **Cylinder**, Vertices **3** in the operator panel — a 3-sided cylinder is a triangular prism.
2. Flatten: `S` `Z` `0.3` `Enter`.
3. Point it the right way: `R` `Z`, type an angle, `Enter`, to rotate it flat on the panel until the triangle points where you want (e.g. right for "play").
4. Add a small **Bevel** modifier to soften the sharp points; right-click ▸ Shade Smooth; **Plastic**.

- **Watch for:** very sharp tips look harsh — a little bevel makes them friendlier and on-style.

## Octagon / Stop

**Use:** a stop/cancel button — the eight-sided shape reads as "halt."

1. Add a cylinder: `Shift+A` ▸ Mesh ▸ **Cylinder**, Vertices **8**.
2. Flatten: `S` `Z` `0.3` `Enter`.
3. Add a **Bevel** modifier to soften the edges; right-click ▸ Shade Smooth; **Plastic** (classically red).

## Diamond / Rhombus

**Use:** an accent or indicator button turned on its point.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Rotate it 45° flat on the panel: `R` `Z` `45` `Enter` so a corner points forward.
3. Flatten: `S` `Z` `0.3` `Enter`.
4. Add a small **Bevel** modifier; right-click ▸ Shade Smooth; **Plastic**.

## Faceted Gem

**Use:** a jewel-like indicator, faceted and sparkly.

1. Add a cylinder: `Shift+A` ▸ Mesh ▸ **Cylinder**, Vertices **6–8** for the gem's outline.
2. Enter Edit Mode `Tab`; select the **top face**; **Inset** it small with `I`; then collapse it to a point — press `M` ▸ **At Center** to merge those vertices into a single peak, forming the faceted crown.
3. Leave Edit Mode `Tab`. **Do not** Shade Smooth — the cut facets are what make it sparkle.
4. **Plastic** with low Roughness (~0.15), or **Glass**, for a gem-like shine.

## Teardrop / Blob

**Use:** an organic, soft, hand-made-looking button.

1. Add a sphere: `Shift+A` ▸ Mesh ▸ **UV Sphere**.
2. Enter Edit Mode `Tab`; select the **top pole vertex**. Turn on **Proportional Editing** with `O` — this makes a transform fall off smoothly to nearby geometry, so pulling one vertex drags its neighbours in a smooth taper.
3. Pull it up: `G` `Z` and drag; **scroll** the wheel to grow/shrink the falloff radius until the taper looks like a teardrop; click. Press `O` again to turn Proportional Editing off.
4. Leave Edit Mode `Tab`; flatten slightly `S` `Z` `0.8` `Enter`; right-click ▸ Shade Smooth; **Plastic**.

## Pebble / Organic

**Use:** an irregular, asymmetric button — a hand-made, non-uniform feel.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Add a **Subdivision Surface** modifier (Modifier Properties ▸ Add ▸ Generate ▸ Subdivision Surface) at level 2–3 — it rounds the cube into a smooth blobby form by repeatedly subdividing and smoothing.
3. Enter Edit Mode `Tab`; turn on Proportional Editing `O`; nudge a few vertices with `G` to make the shape lumpy and asymmetric. Imperfection is the goal. `O` off; `Tab` out.
4. Right-click ▸ Shade Smooth; **Plastic**.

## Pillow (Puffy Square)

**Use:** an inflated, puffy soft key — like a little cushion.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Add a **Subdivision Surface** modifier at level 2. With no supporting edges, the subdivision inflates the cube into a rounded, pillow-like square.
3. For extra puff, add a **Cast** modifier (Add ▸ Deform ▸ Cast) set toward **Sphere** with a low Factor (~0.2) — this nudges the shape toward a sphere, inflating it.
4. Right-click ▸ Shade Smooth; **Plastic**.

## Gumdrop

**Use:** a tall, rounded cap — a friendly domed nub.

1. Add a cone: `Shift+A` ▸ Mesh ▸ **Cone** (or a Cylinder with a small top radius set in the operator panel).
2. Add a **Subdivision Surface** modifier at level 2 — it rounds the cone's tip and base into a smooth gumdrop.
3. Flatten or scale to taste with `S` `Z`; right-click ▸ Shade Smooth; **Plastic**.

## Long Bar / Pill Bar

**Use:** a wide, low action bar — for full-width controls.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Make it wide and low: `S` `X` `3` `Enter`, then `S` `Z` `0.3` `Enter`.
3. Add a **Bevel** modifier with enough **Amount** to round the short ends into half-circles (like the capsule).
4. Right-click ▸ Shade Smooth; **Plastic**.

## Half-Pill / D-Shape

**Use:** a directional or paired button — a capsule cut in half along its length, flat on one side.

1. Build a capsule first: `Shift+A` ▸ Mesh ▸ **Cube** → `S` `X` `2` `Enter` → `S` `Z` `0.35` `Enter` → add a **Bevel** modifier (Segments 8, high Amount so the ends round). Then **apply** the Bevel (modifier dropdown ▸ Apply) so the rounding becomes real, editable geometry.
2. Enter Edit Mode `Tab`; add a loop cut down the length: `Ctrl+R`, hover so the line runs lengthwise, click to place, right-click to centre it.
3. Select the vertices of one half and delete them: `X` ▸ **Vertices**.
4. Cap the open side: select the boundary edge loop (`Alt+Click` the open edge), press `F` to **Fill** it with a face.
5. Leave Edit Mode `Tab`; right-click ▸ Shade Smooth; **Plastic**.

## Stacked / Tiered

**Use:** a chunky two-level arcade cap — a smaller button raised on a wider base.

1. Base puck: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 48) → flatten `S` `Z` `0.25` `Enter` → add a **Bevel** modifier (Segments 4, Amount ~0.08) → right-click ▸ Shade Smooth.
2. Top tier: duplicate the base with `Shift+D` then `Esc` (Esc drops the copy exactly on top without moving it); shrink it with `S` (~0.7); raise it onto the base with `G` `Z`.
3. Optionally join the two with `Ctrl+J`. **Plastic** material.

## Mushroom / E-Stop

**Use:** a big emergency/panic button — the wide red dome on a collar you see on machinery kill switches.

1. Cap: `Shift+A` ▸ Mesh ▸ **UV Sphere** → flatten `S` `Z` `0.5` `Enter` for a broad dome.
2. Collar: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32) → flatten `S` `Z` `0.2`, make it a bit narrower than the cap with `S` `0.8`; place it under the cap with `G` `Z`.
3. Join with `Ctrl+J`; right-click ▸ Shade Smooth.
4. Red **Plastic** with low Roughness (~0.2) for a strong, alarming specular shine.

## Cross / Plus

**Use:** a plus/add button, or a single D-pad cell.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube** → make a bar with `S` `X` `2` `Enter`.
2. Duplicate it: `Shift+D` then `Esc`; rotate the copy 90°: `R` `Z` `90` `Enter`, giving a crossing bar.
3. Combine: select both and use a **Boolean** Union (or just `Ctrl+J` if they overlap cleanly) so they read as one solid plus.
4. Add a **Bevel** modifier; right-click ▸ Shade Smooth; **Plastic**.

## D-Pad (Four-Way Unit)

**Use:** a directional control — a plus-shaped rocker seated in a round recess.

1. Cross rocker: `Shift+A` ▸ Mesh ▸ **Cube** → bar `S` `X` `2` `Enter`; duplicate `Shift+D` `Esc`, rotate `R` `Z` `90` `Enter`; combine (Boolean Union or `Ctrl+J`); add a **Bevel** modifier; right-click ▸ Shade Smooth.
2. Round recess base: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32) → flatten `S` `Z` `0.2`; recess its top — `Tab`, select the top face, `I` inset, `E` `Z` push down; `Tab` out.
3. Seat the cross into the recess with `G` `Z`. **Plastic** material.

- **State:** render four variants — `R` rocking the cross up, down, left, and right.

## Chiclet (Low-Profile Key)

**Use:** a modern flat key-bed key — low and softly rounded, like a laptop keyboard key.

1. Add a cube: `Shift+A` ▸ Mesh ▸ **Cube**.
2. Make it very flat: `S` `Z` `0.15` `Enter`.
3. Add a **Bevel** modifier with a small Amount to gently round the edges.
4. Right-click ▸ Shade Smooth; **Plastic**, or a matte rubber for soft-touch.

## Heart (Decorative)

**Use:** a playful accent button. Compound shapes like this are fiddlier — build the parts, then merge.

1. Lobes: add two **UV Spheres** side by side for the two top bumps; position with `G`.
2. Tip: add a **Cone** below, pointing down, for the bottom point; position it so it meets the lobes.
3. Merge: select all three and use a **Boolean** Union (or `Ctrl+J` then a remesh) so they become one heart.
4. Flatten with `S` `Z`; right-click ▸ Shade Smooth; **Plastic**.

> [!note]
> Compound shapes rarely come out perfect first try — nudge the parts until the silhouette reads, and remember imperfection suits the style.

## Soft Star / Flower (Decorative)

**Use:** a badge or decorative accent (usually not interactive).

1. Add a curve circle: `Shift+A` ▸ Curve ▸ **Circle**.
2. Enter Edit Mode `Tab` and shape it into a star or petal outline by moving the control points; in the curve's Object Data Properties, enable **2D Fill** so the outline becomes a solid filled shape.
3. Add **Solidify** (gives the flat shape thickness) and **Bevel** (rounds the edges) modifiers; right-click ▸ Shade Smooth; **Plastic**.

## Inventing New Buttons (Combining Shapes)

> [!note]
> The builds above and below lean on the general skills in **Modeling Fundamentals**, the **Edit Mode Toolkit**, and **Modifiers in Depth** — reach for those pages when a step (extrude, boolean, array, cleanup) needs more detail.

The catalog is a starting set, not a ceiling. New buttons come from three moves:

1. **Combine primitives** — join a dome to a ring, stack a small cap on a wide base, set a gem into a puck. Build each part, position it, then `Ctrl+J` to weld into one asset.
2. **Boolean** — carve a glyph, notch, or groove into any cap (Difference), or fuse two forms into one (Union).
3. **Deform** — taper, twist, or proportional-edit (`O`) a standard shape into something organic.

After combining, run the pre-asset cleanup pass (Merge by Distance, Recalculate Normals) and then Shade Smooth. Keep the silhouette readable at button size — detail that disappears when shrunk isn't worth modelling.

## Troubleshooting Button Geometry

- **Still faceted after Shade Smooth** → the base primitive had too few Segments/Rings; rebuild with higher counts.
- **Bevel looks uneven or balloons** → scale wasn't applied; `Ctrl+A` ▸ Scale, then redo — or lower Amount and enable Clamp Overlap.
- **Boolean notch left a hole or dark patch** → the cutter didn't fully overlap, or normals flipped; ensure overlap, Apply, then `Shift+N` and Merge by Distance.
- **Pressed state jumps when the UI swaps it** → the camera moved between renders; rebuild every state from the one locked rig.
- **A crisp rim went soft and muddy** → over-smoothed; use Shade Auto Smooth by angle, or add a Weighted Normal modifier.
