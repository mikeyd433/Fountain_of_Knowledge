---
title: Filmstrips & Composing
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 19
---
Two related jobs live here: making **filmstrips** (animated controls — a knob turning, a meter filling), and **composing** finished elements into a full panel. Both come down to one principle you've seen throughout: static structure renders once, and anything that moves or changes is captured as separate frames or sprites, all from the locked rig so they line up.

## Filmstrips / Animation

### What a Filmstrip Is

A filmstrip is a single image holding a row (or grid) of animation frames laid side by side. The UI shows one frame at a time to animate something — a knob rotating, a fader sweeping, a pad pressing, a meter filling, an LED blinking. You make the frames by animating a property in Blender, rendering the animation to a numbered image sequence, then stitching those frames into one strip.

### Animating a Property (Keyframes)

A **keyframe** records "at this frame, this property has this value." Set two and Blender fills in the motion between them.

1. Decide what changes — **rotation** (knob), **location** (fader cap), **scale** (pad squash), or a **shape-key Value** (a press morph).
2. Set the start: in the Timeline at the bottom, go to frame **1**. Set the property to its starting value, then hover over that property's field and press `I` to insert a keyframe (or right-click ▸ Insert Keyframe).
3. Set the end: go to a later frame (e.g. **24**). Change the property to its end value (rotate the knob, slide the cap), and press `I` again.
4. Blender interpolates the in-between frames — scrub the Timeline to preview the motion.
5. For mechanical UI motion you usually want constant speed, not the default ease-in/out: select the keys in the Graph Editor (or right-click them) ▸ Interpolation Mode ▸ **Linear**.

### Setting the Frame Range

1. Output Properties ▸ **Frame Start** and **Frame End** — set these to the range you animated (e.g. 1 to 24). Only these frames render.
2. Sensible counts: 12–24 frames for a smooth knob turn, 4–8 for a pad velocity ramp, 2 for an LED blink.

### Rendering the Animation

1. Output Properties ▸ set an **Output folder** and base filename; keep format **PNG / RGBA**, and Film ▸ **Transparent** on (same as stills).
2. Render the whole range: **Render ▸ Render Animation** (`Ctrl+F12`). Blender renders every frame in the range and saves a numbered sequence (`name0001.png`, `name0002.png`, …).
3. This takes a while — each frame is a full render — so keep frame counts as low as the motion allows.

### Stitching Frames into a Strip

The UI usually wants the frames combined into one strip image.

1. In GIMP or Krita, make a canvas sized to hold all frames in a row: **frame width × frame count** wide, by the frame height (or a tall canvas for a vertical strip).
2. Place each frame side by side in order, with **no gaps and uniform spacing** — the UI slices the strip assuming every frame is the same width.
3. Export as a single PNG.

> [!note]
> This stitching is exactly the repetitive job the future batch script should automate — render the frame sequence, then assemble the strip — so the manual process here is the spec for that tool.

### Filmstrip vs Separate Sprites vs Movable Sprite

- **Filmstrip** — for continuous motion: knob rotation, fader sweep, meter fill, press morph, blink.
- **Separate state sprites** — for discrete states: normal/pressed/disabled, on/off.
- **Movable sprite** — when the UI itself slides a piece (a fader cap travelling the track) rather than playing frames; render that piece once and let the layout move it.

## Composing Panels

### Overview

Composing is assembling multiple elements into a full device face. The governing rule: **static structure renders once as a single sprite; interactive elements render separately and layer over it.**

### Placement Tools

- **3D cursor** — `Shift+RMB` places it; new objects appear there, and it can act as a pivot or snap target. `Shift+C` recenters it and frames everything.
- **Snapping** — the magnet icon in the header (toggle with `Shift+Tab`) snaps your moves to vertices, edges, or the grid for clean alignment; pick the snap target in the dropdown beside the magnet.
- **Exact coordinates** — `N` ▸ **Item** tab shows and lets you type precise Location and Rotation for pixel-perfect placement.
- **Parenting** — select the children, shift-select the parent last, `Ctrl+P` ▸ Object. Now moving the parent moves them all together — e.g. parent a group of buttons to their console.

### Building Order

1. **Build the static structure first** — backplate, console, bezel, sockets, pipes, hardware — and position it all.
2. **Lay the interactive elements in place** where they'll sit, so you can judge the whole composition: spacing, alignment, breathing room.
3. Once the layout looks right, render each piece.

### Render Strategy (Static vs Interactive)

- **Static** (console, backplate, bezel, pipes, wires, hardware, stone) → render **once** as a single sprite. It never changes at runtime.
- **Interactive** (buttons, toggles, knobs, faders, LEDs) → render **each** separately, with its full state set.
- To render one piece alone, hide everything else with the Outliner eye icons, then `F12`.
- Everything comes from the same locked rig, so all the separate sprites register against the backplate.

### Layering in the Layout

- The backplate sprite sits at the bottom.
- Interactive element sprites layer over it at their positions, each referencing its own state sprites or filmstrip.
- Because every piece was rendered from the same camera at the same resolution, they drop into place aligned.

> [!tip]
> Render the whole composed panel once as a reference image. Then, when you place each element's individual sprite in the layout, you know exactly where it belongs.
