import type { Period, Adapter, AdapterUnit } from "../types";

/**
 * Check if two periods are the same for a given unit
 *
 * Uses the Period-centric API pattern where operations work with Period objects.
 * To compare dates directly, wrap them in periods or use period.date.
 *
 * @example
 * // Compare two periods
 * isSame(adapter, yearPeriod, otherYearPeriod, 'year')
 *
 * @example
 * // Compare periods by their reference dates
 * const sameDayPeriod = period(adapter, 'day', period)
 * isSame(adapter, period, sameDayPeriod, 'day')
 */
export function isSame(
  adapter: Adapter,
  a: Period | null | undefined,
  b: Period | null | undefined,
  unit: AdapterUnit | "custom"
): boolean {
  if (!a || !b) return false;

  const dateA = a.date;
  const dateB = b.date;

  // Handle custom periods - they are the same if their dates are exactly equal
  if (unit === "custom") {
    return dateA.getTime() === dateB.getTime();
  }

  // For all other units, compare by checking if startOf values are equal
  const startA = adapter.startOf(dateA, unit);
  const startB = adapter.startOf(dateB, unit);
  return startA.getTime() === startB.getTime();
}
