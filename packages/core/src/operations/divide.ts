import type { Period, Unit, Temporal, AdapterUnit } from "../types";
import { getUnitDefinition } from "../unit-registry";

/**
 * Divide a period into smaller units
 */
export function divide(
  temporal: Temporal,
  period: Period,
  unit: Unit
): Period[] {
  const { adapter } = temporal;

  if (unit === "custom") {
    throw new Error(
      "Cannot divide by custom unit. Custom periods have arbitrary boundaries."
    );
  }

  // Check if the parent period type has division info
  const parentUnitDef = getUnitDefinition(period.type);
  if (parentUnitDef?.divisions && !parentUnitDef.divisions.includes(unit)) {
    throw new Error(
      `Unit '${period.type}' cannot be divided into '${unit}'. Valid divisions: ${parentUnitDef.divisions.join(", ")}`
    );
  }

  // Standard division - calculate intervals manually
  const periods: Period[] = [];
  let current = new Date(period.start);

  // Check if this is a custom unit with definition
  const unitDef = getUnitDefinition(unit);

  while (current <= period.end) {
    let start: Date;
    let end: Date;

    if (unitDef) {
      // Use custom unit definition
      const { start: unitStart, end: unitEnd } = unitDef.createPeriod(current, adapter);
      start = unitStart;
      end = unitEnd;
    } else {
      // Use adapter built-in units
      const safeUnit = unit as AdapterUnit;
      start = adapter.startOf(current, safeUnit);
      end = adapter.endOf(current, safeUnit);
    }

    // Only include periods that overlap with the parent period
    if (end >= period.start && start <= period.end) {
      periods.push({
        start: start < period.start ? period.start : start,
        end: end > period.end ? period.end : end,
        type: unit,
        date: new Date(current),
      });
    }

    // Move to next period
    if (unitDef) {
      // For custom units, move to the day after the end
      current = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    } else {
      const safeUnit = unit as AdapterUnit;
      current = adapter.add(current, 1, safeUnit);
    }

    // For safety, break if we've gone too far (prevent infinite loops)
    if (periods.length > 1000) {
      throw new Error("Too many periods generated in divide operation");
    }
  }

  return periods;
}