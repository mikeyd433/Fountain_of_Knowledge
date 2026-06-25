---
title: Continuous Controls
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 12
---
Continuous controls — knobs, faders, wheels, pads — differ from buttons in two ways: they're usually built from **several parts** (a body plus a cap plus an indicator), and they often have a **range of positions** rather than two states, which you capture either as a filmstrip or as a separate movable sprite. A few techniques recur here: **recessing a face** (Inset then Extrude down to sink a well or channel), **Boolean Difference** (carving a shape out of another to make grooves and sockets), and the **Array** and **Screw** modifiers for repeating ridges and lathing round bodies. Every recipe below is self-contained. Finish each with right-click ▸ **Shade Smooth** and a **Plastic** or **Metal** material.

## Basic Knob

**Use:** the fundamental rotary control — a cylindrical cap you turn. It's also the base most other knobs are built from.

1. Add a cylinder: `Shift+A` ▸ Mesh ▸ **Cylinder**; in the bottom-left operator panel set **Vertices** to 32 so the round body is smooth.
2. Scale to knob proportions: `S` `Z` `0.6` `Enter` — taller than a flat puck so it reads as a grippable knob.
3. Round the top edge so it's not sharp: enter Edit Mode `Tab`, hover the top rim and `Alt+Click` to **loop-select** the whole ring of edges at once, then `Ctrl+B` to bevel just that rim, scroll the wheel to ~4 segments, and click.
4. Add an indicator so you can read the angle: add a small `Shift+A` ▸ Mesh ▸ **Cube**, shrink it tiny (`S` `0.1`), and move it (`G`) to the top edge as a pointer nub — or Boolean-cut a thin notch (see the Skirted Knob for that method).
5. Leave Edit Mode `Tab`; right-click ▸ **Shade Smooth**; apply **Plastic** or **Metal**.

- **State:** keyframe rotation (`R`) across frames and render a filmstrip, or render the knob static with a separate rotating indicator sprite on top.

## Skirted Knob (Indicator Line)

**Use:** a knob with a wider base flange (skirt) and a recessed pointer line on top — the classic synth knob.

