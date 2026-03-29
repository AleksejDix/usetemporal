# Snap to interval — round a time to the nearest interval boundary

**Effort:** Small (1 hour)

## Problem

When drag-and-dropping events in a calendar day view, the dropped time needs to snap to the nearest interval grid line (e.g., 15-min or 30-min). No snapping utility exists.

## Use cases

```ts
snap(new Date("2024-03-15T10:37:00"), { minutes: 15 }); // → 10:45
snap(new Date("2024-03-15T10:37:00"), { minutes: 30 }); // → 10:30
snap(new Date("2024-03-15T14:02:00"), { minutes: 5 }); // → 14:00
```

Drag-and-drop scenarios:

- Moving an event → snap start time, preserve duration
- Resizing an event → snap end time to nearest boundary
- Creating an event by click-drag → snap both start and end

## Design considerations

- Depends on interval grid from backlog 044 — same duration format `{ hours?, minutes?, seconds? }`
- Rounding strategy: nearest, floor (always earlier), ceil (always later)
- DST gap: snapping into a gap time should snap forward past the gap
- DST ambiguous hour: snap to the nearest occurrence
- Pure millisecond math — no adapter needed

## Affected code

- New file: `packages/minuta/src/operations/snap.ts`
- New tests: `packages/minuta/src/operations/snap.test.ts`
- Export from operations index

## Test cases

- 10:37 snap 15min → 10:45 (nearest)
- 10:37 snap 15min floor → 10:30
- 10:37 snap 15min ceil → 10:45
- 10:00 snap 15min → 10:00 (already on boundary)
- 23:58 snap 15min → 00:00 next day (crosses midnight)
- Spring forward 2:10 AM snap 15min → 3:00 AM (skip gap)
