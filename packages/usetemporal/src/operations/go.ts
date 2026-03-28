import type { Period, AdapterUnit, TemporalContext } from "../types";
import { derivePeriod } from "./period";
import { shiftCustomPeriod } from "./customPeriod";

/**
 * Move by a specific number of periods
 */
export function go(ctx: TemporalContext, p: Period, steps: number): Period {
  if (steps === 0) return p;

  const navigator = ctx.navigators.get(p.type);
  if (navigator) {
    return navigator(ctx.adapter, p, steps);
  }

  if (p.type === "custom") {
    return shiftCustomPeriod(p, steps);
  }

  const unit: AdapterUnit = p.type;
  const newValue = ctx.adapter.add(p.start, steps, unit);

  return derivePeriod(ctx.adapter, newValue, unit);
}