1. Skirt: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32); flatten it low and wide with `S` `Z` `0.3` `Enter`.
2. Grip: add another `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32); make it narrower with `S` `0.6`, leave it taller; raise it onto the skirt with `G` `Z` so it stacks on top.
3. Pointer line: add a `Shift+A` ▸ Mesh ▸ **Cube**; scale it into a thin radial sliver reaching from centre to edge; sink it slightly into the grip's top.
4. Cut the line in: select the grip, Modifier Properties ▸ Add Modifier ▸ Generate ▸ **Boolean**, set Operation to **Difference**, and pick the sliver as the Object. Boolean Difference carves the sliver's shape out of the knob, leaving a recessed groove. **Apply** the modifier, then delete the sliver (`X`).
5. Join skirt and grip with `Ctrl+J`; right-click ▸ Shade Smooth; **Plastic** or **Metal**.

- **Watch for:** the sliver must actually overlap the surface it cuts, or the Boolean does nothing visible.

## Encoder (Knurled)

**Use:** a knob with a ridged (knurled) grip, suggesting an endless-rotation encoder.

1. Knob body: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32); `S` `Z` `0.6` `Enter`.
2. One grip ridge: add a `Shift+A` ▸ Mesh ▸ **Cube**; scale it into a thin vertical sliver; place it against the knob's side with `G` so it sits on the rim.
3. Repeat it evenly around the rim with an Array: first add an **Empty** at the knob's centre (`Shift+A` ▸ Empty ▸ Plain Axes) to act as a pivot. Select the ridge, add an **Array** modifier (Modifier Properties ▸ Add ▸ Array), set **Count** to ~24, and under **Object Offset** choose the Empty. Now rotating the Empty fans the copies evenly around the knob — rotate it until the ridges wrap the full rim. (Or duplicate by hand with `Shift+D` + `R` `Z`.)
4. Join with `Ctrl+J`; right-click ▸ Shade Smooth; **Metal** or **Plastic**. Pair it with a separate value readout, since encoders have no fixed pointer.

> [!note]
> The Array-with-an-Empty (Object Offset) method is the clean way to repeat anything radially — knurls, gear teeth, vent slots, rim grips.

## Chicken-Head Knob

**Use:** the vintage pointer knob shaped like a chicken's head — a tapered body with a protruding beak that points at the value.

1. Draw a profile: switch to front view `Numpad1`; add a `Shift+A` ▸ Mesh ▸ **Plane**; enter Edit Mode `Tab`, delete all but one vertical edge, and use `E` (Extrude) to draw a half-silhouette of the knob — a tall body tapering to a pointed nose. This 2D outline is one side of the knob's cross-section.
2. Lathe it into 3D: select the profile, Modifier Properties ▸ Add Modifier ▸ Generate ▸ **Screw**. The Screw modifier spins your flat profile 360° around the centre axis, sweeping it into a solid symmetrical knob — like a potter's wheel.
3. Add the beak: `Shift+A` ▸ Mesh ▸ **Cone**; flatten it; attach to one side with `G` as the pointer.
4. Join with `Ctrl+J`; right-click ▸ Shade Smooth; **Plastic**.

> [!note]
> The Screw modifier (lathe) is fiddly the first time — the profile must sit on the correct side of the centre line, and you may need to set the modifier's **Axis**. Expect to nudge it.

## Rotary Selector (Multi-Position)

**Use:** a knob that clicks between fixed positions (e.g. a 5-way mode selector), with a bold pointer.

1. Knob: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32); `S` `Z` `0.6` `Enter`.
2. Bold pointer: add a `Shift+A` ▸ Mesh ▸ **Cube**; scale it into a chunky arrow; seat on top with `G` `Z` — or Boolean-cut a deep wedge notch into the top (Boolean Difference, as in the Skirted Knob).
3. Join with `Ctrl+J`; right-click ▸ Shade Smooth; **Plastic**.

- **State:** render the knob at each detent angle by rotating with `R` `Z` to each fixed position (e.g. five positions at set degrees), saving each as its own sprite.

## Fader / Slider

**Use:** a linear control — a cap that slides along a recessed track. The standard level/volume control.

1. Track body: `Shift+A` ▸ Mesh ▸ **Cube**; scale it into a long thin block — `S` `Y` `3` `Enter` (long), `S` `X` `0.3` `Enter` (narrow), `S` `Z` `0.2` `Enter` (low).
2. Carve the channel the cap rides in: add another `Shift+A` ▸ Mesh ▸ **Cube**, scale it into a thinner long cutter, and sink it into the top of the track. Select the track, add a **Boolean** modifier ▸ Difference ▸ the cutter; Boolean Difference removes the cutter's volume, leaving a recessed slot. **Apply** the modifier and delete the cutter (`X`).
3. Cap: add a `Shift+A` ▸ Mesh ▸ **Cube**, flatten with `S` `Z` `0.3`, and add a **Bevel** modifier (Segments 4, Amount ~0.1) for a rounded cap; seat it in the channel.
4. Right-click ▸ Shade Smooth; **Plastic**.

- **State:** render the track once (it never changes); the cap is its own separate sprite the UI slides along the track, or render a filmstrip of the cap at each position.

## Crossfader

**Use:** a horizontal fader with a wide low cap — for blending between two sources (DJ-style).

1. Track: `Shift+A` ▸ Mesh ▸ **Cube**; make a long thin block along X — `S` `X` `3` `Enter`, `S` `Y` `0.3` `Enter`, `S` `Z` `0.2` `Enter`.
2. Channel: add a `Shift+A` ▸ Mesh ▸ **Cube** cutter sunk into the track's top; select the track, **Boolean** ▸ Difference ▸ cutter; apply; delete the cutter (`X`).
3. Cap: a `Shift+A` ▸ Mesh ▸ **Cube** flattened (`S` `Z` `0.3`), Beveled (Segments 4), seated in the channel — usually wider and lower than a vertical fader's cap.
4. Right-click ▸ Shade Smooth; **Plastic**. Horizontal travel.

## Pitch Wheel

**Use:** the spring-loaded thumb wheel on a synth's left cheek — a cylinder half-buried in the panel so only its top arc shows.

1. Wheel: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 48); lay it on its side by rotating `R` `X` `90` `Enter` so the round face points sideways and the wheel can "roll" toward/away from you.
2. Sink it into the panel: `G` `Z` down until only the top arc rises above the surface — that exposed arc is the part a thumb touches.
3. Grip ridges across the rim: a thin `Shift+A` ▸ Mesh ▸ **Cube** ridge laid across the edge, then Array around the wheel (Array modifier with an Empty at the wheel centre, as in the Encoder), or duplicate several by hand with `Shift+D` + `R`.
4. Right-click ▸ Shade Smooth; **Plastic**.

- **State:** a rotation filmstrip for visible movement, or static (the arc looks much the same at rest).

## Mod Wheel

**Use:** the modulation wheel beside the pitch wheel; identical build, usually with a bit more travel.

1. Build it exactly like the pitch wheel: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 48); lay on its side `R` `X` `90` `Enter`; sink into the panel `G` `Z`; add a thin **Cube** ridge Arrayed around the rim for grip.
2. Place it beside the pitch wheel. Right-click ▸ Shade Smooth; **Plastic**.

## XY Pad

**Use:** a 2D touch surface — a recessed square field with a movable indicator puck. Common on phone instruments.

1. Field slab: `Shift+A` ▸ Mesh ▸ **Cube**; scale into a square — `S` `X` `2` `Enter`, `S` `Y` `2` `Enter`, `S` `Z` `0.15` `Enter`. Add a **Bevel** modifier for soft outer edges.
2. Recess the field: enter Edit Mode `Tab`, select the top face, **Inset** it inward with `I`, then **Extrude** it down with `E` `Z` to sink the touch area below the rim; `Tab` out. This recessed well is the playable surface.
3. Touch puck: a separate small indicator — `Shift+A` ▸ Mesh ▸ **UV Sphere**, flattened `S` `Z` `0.4`, Shade Smooth — that the UI positions wherever the finger is.
4. Right-click ▸ Shade Smooth on the field; **Plastic**. Render the field once (static); render the puck separately.

## Ribbon Controller

**Use:** a long touch strip you slide a finger along; the UI reads position, so the sprite itself is static.

1. Strip: `Shift+A` ▸ Mesh ▸ **Cube**; scale into a long low strip — `S` `X` `3` `Enter`, `S` `Y` `0.5` `Enter`, `S` `Z` `0.15` `Enter`.
2. Add a **Bevel** modifier (Segments 3, small Amount) to soften the edges; right-click ▸ Shade Smooth.
3. Material: matte soft-touch — Principled BSDF with Metallic 0 and Roughness ~0.6–0.7, so it reads as velvety rubber rather than glossy plastic.

## Joystick / Thumbstick

**Use:** a tiltable stick in a round collar — for directional input.

1. Collar: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32); flatten `S` `Z` `0.2`; recess the centre — `Tab`, select the top face, `I` inset, `E` `Z` push down; `Tab` out. This well holds the stick.
2. Stalk: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 16); make it thin and short; stand it up in the collar with `G` `Z`.
3. Cap: `Shift+A` ▸ Mesh ▸ **UV Sphere**; scale to a thumb ball; seat it on the stalk top with `G` `Z`.
4. Join the stalk and cap with `Ctrl+J`; right-click ▸ Shade Smooth; **Plastic** (often a rubber cap).

- **State:** render tilt variants by rotating the stick with `R`, or keep it static and let the UI imply direction.

## Jog Wheel / Shuttle

**Use:** a large flat wheel you spin to scrub, with a finger dimple near the edge and a grippy rim.

1. Disc: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 64 for a smooth big circle); flatten `S` `Z` `0.2` into a large low disc.
2. Finger dimple: add a `Shift+A` ▸ Mesh ▸ **UV Sphere**; place it near the rim, sunk into the top; select the disc, **Boolean** ▸ Difference ▸ the sphere; apply; delete the sphere (`X`). This scoops a shallow dish for a fingertip.
3. Grippy rim: `Tab`, select the outer edge loop (`Alt+Click`), `Ctrl+B` for a small bevel — or Array thin ridges around the edge; `Tab` out.
4. Right-click ▸ Shade Smooth; **Plastic** or **Metal**.

- **State:** rotation filmstrip if you want visible spin.

## Trackball

**Use:** a ball seated in a socket that you roll for free 2D movement.

1. Socket: `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 32); flatten `S` `Z` `0.3`; recess the centre — `Tab`, top face, `I` inset, `E` `Z` push down; `Tab` out — to cradle the ball.
2. Ball: `Shift+A` ▸ Mesh ▸ **UV Sphere**; half-sink it into the socket with `G` `Z` so the top hemisphere shows.
3. Right-click ▸ Shade Smooth; **Plastic** (matte or glossy — glossy reads as a polished trackball).

