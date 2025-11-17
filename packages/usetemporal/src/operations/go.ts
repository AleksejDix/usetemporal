import type { Period, Adapter, AdapterUnit } from "../types";
import { period } from "./period";

/**
 * Move by a specific number of periods
 */
export function go(adapter: Adapter, p: Period, steps: number): Period {
  if (steps === 0) return p;

  // Handle custom periods by using duration
  if (p.type === "custom") {
    const duration = p.end.getTime() - p.start.getTime() + 1;
    let newStart: Date;
    if (steps > 0) {
      newStart = new Date(p.start.getTime() + duration * steps);
    } else {
      newStart = new Date(p.start.getTime() - duration * Math.abs(steps));
    }
    const newEnd = new Date(newStart.getTime() + duration - 1);
    return {
      start: newStart,
      end: newEnd,
      type: "custom",
      date: newStart,
    };
  }

  const unit = p.type as AdapterUnit;
  let newValue: Date;

  // Special handling for large day steps to handle leap years correctly
  if (unit === "day" && Math.abs(steps) >= 365) {
    // For steps that are roughly a year or more, use year-based navigation
    // This makes go(date, 365) move to the same date next year
    const years = Math.floor(steps / 365);
    const remainingDays = steps % 365;

    // First add the years
    let result = adapter.add(p.date, years, "year");

    // Then add remaining days
    if (remainingDays !== 0) {
      result = adapter.add(result, remainingDays, "day");
    }

    newValue = result;
  } else {
    // Use adapter for smaller steps or non-day units
    newValue = adapter.add(p.date, steps, unit);
  }

  return period(adapter, newValue, unit);
}
