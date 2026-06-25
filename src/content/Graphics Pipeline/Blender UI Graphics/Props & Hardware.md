---
title: Props & Hardware
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 15
---
Props are the small details that make a flat UI read as a real, assembled device — pipes, wires, jacks, screws, LEDs, hinges. Most are **static** (rendered once), and most are **Metal**, **Rubber**, or **Emission** rather than plastic. The recurring techniques here: turning **curves into tubes** (a curve plus a Bevel Depth), **boring holes** with Boolean Difference, **lathing** round parts and helixes with the **Screw** modifier, and **Array** for repeating fins, rivets, and chain links. Finish solid parts with right-click ▸ Shade Smooth.

## Pipe / Tube

**Use:** the connective plumbing that ties a scene together — the green pipes in the reference.

1. Draw the path: `Shift+A` ▸ Curve ▸ **Bezier** (a smooth curve) or **Path** (straight segments). A curve is a line with no thickness yet.
2. Route it: enter Edit Mode `Tab`, move the control points with `G` to lay out the run; extend from an end point by selecting it and pressing `E` to add more curve; `Tab` out.
3. Give it thickness: in the curve's **Object Data Properties** (the curve icon) ▸ Geometry ▸ **Bevel** ▸ set the **Depth**. This sweeps a circle along the curve, turning the line into a round tube. Raise **Resolution** for smoother bends.
4. Right-click ▸ Shade Smooth; **Plastic** (green) or **Metal**.

- **Tip:** the Bezier handles control how tight the bends are — drag them in Edit Mode to shape gentle or sharp turns.

## Pipe Elbow / Joint Ball

**Use:** a rounded cap or ball at a pipe bend or junction, hiding the seam.

1. `Shift+A` ▸ Mesh ▸ **UV Sphere**, scaled to roughly the pipe's diameter.
2. Place it at the bend or where two pipes meet with `G`; right-click ▸ Shade Smooth.
3. Chrome or matching-pipe material — it reads as a swivel joint or connector ball.

## Wire / Cable

**Use:** thin, bright, loosely-routed cabling — the coloured wires in the reference.

1. Path: `Shift+A` ▸ Curve ▸ **Bezier**; `Tab`, route the control points with `G` into a loose, sagging run (cables aren't straight); extend with `E`; `Tab` out.
2. Thickness: Object Data ▸ Geometry ▸ Bevel ▸ set a **small Depth** — wires are much thinner than pipes.
3. Add a plug end at each tip (next entry); right-click ▸ Shade Smooth; bright **Plastic**.

- **Tip:** a little sag and randomness reads far more natural than a taut straight line.

## Patch-Cord Plug End

**Use:** the metal connector at the end of a cable.

1. Body: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 16), short.
2. Tip: add a thinner `Shift+A` ▸ Mesh ▸ **Cylinder** sticking out the front (the plug pin); position with `G`.
3. Groove: Boolean-cut a thin collar ring around the body — make a thin ring cutter, **Boolean** ▸ Difference, apply — for the typical plug detail.
4. `Ctrl+J` to join; right-click ▸ Shade Smooth; **Metal**.

## Jack / Port (1/4")

**Use:** an audio input/output socket.

1. Body: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 24), short.
2. Bore the hole: add a smaller `Shift+A` ▸ Mesh ▸ **Cylinder** down the centre; select the body, **Boolean** ▸ Difference ▸ the small cylinder; apply; delete the cutter (`X`). This hollows out the socket.
3. Tiny **Bevel** on the outer rim; right-click ▸ Shade Smooth; **Metal**.

## MIDI DIN Socket

**Use:** the round 5-pin MIDI connector.

1. Socket: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32), short; recess the face — `Tab`, select the top face, `I` inset, `E` `Z` push down; `Tab` out. **Metal** material.
2. Pin-holes: add a tiny `Shift+A` ▸ Mesh ▸ **Cylinder**; duplicate it (`Shift+D`) into five positions arranged in a semicircle inside the socket; select the socket, **Boolean** ▸ Difference ▸ the pins; apply; delete the cutters (`X`).

## USB Slot

**Use:** a USB-A port.

