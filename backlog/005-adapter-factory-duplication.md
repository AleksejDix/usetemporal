# All 5 adapter factories repeat the same 33-line pattern

**Effort:** Medium (1 hour)
**Savings:** ~90 lines

## Problem

Every adapter.ts builds the same handlers map and returns the same 4-method object. Only the handlers and configuration differ.

## Fix

Extract a shared `createAdapter` function:

```typescript
// shared/createAdapter.ts
export function createAdapter(
  handlers: Record<AdapterUnit, UnitHandler>
): Adapter {
  return {
    startOf: (date, unit) => handlers[unit].startOf(date),
    endOf: (date, unit) => handlers[unit].endOf(date),
    add: (date, amount, unit) => handlers[unit].add(date, amount),
    diff: (from, to, unit) => handlers[unit].diff(from, to),
  };
}
```

Then each adapter becomes just handler assembly + createAdapter call.
