import { derived, readable, type Readable } from "svelte/store";
import type { Period, Unit } from "@allystudio/usetemporal";
import { period } from "@allystudio/usetemporal/operations";
import type { SvelteTemporal } from "./types";

/**
 * Creates a derived period store for any unit.
 */
export function usePeriod(
  temporal: SvelteTemporal,
  unit: Unit | Readable<Unit>
): Readable<Period> {
  const unitStore: Readable<Unit> =
    typeof unit === "string" ? readable(unit) : unit;

  return derived([temporal.browsing, unitStore], ([$browsing, $unit]) =>
    period(temporal.adapter, $browsing.date, $unit)
  );
}
