import { computed, isRef, ref } from "vue";
import type { Period } from "@allystudio/usetemporal";
import { createTemporalBuilder } from "./builder";
import type { TemporalBuilder, UseTemporalOptions, VueTemporal } from "./types";

/**
 * Creates a temporal instance with builder methods (Level 2 API)
 *
 * Returns a temporal builder that provides convenience methods
 * wrapping pure operations. Methods automatically pass the adapter.
 *
 * @param options - Configuration options
 * @returns A temporal builder with convenience methods
 *
 * @example
 * ```typescript
 * const temporal = useTemporal({
 *   adapter: nativeAdapter,
 *   date: new Date()
 * });
 *
 * const year = temporal.period(new Date(), "year");
 * const months = temporal.divide(year, "month");
 * ```
 */
export function useTemporal(options: UseTemporalOptions): TemporalBuilder {
  if (!options.adapter) {
    throw new Error(
      "A date adapter is required. Please install and provide an adapter from @allystudio/usetemporal/* packages."
    );
  }

  const browsingDate = isRef(options.date) ? options.date : ref(options.date);
  const nowDate = isRef(options.now)
    ? options.now
    : ref(options.now ?? new Date());

  // Create a reactive Period for browsing that represents a point in time
  const browsing = ref<Period>({
    start: browsingDate.value,
    end: browsingDate.value,
    type: "day", // Default browsing unit is day
    date: browsingDate.value,
  });

  // Create a reactive Period for now that represents a point in time
  const now = computed(() => {
    const nowValue = nowDate.value;
    return {
      start: nowValue,
      end: nowValue,
      type: "second" as const, // Most precise unit for a point in time
      date: nowValue,
    };
  });

  const temporal: VueTemporal = {
    adapter: options.adapter,
    weekStartsOn: options.weekStartsOn ?? 1, // Default to Monday
    browsing,
    now,
  };

  return createTemporalBuilder(temporal);
}
