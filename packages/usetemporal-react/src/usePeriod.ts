import { useMemo } from "react";
import { period } from "@allystudio/usetemporal/operations";
import type { Period, Unit } from "@allystudio/usetemporal";
import type { TemporalBuilder } from "./types";

/**
 * Creates a reactive period of any unit type
 * Period updates when temporal.browsing changes
 *
 * @example
 * const year = usePeriod(temporal, 'year')
 * const month = usePeriod(temporal, 'month')
 */
export function usePeriod(temporal: TemporalBuilder, unit: Unit): Period {
  return useMemo(
    () => period(temporal.adapter, temporal.browsing.date, unit),
    [temporal.adapter, temporal.browsing, unit]
  );
}
