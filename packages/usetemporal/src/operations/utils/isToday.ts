import type { Period, Adapter } from "../../types";
import { isSame } from "../isSame";

/**
 * Checks if a period represents today
 * @param adapter - The adapter instance
 * @param now - The current date
 * @param p - The period to check
 * @returns true if the period is a day period that represents today
 */
export function isToday(adapter: Adapter, now: Date, p: Period): boolean {
  // Only day periods can be "today"
  if (p.type !== "day") {
    return false;
  }
  
  // Create a temporary period for the current date to compare with
  const nowPeriod: Period = {
    start: now,
    end: now,
    type: 'day', // Type doesn't strictly matter as isSame looks at the date
    date: now,
  };

  return isSame(adapter, p, nowPeriod, "day");
}