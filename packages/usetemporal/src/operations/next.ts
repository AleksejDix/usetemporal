import type { Period, Temporal, AdapterUnit } from "../types";
import { period } from "./period";

/**
 * Move to the next period
 */
export function next(temporal: Temporal, p: Period): Period {
  const { adapter } = temporal;

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


  const nextValue = adapter.add(
    p.date,
    1,
    p.type as AdapterUnit
  );

  // Create a temporary point-in-time period for the new date
  const tempPeriod: Period = {
    start: nextValue,
    end: nextValue,
    type: "second",
    date: nextValue,
  };

  return period(temporal, nextValue, p.type);
}
