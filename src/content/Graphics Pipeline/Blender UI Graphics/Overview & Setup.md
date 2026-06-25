---
title: Overview & Setup
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 2
---
This is the foundation page. It explains the tools you'll use and why, the principles that keep every element consistent, and the one-time setup (asset library + render template) that everything else in this reference depends on. Do this setup once and every later recipe slots straight into it.

## Toolset

Three programs cover the whole pipeline, each doing the job it's actually good at.

- **Blender** — the workhorse, and free. It does all the 3D: modeling the shapes, applying materials, lighting, and rendering them out to images. It earns its central place for a second reason too — the same models you build here can later be exported as glTF/GLB files (with shape keys) for the live 3D visualizer in the plugin shell. So learning Blender pays off on both halves of the project: the flat pre-rendered sprites *and* the real-time visualizer geometry.
- **Krita** — a free painting program, used for anything hand-drawn: the wobbly hand-lettered titles, painted labels and icons, and any texture you want to paint by hand. It's chosen over GIMP specifically because it's built for freehand drawing and painting, where GIMP is clumsy. If you already own Photoshop it works for this too.
- **GIMP or Photoshop** — the raster editor for cleanup after rendering: trimming stray pixels off a render, fixing alpha edges, compositing pieces together, and stitching animation frames into a filmstrip.

**Canva** stays out of the pipeline except for flat typographic odds and ends; it's a layout tool, not a drawing or rendering tool.

## Core Principles

Four ideas underpin everything. Internalising them makes the rest of the reference make sense.

- **The jank is the style.** The retro "imperfect 3D" look comes from deliberately *not* doing what modern tutorials push: keep geometry simple, materials cheap (flat colour plus gloss, no fancy texture maps), lighting minimal, and let small imperfections stand. Over-polishing is what actually kills the aesthetic.
- **Non-destructive always.** Every edit should work on a copy or through a modifier, so the original survives. Modifiers (Bevel, Subdivision, Boolean) reshape without destroying the base mesh; duplicating before you alter something keeps the source intact. This mirrors the plugin's own asset rule — edits produce derived copies, never silent overwrites.
- **One locked rig = registered sprites.** "Registration" means two images line up pixel-for-pixel so the UI can swap one for another without anything jumping. Because your camera, light, and render settings all live in a single shared template file, every sprite rendered from it is framed and lit identically — so a button's normal and pressed states (or a backplate and the buttons on top of it) snap together perfectly in the interface.
- **Shared primitives pay forward.** Instead of rebuilding a button from scratch each time, you keep a small library of master shapes and one shared plastic material, and reuse and reskin them. Effort spent making one clean master shape repays itself across every variant.

> [!tip]
> One habit that prevents a lot of headaches: after scaling anything in Object Mode, press `Ctrl+A` ▸ **Scale** before adding a Bevel or Boolean. Non-uniform scale otherwise makes bevels uneven and booleans misbehave. `Ctrl+A` "bakes in" the current scale so the object behaves as if it were that size natively.

## Registering the Asset Library

An **asset library** is just a folder Blender watches; any `.blend` file you save inside it that contains "marked" assets (shapes, materials, node groups) will show those assets in the Asset Browser of *every* other file. This is how a shape you build in one file becomes draggable into all your other element files.

1. Open Preferences — Edit ▸ Preferences ▸ File Paths ▸ **Asset Libraries**.
2. Click the **+** button.
3. Point it at your `Cartridge_Assets` folder (this is where your element `.blend` files and master shapes live).
4. Close Preferences. The setting saves automatically.

From now on, anything you mark as an asset and save inside `Cartridge_Assets` is available across all your files. (Marking assets is covered on the Asset Reuse page.)

## Building the Template Rig

The **template** is a `.blend` file that contains a finished camera, light, world, and render settings — but no actual button. It's the starting point for every element you make, so that the framing and lighting are identical every time. You build it once.

1. **Start a fresh scene** — File ▸ New ▸ General. This gives you a default cube, a camera, and a light, all of which you'll repurpose.
2. **Make a stand-in to aim at.** You need something button-sized at the centre so you can frame the camera and aim the light, but it gets deleted before saving. Flatten the default cube into a placeholder: select it, press `S` `Z` `0.3` `Enter` (scale, constrained to the Z axis, to 30% height).
3. **Set up the light.** Switch the viewport to Rendered (the 4th shading sphere, top-right). Select the Light, press `G` `Z` and lift it above the stand-in, then nudge it to the front-left. In Light Properties (green bulb tab) raise **Power** until it's well lit and raise **Size** for a soft highlight. (The Lighting page covers this in full.)
4. **Set the camera angle.** Orbit with `MMB` drag to a gentle looking-down 3/4 angle, then press `Ctrl+Alt+Numpad0` to snap the camera to that view. Press `Numpad0` to look through it and confirm the framing, leaving margin around the stand-in. (The Camera page covers this in full.)
5. **Set the render output.** Render Properties (back-of-camera tab) ▸ Film ▸ tick **Transparent**. Output Properties (printer tab) ▸ set Resolution (e.g. 1024×1024), format **PNG**, colour **RGBA**. (The Render Settings page covers this in full.)
6. **Remove the stand-in.** Select the flattened cube and press `X` ▸ Delete. The file is now pure rig — camera, light, world, settings, nothing else.
7. **Save it.** File ▸ Save As, navigate into `Cartridge_Assets`, and name it `_button_template.blend`. The leading underscore sorts it to the top of the folder so it's easy to find. Press `Ctrl+S`.

> [!note]
> You can also build the template *from* a button file whose lighting and angle you already like: open that file, File ▸ Save As to `_button_template.blend` first (so you're now editing a copy), then select the button mesh and press `X` to delete it, leaving the camera and light. `Ctrl+S`.

## The Per-Element Routine

This is the loop you'll repeat for every button, knob, and panel. The golden rule is **Save As before you touch anything**, so the template stays pristine.

1. **Open the template** — File ▸ Open ▸ `_button_template.blend`.
2. **Save As immediately** — File ▸ Save As ▸ name it for the element (e.g. `green_play_button.blend`). The moment you save, you're working in a fresh copy and the template is safe and untouched.
3. **Add the element** — build the shape from this reference, or drag a master shape in from the Asset Browser.
4. **Apply the material** — drag in your shared Plastic node group and set the colour.
5. **Render the normal state** — `F12`, then in the render window Image ▸ Save As → `green_play_button.png`.
6. **Render the pressed state** — duplicate the shape in place (`Shift+D` then `Esc`), squash it (`S` `Z` `0.8`), darken the colour slightly, `F12`, save as `green_play_button_pressed.png`.

> [!danger]
> Never work directly in `_button_template.blend` and never re-aim its camera or light casually — that's the shared rig that keeps all your sprites registered. Always Save As to a new name first.
