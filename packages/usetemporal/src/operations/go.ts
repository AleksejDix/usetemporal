import type { Period, Adapter, AdapterUnit } from "../types";
import { period } from "./period";
import { shiftCustomPeriod } from "./customPeriod";

/**
 * Move by a specific number of periods
 */
export function go(adapter: Adapter, p: Period, steps: number): Period {
  if (steps === 0) return p;

  if (
    p.type === "custom" ||
    p.type === "stableMonth" ||
    p.type === "stableYear"
  ) {
    return shiftCustomPeriod(p, steps);
  }

  const unit: AdapterUnit = p.type;
  const newValue = adapter.add(p.date, steps, unit);

  return period(adapter, newValue, unit);
}
