import type { Period, Adapter, AdapterUnit } from "../types";
import { derivePeriod } from "./period";
import { shiftCustomPeriod } from "./customPeriod";

/**
 * Move by a specific number of periods.
 * Only works with TimePeriod (adapter units + custom).
 * For PeriodSeries (stableMonth/stableYear), use createStableMonth/createStableYear directly.
 */
export function go(adapter: Adapter, p: Period, steps: number): Period {
  if (steps === 0) return p;

  if (p.type === "custom") {
    return shiftCustomPeriod(p, steps);
  }

  if (p.type === "stableMonth" || p.type === "stableYear") {
    throw new Error(
      `Cannot navigate "${p.type}" with go(). Use createStableMonth() or createStableYear() directly.`
    );
  }

  const unit: AdapterUnit = p.type;
  const newValue = adapter.add(p.start, steps, unit);

  return derivePeriod(adapter, newValue, unit);
}
