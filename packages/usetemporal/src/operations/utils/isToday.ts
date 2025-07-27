import type { Period, Temporal } from "../../types";
import { isSame } from "../isSame";

/**
 * Checks if a period represents today
 * @param temporal - The temporal instance for accessing current time
 * @param period - The period to check
 * @returns true if the period is a day period that represents today
 */
export function isToday(temporal: Temporal, p: Period): boolean {
  // Only day periods can be "today"
  if (p.type !== "day") {
    return false;
  }
  return isSame(temporal, p, temporal.now.value, "day");
}