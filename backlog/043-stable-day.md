# stableDay — consistent 24-hour grid regardless of DST

**Effort:** Medium (1-2 hours)

## Problem

`divide(day, "hour")` returns 23 or 25 hours during DST transitions. Calendar day views (like Google Calendar) need a stable 24-slot grid for consistent layout. Without this, rows shift and misalign on DST days.

| DST scenario   | divide result | UI problem                 |
| -------------- | ------------- | -------------------------- |
| Spring forward | 23 hours      | Missing row, layout shifts |
| Fall back      | 25 hours      | Extra row, layout shifts   |
| Normal         | 24 hours      | Fine                       |

## Fix

Add `createStableDay` following the same pattern as `stableMonth` (42-day grid) and `stableYear` (52-53 week grid):

- Always returns 24 hour slots
- Spring forward (23h): the skipped hour slot exists but is marked as a gap (e.g., 2 AM slot with meta indicating it doesn't exist)
- Fall back (25h): the repeated hour is merged into one slot with meta indicating it occurs twice
- Normal: 1:1 mapping, no meta needed

```ts
createStableDay(adapter, date, timezone?): Period & {
  meta: {
    gaps: Date[]       // hours that don't exist (spring forward)
    ambiguous: Date[]  // hours that occur twice (fall back)
  }
}
```

## Affected code

- New file: `packages/minuta/src/calendar/stableDay.ts`
- New tests: `packages/minuta/src/calendar/stableDay.test.ts`
- Export from calendar index
- Framework bindings may expose via composables/hooks

## Test cases

- Normal day: 24 slots, no gaps, no ambiguous
- Spring forward (America/New_York, March 10 2024): 24 slots, gap at 2 AM
- Fall back (America/New_York, Nov 3 2024): 24 slots, ambiguous at 1 AM
- Lord Howe Island (+30 min DST): 24 slots, gap/ambiguous at 30-min boundary
- UTC: always 24 slots, never gaps or ambiguous
