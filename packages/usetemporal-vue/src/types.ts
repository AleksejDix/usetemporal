import type { Adapter, AdapterUnit, Period, Unit } from "@allystudio/usetemporal";
import type { ComputedRef, Ref } from "vue";

/**
 * Vue-specific temporal instance with reactive state.
 * Browsing and now periods remain fully reactive while core adapter logic
 * comes from @allystudio/usetemporal.
 */
export interface VueTemporal {
  adapter: Adapter;
  weekStartsOn: number;
  browsing: Ref<Period>;
  now: Ref<Period> | ComputedRef<Period>;
}

/**
 * Options for creating a Vue temporal instance.
 * Accepts native dates or refs so state can be controlled externally.
 */
export interface UseTemporalOptions {
  date: Date | Ref<Date>;
  now?: Date | Ref<Date>;
  adapter: Adapter;
  weekStartsOn?: number;
}

export interface TemporalBuilder extends VueTemporal {
  period(date: Date, unit: Unit): Period;
  period(options: { start: Date; end: Date }): Period;
  divide(period: Period, unit: AdapterUnit): Period[];
  merge(periods: Period[], targetUnit?: AdapterUnit): Period | null;
  next(period: Period, count?: number): Period;
  previous(period: Period, count?: number): Period;
  go(period: Period, count: number): Period;
  split(period: Period, date: Date): [Period, Period];
  contains(period: Period, dateOrPeriod: Date | Period): boolean;
  isSame(
    period1: Period,
    period2: Period,
    unit: AdapterUnit | "custom"
  ): boolean;
}

export type { Adapter, AdapterUnit, Period, Unit, Duration } from "@allystudio/usetemporal";
