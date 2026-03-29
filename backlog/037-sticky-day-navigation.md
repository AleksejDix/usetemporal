# Chained navigation loses original day and time (sticky anchor)

**Effort:** Large (4-5 hours)

## Problem

When navigating months from a high day number, clamping causes permanent drift:

```
Jan 31 → +1 month → Feb 28 → +1 month → Mar 28 (should be Mar 31)
```

The `go` function uses `period.start` as input each time, so the original day (31) is lost after the first clamp. Every date library has this problem.

**Expected behavior:**

```
anchor: Jan 31
+1 month → Feb 28 (clamped from 31)
+2 months → Mar 31 (restored!)
+3 months → Apr 30 (clamped from 31)
+4 months → May 31 (restored!)
```

## Fix

Introduce an `anchor` date on `TimePeriod` (optional field, set on first navigation). The `go` function should always compute from the anchor rather than the current start:

```ts
go(adapter, period, steps)
  → anchor = period.anchor ?? period.start
  → adapter.add(anchor, totalSteps, unit)
  → derivePeriod(adapter, newDate, unit, { anchor })
```

This applies to:

- **Month/quarter/year** navigation where day clamping can occur
- **Hour** navigation across DST boundaries where wall-clock time drifts

## Affected code

- `packages/minuta/src/operations/go.ts` — compute from anchor
- `packages/minuta/src/types.ts` — add optional `anchor` to `TimePeriod`
- `packages/minuta/src/operations/period.ts` — pass anchor through `derivePeriod`
- All adapter `add` implementations — no changes needed (anchor logic lives in `go`)
- Framework bindings (React/Vue/Svelte) — pass anchor through navigation state

## Test cases

- Jan 31 → +1m → +1m → +1m: expect Feb 28, Mar 31, Apr 30
- Jan 29 → +1m → +1m: expect Feb 29 (leap 2024), Mar 29
- Feb 29 → +1m → +1m → ... through full year: expect 29th or clamped
- Backward: Mar 31 → -1m → -1m: expect Feb 29, Jan 31
- Quarter: Jan 31 → +1q → +1q: expect Apr 30, Jul 31
- Year: Feb 29 2024 → +1y → +1y: expect Feb 28 2025, Feb 28 2026
- Year: Feb 29 2024 → +4y: expect Feb 29 2028 (restored, leap year)

### DST gap (spring forward, America/New_York, March 10 2024)

- anchor 1:30 AM → +1h → +2h → +3h: expect 3:30, 3:30, 4:30 (2:30 doesn't exist)
- anchor 1:30 AM → +1h → -1h: should return to 1:30 AM, not land in the gap

### DST ambiguous hour (fall back, America/New_York, November 3 2024)

- anchor 1:30 AM EDT → +1h → +2h: expect 1:30 AM EST, 2:30 AM EST
- anchor 1:30 AM EDT → +1h → -1h: should return to 1:30 AM EDT (first occurrence)
- Navigation through the repeated hour is deterministic from anchor offset
