# merge() uses manual loop for consecutiveness check

**Effort:** Low (10 min)
**Savings:** ~5 lines

## Problem

```typescript
let consecutive = true;
for (let i = 1; i < sorted.length; i++) {
  const expected = adapter.add(sorted[i - 1].start, 1, "day");
  if (
    adapter.startOf(expected, "day").getTime() !== sorted[i].start.getTime()
  ) {
    consecutive = false;
    break;
  }
}
```

## Fix

```typescript
const consecutive = sorted.every((p, i) => {
  if (i === 0) return true;
  const expected = adapter.startOf(
    adapter.add(sorted[i - 1].start, 1, "day"),
    "day"
  );
  return expected.getTime() === p.start.getTime();
});
```