## The Multi-Part Assembly Pattern

> [!note]
> These assemblies use the general techniques in **Modeling Fundamentals**, the **Edit Mode Toolkit**, and **Modifiers in Depth** — especially origins/pivots, parenting, Boolean, and the Array-with-an-Empty method.

Almost every control is **body + cap + indicator**, and they're easiest when assembled the same way each time:

1. Build each part as its own object.
2. Position them precisely with snapping (`Shift+Tab`) and the `N`-panel for exact coordinates.
3. **Set the origin to the rotation centre** on any part that turns (knob, pointer, rocker) so it spins true rather than wobbling.
4. **Parent** sub-parts to the main body (`Ctrl+P` ▸ Object) so the whole control moves together.
5. Decide *before* joining: keep parts separate if a piece must animate on its own (a pointer spinning over a static body), or `Ctrl+J` into one asset if it's rigid.

## Troubleshooting Controls

- **Knob wobbles when rotated** → its origin isn't centred; Set Origin ▸ Origin to Geometry (or 3D Cursor at the true pivot).
- **Knurl/ridges won't go around the rim** → the Array's Object Offset isn't pointing at a centred Empty; place an Empty at the knob centre, use it as the offset, then rotate the Empty.
- **Screw-modelled knob comes out inside-out or flat** → the profile is on the wrong side of the axis, or the modifier **Axis** is wrong; flip the profile across centre or change the Axis.
- **Slider cap won't sit in the channel** → the channel was cut too shallow or narrow; widen the boolean cutter and re-carve.
- **Indicator line is invisible** → the boolean sliver didn't overlap the cap surface; sink it in further before cutting.
