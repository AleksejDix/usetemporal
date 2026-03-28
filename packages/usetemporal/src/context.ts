import type { Adapter, PeriodNavigator, TemporalContext } from "./types";

/**
 * Create a temporal context for operations.
 *
 * @example
 * import { calendarNavigators } from "@allystudio/usetemporal/calendar";
 * const ctx = createContext({
 *   adapter: createNativeAdapter({ weekStartsOn: 1 }),
 *   navigators: calendarNavigators,
 * });
 */
export function createContext({
  adapter,
  weekStartsOn = 1,
  navigators = {},
}: {
  adapter: Adapter;
  weekStartsOn?: number;
  navigators?: Record<string, PeriodNavigator>;
}): TemporalContext {
  return {
    adapter,
    weekStartsOn,
    navigators: new Map(Object.entries(navigators)),
  };
}
