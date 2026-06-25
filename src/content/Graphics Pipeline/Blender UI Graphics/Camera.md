---
title: Camera
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 3
---
The camera decides how every sprite is framed, and because all your elements share one locked camera (stored in `_button_template.blend`), getting it right once means every button, knob, and panel lines up perfectly when the UI swaps them. This page covers how the camera works, how to aim it, every lens and framing setting, and the angle to use per element type.

## Viewport Navigation

Before you can aim a camera you need to move around comfortably. The viewport "eye" is separate from the camera object — moving your view does not move the camera unless you tell it to.

- **Orbit** — hold the **middle mouse button** (`MMB`, the scroll wheel pressed down) and drag. This tumbles your view around the scene's center. This is the single most-used navigation move; get fluent with it.
- **Pan** — hold `Shift+MMB` and drag to slide the view sideways/up without rotating.
- **Zoom** — `Scroll` the wheel in and out. If you "zoom past" your object and can't get closer, hover the object and press `Numpad.` (the period key on the number pad) to refocus on it.
- **Snap to a flat view** — `Numpad1` looks at the front, `Numpad3` the right side, `Numpad7` straight down (top). These are orthographic, perfect for lining things up squarely.
- **Frame everything** — `Home` zooms out until all objects fit on screen. Use it any time something vanishes off-screen.

> [!tip]
> No number pad (most laptops)? Edit ▸ Preferences ▸ Input ▸ tick **Emulate Numpad** so the top-row number keys act as the numpad views. If you have no middle mouse button, tick **Emulate 3-Button Mouse** in the same panel, then `Alt+Left-drag` orbits.

```shortcuts
Orbit | MMB drag
Pan | Shift+MMB drag
Zoom | Scroll
Refocus on selection | Numpad.
Frame all | Home
Front / Right / Top view | Numpad1 / Numpad3 / Numpad7
```

## How the Camera Works

The camera is a physical object in the scene, like your button or light — it has a position and a rotation, and it is what actually gets rendered. The little pyramid-shaped wireframe in the viewport *is* the camera; the wide end points where it's looking.

You have two separate things going on at once: your **viewport view** (your free-flying eye, which you move with orbit/pan/zoom) and the **camera object** (fixed in place until you move it). Pressing `Numpad0` flips your viewport to look *through* the camera so you see exactly what will render. Pressing `Numpad0` again flips back to your free eye.

The workflow is always: fly your free eye to a nice angle, then tell the camera to copy that angle.

## Setting Your Angle

1. Orbit, pan, and zoom (`MMB`, `Shift+MMB`, `Scroll`) until your free view shows the element the way you want it framed.
2. Press `Ctrl+Alt+Numpad0`. This is the **"Align Active Camera to View"** command — it teleports the camera to your exact current viewpoint, matching position, rotation, and zoom. This is the fast, beginner-friendly way to set an angle: you compose by eye, then snap the camera to it.
3. Press `Numpad0` to look through the camera and check the result. Leave a comfortable margin of empty space around the element so the soft highlight and any glow aren't clipped at the frame edge.

**Fine-tuning live (the smoother method):** while looking through the camera (`Numpad0`), open the side panel with `N`, go to the **View** tab, and tick **Lock Camera to View**. Now your normal navigation moves the *camera itself* in real time — `MMB` orbits it, `Shift+MMB` pans it, `Scroll` dollies it in and out — and you watch the framed result update as you go. When the shot looks right, **untick Lock Camera to View** so you don't accidentally nudge the camera later.

> [!warning]
> Leave Lock Camera to View **off** during normal work. If it's on, every orbit silently moves your locked camera and your sprites stop registering with each other.

## Lens Type: Perspective vs Orthographic

Select the camera, then open **Object Data Properties** (the green camera icon in the Properties panel on the right) ▸ **Lens** ▸ **Type**.

- **Perspective** (default) — behaves like a real camera and a real eye: distant things shrink, near things loom, parallel edges converge. This gives natural depth and the chunky bulge that suits retro 3D. Use it for hero shots and anything where you want dimensionality.
- **Orthographic** — removes perspective entirely: parallel edges stay parallel, near and far render at the same size. The result is flat, technical, and sticker-like, with zero skew. This is excellent for clean icon-style buttons that must read as perfectly symmetrical, and for top-down panel layouts where you don't want edges fanning out. With Orthographic selected, framing is controlled by **Orthographic Scale** (higher = more of the scene fits = element looks smaller) instead of by moving closer.

> [!tip]
> A practical hybrid: model and check in Perspective for the friendly bulge, but if a button looks subtly lopsided because it's off to the side of frame, switch to Orthographic so it renders dead-symmetrical.

## Focal Length & Perspective Feel

In Perspective mode, **Object Data Properties ▸ Lens ▸ Focal Length** (in millimetres) controls how strong the perspective bulge is.

