import type { Period, TemporalContext } from "../types";
import { go } from "./go";

/**
 * Move to the next period
 */
export function next(ctx: TemporalContext, p: Period): Period {
  return go(ctx, p, 1);
}
