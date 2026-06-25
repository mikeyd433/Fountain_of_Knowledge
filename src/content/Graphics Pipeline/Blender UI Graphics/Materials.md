---
title: Materials
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 6
---
A material is the surface description that tells the renderer how light behaves on a shape — its colour, shininess, whether it's plastic or metal or glass. In Blender almost every material is built from one master shader node called the **Principled BSDF**, which has a handful of sliders that, in combination, can describe nearly any real surface. This page explains how to create and assign materials, then gives a full recipe for each surface you'll need, with what every setting does and why.

## How Materials Work Here

1. **Create:** Material Properties (the checkered-sphere tab in the Properties panel) ▸ **New**. This makes a default Principled BSDF material with all its inputs (Base Colour, Metallic, Roughness, and more).
2. **Preview:** set the viewport to **Material Preview** (the 3rd shading sphere, top-right) to see the material lit by a built-in studio environment, or **Rendered** (4th) to see it under your actual scene lights.
3. **Assign:** a new material applies to the selected object automatically. To reuse an existing material on another object, click the **browse** icon (small sphere/dropdown) just left of "New" and pick it from the list.

The two sliders that do almost all the work are **Metallic** (is this metal? 0 = no, 1 = yes) and **Roughness** (how blurry are reflections? 0 = mirror-sharp/wet, 1 = totally matte). Most of the recipes below are just different settings of those two plus a colour.

## Plastic (the workhorse)

The default toy-button surface — flat saturated colour with a glossy highlight.

- **Base Colour** — a bold, saturated popper colour. Muddy tones fight the look.
- **Metallic** — **0**. Plastic isn't metal; this is what keeps it reading as a toy rather than chrome.
- **Roughness** — **~0.35**. This sits in fidget-popper territory: glossy but not a mirror. Lower (0.2) looks wetter and shinier; higher (0.5) looks more matte and rubbery.
- Leave every other setting at default — no coat, no texture maps. The plainness *is* the aesthetic.

## The Shared Plastic Node Group

Rather than give every button its own copy of the plastic recipe, you bake the recipe once into a reusable **node group** that exposes only a colour input. Then every button uses that group and just plugs in its own colour, so the finish stays identical across the whole set and you can tweak it everywhere from one place.

1. Open the **Shading** tab (top bar). The Shader Editor appears at the bottom, showing a **Principled BSDF** wired into **Material Output**.
2. Click only the Principled BSDF node, press `Ctrl+G` to wrap it in a group. Blender drops you *inside* the group.
3. Inside, make sure a single **Colour** input feeds the Base Colour, and that Metallic is 0 and Roughness ~0.35.
4. Press `Tab` to step out, and rename the group to **Plastic** in the header.
5. From now on, per button you change *only* the group's Colour input — the finish is locked inside.

> [!warning]
> In Blender 5.1.2, `Ctrl+G` exposes *all* of the Principled BSDF's inputs on the group, not just Colour. This is cosmetic clutter only — grouping doesn't change how the button looks. Just touch only the Colour input from outside; don't `Tab` into the group to edit Roughness/Metallic unless you intend to change *every* button that uses it.

## Metal

For jacks, screws, knurled nuts, antennas — any hardware.

- **Metallic** — **1**. This flips the surface to metal: its colour now tints reflections rather than showing as a flat paint colour.
- **Roughness** — **~0.3–0.5**. Lower = polished chrome; higher = brushed/satin steel.
- **Base Colour** — a grey or steel tone (a warm tint for brass/gold, blue-grey for steel).

> [!note]
> Metal only looks like metal if there's something for it to reflect. Under a black void it reads dull and grey. Give the scene an HDRI or some fill light (see the Lighting page) so the metal has an environment to mirror.

## Emission (Glow)

For LEDs, screens, lit rings — anything that emits its own light.

- On the Principled BSDF, set **Emission Colour** to the glow colour (green, red, amber…).
- Set **Emission Strength** to ~2–5. Higher glows brighter; 0 means no glow.
- Turn on **Bloom** in Render settings so the glow spreads into a soft halo and genuinely reads as lit, not just brightly painted.

## Stone / Slate

For the dark, rough background slab in full-scene renders.

- **Base Colour** — dark, desaturated (near-black charcoal).
- **Roughness** — **~0.8** (matte, no shine — rock isn't glossy).
- **Metallic** — 0.
- For surface relief, add a **Noise Texture** node and plug it into Base Colour (for mottling) and/or into a **Bump** node feeding the Normal input (for fake bumpiness without modeling it).

## Rubber / Soft-Touch

For feet, ribbon controllers, grips, matte buttons.

- **Roughness** — **~0.6–0.7** (soft, diffused — no sharp highlight).
- **Metallic** — 0.
- **Base Colour** — usually dark. The look is a velvety, non-reflective surface.

## Brushed Metal

A directional, satin metal for a more industrial hardware look.

- Start from the **Metal** recipe (Metallic 1).
- Plug a **Noise Texture**, stretched along one axis (scale it non-uniformly in its mapping), into the **Roughness** input. The streaky roughness variation reads as a brushed grain.

## Glass / Screen Cover

For nixie domes and clear covers over screens.

- **Transmission Weight** — **1**. This makes the surface transmit light through it (see-through) like glass.
- **Roughness** — very low (~0.05) for clear glass; raise it slightly for frosted.
- Glass needs an environment (HDRI/fill) to refract and reflect, or it looks like a flat grey blob.

## Glossy Enamel

A wet, candy-coated version of plastic.

- Same as Plastic but **Roughness ~0.15** — much shinier, with a tight bright highlight. Good for a premium, lacquered button.

## Translucent / Back-lit

For buttons that should glow when active, with light shining through the cap.

- Light **Base Colour**, plus a modest **Transmission** so some light passes through.
- Place a hidden **emissive plane** just behind/inside the cap; when it's on, light glows through the translucent plastic. Drive that plane's Emission Strength for the on/off state.

## Printed Graphic on Plastic

For caps with a logo or label printed on them.

- Build the Plastic finish, then plug a **texture** (a graphic you painted in Krita, saved with transparency) into the **Base Colour** so the artwork sits on the coloured plastic.

## Wear / Grime

To break up clean surfaces with scuffs and fingerprints — and imperfection is on-style.

- Mix a **Noise Texture** into the **Roughness** input so some patches are duller (greasy) and others shinier.
- Or darken the Base Colour in patches. Keep it subtle; a little reads as character, a lot reads as dirty.

> [!tip]
> Save each finished material as a node-group asset so it's one drag away in any file: Outliner ▸ switch display mode to **Blender File** ▸ expand **Node Groups** ▸ right-click ▸ Mark as Asset. Keep them together in a "Materials" catalog.
