import type { Period, Temporal, AdapterUnit } from "../types";
import { createPeriod } from "./createPeriod";

/**
 * Move to the next period
 */
export function next(temporal: Temporal, period: Period): Period {
  const { adapter } = temporal;

  // Handle custom periods by using duration
  if (period.type === "custom") {
    const duration = period.end.getTime() - period.start.getTime() + 1;
    const nextStart = new Date(period.end.getTime() + 1);
    const nextEnd = new Date(nextStart.getTime() + duration - 1);
    return {
      start: nextStart,
      end: nextEnd,
      type: "custom",
      date: nextStart,
    };
  }


  const nextValue = adapter.add(
    period.date,
    1,
    period.type as AdapterUnit
  );

  // Create a temporary point-in-time period for the new date
  const tempPeriod: Period = {
    start: nextValue,
    end: nextValue,
    type: "second",
    date: nextValue,
  };

  return createPeriod(temporal, period.type, tempPeriod);
}
