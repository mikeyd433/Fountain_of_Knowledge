---
title: Start Here — Reference Index
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 1
---
This is the front door to the Blender UI Graphics reference — a complete workflow for authoring the plastic, fidget-popper-style UI assets for Satisfaction Plugins. It runs from first-time setup, through the core modeling craft, into a catalog of ~90 buildable elements, and out to states, reuse, and rendering. Use this page to find where anything lives.

## How the Reference Is Organised

Four blocks, in order:

- **Foundation (1–5)** — the locked rig every asset shares: setup, camera, lighting, render, materials.
- **Modeling Craft (6–9)** — the cross-cutting skills every build relies on: mesh fundamentals, the Edit Mode toolkit, modifiers, and clean geometry. *Read these before the catalogs and the per-shape recipes stop feeling like magic.*
- **Catalog (10–14)** — the actual shapes: buttons, controls, displays, surfaces, props.
- **Workflow (15–20)** — finishing and reuse: text, states, assets, filmstrips, shortcuts, the look.

Read it front-to-back once, then treat it as a lookup.

## The 21 Pages

**Foundation — the shared rig**
- **1 · Overview & Setup** — the project, the template-file system, registering the asset library.
- **2 · Camera** — framing, the snap-to-view trick, lens and angle per element type.
- **3 · Lighting** — the one-soft-key-light setup that gives the glossy highlight blob.
- **4 · Render Settings** — transparent PNG / RGBA output, resolution, Bloom.
- **5 · Materials** — the shared "Plastic" node group, plus Metal, Rubber, Glass, Emission, Stone.

**Modeling Craft — how to actually build**
- **6 · Modeling Fundamentals** — mesh anatomy, primitives, modes, origins, pivots, applying scale, the modeling loop.
- **7 · The Edit Mode Toolkit** — every core edit operation: extrude, inset, loop cut, bevel, knife, merge, bridge, spin, fill, proportional editing.
- **8 · Modifiers in Depth** — the stack, and every modifier used here: Bevel, Subdivision, Mirror, Array, Boolean, Solidify, Screw, Simple Deform, Cast.
- **9 · Smoothing, Normals & Clean Geometry** — shade smooth vs auto smooth, normals, n-gons, artifacts, the pre-asset cleanup checklist.

**Catalog — what to build**
- **10 · Buttons & Keys** — 27 button shapes, plus combining and troubleshooting.
- **11 · Continuous Controls** — 14 knobs, faders, wheels, pads, plus the assembly pattern.
- **12 · Displays & Meters** — 8 self-lit screens, segments, LEDs, meters.
- **13 · Surfaces & Panels** — 20 backplates, consoles, bezels, housings, structure.
- **14 · Props & Hardware** — 23 pipes, wires, jacks, screws, plus curve-based props.

**Workflow — finishing and reuse**
- **15 · Text & Labels** — modeled, painted, engraved, and embossed lettering.
- **16 · Interactive States** — the deep one: every way a button can press, plus all other states.
- **17 · Asset Reuse** — marking assets, catalogs, Append vs Link.
- **18 · Filmstrips & Composing** — animating controls and assembling full panels.
- **19 · Shortcut Reference** — every hotkey used here, grouped by task.
- **20 · Gotchas & Aesthetics** — version traps, pitfalls, the look, and the future batch pipeline.

## Element Index

Every buildable element, by type. Each lives on the page named beside its group.

**Buttons & Keys** (→ page 10): Dome / Popper · Tall Dome / Bubble · Squircle · Arcade Puck · Capsule / Pill · Rectangular Key · Dished / Concave · Hex / Faceted · Ring / Torus · Concentric Ring · Triangle / Play · Octagon / Stop · Diamond / Rhombus · Faceted Gem · Teardrop / Blob · Pebble / Organic · Pillow · Gumdrop · Long Bar · Half-Pill / D-Shape · Stacked / Tiered · Mushroom / E-Stop · Cross / Plus · D-Pad · Chiclet · Heart · Soft Star / Flower.

