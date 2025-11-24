import { computed, type ComputedRef, type Ref } from "vue";
import { period } from "@allystudio/usetemporal/operations";
import type { Period, Unit } from "@allystudio/usetemporal";
import type { VueTemporal } from "./types";

/**
 * Creates a reactive period of any unit type
 * This is the unified composable that can replace all individual unit composables
 *
 * @example
 * const year = usePeriod(temporal, "year")
 * const month = usePeriod(temporal, "month")
 * const customUnit = usePeriod(temporal, unitRef) // reactive unit
 */
export function usePeriod(
  temporal: VueTemporal,
  unit: Unit | Ref<Unit> | ComputedRef<Unit>
): ComputedRef<Period> {
  return computed(() => {
    const unitValue = typeof unit === "string" ? unit : unit.value;
    return period(temporal.adapter, temporal.browsing.value.date, unitValue);
  });
}
