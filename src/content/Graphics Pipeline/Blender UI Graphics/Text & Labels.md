---
title: Text & Labels
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 16
---
Text on your panels and caps can be made three ways, and the right one depends on whether the lettering should behave like real 3D (catching light and shadow) or sit flat and crisp. This page covers each route in full, plus how to handle the hand-lettered title look and small icon glyphs.

## How to Approach Labels

- **Model it in 3D** (extruded, engraved, or embossed) when the label is *part of the object* and should catch the scene's light — a stamped nameplate, a logo molded into a cap, raised lettering. It renders with everything else.
- **Paint it in Krita and composite** when you want flat, crisp text or the wobbly hand-lettered look — the title in the reference, or small UI labels that must stay sharp.
- **Apply it as a texture** on a surface when you want printed-on graphics that follow the surface but don't need real depth.

Pick by asking: should the text have physical depth and shadow (model it) or just sit flat and clean (paint it)?

## 3D Extruded Text

**Use:** raised dimensional lettering that catches light — logos, big titles, embossed caps.

1. Add text: `Shift+A` ▸ **Text**. A flat "Text" object appears.
2. Edit the string: press `Tab` to enter text-edit mode (a cursor appears, like a tiny word processor), delete the placeholder, type your label, then `Tab` to exit.
3. Pick a font: in the text's **Object Data Properties** (the "a" icon) ▸ Font ▸ Regular, open a `.ttf`/`.otf` font file. The default Blender font is plain — load one with character for this aesthetic.
4. Give it depth: still in Object Data ▸ **Geometry** ▸ raise **Extrude** to push the flat letters out into 3D. Add a little **Bevel ▸ Depth** here too for softened letter edges.
5. To boolean or sculpt it, convert to a mesh: Object ▸ Convert To ▸ **Mesh**.
6. Apply a material; right-click ▸ Shade Smooth (or leave it faceted for a blocky look).

- **Tip:** the hand-lettered red title in the reference is better *painted* (below) than typed — fonts look too clean and even for that deliberate wobble.

## Engraved Text

**Use:** lettering recessed into a surface — a stamped nameplate or a panel label.

1. Make 3D extruded text (above) and position it so it slightly overlaps *into* the surface you're labelling (`G` to push it partway in).
2. Convert the text to a mesh: Object ▸ Convert To ▸ **Mesh**.
3. Carve it: select the surface, add a **Boolean** modifier ▸ Difference ▸ the text object. Boolean Difference subtracts the letter shapes, leaving recessed grooves.
4. Apply the modifier; delete the text object (`X`). The grooves catch shadow and read as engraving.

## Embossed Text

**Use:** raised lettering standing proud of a surface.

1. Make 3D extruded text and place it sitting *on* the surface (not into it).
2. Either leave it as a separate raised object, or Boolean-Union it to the surface so they become one piece.
3. A slight Bevel on the letters softens them into a molded, embossed look.

## Painted Labels & Icons (Krita)

**Use:** crisp flat UI labels and the hand-lettered title look — the most flexible route.

1. In Krita, make a canvas with a **transparent background** at your sprite resolution.
2. Paint or type the label/icon. For the wobbly hand-drawn title, paint it freehand with a textured brush; for clean UI labels, use Krita's text tool.
3. Export as a PNG with transparency.
4. Use it either by (a) compositing it over your rendered sprite in GIMP/Krita afterward, or (b) plugging it as a texture into a material's Base Colour on a thin plane laid on the surface, so it renders with the scene.

- **Tip:** painting keeps full control over wobble, weight, and colour, and sidesteps the "too clean" look a font gives.

## Font & Style Notes

- Rounded, chunky, slightly childish fonts suit the aesthetic; thin elegant fonts fight it.
- For the main title, hand-painting beats any font.
- Keep text high-contrast against its surface so it reads at small sizes.
- A subtle drop shadow — painted, or coming from real 3D depth — helps text pop off a busy panel.

## Icon Glyphs

**Use:** simple symbols (play, power, gear) on buttons.

1. Easiest: paint the glyph in Krita and apply it like a painted label.
2. Or model it: build the symbol from simple shapes (a triangle for play, a square for stop) and emboss or engrave it on the cap.
3. Keep glyphs bold and simple so they read clearly at button size.
