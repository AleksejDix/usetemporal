# General period equality — compare any two periods

**Effort:** Small (30 min)

## Problem

`isSame` compares periods by unit — it checks if two dates fall in the same calendar unit. There's no way to check if two arbitrary periods cover the exact same time range regardless of type.

```ts
// These cover the same time range but isSame can't compare them
const jan = derivePeriod(adapter, date, "month"); // Jan 1 00:00 – Jan 31 23:59:59.999
const custom = { start: jan.start, end: jan.end, type: "custom" };

isSame(adapter, jan, custom, "month"); // works but requires knowing the unit
equals(jan, custom); // what users want — true
```

## Fix

Add `equals(a: Period, b: Period): boolean` that compares `start.getTime()` and `end.getTime()`. No adapter needed — pure timestamp comparison.

```ts
function equals(a: Period, b: Period): boolean {
  return (
    a.start.getTime() === b.start.getTime() &&
    a.end.getTime() === b.end.getTime()
  );
}
```

Optionally add `strictEquals` that also checks `type` matches.

## Affected code

- New: `packages/minuta/src/operations/equals.ts`
- New tests: `packages/minuta/src/operations/equals.test.ts`
- Export from operations index

## Test cases

- Same period — true
- Same range, different types — true (equals), false (strictEquals)
- Off by 1ms — false
- Zero-length periods at same instant — true
- Zero-length periods at different instants — false
