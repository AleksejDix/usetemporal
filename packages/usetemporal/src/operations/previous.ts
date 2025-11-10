import type { Period, Adapter, AdapterUnit } from "../types";
import { period } from "./period";

/**
 * Move to the previous period
 */
export function previous(adapter: Adapter, p: Period): Period {
  // Handle custom periods by using duration
  if (p.type === "custom") {
    const duration = p.end.getTime() - p.start.getTime() + 1;
    const prevEnd = new Date(p.start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration + 1);
    return {
      start: prevStart,
      end: prevEnd,
      type: "custom",
      date: prevStart,
    };
  }

  const prevValue = adapter.add(
    p.date,
    -1,
    p.type as AdapterUnit
  );

  return period(adapter, prevValue, p.type as AdapterUnit);
}
