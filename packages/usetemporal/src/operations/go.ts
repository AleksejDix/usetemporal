import type { Period, Temporal, AdapterUnit } from "../types";
import { period } from "./period";
import { getUnitDefinition } from "../unit-registry";

/**
 * Move by a specific number of periods
 */
export function go(temporal: Temporal, p: Period, steps: number): Period {
  if (steps === 0) return p;

  const { adapter } = temporal;

  // Handle custom periods by using duration
  if (p.type === "custom") {
    const duration = p.end.getTime() - p.start.getTime() + 1;
    let newStart: Date;
    if (steps > 0) {
      newStart = new Date(p.start.getTime() + duration * steps);
    } else {
      newStart = new Date(p.start.getTime() - duration * Math.abs(steps));
    }
    const newEnd = new Date(newStart.getTime() + duration - 1);
    return {
      start: newStart,
      end: newEnd,
      type: "custom",
      date: newStart,
    };
  }


  // Check if this is a custom unit
  const unitDef = getUnitDefinition(p.type);
  if (unitDef) {
    // For custom units, calculate the duration and shift by that amount
    const duration = p.end.getTime() - p.start.getTime() + 1;
    let newStart: Date;
    if (steps > 0) {
      newStart = new Date(p.start.getTime() + duration * steps);
    } else {
      newStart = new Date(p.start.getTime() - duration * Math.abs(steps));
    }
    
    // Use the unit definition to create the proper period
    const { start, end } = unitDef.period(newStart, adapter);
    return {
      start,
      end,
      type: p.type,
      date: newStart,
    };
  }

  // Use adapter for built-in units
  if (isAdapterUnit(p.type)) {
    let newValue: Date;
    
    // Special handling for large day steps to handle leap years correctly
    if (p.type === "day" && Math.abs(steps) >= 365) {
      // For steps that are roughly a year or more, use year-based navigation
      // This makes go(date, 365) move to the same date next year
      const years = Math.floor(steps / 365);
      const remainingDays = steps % 365;
      
      // First add the years
      let result = new Date(p.date);
      result.setFullYear(result.getFullYear() + years);
      
      // Then add remaining days
      if (remainingDays !== 0) {
        result = adapter.add(result, remainingDays, "day");
      }
      
      newValue = result;
    } else {
      // Use adapter for smaller steps or non-day units
      newValue = adapter.add(p.date, steps, p.type);
    }
    
    // Create a temporary point-in-time period for the new date
    const tempPeriod: Period = {
      start: newValue,
      end: newValue,
      type: "second",
      date: newValue,
    };

    return period(temporal, newValue, p.type);
  }

  throw new Error(`Unknown unit type: ${p.type}`);
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
