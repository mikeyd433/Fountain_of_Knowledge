---
title: Lighting
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 4
---
Lighting is what makes a flat-coloured plastic shape read as a glossy, molded toy button. The whole Nubby's look hinges on one thing: a single soft light producing a big, broad highlight blob sliding across the surface. This page covers every light type, how to build and tune your key light, what each setting does, and how to fix the common problems. Like the camera, your lighting lives in the template so every sprite shares it.

## Light Types In Depth

Add any light with `Shift+A` ▸ Light ▸ … . Each behaves differently:

- **Area** — a glowing rectangular (or disk) panel that emits from its surface. Its physical size controls how soft the shadows and highlights are: a big Area light gives the broad, gentle highlight this style lives on. **This is your default and usually your only light.**
- **Point** — an omnidirectional bulb radiating in all directions from a single spot. By default it casts hard shadows; raise its **Radius** to soften them. Useful as a small fill or a glint.
- **Sun** — perfectly parallel rays that light everything evenly regardless of distance, like real sunlight. Its **Strength** is irradiance (not Watts), and its **Angle** setting controls shadow softness. Good for flat, even, shadow-light scenes; less characterful than an Area light for glossy plastic.
- **Spot** — a cone of light, with a **Spot Size** (cone angle) and **Blend** (edge softness). Use it for a theatrical pooled highlight or to rake light across one element.

> [!tip]
> When in doubt, use one Area light. It produces the soft highlight blob with the least fuss, and the rest of this page assumes it.

## Building Your Key Light (Step by Step)

The "key" is your main, brightest light — the one that defines the look.

1. **See real light first.** In the top-right of the viewport, click the **fourth shading sphere ("Rendered")** so you're judging actual lighting, not the flat preview.
2. **Add the light:** `Shift+A` ▸ Light ▸ Area.
3. **Lift it above the element:** press `G` then `Z`, and drag upward so it floats over the button.
4. **Push it off to one side:** with `G`, nudge it forward and to the left (or right). A front-top-left position is classically flattering — it puts the highlight off-centre, which reads more natural than a dead-centre hotspot.
5. **Aim it at the element.** An Area light emits from one face, so it needs to face the button. Either rotate it with `R` until it points down at the subject, or (cleaner) give it a **Track To** constraint pointed at the button so it always aims there even if you move it.
6. **Set brightness:** open **Light Properties** (the green lightbulb tab) and raise **Power** until the element is clearly lit — start around a few hundred Watts and adjust.
7. **Set softness:** raise the light's **Size** until the highlight on the button becomes a soft, broad blob rather than a tiny hard dot. This is the single most important setting for the look — see the next section.
8. **Verify:** orbit a little (`MMB`) and watch the highlight glide across the surface. If it looks like glossy plastic, you're done. One key light is genuinely enough.

## Light Power & Exposure

**Power** (in Watts for Area/Point/Spot) is raw brightness. Two things to understand:

- Power and **Size** interact: as you make a light bigger, its energy spreads over a larger area, so a big soft light usually needs *more* Power to reach the same brightness as a small one.
- Judge exposure by the highlight and the shadow side together. If the brightest part of the button is pure white with no detail, it's **blown out** — lower Power. If the whole button is muddy and dim, raise Power. The sweet spot has a bright-but-not-white highlight and a shadow side that's dark but still shows the colour.

> [!tip]
> Fix a blown highlight by lowering **Power**, not by shrinking the light. Shrinking the light to dim it also makes the highlight hard and small, which kills the soft look.

## Softness: Light Size & Shadows

This is the heart of the aesthetic. **Light Properties ▸ Size** sets the physical dimensions of the Area light, and physical size is what controls softness:

- **Large light** = soft, broad highlight blob and gentle, feathered shadow edges. This is what you want — it reads as a smooth molded surface catching diffuse studio light.
- **Small light** = a hard pinpoint glare and crisp, sharp-edged shadows. This looks cheap and harsh on plastic and should be avoided.

So: if the highlight is a tight bright dot, **raise Size**. If shadows have razor edges, **raise Size**. Think of it like a softbox in a photo studio — bigger softbox, softer light.

