# Tighten return types: merge, gap, split return TimePeriod not Period

**Effort:** Low (15 min)

## Problem

`merge()`, `gap()`, and `split()` all declare return type `Period` but always produce `TimePeriod`. Callers must narrow unnecessarily.

- `merge()` returns `{ start, end, type }` — never a PeriodSeries with meta
- `gap()` always returns `{ start, end, type: "custom" }`
- `split()` returns two halves with the input's type — never PeriodSeries

## Fix

Change return types to `TimePeriod`. This is a non-breaking change for callers since `TimePeriod` is assignable to `Period`.
