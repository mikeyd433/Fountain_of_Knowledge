---
title: Displays & Meters
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 13
---
Displays differ from other elements in one key way: they're **self-lit**. Instead of relying on the scene's light to show their surface, they use an **Emission** material — a surface that glows on its own. Most also sit in a recessed screen well and benefit from **Bloom** (a render setting that makes bright areas spread a soft halo) so they read as genuinely lit. Recurring techniques here: recessing a face (Inset then Extrude down), Emission materials, and the **Array** modifier for grids of dots or segments. Finish solid parts with right-click ▸ Shade Smooth.

## LCD / Screen Inset

**Use:** a glowing rectangular screen set into a panel — the base for most readouts.

1. Host panel: `Shift+A` ▸ Mesh ▸ **Cube**, flatten `S` `Z` `0.15`, add a **Bevel** modifier for soft edges; right-click ▸ Shade Smooth.
2. Recess the screen well: enter Edit Mode `Tab`, select the top face, **Inset** with `I` to make a smaller inner face (the screen border), then **Extrude** down with `E` `Z` to sink it below the surface; `Tab` out. The sunken face is the screen.
3. Light the screen: give that inner face an **Emission** material. In Edit Mode, with the screen face selected, add a second material slot, Assign it, and set its Emission Colour to a screen tint (cyan/green/amber) at Strength ~2–4. Emission makes the surface glow on its own rather than depending on scene lights.
4. The readout: paint the digits/graphics in Krita and apply as a texture on that face, or leave it an abstract glowing panel.

- **Tip:** enable **Bloom** in Render settings so the screen's glow spreads softly past its edges and sells the "it's lit" effect.

## Seven-Segment Digit

**Use:** a classic calculator/clock numeral made of seven lit bars.

1. Model one segment: `Shift+A` ▸ Mesh ▸ **Cube**, scaled into a short stretched bar (bevel the ends for the stadium look). This is one of the seven strokes.
2. Build the figure-8: duplicate the segment with `Shift+D` and arrange seven copies into the classic figure-8 — two verticals per side plus three horizontals (top, middle, bottom). Rotate the horizontals with `R` `Z` `90`; position each with `G`.
3. Material: give all segments an **Emission** material. To show a specific numeral, set the *lit* segments to high Emission Strength (~3) and the *off* segments near zero.
4. Combine digits side by side for a multi-digit counter.

- **State:** render each numeral 0–9 by toggling which segments glow.

## Dot-Matrix Panel

**Use:** a grid of small glowing dots that form characters or patterns.

1. One dot: `Shift+A` ▸ Mesh ▸ **UV Sphere** (or a flat Circle), small, flattened slightly with `S` `Z` `0.6`; Shade Smooth.
2. Make a row: add an **Array** modifier (Modifier Properties ▸ Add ▸ Array), set **Count** and a small **Factor X** offset so copies march sideways with a gap.
3. Make the grid: add a *second* Array modifier, set its **Count** and a **Factor Y** offset so the row repeats downward into a full grid.
4. Material: **Emission**. Drive patterns by varying dot brightness, or by painting the pattern as a texture across the grid.

- **Tip:** the two-Array trick (one for X, one for Y) is the standard way to build any regular grid.

## LED Matrix

**Use:** a bolder, brighter dot grid — chunky glowing LEDs for status or simple animation.

1. One LED: `Shift+A` ▸ Mesh ▸ **UV Sphere**, small, flattened slightly (`S` `Z` `0.6`); Shade Smooth — slightly domed so it catches a highlight.
2. Grid it with two **Array** modifiers (a Factor X offset for the row, a Factor Y offset for the columns), exactly as in the dot-matrix.
3. Material: **Emission** at higher Strength (~4) for a strong glow; turn on **Bloom** in Render settings for the LED halo.

- **State:** toggle individual LED brightness for patterns, or drive the whole grid from a texture.

## VU / Bargraph Meter

**Use:** a level meter — a row of segments that light up cumulatively from low to high.

1. One segment: `Shift+A` ▸ Mesh ▸ **Cube**, scaled into a small rectangular bar.
2. Make the row: an **Array** modifier with a Count and offset so the bars line up in a strip.
3. Colour zones: give the low segments a green **Emission**, the middle amber, the top red — the classic meter ramp.

- **State:** to show a level, light segments cumulatively (low→high); render a filmstrip with progressively more segments glowing.

## Oscilloscope Screen

**Use:** a screen showing a glowing waveform trace.

1. Screen recess: build a panel (`Shift+A` ▸ Mesh ▸ Cube → flatten → Bevel), then `Tab`, select the top face, `I` inset, `E` `Z` push down to sink a screen well; `Tab` out.
2. Screen face: give the recessed face an **Emission** material in a phosphor colour (green or cyan).
3. The waveform: paint a glowing trace in Krita and apply as a texture on the face, **or** model a thin glowing line — `Shift+A` ▸ Curve ▸ **Bezier**, shape it into a wave, give it a small **Bevel Depth** (Object Data ▸ Geometry ▸ Bevel) so it has thickness, and an Emission material — laid across the screen.

- **Tip:** Bloom makes the trace bleed light convincingly.

## Halo / Indicator Ring

**Use:** a glowing ring around a control or button that signals "active."

1. Ring: `Shift+A` ▸ Mesh ▸ **Torus** with a small Minor Radius for a thin ring; squash `S` `Z` `0.5`; place it around the control it indicates.
2. Material: **Emission** in the indicator colour; right-click ▸ Shade Smooth.

- **State:** `_off` (Emission Strength 0) and `_on` (Strength ~3); enable Bloom for the lit halo.

## Nixie-Style Tube

**Use:** a retro glowing-numeral tube under a glass dome — warm orange digits, very vintage.

1. Numeral: `Shift+A` ▸ **Text**, type a digit, `Tab` out; Object Data ▸ Geometry ▸ **Extrude** for slight depth; **Emission** material in warm orange at Strength ~3.
2. Dome: `Shift+A` ▸ Mesh ▸ **UV Sphere** placed over the numeral; **Glass** material — Principled BSDF ▸ Transmission Weight 1, Roughness ~0.05 — so the digit shows through clear glass.
3. Base: a short `Shift+A` ▸ Mesh ▸ **Cylinder** (Vertices 24) collar under the dome.
4. Enable **Bloom** so the digit glows through the glass.

- **Watch for:** glass needs an environment (HDRI or fill light) to read; under a black void it looks like a grey blob.

## Geometry vs Texture for Readouts

> [!note]
> See **Materials** for the Emission setup and **Modifiers in Depth** for the Array used to build dot/segment grids.

You can build a readout two ways, and choosing right saves real time:

- **Model the geometry** (individual segments, dots, bars) when the lit elements must toggle or move independently, or catch real 3D light — seven-segment digits, VU bars, an animated LED grid.
- **Paint a texture** (made in Krita, plugged into an Emission material's Colour) when the readout is a fixed or 2D-changing image — a waveform, an icon, a labelled LCD face.

Textures are far lighter and faster; geometry gives real depth and per-element control. Many displays mix both: a modelled recessed screen with a painted glowing face.

## Troubleshooting Displays

- **Screen glow too weak** → raise Emission Strength, and enable **Bloom** in Render settings.
- **Glow blows out / washes the scene** → lower Strength, or reduce Bloom intensity and raise its threshold.
- **Glass dome renders black** → nothing to refract; add an HDRI or a fill light.
- **Emissive face looks bright but doesn't *glow*** → Bloom is off; turn it on for the halo bleed.
- **Dot or segment grid is uneven** → Array offsets inconsistent; use Relative Offset with matching counts.
