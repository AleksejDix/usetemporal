import type { Period, Adapter, AdapterUnit } from "../types";

/**
 * Divide a period into smaller units
 */
export function divide(
  adapter: Adapter,
  period: Period,
  unit: AdapterUnit
): Period[] {
  const periods: Period[] = [];
  let current = new Date(period.start);

  while (current <= period.end) {
    const start = adapter.startOf(current, unit);
    const end = adapter.endOf(current, unit);

    // Only include periods that overlap with the parent period
    if (end >= period.start && start <= period.end) {
      periods.push({
        start: start < period.start ? period.start : start,
        end: end > period.end ? period.end : end,
        type: unit,
        date: new Date(current),
      });
    }

    // Move to the start of the next unit to avoid issues with variable length units
    const nextDate = adapter.add(start, 1, unit);
    
    // If the next date is the same as the current one (e.g. DST), we must advance manually
    if (nextDate.getTime() <= current.getTime()) {
      current = new Date(start.getTime() + 24 * 60 * 60 * 1000); // Move to next day
    } else {
      current = nextDate;
    }

    // For safety, break if we've gone too far (prevent infinite loops)
    if (periods.length > 2000) {
      // This limit might need to be adjusted depending on expected use cases.
      // For example, dividing a year by minutes would exceed this.
      // For now, keeping it as a safeguard.
      console.warn("divide operation generated over 2000 periods, aborting.");
      break;
    }
  }

  return periods;
}