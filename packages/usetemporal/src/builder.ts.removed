import type { Temporal, Period, Unit, AdapterUnit } from "./types";
import * as ops from "./operations";

// Type for custom period options
interface CustomPeriodOptions {
  start: Date;
  end: Date;
}

/**
 * Builder interface - convenience methods that wrap pure operations
 * This is Level 2 API - balances DX with tree-shaking
 *
 * Methods automatically pass the adapter, reducing repetitive code
 * while maintaining tree-shakability through operation imports
 */
export interface TemporalBuilder extends Temporal {
  /**
   * Create a period of a specific type from a date
   * @param date - The date to create the period from
   * @param unit - The unit type
   */
  period(date: Date, unit: Unit): Period;

  /**
   * Create a custom period with specific start and end dates
   * @param options - Object with start and end dates
   */
  period(options: CustomPeriodOptions): Period;

  /**
   * Divide a period into smaller units
   * @param period - The period to divide
   * @param unit - The unit to divide into
   */
  divide(period: Period, unit: AdapterUnit): Period[];

  /**
   * Merge multiple periods into a single period
   * @param periods - The periods to merge
   * @param targetUnit - Optional target unit for the merged period
   */
  merge(periods: Period[], targetUnit?: AdapterUnit): Period | null;

  /**
   * Get the next period
   * @param period - The current period
   * @param count - Number of periods to advance (default: 1)
   */
  next(period: Period, count?: number): Period;

  /**
   * Get the previous period
   * @param period - The current period
   * @param count - Number of periods to go back (default: 1)
   */
  previous(period: Period, count?: number): Period;

  /**
   * Navigate to a period relative to the current one
   * @param period - The current period
   * @param count - Number of periods to move (positive = forward, negative = backward)
   */
  go(period: Period, count: number): Period;

  /**
   * Split a period at a specific date
   * @param period - The period to split
   * @param date - The date to split at
   */
  split(period: Period, date: Date): [Period, Period];

  /**
   * Check if a period contains a date or another period
   * @param period - The period to check
   * @param dateOrPeriod - The date or period to check for containment
   */
  contains(period: Period, dateOrPeriod: Date | Period): boolean;

  /**
   * Check if two periods represent the same time unit
   * @param period1 - First period
   * @param period2 - Second period
   * @param unit - The unit to compare at
   */
  isSame(period1: Period, period2: Period, unit: AdapterUnit | 'custom'): boolean;
}

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
export function createTemporalBuilder(temporal: Temporal): TemporalBuilder {
  return {
    ...temporal,

    period(dateOrOptions: Date | CustomPeriodOptions, unit?: Unit): Period {
      if (typeof dateOrOptions === 'object' && 'start' in dateOrOptions) {
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

    isSame(period1: Period, period2: Period, unit: AdapterUnit | 'custom'): boolean {
      return ops.isSame(temporal.adapter, period1, period2, unit);
    },
  };
}
