---
title: Render Settings
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 5
---
Rendering is the step that turns your 3D scene into a flat 2D image. For this pipeline the output is always a **transparent PNG** — the button on a see-through background — so it can be dropped onto a panel or swapped between states in the UI without a background box around it. This page explains every setting that matters, why, and the exact steps to render and save.

## Choosing the Render Engine

Render Properties (the back-of-camera icon in the Properties panel) ▸ **Render Engine**. Blender has two main engines:

- **Eevee** — a fast, real-time engine. It approximates light rather than fully simulating it, which gives a slightly "game-like" look that actually suits the retro aesthetic, and it renders in a second or two. **Use Eevee.** For the glossy plastic shine, enable **Screen Space Reflections** in its settings so surfaces pick up reflective highlights.
- **Cycles** — a physically accurate ray-tracer. Cleaner and more realistic, with true reflections and soft shadows, but much slower (seconds to minutes per frame). You don't need its realism for cheap plastic, and the speed cost adds up across dozens of sprites and filmstrip frames. Reach for it only if you want a polished hero render.

Set this once in the template so every element uses the same engine.

## Transparent Background (Alpha)

By default a render has a solid background. You want no background at all, so the PNG carries an **alpha channel** — the invisible fourth channel that records, per pixel, how opaque or transparent it is.

1. Render Properties ▸ **Film** section ▸ tick **Transparent**.

That's it — now the world/background renders as fully transparent, and only your lit element shows up, with soft anti-aliased edges fading cleanly to nothing. Without this, you'd get your button sitting on a grey or sky-coloured square, which is useless for compositing.

> [!warning]
> Transparent only *produces* alpha in the render. You also have to **save** in a format that *keeps* alpha — that's the RGBA setting below. Tick Transparent but forget RGBA and the saved file will have a solid background anyway.

## Resolution & Aspect

Output Properties (the printer icon) ▸ **Resolution X** and **Resolution Y** set the pixel dimensions, and their ratio sets the frame's shape.

- For individual buttons, a square like **1024×1024** is a good default — generous detail, and square frames the round/blocky shapes neatly.
- For wide panels or consoles, use a wider resolution (e.g. 2048×1024) so the whole piece fits without cramming.
- **Resolution sets the frame shape, so it affects your camera framing.** Decide resolution *before* you finalise the camera, or your careful framing will shift when you change it.
- Powers of two (512, 1024, 2048) are friendly to game/UI engines and scale cleanly.

## File Format & Colour

Output Properties ▸ scroll to the output format section.

- **File Format: PNG** — lossless (no compression artefacts) and supports transparency. The right choice for crisp UI sprites with clean edges.
- **Colour: RGBA** — R, G, B, *and* Alpha. The **A** is what actually saves the transparency. If this is set to plain RGB, the alpha is discarded and you lose the cutout. This is the single most common "why does my button have a background?" mistake — check it's **RGBA**.
- **Colour Depth: 8-bit** is fine for UI sprites. 16-bit doubles file size for smoother gradients you won't notice here.

## Quality & Samples

Render Properties ▸ **Sampling**:

- **Render Samples** — how many passes the engine averages. Higher = smoother edges and shadows but slower. If your render looks grainy or noisy (especially in soft shadows or reflections), raise this. For simple plastic buttons the default is usually plenty.
- **Ambient Occlusion** (Eevee setting) — adds subtle soft shadowing where surfaces meet, giving a little extra grounding and depth. Optional but nice.
- **Bloom** — makes bright/emissive areas glow with a soft halo. Turn this on when rendering LEDs, screens, or any Emission material so they read as genuinely lit rather than just brightly coloured.

## The Render-and-Save Steps

1. Frame the element through the camera (`Numpad0` to check).
2. Press `F12` to render. A separate render window opens and the image appears.
3. In that window: **Image ▸ Save As**, choose a location, confirm the format is PNG/RGBA, and save. Give it a clear, state-tagged name (see below).
4. Close the render window (or just switch back) and move on to the next state or element.

> [!tip]
> The render reflects whatever is currently *visible*. To render one element alone in a busy file, hide the others using the eye icons in the Outliner, then `F12`.

## Naming Conventions

Consistent filenames are what let the UI find the right sprite for each state, and what lets the future batch script process them automatically. Tag every file with its element and its state.

```
green_play_button.png            (normal / resting)
green_play_button_pressed.png    (pressed / active)
green_play_button_disabled.png   (greyed out)
led_status_on.png   led_status_off.png
knob_filter_01.png … knob_filter_24.png   (filmstrip frames)
```

The pattern is `element_descriptor_state.png`, with numbered suffixes (`_01`, `_02`, …) for animation filmstrips. Pick a convention and never deviate — half the value of a sprite set is being able to predict its filenames.
