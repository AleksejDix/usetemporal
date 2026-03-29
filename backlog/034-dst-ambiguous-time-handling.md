# No disambiguation for ambiguous times during fall back

**Effort:** Large (2-3 hours)

## Problem

During fall back, wall-clock times repeat (e.g., 1:30 AM occurs twice). The codebase has no strategy for disambiguating which occurrence is intended. This affects:

- Creating periods that start/end during the repeated hour
- divide producing hour slots during the overlap
- Adapter consistency — each adapter may resolve the ambiguity differently

## Fix

Define a disambiguation strategy (prefer earlier, prefer later, or error). Document the chosen behavior. Add tests that verify all adapters agree on the same resolution. The date-fns-tz adapter uses `fromZonedTime` which defaults to the earlier offset — verify and document this.
