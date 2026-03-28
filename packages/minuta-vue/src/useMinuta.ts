import type { MinutaBuilder } from "./types";
import { injectMinuta } from "./minutaContext";

/**
 * Injects the nearest minuta instance provided via createMinuta().
 *
 * @returns The current MinutaBuilder from context
 *
 * @example
 * ```ts
 * const temporal = useMinuta();
 * const month = temporal.period(new Date(), "month");
 * ```
 */
export function useMinuta(): MinutaBuilder {
  return injectMinuta();
}
