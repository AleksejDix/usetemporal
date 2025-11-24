import * as ops from "@allystudio/usetemporal/operations";
import type {
  AdapterUnit,
  Period,
  Unit,
} from "@allystudio/usetemporal";
import type { TemporalBuilder, VueTemporal } from "./types";

/**
 * Create a temporal builder with convenient method wrappers
 *
 * This wraps pure operations with automatic adapter passing.
 * Each method is tree-shakable - unused methods add 0KB to bundle.
 *
 * @param temporal - The base temporal instance
 * @returns A temporal builder with convenience methods
 *
 * @example
 * ```typescript
 * const temporal = createTemporal({ adapter: nativeAdapter, date: new Date() });
 * const builder = createTemporalBuilder(temporal);
 *
 * const year = builder.period(new Date(), 'year');
 * const months = builder.divide(year, 'month');
 * ```
 */
export function createTemporalBuilder(temporal: VueTemporal): TemporalBuilder {
  return {
    get adapter() {
      return temporal.adapter;
    },
    set adapter(value) {
      temporal.adapter = value;
    },
    get weekStartsOn() {
      return temporal.weekStartsOn;
    },
    set weekStartsOn(value) {
      temporal.weekStartsOn = value;
    },
    get browsing() {
      return temporal.browsing;
    },
    set browsing(value) {
      temporal.browsing = value;
    },
    get now() {
      return temporal.now;
    },
    set now(value) {
      temporal.now = value;
    },

    period(dateOrOptions: Date | CustomPeriodOptions, unit?: Unit): Period {
      if (typeof dateOrOptions === "object" && "start" in dateOrOptions) {
        // Custom period
        return ops.period(temporal.adapter, dateOrOptions);
      }
      // Standard period
      return ops.period(temporal.adapter, dateOrOptions as Date, unit!);
    },

    divide(period: Period, unit: AdapterUnit): Period[] {
      return ops.divide(temporal.adapter, period, unit);
    },

    merge(periods: Period[], targetUnit?: AdapterUnit): Period | null {
      return ops.merge(temporal.adapter, periods, targetUnit);
    },

    next(period: Period, count: number = 1): Period {
      if (count === 1) {
        return ops.next(temporal.adapter, period);
      }
      return ops.go(temporal.adapter, period, count);
    },

    previous(period: Period, count: number = 1): Period {
      if (count === 1) {
        return ops.previous(temporal.adapter, period);
      }
      return ops.go(temporal.adapter, period, -count);
    },

    go(period: Period, count: number): Period {
      return ops.go(temporal.adapter, period, count);
    },

    split(period: Period, date: Date): [Period, Period] {
      return ops.split(period, date);
    },

    contains(period: Period, dateOrPeriod: Date | Period): boolean {
      return ops.contains(period, dateOrPeriod);
    },

    isSame(
      period1: Period,
      period2: Period,
      unit: AdapterUnit | "custom"
    ): boolean {
      return ops.isSame(temporal.adapter, period1, period2, unit);
    },
  };
}

interface CustomPeriodOptions {
  start: Date;
  end: Date;
}
