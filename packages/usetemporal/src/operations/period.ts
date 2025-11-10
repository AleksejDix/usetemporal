import type { Period, Unit, Temporal, AdapterUnit } from "../types";
import { getUnitDefinition } from "../unit-registry";

// Type for custom period options
interface CustomPeriodOptions {
  start: Date;
  end: Date;
}

/**
 * Create a period of a specific type from a date
 * @param temporal - The temporal instance
 * @param date - The date to create the period from
 * @param unit - The unit type
 * @returns A period of the specified type
 */
export function period(temporal: Temporal, date: Date, unit: Unit): Period;

/**
 * Create a custom period with specific start and end dates
 * @param temporal - The temporal instance (for consistency, though not used for custom periods)
 * @param options - Object with start and end dates
 * @returns A custom period
 */
export function period(temporal: Temporal, options: CustomPeriodOptions): Period;

/**
 * Create a period of a specific type from a date or create a custom period
 * 
 * @example
 * // Standard period from date
 * period(temporal, new Date(), "month")
 * 
 * @example
 * // Custom period with start and end
 * period(temporal, { start: new Date('2024-01-01'), end: new Date('2024-03-31') })
 */
export function period(
  temporal: Temporal,
  dateOrOptions: Date | CustomPeriodOptions,
  unit?: Unit
): Period {
  // Check if this is a custom period request
  if ('start' in dateOrOptions && 'end' in dateOrOptions) {
    // Custom period logic
    const { start, end } = dateOrOptions;
    return {
      start,
      end,
      type: "custom",
      date: new Date((start.getTime() + end.getTime()) / 2),
    };
  }

  // Standard period logic
  const { adapter } = temporal;
  const date = dateOrOptions as Date;
  const type = unit!; // We know unit is defined when dateOrOptions is a Date

  // Check if this is a registered custom unit
  const unitDefinition = getUnitDefinition(type);
  if (unitDefinition) {
    const { start, end } = unitDefinition.period(date, adapter);
    return {
      start,
      end,
      type,
      date,
    };
  }

  // Fall back to adapter built-in units
  if (isAdapterUnit(type)) {
    const start = adapter.startOf(date, type);
    const end = adapter.endOf(date, type);

    return {
      start,
      end,
      type,
      date,
    };
  }

  throw new Error(`Unknown unit type: ${type}`);
}

/**
 * Type guard to check if a unit is an adapter unit
 */
function isAdapterUnit(unit: string): unit is AdapterUnit {
  const adapterUnits: AdapterUnit[] = [
    "year",
    "quarter", 
    "month",
    "week",
    "day",
    "hour",
    "minute",
    "second",
  ];
  return adapterUnits.includes(unit as AdapterUnit);
}