- **Low focal length (24–35 mm)** = wide angle. Edges fan out, the nearest part of the object balloons toward you, and you have to move close to fill the frame. This exaggerates the chunky, toy-like, slightly distorted look — on-style for Nubby's, but it can make a flat panel look warped.
- **Medium focal length (50–85 mm)** = natural. Minimal distortion, honest proportions. This is the safe default for most UI sprites because shapes read true.
- **High focal length (100 mm+)** = telephoto. Perspective flattens almost to orthographic; you must move far back. Good for a clean, undistorted hero of a single control.

Focal length and distance work together: a 35 mm lens up close and an 85 mm lens further back can frame the button the same size, but the 35 mm version will have far more bulge. Pick the *feel* first (how much bulge you want), then move the camera to frame it.

> [!note]
> When you change focal length, the framing changes too — you'll usually re-snap with `Ctrl+Alt+Numpad0` or dolly the camera to re-fill the frame.

## Sensor & Field of View

**Object Data Properties ▸ Camera ▸ Sensor Size** (default 36 mm) works with focal length to set the field of view. You rarely need to touch it — leave it at 36 mm unless you're matching a real-world camera reference. Just know it exists: a smaller sensor with the same focal length zooms in (narrower field of view), a larger one zooms out. For consistency across your whole sprite set, set it once in the template and never change it.

## Depth of Field (Background Blur)

**Object Data Properties ▸ Depth of Field ▸ enable.** This blurs whatever isn't at the focus distance, like a real lens with a wide aperture.

1. Set **Focus Object** to your element (so it stays sharp), or type a **Focus Distance** manually.
2. Set the **F-Stop**: lower numbers (e.g. 1.4–2.8) = stronger blur; higher numbers (8+) = nearly everything sharp.

For flat sprites on a transparent background there's nothing behind to blur, so leave DoF **off** for normal button rendering. It's worth turning on for hero/marketing renders of a full assembled panel, where a softly blurred background sells depth.

## Clipping (When Geometry Disappears)

**Object Data Properties ▸ Lens ▸ Clip Start / Clip End** define the nearest and farthest distances the camera can see. Anything closer than Clip Start or farther than Clip End simply isn't drawn.

- If the front of a close-up object gets sliced away or vanishes, **lower Clip Start** (e.g. from 0.1 to 0.01).
- If distant scenery vanishes, **raise Clip End**.

For small UI elements close to the camera, a small Clip Start prevents the "front of my button is missing" surprise.

## Framing & Composition Aids

- **Passepartout** — Object Data Properties ▸ Viewport Display ▸ Passepartout dims everything outside the camera frame in the viewport, so you can judge your composition cleanly. Raise its **Alpha** toward 1.0 for a stronger mask.
- **Composition Guides** — same panel ▸ enable **Thirds** or **Center** to overlay alignment lines; handy for centring a single button.
- **Resolution affects framing** — the frame's shape comes from Output Properties ▸ Resolution X/Y. A square 1024×1024 gives a square frame; if you change to a wide resolution, your careful framing will shift, so set resolution before final framing.
- **Leave margin** — keep a ring of empty space around the element. Soft highlights, glow/bloom, and the pressed-state squash can all spill slightly past the resting silhouette; clipping them ruins the alpha edge.

## Per-Element Camera Angles

Different element shapes read best from different angles. Because your template holds one camera, you'll usually pick a single house angle for a whole family of buttons — but here's what flatters each type if you render categories separately.

- **Domes / poppers / rounded buttons** — a gentle looking-down 3/4 (camera slightly above, slightly to one side). Shows the curved top and lets the highlight slide across it.
- **Pucks / discs** — a *lower* angle, closer to eye level, so the rounded rim catches a bright glossy band around the edge. Pure top-down kills that rim shine.
- **Knobs / tall controls** — near eye level so the body and indicator read; a touch above to show the cap.
- **Panels / consoles / backplates** — flatter and higher, or full top-down orthographic, to keep all the edges straight and avoid keystoning.
- **Props (screws, jacks, LEDs)** — match the angle they'll actually sit at on the panel, so their shading agrees with the surface they're composited onto.

## Reusing the Camera Across Files

Since each element lives in its own `.blend`, the camera has to be identical in all of them — that's what guarantees registration.

- **From the template** — the per-element routine starts by opening `_button_template.blend` and Save-As-ing it, so the camera comes along automatically. This is the main path.
- **Append into an existing file** — File ▸ Append ▸ pick the file with the good camera ▸ Object ▸ Camera. It arrives at the exact same transform and lens. Append the Light the same way and your whole rig travels as a unit.
- **Record exact values** — select the camera, press `N`, open the **Item** tab to see its precise Location and Rotation. Jot these down (or just trust the appended camera) so you can always restore the exact angle if something drifts.

> [!danger]
> If you re-aim the camera in one element's file, every sprite from that file stops matching the others. Only change the shared angle deliberately, and if you do, re-render the whole set.
