---
title: Interactive States
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 17
---
Every interactive element ships as a *set* of sprites — one per thing it can be doing. In SatisFactory these map to **element states** (normal, pressed, on, off, disabled…) and animated ones to **filmstrips**. Getting states right is what makes the UI feel physical: a button that visibly sinks, a toggle that flips, an LED that lights. This page goes deep on how to build each state, with special attention to the many ways a button can look **pressed** — because it's the workhorse, and different button shapes press in genuinely different ways.

## The State Model

The states you might produce, and what each means:

- **Normal / Resting** — the default look.
- **Hover / Highlight** — pointer over or "armed," just before a press. Less common on pure touch, but used to show focus.
- **Pressed / Active** — being touched right now.
- **Held / Sustained** — held down; often looks like pressed, sometimes with added intensity.
- **Toggled On / Off** — for *latching* controls that hold their state after release.
- **Disabled** — greyed and unavailable.
- **Focused / Selected** — the currently-selected item in a group.
- **Error / Alert** — flashing or red, demanding attention.

You don't need all of these for every element. Most buttons need **normal + pressed** (plus **disabled** if it can be greyed out); toggles need **on + off**; knobs and faders need a range. Build only the states that element actually uses.

## How States Map to the UI

Each interactive element in the layout references a set of state sprites, and the runtime swaps which one is shown based on the user's input. These interactive sprites sit *over* the static backplate. Because every state sprite is rendered from the same locked rig, the swap is seamless — the button appears to change, not jump. Each state is simply a different PNG with a state suffix in its name.

## Two Ways to Build States

### A) Duplicate & Modify (simple, quick)

Duplicate the resting shape in place (`Shift+D` then `Esc`), change one thing, hide the original (Outliner eye), and render. Fast, but you end up managing several objects in the file.

### B) Shape Keys (non-destructive — recommended)

A **shape key** stores an alternate version of a mesh's shape on the *same object*, with a slider to blend between them. This is the cleaner, professional way to do states — one object, no duplicate juggling, and it doubles as the press *animation*.

1. Select the button; open **Object Data Properties** (the green triangle icon) ▸ **Shape Keys**.
2. Click **+** to add the first key — this becomes **Basis**, the resting shape.
3. Click **+** again and rename the new key **Pressed**.
4. With **Pressed** selected and its **Value** set to **1.0**, enter Edit Mode (`Tab`) and reshape the mesh — squash it, invert the dome, push it down. These edits are stored *only* in the Pressed key.
5. Back in Object Mode, the **Value** slider now blends: **0** = normal, **1** = pressed.
6. Render at Value 0 → `_normal`; render at Value 1 → `_pressed`.

> [!tip]
> Render intermediate Values (0.25, 0.5, 0.75) as extra frames and you get an animated press for free. Shape keys are also exactly the mechanism the 3D visualizer uses, so learning them here pays off on both halves of the project.

## What Makes a Press Read

Before the recipes, the visual cues your eye actually uses to read "this is pressed." You rarely need all of them — two or three sell it, and which ones depend on the button's shape.

- **Travel** — the button physically moves down. The single strongest cue.
- **Compression** — soft buttons squash shorter and a touch wider.
- **Darkening** — a depressed surface sits lower and catches less light.
- **Highlight change** — the glossy hotspot shrinks or shifts because the surface flattened and moved.
- **Contact shadow** — a subtle dark ring where the cap meets the socket rim deepens as it sinks.
- **Rim reveal** — more of the socket wall shows as the cap drops in.

## Pressed Buttons — The Variations

There's no single "pressed." Here are the distinct approaches, each suited to different button shapes.

### Squash & Darken (soft buttons)

The default for domes, squircles, capsules — soft buttons that visibly compress.

1. Use a **Pressed** shape key, or duplicate in place.
2. Squash: `S` `Z` `0.8` `Enter` — soft buttons compress ~15–25%.
3. Bulge slightly as it squashes (real rubber does this): `S` `Shift+Z` `1.03` `Enter` — `Shift+Z` scales on X and Y but *not* Z, widening it a hair.
4. Sink it: `G` `Z` `-0.05` `Enter`.
5. Darken: lower the Plastic colour's **Value (V)** ~15% in the colour picker.
6. Render `_pressed`.

### Concave / Popper Invert (fidget snap)

For poppers that should "pop through" to the other side, like a real fidget popper.

1. Use a **Pressed** shape key (much cleaner here than a duplicate).
2. In the Pressed key, select the dome's top and push it *down through* the base into a concave dish — the convex bubble inverts into a cup.
3. Darken slightly; the inverted cup catches light differently, which is what sells the snap.
4. Render `_pressed`. Render mid-Values too for a satisfying snap-through animation.

### Sink-Into-Socket (rigid buttons)

For arcade pucks, hex buttons, and other hard caps that don't compress — they travel straight down into their well.

1. The press is pure downward travel, so duplicate or shape-key and just move it: `G` `Z` `-0.1` `Enter` (or deeper).
2. As it drops, more of the socket rim shows above it and the cap falls into shadow — that's the cue.
3. Optionally lower **Value** slightly to deepen the contact shadow. **No squash** — rigid plastic doesn't compress.
4. Render `_pressed`.

### Depth-Only Micro-Travel (chiclets, low keys)

Very low-profile keys: a tiny downward move (`G` `Z` `-0.03`) plus a faint darken. Subtle is correct — over-squashing a flat key looks wrong and mushy.

### Pivot Press (rectangular / piano keys)

