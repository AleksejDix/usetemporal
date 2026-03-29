# isWeekend/isWeekday should accept TimePeriod, not Period

**Effort:** Trivial (5 min)

## Problem

`isWeekend(p: Period)` and `isWeekday(p: Period)` accept any Period including PeriodSeries. A stableMonth or stableYear is never a weekend. Passing one always returns false due to the duration check, but the types don't communicate this.

## Fix

Change parameter type from `Period` to `TimePeriod`.
