---
title: Gotchas & Aesthetics
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 21
---
The traps that cost the most time, the general pitfalls to avoid, a fuller guide to nailing the look, and where this whole manual is heading (the batch pipeline).

## Blender 5.1.2 Gotchas

Version-specific surprises that have already bitten, each with the fix.

- **Mark as Asset moved to the Outliner.** It is *not* in the 3D-viewport right-click menu, and node groups can't be marked from the Shader Editor at all. **Fix:** objects → Outliner right-click ▸ Mark as Asset; node groups → Outliner ▸ switch display mode to **Blender File** ▸ Node Groups ▸ right-click ▸ Mark as Asset.
- **`Ctrl+G` exposes every input on a node group**, not just the one you wanted. **Fix:** it's cosmetic — grouping doesn't change the look. Just touch only the Colour input from outside; don't `Tab` in to edit the finish unless you mean to change every button using the group.
- **Catalogs are edit-locked on external libraries.** "New Asset Catalog" is greyed out unless you're viewing **Current File**. **Fix:** set the Asset Browser's library selector to Current File before making catalogs.
- **Assets drag in locked (uneditable).** That means the **Import Method** was set to **Link**. **Fix:** switch it to **Append** in the Asset Browser header, delete the locked copy (`X`), and re-drag.
- **Apply scale before Bevel or Boolean.** Non-uniform object scale makes bevels uneven and booleans misbehave. **Fix:** `Ctrl+A` ▸ Scale first, which bakes the current size in.
- **Metaballs must be converted.** You can't edit or normally use a metaball blob until you freeze it. **Fix:** Object ▸ Convert To ▸ Mesh.
- **Metal and glass look dead under nothing.** Reflective and transmissive materials need an environment to reflect/refract. **Fix:** add an HDRI or some fill light (see Lighting).

## General Pitfalls (Any Version)

- **Working directly in the template.** It overwrites your shared rig and desyncs everything. **Always Save As to a new name first.**
- **Re-aiming the camera between states.** A normal and pressed sprite from different angles won't register and will jump when swapped. **Keep the rig identical across an element's state set.**
- **Forgetting RGBA.** Ticking Film ▸ Transparent but saving as RGB discards the alpha, so the sprite keeps a background. **Save as PNG / RGBA.**
- **Editing the shared node group from inside.** Changing Roughness/Metallic inside the Plastic group changes *every* button at once. Only do it on purpose.
- **Over-polishing.** Clean topology, PBR maps, and crisp perfection actively kill this aesthetic. Restraint is the skill.

## The Aesthetic — A Fuller Guide

The Nubby's look is a specific flavour of "imperfect old 3D": blobby, plasticky, saturated, and just slightly uncanny. To hit it:

- **Keep geometry simple.** Rounded primitives, bevels, and subdivision — not careful hand-modelled topology. The slightly-too-smooth, slightly-too-simple read is the point.
- **Cheap plastic materials.** Flat saturated colour plus a glossy highlight, no texture maps. Two sliders (Metallic 0, Roughness ~0.35) do almost everything.
- **One soft key light.** A big Area light giving a broad, gentle highlight blob. Avoid hard pinpoint glares.
- **Saturated, slightly garish colours.** Bold blues, greens, oranges, reds — muddy or tasteful tones fight the look.
- **Embrace imperfection.** Slight asymmetry, wonky proportions, a console that isn't perfectly even. Don't fix everything — the hand-made wobble is character.
- **A touch of softness or grain.** A render that's a hair soft, or light grain added in post, reads more "old 3D" than crisp perfection.
- **Hardware sells the device.** Screws at the corners, jacks, pipes, wires, LEDs, and labels turn a flat panel into a believable physical object.

**What to avoid:** photoreal PBR materials, razor-crisp edges, tiny hard highlights, desaturated "tasteful" palettes, perfect symmetry. Every one of those pushes toward sterile modern 3D and away from the toy-shelf charm.

## Headless / Batch Pipeline (Future)

This entire manual — the template rig, the shape recipes, the shared material, the state and filmstrip conventions — is the **specification for an eventual Claude Code batch script**. Every decision documented here is something the script can reproduce automatically.

What that script would do, end to end:

1. Open `_button_template.blend` (the locked rig).
2. Load a master shape from the asset library.
3. Apply the Plastic material and set the colour.
4. Render the normal state, then generate and render the pressed/disabled states.
5. For animated controls, render the filmstrip frame sequence and stitch it into a strip.
6. Export everything with the correct naming convention into the asset library.

It runs without opening the Blender window, driven from the command line:

```bash
blender --background _button_template.blend --python render_element.py
```

> [!warning]
> Blender's Python API (`bpy`) shifts between versions, and tooling knowledge can be stale. When this script gets built (a Claude Code job, not a chat one), **pin the Blender version** and let it verify the current API against your actual install rather than trusting older examples — the same reason the 5.1.2 gotchas above caught us by surprise.
