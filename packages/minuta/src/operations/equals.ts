import type { Period } from "../types";

/**
 * Check if two periods cover the exact same time range.
 * Compares start and end timestamps only — ignores type.
 *
 * @example
 * const jan = derivePeriod(adapter, date, "month")
 * const custom = createPeriod(jan.start, jan.end)
 * equals(jan, custom) // true
 */
export function equals(a: Period, b: Period): boolean {
  return (
    a.start.getTime() === b.start.getTime() &&
    a.end.getTime() === b.end.getTime()
  );
}

/**
 * Check if two periods cover the exact same time range AND have the same type.
 */
export function strictEquals(a: Period, b: Period): boolean {
  return equals(a, b) && a.type === b.type;
}