1. Slot: `Shift+A` ▸ Mesh ▸ **Cube**, scaled to a small flat rectangle, recessed into a panel (inset + extrude down, or Boolean a rectangular cutter).
2. Tongue: add a thin `Shift+A` ▸ Mesh ▸ **Cube** inside the slot — the plastic tongue of a USB-A port.
3. **Metal** slot, contrasting tongue.

## Knurled Nut / Collar

**Use:** a threaded collar with a ridged grip — fastens a jack or pot to a panel.

1. Body: draw a small nut cross-section in front view `Numpad1` and add a **Screw** modifier to lathe it into a round nut, or just use a short Cylinder.
2. Knurl: add a thin ridge (a Cube), then **Array** it radially around the rim using an **Empty** at the centre as the Object Offset (Count ~24), exactly as with the Encoder knob.
3. `Ctrl+J`; right-click ▸ Shade Smooth; **Metal**.

## Screw / Bolt

**Use:** the small fastener that sells "this is a real assembled device." Scatter at panel corners.

1. Head: `Shift+A` ▸ Mesh ▸ **Cylinder** — Vertices **6** for a hex bolt head, or **16** for a round screw — kept short.
2. Head detail: Boolean-cut a slot (a thin Cube), a Phillips cross (two thin Cubes), or a hex recess (a hex cylinder) into the top — or just paint the slot for distant screws.
3. Right-click ▸ Shade Smooth; **Metal**.

- **Tip:** at small sizes even a flat disc with a painted cross reads as a screw — don't over-model the ones far from camera.

## Rivet

**Use:** a small dome stud along a seam or edge.

1. `Shift+A` ▸ Mesh ▸ **UV Sphere**; flatten to a low dome (`S` `Z` `0.4`); right-click ▸ Shade Smooth.
2. Repeat along an edge with an **Array** modifier (Count + offset). **Metal**.

## Rubber Foot

**Use:** a soft foot on a device's underside (for underside / 3-quarter shots).