For a rectangular Area light you can set **Size X** and **Size Y** independently, stretching the highlight into a streak — handy for long capsule buttons or bars where you want the highlight to run along the length.

## Light Colour & Mood

**Light Properties ▸ Colour.** Pure white is neutral and safe. A slight warm tint (toward pale yellow/orange) gives a cozy, friendly, toy-shelf feeling that suits the playful aesthetic. A cool tint (toward pale blue) reads clinical and techy. Keep tints subtle — heavy colour casts fight the saturated button colours. For a whole consistent set, lock the key colour in the template so every sprite shares the same warmth.

## Area Light Shape & Spread

- **Shape** — Light Properties lets you choose Square, Rectangle, Disk, or Ellipse. The shape is what gets reflected in glossy surfaces, so a Disk light gives round highlights (very natural on domes), while a Rectangle gives a streaky highlight.
- **Spread** — controls how directional the Area light is. The default wide spread floods light broadly; lowering Spread makes it more like a focused panel, tightening the pool and increasing contrast. Leave it wide for soft general lighting; lower it if you want a more dramatic, directional pool on a hero element.

## Fill Light (Lifting the Shadows)

A **fill** is a second, much weaker light on the opposite side of the key, used to stop the shadow side from going pure black.

1. Duplicate your key light (`Shift+D`) or add a new Area light on the opposite side.
2. Make it **larger and much dimmer** — roughly a quarter of the key's Power.
3. Position it lower and to the other side so it gently raises the dark side.

This aesthetic actually *likes* some honest shadow, so keep fill subtle or skip it entirely. Use it only when the shadow side is so dark the colour disappears.

## Rim / Back Light (Optional Pop)

A **rim** light sits behind and above the element, catching the top edge of the silhouette so it separates from the background. It's a polish move for hero renders; for ordinary transparent-alpha sprites it's usually unnecessary, since there's no background to separate from.

## Named Lighting Recipes

- **Single soft key** — one large Area light, front-top-left, generous Size, moderate Power. The default; fast and squarely on-style. Use this for almost everything.
- **Key + weak fill** — the single key plus a dim, larger opposite Area at ~25% power, to rescue an over-dark shadow side. Use when a deep-coloured button is losing its shadow-side colour.
- **Three-point** — key + fill + rim, the classic polished setup. Reserve for hero/marketing renders of a finished panel.
- **Toy-shelf** — a slightly warm key plus a soft world fill (next section), for that friendly, well-lit plastic glow. A nice mood for a whole button family.

## World & Ambient Light

The **World** is the environment's ambient contribution — light that comes from everywhere at once.

- **Flat ambient:** World Properties (the red globe tab) ▸ **Colour** and **Strength**. Nudge Strength up to lift all shadows uniformly across the scene. A little goes a long way.
- **HDRI for real reflections:** World Properties ▸ Colour ▸ click the dot ▸ **Environment Texture** ▸ open an `.hdr` image. An HDRI surrounds the scene with a real lit environment, giving free, believable highlights and reflections — this is exactly what the Material Preview mode uses to make plastic and metal look good instantly.

> [!note]
> **Metal** and **glass** materials need environment detail (an HDRI or at least some fill) to look right — a black void around them makes them read dead and flat. **Plastic** is forgiving and looks fine with just one key light.

## Verifying & Troubleshooting

- **Everything too dark** → raise key **Power**, or add a touch of World Strength.
- **Highlight blown to pure white** → lower **Power** (don't shrink the light).
- **Highlight is a hard tiny dot / shadows razor-sharp** → raise the light **Size**.
- **Looks flat and lifeless** → your light is too head-on; move it more to the side and above so the highlight sits off-centre and a shadow side appears.
- **Metal/glass looks dull and grey** → add an HDRI or fill; reflective materials need something to reflect.
- **Highlight in the wrong spot** → move the light, not the camera. The highlight's position is set by the light's angle relative to the surface.

> [!danger]
> As with the camera, your lighting is shared across every element's file via the template. Re-tuning the light in one file desynchronises that sprite from the rest — change lighting deliberately, and re-render the whole set if you do.
