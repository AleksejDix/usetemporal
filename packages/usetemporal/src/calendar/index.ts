/**
 * Calendar-specific utilities
 *
 * Import from '@allystudio/usetemporal/calendar'
 */
export { createStableMonth, stableMonthNavigator } from "./stableMonth";
export { createStableYear, stableYearNavigator } from "./stableYear";

import { stableMonthNavigator } from "./stableMonth";
import { stableYearNavigator } from "./stableYear";

/** All calendar navigators — pass to createContext() */
export const calendarNavigators = {
  stableMonth: stableMonthNavigator,
  stableYear: stableYearNavigator,
};
