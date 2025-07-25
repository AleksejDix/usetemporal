import type { Period, Unit, Temporal, AdapterUnit } from "../types";
import { getUnitDefinition } from "../unit-registry";

/**
 * Create a period of a specific type from another period
 * Uses the period's date as the reference point
 */
export function createPeriod(
  temporal: Temporal,
  type: Unit,
  period: Period
): Period {
  const { adapter } = temporal;
  const date = period.date;

  if (type === "custom") {
    // For custom periods, just return the original period
    return period;
  }


  // Check if this is a registered custom unit
  const unitDefinition = getUnitDefinition(type);
  if (unitDefinition) {
    const { start, end } = unitDefinition.createPeriod(date, adapter);
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