**Continuous Controls** (→ page 11): Basic Knob · Skirted Knob · Encoder (Knurled) · Chicken-Head Knob · Rotary Selector · Fader / Slider · Crossfader · Pitch Wheel · Mod Wheel · XY Pad · Ribbon Controller · Joystick / Thumbstick · Jog Wheel / Shuttle · Trackball.

**Displays & Meters** (→ page 12): LCD / Screen Inset · Seven-Segment Digit · Dot-Matrix Panel · LED Matrix · VU / Bargraph Meter · Oscilloscope Screen · Halo / Indicator Ring · Nixie-Style Tube.

**Surfaces & Panels** (→ page 13): Flat Backplate · Soft Console Blob (Metaball) · Soft Console (Beveled Slab) · Button Socket / Recess · Recessed Tray / Well · Bezel / Frame · Cartridge / Device Body · Rounded Pod / Capsule Housing · Raised Boss / Pedestal · Channel / Groove · Nameplate / Label Plate · Layered / Tiered Panels · Split-Seam Panel · Curved / Wraparound Panel · Corner Bracket · Handle / Tab / Grip · Perforated Panel · Grille / Vent · Hinged Lid · Stone / Slate Background.

**Props & Hardware** (→ page 14): Pipe / Tube · Pipe Elbow / Joint Ball · Wire / Cable · Patch-Cord Plug End · Jack / Port · MIDI DIN Socket · USB Slot · Knurled Nut / Collar · Screw / Bolt · Rivet · Rubber Foot · Heat-Sink Fins · Hinge Knuckle · Latch / Clasp · LED / Indicator Dome · Antenna / Aerial · Spring / Coil · Gear / Cog · Vent Louver · Standoff Post · Bumper / Corner Guard · Chain Link · Sticker / Decal.

## Core Techniques Index

The recurring moves, and where each is taught in full:

- **Extrude, Inset, Loop Cut, Bevel edges, Knife, Merge, Bridge, Spin, Proportional Editing** → page 7 (Edit Mode Toolkit).
- **Bevel, Subdivision, Mirror, Array (incl. radial via Empty), Boolean, Solidify, Screw lathe/helix, Simple Deform, Cast** → page 8 (Modifiers in Depth).
- **Shade Smooth, Auto Smooth, Normals, Merge by Distance, Non-Manifold, cleanup checklist** → page 9.
- **Origins, pivots, applying scale, the modeling loop** → page 6 (Fundamentals).
- **Recess combo (Inset + Extrude down), curve-to-tube, the radial Array** → introduced on pages 7–8, applied throughout the catalogs.

## The Through-Lines

A few principles recur on every page — internalise these and the rest follows:

- **One locked rig.** Build from `_button_template.blend` (Save As first), so every sprite shares the same camera, light, and settings, and registers cleanly when the UI swaps or layers them.
- **Static once, interactive separately.** Structure (console, backplate, hardware) renders once; buttons and controls render per element, each with its full state set.
- **Build a master once, reuse forever.** Mark shapes and the Plastic material as assets, so they're a drag away in any file.
- **Clean geometry before you commit.** Apply scale, recalc normals, merge doubles, then Shade Smooth — a model that passes the page-9 checklist behaves the same forever.
- **Embrace imperfection.** Simple geometry, saturated plastic, soft light, a little wonkiness — restraint is the skill, and polish is the enemy of the look.
- **The manual is a spec.** Every routine here is something the future Claude Code batch script can automate.

## Importing & Updating in the Reader

Each page is one `.md` file in this folder. Drag them in to import. When you revise a page later, only that page's file needs re-importing — the others are untouched.

> [!note]
> The `category` and `section` fields in every page's frontmatter are set to **Graphics Pipeline ▸ Blender UI Graphics**. If you'd rather file these under a different section name (e.g. "Asset Creation"), it's a one-line edit at the top of each file.
