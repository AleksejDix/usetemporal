import type { Adapter, AdapterUnit, UnitHandler } from "../../types";
import { createYearHandler } from "./units/year";
import { createQuarterHandler } from "./units/quarter";
import { createMonthHandler } from "./units/month";
import { createWeekHandler } from "./units/week";
import { createDayHandler } from "./units/day";
import { createHourHandler } from "./units/hour";
import { createMinuteHandler } from "./units/minute";
import { createSecondHandler } from "./units/second";

/**
 * Create a timezone-aware date-fns adapter
 * 
 * @param options - Adapter configuration options
 * @param options.timezone - IANA timezone string (e.g., 'America/New_York', 'Europe/London')
 * @param options.weekStartsOn - First day of the week (0 = Sunday, 1 = Monday, etc.)
 * @returns Adapter instance with timezone support
 */
export function createDateFnsTzAdapter(options?: {
  timezone?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}): Adapter {
  const timezone = options?.timezone ?? "UTC";
  const weekStartsOn = options?.weekStartsOn ?? 1;
  
  // Create timezone-aware handlers
  const handlers: Record<AdapterUnit, UnitHandler> = {
    year: createYearHandler(timezone),
    quarter: createQuarterHandler(timezone),
    month: createMonthHandler(timezone),
    week: createWeekHandler(timezone, weekStartsOn),
    day: createDayHandler(timezone),
    hour: createHourHandler(timezone),
    minute: createMinuteHandler(timezone),
    second: createSecondHandler(timezone),
  };

  return {
    startOf(date: Date, unit: AdapterUnit): Date {
      return handlers[unit].startOf(date);
    },

    endOf(date: Date, unit: AdapterUnit): Date {
      return handlers[unit].endOf(date);
    },

    add(date: Date, amount: number, unit: AdapterUnit): Date {
      return handlers[unit].add(date, amount);
    },

    diff(from: Date, to: Date, unit: AdapterUnit): number {
      return handlers[unit].diff(from, to);
    },
  };
}

// Export a default instance with UTC timezone
export const dateFnsTzAdapter = createDateFnsTzAdapter({ timezone: "UTC", weekStartsOn: 1 });