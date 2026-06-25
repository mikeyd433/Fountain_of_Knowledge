---
title: Routing
category: REAPER
section: Workflows
order: 1
icon: 🔀
tags: [routing, sends, busses, mixing]
---

## Concepts

REAPER routing is just signal flow: every track can send to any other track or
hardware output. A **bus** is simply a track that receives sends from other
tracks.

## Create a bus

1. Add a new track — `Ctrl+T`.
2. Name it (e.g. `DRUM BUS`).
3. On each source track, open the routing window with the **IO** button.
4. Add a send to the bus.

```shortcuts
New track            | Ctrl+T
Open track routing   | Click IO button
Toggle master/parent | Click parent send box
```

> [!warning] Sending a track to a bus while its **Master/Parent send** is still
> on will double the signal. Disable the parent send when routing into a bus.

## Batch routing with SWS

> [!tip] Use the SWS extensions for batch routing — select multiple tracks and
> route them all at once instead of clicking each IO button.

```lua
-- Example: route all selected tracks to the last touched track
reaper.Main_OnCommand(
  reaper.NamedCommandLookup("_SWS_ROUTETOLAST"), 0
)
```