1. `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 24); flatten into a short squashed puck (`S` `Z` `0.3`); Bevel the edge; right-click ▸ Shade Smooth.
2. Dark matte **Rubber** material (Roughness ~0.7).

## Heat-Sink Fins

**Use:** a comb of metal fins — a "powered hardware" cue.

1. One fin: `Shift+A` ▸ Mesh ▸ **Cube**, scaled into a thin tall plate.
2. Repeat: add an **Array** modifier (Count + offset along one axis) to make the comb of fins.
3. Right-click ▸ Shade Smooth; **Metal** (or brushed metal).

## Hinge Knuckle

**Use:** the interlocking barrels of a hinge, on a pin.

1. Knuckles: 3–4 short **Cylinders** (Vertices 16) lying sideways (`R` `X` `90`), alternating with gaps along an edge.
2. Pin: a thin **Cylinder** run through all of them.
3. `Ctrl+J`; right-click ▸ Shade Smooth; **Metal**.

## Latch / Clasp

**Use:** a small lever clasp for an openable body.

1. Lever: `Shift+A` ▸ Mesh ▸ **Cube**, scaled into a small flat lever; Bevel the edges.
2. Pivot: a thin **Cylinder** pin at one end.
3. `Ctrl+J`; right-click ▸ Shade Smooth; **Metal** or **Plastic**.

## LED / Indicator Dome

**Use:** a small glowing status light.

1. `Shift+A` ▸ Mesh ▸ **UV Sphere** (or a low dome); right-click ▸ Shade Smooth.
2. **Emission** material in the lit colour (green/red/amber); enable **Bloom** for the glow.

- **State:** `_off` (Emission Strength 0) and `_on` (Strength ~3). Cluster several for a status row.

## Antenna / Aerial

**Use:** a thin rod with a ball tip — a wireless/retro cue.

1. Rod: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 12), thin and tall.
2. Tip: a small **UV Sphere** on top (`G` `Z`).
3. `Ctrl+J`; right-click ▸ Shade Smooth; **Metal**.

## Spring / Coil

**Use:** a helical spring — mechanical detail or a decorative coil.

1. Profile: `Shift+A` ▸ Mesh ▸ **Circle** (small) — this is the cross-section of the wire.
2. Coil it: add a **Screw** modifier; set the **Screw** value (the vertical rise per turn = the pitch) and **Iterations** (number of turns). The Screw modifier sweeps the circle around *and up* the axis, producing a helix.
3. Right-click ▸ Shade Smooth; **Metal**.

## Gear / Cog

**Use:** a toothed wheel — decorative "machinery" detail.

1. The fast way: enable the **Add Mesh: Extra Objects** add-on (Edit ▸ Preferences ▸ Add-ons, search "Extra Objects", tick it), then `Shift+A` ▸ Mesh ▸ **Gear** — it builds a parametric cog with adjustable tooth count and depth.
2. By hand: model one tooth (a small Cube), **Array** it radially around a central cylinder using an Empty offset, then Boolean-Union the teeth onto the cylinder.
3. Right-click ▸ Shade Smooth; **Metal**.

> [!note]
> Gears are the most involved prop here — the Extra Objects add-on's Gear is by far the easiest route.

## Vent Louver

**Use:** a stack of angled slats — an air vent.

1. One slat: `Shift+A` ▸ Mesh ▸ **Cube**, thin, tilted slightly with `R`.
2. Stack: an **Array** modifier (Count + offset) to repeat the slats into a louver.
3. Optional thin frame around the stack; right-click ▸ Shade Smooth; **Metal** or **Plastic**.

## Standoff Post

**Use:** a hex spacer post — a mounting-hardware detail.

1. `Shift+A` ▸ Mesh ▸ **Cylinder**, Vertices **6** (hex), tall.
2. Bore a centre hole: a smaller Cylinder, **Boolean** ▸ Difference, apply, delete the cutter.
3. Right-click ▸ Shade Smooth; **Metal**.

## Bumper / Corner Guard

**Use:** a soft rubber guard on a corner or edge.

1. `Shift+A` ▸ Mesh ▸ **Torus** (use a quarter of it) or a rounded L, placed at the corner.
2. **Rubber** material (matte, dark); right-click ▸ Shade Smooth.

## Chain Link

**Use:** an interlocking chain — decorative or functional.

1. One link: `Shift+A` ▸ Mesh ▸ **Torus**, stretched into an oval with `S`.
2. Chain it: build a two-link unit where the second link is rotated 90° (`R` `X` `90`) so they interlock, then **Array** that unit so the whole chain interlocks correctly.
3. Right-click ▸ Shade Smooth; **Metal**.

## Sticker / Decal

**Use:** a printed sticker or label slapped onto a surface.

1. `Shift+A` ▸ Mesh ▸ **Plane**, scaled to the sticker size; add a tiny **Bevel** for a slightly raised edge.
2. Apply a painted graphic (made in Krita, saved with transparency) as a texture in the material's Base Colour.
3. Lay it onto a surface with `G`; a faint edge shadow sells it as a real sticker.

## Curve-Based Props in Depth

> [!note]
> Curves, the Screw modifier, and Convert-to-Mesh are detailed on **Modifiers in Depth** and the **Edit Mode Toolkit**.

Pipes, wires, springs, and trim all come from **curves** — a line you give thickness. The controls worth knowing:

- A **Bezier** curve has handles for smooth flowing bends (pipes, cables); a **Path/Poly** curve is straighter and segmented.
- Thickness comes from Object Data ▸ Geometry ▸ **Bevel ▸ Depth**, which sweeps a circle along the curve. **Resolution** smooths the bends; **Bevel ▸ Caps** closes the tube ends.
- A **Taper Object** makes the tube thicken or thin along its length.
- To edit a curve-tube as real geometry (to boolean it or attach to it), **Convert To ▸ Mesh**.
- Route the curve in Edit Mode by moving control points (`G`) and extending from an end point (`E`).

## Troubleshooting Props

- **Tube pinches or kinks at a sharp bend** → the bend radius is too tight for the Depth; ease the Bezier handles, lower the Depth, and raise Resolution.
- **Spring/helix goes flat or spirals on the wrong axis** → set a positive **Screw** height value and correct the modifier **Axis**.
- **Array of fins or links overlaps or gaps** → toggle between Relative and Constant Offset and check the Count.
- **Screw heads or jacks look too busy at small size** → simplify; a painted slot beats modelled detail when far from camera.
- **Wire ends float without connectors** → add a plug-end at each tip and seat it where the wire meets its socket.
