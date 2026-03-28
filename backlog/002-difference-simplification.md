# difference.ts over-engineered dispatch

**Effort:** Low (15 min)
**Savings:** ~25 lines

## Problem

102 lines with 4 nested cases (Date-Date, Date-Period, Period-Date, Period-Period), each with forward/backward branches. Most of the logic is extracting start/end from inputs.

## Fix

Extract start/end resolution upfront, then handle direction once:

```typescript
export function difference(
  _adapter: Adapter,
  from: Period | Date,
  to: Period | Date
): Period {
  const fromEnd = from instanceof Date ? from : from.end;
  const toStart = to instanceof Date ? to : to.start;

  // For Date-to-Date: direct span
  if (from instanceof Date && to instanceof Date) {
    const [start, end] = from <= to ? [from, to] : [to, from];
    return { start, end, type: "custom" };
  }

  // For Period involvement: gap between end of first and start of second
  const isForward = fromEnd.getTime() <= toStart.getTime();
  if (isForward) {
    return {
      start: new Date(fromEnd.getTime() + 1),
      end: new Date(toStart.getTime() - 1),
      type: "custom",
    };
  }
  // Backward/overlapping
  return {
    start: from instanceof Date ? from : from.start,
    end: to instanceof Date ? to : to.end,
    type: "custom",
  };
}
```
