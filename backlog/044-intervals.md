# Intervals — subdivide periods into fixed-duration slots

**Effort:** Medium (2-3 hours)

## Problem

`divide` only works with calendar units (year, month, week, day, hour, minute, second). There's no way to split a period into fixed-duration slots like 15-min or 30-min intervals. This is a common need for calendar UIs, scheduling, and time-slot pickers.

## Use cases

```ts
interval(day, { minutes: 15 }); // → 96 slots
interval(day, { minutes: 30 }); // → 48 slots
interval(day, { hours: 1, minutes: 30 }); // → 16 slots
interval(hour, { minutes: 10 }); // → 6 slots
```

## Design considerations

- Intervals are fixed millisecond durations, not calendar units — no adapter needed
- Last slot may be shorter if the period doesn't divide evenly (truncate or extend?)
- DST: a 23-hour day split into 30-min intervals → 46 slots, not 48. Pairs with stableDay (backlog 043) for consistent grids
- Input: a Period + a duration object `{ hours?, minutes?, seconds? }`
- Output: array of Periods (same as divide)

## Affected code

- New file: `packages/minuta/src/operations/interval.ts`
- New tests: `packages/minuta/src/operations/interval.test.ts`
- Export from operations index

## Test cases

- 1 hour ÷ 15 min → 4 equal slots
- 1 hour ÷ 20 min → 3 slots (last slot truncated to 0 min remainder — decide behavior)
- 24-hour day ÷ 30 min → 48 slots
- 23-hour DST day ÷ 30 min → 46 slots
- 25-hour DST day ÷ 30 min → 50 slots
- Zero-length period ÷ any interval → empty array
- Interval larger than period → single slot (the period itself)
