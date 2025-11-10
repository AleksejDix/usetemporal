/**
 * StableYear unit - Always returns a consistent grid of full weeks (52 or 53) for year visualizations
 */

import { defineUnit } from "../unit-registry";
import type { Adapter } from "../types";

/**
 * Helper to calculate the stable year grid boundaries
 * 
 * The stable year grid includes:
 * - All weeks that contain any days of the target year
 * - Always starts on the configured weekStartsOn day
 * - Results in 52 or 53 full weeks depending on year boundaries
 * 
 * This is ideal for GitHub-style contribution grids and week-based year overviews
 */
function getStableYearBounds(date: Date, adapter: Adapter, weekStartsOn: number = 1) {
  // Get the first day of the year
  const yearStart = adapter.startOf(date, "year");
  
  // Find the start of the week containing the first day of the year
  let gridStart = yearStart;
  const firstDayOfWeek = gridStart.getDay();
  const daysToSubtract = (firstDayOfWeek - weekStartsOn + 7) % 7;
  
  if (daysToSubtract > 0) {
    gridStart = adapter.add(gridStart, -daysToSubtract, "day");
  }
  
  // Get the last day of the year
  const yearEnd = adapter.endOf(date, "year");
  
  // Find the end of the week containing the last day of the year
  let gridEnd = yearEnd;
  const lastDayOfWeek = gridEnd.getDay();
  const daysToAdd = (weekStartsOn + 6 - lastDayOfWeek) % 7;
  
  if (daysToAdd > 0) {
    gridEnd = adapter.add(gridEnd, daysToAdd, "day");
  }
  
  // Ensure we have the end of the last day
  gridEnd = adapter.endOf(gridEnd, "day");
  
  return { start: gridStart, end: gridEnd };
}

// Define the stableYear unit
defineUnit("stableYear", {
  period(date: Date, adapter: Adapter) {
    // For stableYear, we return the full-week grid boundaries
    // Note: weekStartsOn defaults to 1 (Monday) here, but will use temporal's value in divide
    return getStableYearBounds(date, adapter, 1);
  },
  
  validate(period) {
    // A stableYear is valid if it spans exactly 52 or 53 weeks
    const ms = period.end.getTime() - period.start.getTime();
    const days = Math.round(ms / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusive end
    const weeks = days / 7;
    return weeks === 52 || weeks === 53;
  },
  
  divisions: ["week", "day"],
  mergesTo: undefined, // stableYear doesn't merge to anything larger
});

/**
 * Helper function to properly create a stableYear with correct weekStartsOn
 * This should be used instead of the standard period when you need the proper weekStartsOn
 * 
 * @example
 * const stableYear = createStableYear(temporal, new Date());
 * const weeks = divide(temporal, stableYear, 'week'); // 52 or 53 weeks
 * 
 * @example
 * // GitHub-style contribution grid
 * const year = createStableYear(temporal, new Date());
 * const days = divide(temporal, year, 'day');
 * // Group days into weeks for grid display
 */
export function createStableYear(temporal: any, date: Date): any {
  const { adapter, weekStartsOn } = temporal;
  const bounds = getStableYearBounds(date, adapter, weekStartsOn);
  
  return {
    start: bounds.start,
    end: bounds.end,
    type: "stableYear",
    date: adapter.startOf(date, "year"), // Reference date is the actual year start
  };
}

// TypeScript module augmentation
declare module "@allystudio/usetemporal" {
  interface UnitRegistry {
    stableYear: true;
  }
}