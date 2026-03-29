# validatePeriod error messages don't include actual values

**Effort:** Trivial (5 min)

## Problem

`"Period start must be before or equal to end"` doesn't show the dates. When debugging, you have to set a breakpoint to find out what went wrong.

## Fix

```typescript
throw new Error(
  `Period start (${p.start.toISOString()}) must be before or equal to end (${p.end.toISOString()})`
);
```
