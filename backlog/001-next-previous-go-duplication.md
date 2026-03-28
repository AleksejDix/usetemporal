# next/previous duplicate go() logic

**Effort:** Low (20 min)
**Savings:** ~35 lines

## Problem

next.ts and previous.ts repeat the same navigator/custom/adapter dispatch as go.ts.

## Fix

```typescript
// next.ts
export function next(adapter: Adapter, p: Period): Period {
  return go(adapter, p, 1);
}

// previous.ts
export function previous(adapter: Adapter, p: Period): Period {
  return go(adapter, p, -1);
}
```
