import type { Period, TemporalContext } from "../types";
import { go } from "./go";

/**
 * Move to the previous period
 */
export function previous(ctx: TemporalContext, p: Period): Period {
  return go(ctx, p, -1);
}
