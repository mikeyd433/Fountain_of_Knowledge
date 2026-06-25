---
title: Asset Reuse
category: Graphics Pipeline
section: Blender UI Graphics
icon: "\U0001F39B️"
tags:
  - blender
  - ui
  - graphics
  - modeling
order: 18
---
The Asset Browser turns your one-time-built shapes and materials into a reusable palette you can drag into any file — it's what makes the "build a master once, reuse it everywhere" principle actually work. This page explains the asset system, how to open the browser, how to mark objects and node groups as assets (which differs in 5.1.2), how to organise them into catalogs, and the crucial Append-vs-Link choice.

## What the Asset System Is

When you "mark" a shape or material as an asset, Blender gives it a thumbnail and lists it in the Asset Browser. If the file it lives in is saved inside a *registered asset-library folder*, that asset becomes available in **every** other file too. Dragging it into a scene creates an independent copy you can edit freely. So you build a clean button once, mark it, and from then on it's one drag away in any element file.

## Opening the Asset Browser

The Asset Browser is an editor type that isn't shown by default. The easy way to open one without rearranging your layout:

1. At the bottom of the window there's a thin **Timeline** strip. Hover its top edge until the cursor becomes a double-arrow, then drag upward to make it taller.
2. Click the **editor-type dropdown** in its top-left corner (the little icon) and choose **Asset Browser**.
3. On the left of the new panel, set the **library selector** to your `Cartridge_Assets` library (or **Current File** to see only this file's assets).

## Registering the Library

For assets to be shared across files, the folder they live in must be a registered library:

1. Edit ▸ Preferences ▸ File Paths ▸ **Asset Libraries** ▸ click **+**.
2. Point it at your `Cartridge_Assets` folder. Close Preferences.

Now any `.blend` saved inside that folder shares its marked assets with every other file's Asset Browser.

## Marking an Object as an Asset

1. In the **Outliner** (the panel listing your scene contents, top-right), right-click the object ▸ **Mark as Asset**. Blender tags it and auto-generates a thumbnail.
2. Save the file (`Ctrl+S`). If it's inside the library folder, the asset now shows up in other files too.

> [!warning]
> In Blender 5.1.2, **Mark as Asset is in the Outliner only** — it is *not* in the 3D-viewport right-click menu.

## Marking a Node Group (Material) as an Asset

Node groups — your shared Plastic group and other materials — are marked from a different place:

1. In the **Outliner**, change the display-mode dropdown (top-left, it says "View Layer") to **Blender File**. This shows the raw data inside the file.
2. Scroll down and expand the **Node Groups** section.
3. Right-click your group ▸ **Mark as Asset**.
4. Switch the Outliner back to "View Layer" so things look normal again.

This Outliner ▸ Blender File route is the only place node groups can be marked — you can't do it from the Shader Editor.

## Catalogs (Organising Assets)

Catalogs are like folders inside the Asset Browser for grouping assets — e.g. "Buttons", "Controls", "Materials", "Props".

1. Catalogs can only be created/edited from the **Current File** view: set the Asset Browser's library selector to **Current File**.
2. Save the file (`Ctrl+S`) first, ideally inside the library folder.
3. In the Asset Browser header ▸ **Catalog** ▸ **New Asset Catalog**; double-click it to rename; drag assets onto it to file them.
4. **Catalog** ▸ **Save** writes the catalog structure into a `blender_assets.cats.txt` file at the library root, so every file using the library sees the same catalog tree.

> [!tip]
> Catalogs are edit-locked unless you're viewing the **Current File** library. If "New Asset Catalog" is greyed out, switch the library selector to Current File.

## Using an Asset: Append vs Link

When you drag an asset in, the **Import Method** dropdown in the Asset Browser header decides what kind of copy you get:

- **Append** — a full, independent, **editable** copy. Its colour and geometry are yours to change. **Use this for shapes**, so every button can have its own colour.
- **Link** — a read-only **reference** to the original in the library file. You can't edit it (the colour field stays locked). Only useful when you deliberately want many copies to update together from one master.

> [!warning]
> If a dragged-in shape comes in with its colour locked, the Import Method was set to **Link**. Switch it to **Append**, delete the locked copy (`X`), and drag a fresh one in.

## Dragging an Asset In

1. With the Asset Browser open and the right library selected, click-drag the asset's thumbnail out into the **3D viewport** and release.
2. With Append, it arrives as an editable copy at the cursor or world centre; tap `Home` to frame it, `G` to position it.
3. It keeps whatever material it was marked with — drag in your shared Plastic group and set the colour if you want to reskin it.
