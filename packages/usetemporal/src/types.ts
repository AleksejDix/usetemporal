/** Metadata for stableMonth periods */
export interface StableMonthMeta {
  weekStartsOn: number;
  monthStart: Date;
}

/** Metadata for stableYear periods */
export interface StableYearMeta {
  weekStartsOn: number;
  yearStart: Date;
}

/** A single time range — derived from adapter or custom boundaries */
export interface TimePeriod {
  start: Date;
  end: Date;
  type: AdapterUnit | "custom";
}

/** A predictable sequence container — exists to be subdivided */
export type PeriodSeries =
  | { start: Date; end: Date; type: "stableMonth"; meta: StableMonthMeta }
  | { start: Date; end: Date; type: "stableYear"; meta: StableYearMeta };

/** Either a time period or a series container */
export type Period = TimePeriod | PeriodSeries;

/**
 * Registry for unit types - extend this interface to add custom units
 */
export interface UnitRegistry {
  year: true;
  quarter: true;
  month: true;
  week: true;
  day: true;
  hour: true;
  minute: true;
  second: true;
}

/**
 * Unified type for all time units
 * Extensible via module augmentation of UnitRegistry
 */
export type AdapterUnit = keyof UnitRegistry;
export type Unit = AdapterUnit | "custom" | "stableMonth" | "stableYear";

/**
 * All available time unit constants grouped for better autocomplete and imports.
 *
 * @example
 * import { UNITS } from '@usetemporal/core'
 *
 * // Better autocomplete
 * const months = divide(temporal, year, UNITS.month)
 * const days = divide(temporal, month, UNITS.day)
 */
export const UNITS = Object.freeze({
  year: "year",
  quarter: "quarter",
  month: "month",
  week: "week",
  day: "day",
  hour: "hour",
  minute: "minute",
  second: "second",
  custom: "custom",
} as const);

// Individual exports for convenience
export const YEAR = "year" as const;
export const QUARTER = "quarter" as const;
export const MONTH = "month" as const;
export const WEEK = "week" as const;
export const DAY = "day" as const;
export const HOUR = "hour" as const;
export const MINUTE = "minute" as const;
export const SECOND = "second" as const;
export const CUSTOM = "custom" as const;

/**
 * Type definition for the UNITS object
 */
export type UnitsObject = typeof UNITS;

/**
 * A navigator knows how to advance a derived period type (e.g., stableMonth).
 * Unlike adapter.add(), navigators reconstruct the period properly.
 */
export type PeriodNavigator = (
  adapter: Adapter,
  period: Period,
  steps: number
) => Period;

/**
 * Context for temporal operations.
 * Holds the adapter for time math and optional navigators for derived period types.
 */
export interface TemporalContext {
  adapter: Adapter;
  weekStartsOn: number;
  navigators: ReadonlyMap<string, PeriodNavigator>;
}

// Adapter Types
export interface Duration {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

export interface AdapterOptions {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Known adapter units (units that adapters must implement)
 */

/**
 * Simplified functional adapter interface (RFC 015)
 * Only 4 core operations needed for date manipulation
 */
export interface Adapter {
  startOf(date: Date, unit: AdapterUnit): Date;
  endOf(date: Date, unit: AdapterUnit): Date;
  add(date: Date, amount: number, unit: AdapterUnit): Date;
  diff(from: Date, to: Date, unit: AdapterUnit): number;
}

/**
 * Unit handler for functional adapters
 * Each unit has its own implementation
 */
export interface UnitHandler {
  startOf(date: Date): Date;
  endOf(date: Date): Date;
  add(date: Date, amount: number): Date;
  diff(from: Date, to: Date): number;
}

// Split operation options
export interface SplitOptions {
  by?: Exclude<Unit, "custom">; // Split by unit type
  count?: number; // Split into N equal parts
  duration?: {
    // Split by duration
    days?: number;
    hours?: number;
    weeks?: number;
  };
}
