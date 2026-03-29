# split() should reject PeriodSeries input

**Effort:** Low (10 min)

## Problem

`split(stableMonth, date)` returns two chunks both typed `stableMonth` — but they're not 42-day grids anymore. The stableMonth contract is broken.

Same issue as `go`/`next`/`previous` had before they were tightened to `TimePeriod`.

## Fix

Change signature from `split(period: Period, ...)` to `split(period: TimePeriod, ...)`. This matches the pattern already established by navigation operations.
