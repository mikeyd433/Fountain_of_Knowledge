---
title: Recording
category: REAPER
section: Workflows
order: 2
icon: 🎙️
tags: [recording, monitoring, takes]
---

## Arm and record

```shortcuts
Arm track for record | Click record-arm
Toggle input monitor | Click monitor icon
Start recording      | Ctrl+R
Stop                 | Space
```

## Loop recording takes

Enable repeat with `R`, set a time selection, then record. Each pass stacks as a
new take in the same item.

> [!note] Right-click the take lane to comp, crop, or explode takes to separate
> tracks.

## Input monitoring

> [!danger] Monitoring through speakers without headphones will cause a feedback
> loop with an open mic. Always monitor on headphones when recording live input.

```bash
# Quick check: list audio devices REAPER can see (macOS)
system_profiler SPAudioDataType
```
