# isOverlapping has zero tests

**Effort:** Low (15 min)
**Impact:** Exported helper with no coverage

## Problem

`isOverlapping()` is exported via `minuta/helpers` but has no test file. Cases to cover:

- Non-overlapping periods (gap between them)
- Overlapping periods (partial overlap)
- One contains the other (full overlap)
- Touching periods (end of one = start of other)
- Same period
- Zero-duration periods
