import type { Period, Adapter, AdapterUnit } from "../types";
import { period } from "./period";

/**
 * Move to the next period
 */
export function next(adapter: Adapter, p: Period): Period {
  // Handle custom periods by using duration
  if (p.type === "custom") {
    const duration = p.end.getTime() - p.start.getTime() + 1;
    const nextStart = new Date(p.end.getTime() + 1);
    const nextEnd = new Date(nextStart.getTime() + duration - 1);
    return {
      start: nextStart,
      end: nextEnd,
      type: "custom",
      date: nextStart,
    };
  }

  const nextValue = adapter.add(p.date, 1, p.type as AdapterUnit);

  return period(adapter, nextValue, p.type as AdapterUnit);
}
