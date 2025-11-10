/**
 * StableMonth unit - Always returns a 42-day (6-week) grid for consistent calendar layouts
 */

import { defineUnit } from "../unit-registry";
import type { Adapter } from "../types";

/**
 * Helper to calculate the stable month grid boundaries
 */
function getStableMonthBounds(date: Date, adapter: Adapter, weekStartsOn: number = 1) {
  // Get the first day of the month
  const monthStart = adapter.startOf(date, "month");
  
  // Find the start of the week containing the first day of the month
  let gridStart = monthStart;
  const firstDayOfWeek = gridStart.getDay();
  const daysToSubtract = (firstDayOfWeek - weekStartsOn + 7) % 7;
  
  if (daysToSubtract > 0) {
    gridStart = adapter.add(gridStart, -daysToSubtract, "day");
  }
  
  // Grid spans 42 days (6 weeks): add 41 days to get to the 42nd day
  const gridEnd = adapter.add(gridStart, 41, "day");
  const gridEndTime = adapter.endOf(gridEnd, "day");
  
  return { start: gridStart, end: gridEndTime };
}

// Define the stableMonth unit
defineUnit("stableMonth", {
  period(date: Date, adapter: Adapter) {
    // For stableMonth, we return the 42-day grid boundaries
    // Note: weekStartsOn defaults to 1 (Monday) here, but will use temporal's value in divide
    return getStableMonthBounds(date, adapter, 1);
  },
  
  validate(period) {
    // A stableMonth is valid if it spans exactly 42 days
    const days = Math.round((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24));
    return days === 42; // 42 days total
  },
  
  divisions: ["week", "day"],
  mergesTo: "year",
});

/**
 * Helper function to properly divide a stableMonth with correct weekStartsOn
 * This should be used instead of the standard divide when you need the proper weekStartsOn
 */
export function createStableMonth(temporal: any, date: Date): any {
  const { adapter, weekStartsOn } = temporal;
  const bounds = getStableMonthBounds(date, adapter, weekStartsOn);
  
  return {
    start: bounds.start,
    end: bounds.end,
    type: "stableMonth",
    date: adapter.startOf(date, "month"), // Reference date is the actual month start
  };
}

// TypeScript module augmentation
declare module "@allystudio/usetemporal" {
  interface UnitRegistry {
    stableMonth: true;
  }
}