Real keys pivot down at the far edge rather than dropping flat.

1. Place the pivot at the key's back edge: `Shift+RMB` to put the 3D cursor there, then set the pivot-point dropdown (top header) to **3D Cursor**.
2. Tilt the key down at the front: `R` and rotate ~3–6° so the front dips while the back stays put.
3. Darken the front face slightly; render `_pressed`. This reads far more mechanical than a flat drop.

### Glow-On-Press / Backlit

For buttons that light up when active.

1. Keep the geometry mostly the same (a little travel optional).
2. Raise the cap's **Emission** strength, or reveal a hidden emissive plane behind a translucent cap so light glows through.
3. Render the lit `_pressed`/`_active`; the resting state is unlit.

### Multi-Stage Press (half / full)

For two-stage or pressure buttons: render `_half` (partial squash/travel, mild darken) and `_full` (deeper squash, more darken). The UI can step between them, or you can use them as the endpoints of a short filmstrip.

## Pressed Behaviour by Button Shape

A quick map of which press approach fits which shape:

- **Dome / Popper** → squash + darken, or invert to concave for the fidget snap.
- **Tall Dome / Bubble** → squash more (it has more height to give), or invert.
- **Arcade Puck** → sink straight down into the socket; no squash.
- **Squircle / Pillow** → compress + slight widen + darken.
- **Rectangular / Piano Key** → pivot down at the front edge.
- **Chiclet** → tiny micro-travel + faint darken.
- **Capsule / Bar** → compress along height + darken.
- **Mushroom / E-Stop** → deep downward travel (a big, satisfying push) + darken.
- **Cross / D-Pad** → tilt the rocker toward the pressed direction.
- **Hex / Octagon / faceted** → small downward travel + darken (rigid, no squash).

## Hover / Highlight States

Useful for "armed" or focused buttons. Pick one:

1. Brighten the colour's **Value** ~10%, or add a faint **Emission**.
2. Scale up a hair (`S` `1.03`) so it appears to lift toward the user.
3. Add a thin glowing ring around it (a small **Torus** with an Emission material).

Render `_hover`.

## Disabled States

The greyed, unavailable look:

1. Desaturate: drop the colour's **Saturation** toward grey.
2. Dim: lower **Value** ~30%.
3. Optionally raise **Roughness** so it loses its gloss — a dead, matte surface reads "off."
4. Optionally composite a faint lock glyph over it.
5. Render `_disabled`.

## Focus / Selected States

For the currently-selected item in a group:

1. Add a glowing outline ring, or a brighter rim.
2. Or a small scale-up plus a slight Emission.
3. Render `_selected`.

## Toggle / Latching Button States

A button that *stays* down after pressing:

1. `_off` — resting (up).
2. `_on` — the pressed look (down + darker), but held there. Add a lit ring or Emission so the latched-on state reads clearly, since it has to communicate "still on" at rest.
3. Render both.

## Rocker States

A rocker tilts between sides on a centre pivot:

1. `_off` / `_left` — tilt one end down: `R` ~10–15° on the rocker axis.
2. `_on` / `_right` — tilt the other way the same amount.
3. Optional `_center` for a neutral middle.
4. Render each.

## Flip Switch / Lever States

1. `_up` — lever rotated up: `R` ~+30°.
2. `_down` — rotated down: ~-30°.
3. Optional `_mid` for a three-way switch.
4. Render each.

## Knob / Encoder / Wheel States

- **Continuous:** a rotation filmstrip — keyframe rotation from minimum to maximum across 12–24 frames and render the animation (see the Filmstrips page).
- **Grabbed highlight:** optionally a slightly brighter or glowing variant for "being turned."
- **Detented encoder:** render the knob at each click position as a separate frame.

## Slider / Fader States

- **Track:** one static sprite (it never changes).
- **Cap:** a position filmstrip across the travel, or a single cap sprite the UI slides.
- **Grabbed cap:** optionally a brighter cap variant for "being dragged."

## Pad / Velocity States

A drum/trigger pad that responds to hit strength:

1. Build a velocity ramp filmstrip: rest → soft (slight squash + faint glow) → medium → hard (deep squash + bright glow).
2. 4–8 frames is plenty; the UI selects a frame by how hard the pad was hit.

## LED / Indicator States

- `_off` — Emission Strength 0 (dark, maybe slightly translucent).
- `_on` — Emission ~3, with Bloom enabled.
- `_dim` — Emission ~1 for a standby glow.
- **Blink** — alternate on/off as a 2-frame filmstrip.

## Naming Your State Sets

Tag every sprite with its element and state so the UI and the future batch script can find them:

```
play_button_normal.png
play_button_hover.png
play_button_pressed.png
play_button_disabled.png
toggle_loop_off.png   toggle_loop_on.png
pad_kick_01.png … pad_kick_06.png      (velocity ramp)
knob_cutoff_01.png … knob_cutoff_24.png (rotation filmstrip)
```

## Registration — The Non-Negotiable

Every state of one element **must** come from the identical rig — same camera, same light, same render settings — so all its sprites occupy the same pixels and swap without shifting. The safest workflow is to build *all* of an element's states in **one file** (using shape keys, or hidden duplicates), and render each from the single shared camera, hiding all but the target each time.

> [!danger]
> Never re-aim the camera or relight between a normal and pressed (or on/off) render. Identical rig = registered sprites; a moved camera = sprites that visibly jump when the UI swaps them. If you ever must change the angle, re-render the element's entire state set.
