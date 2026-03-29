import type { UnitHandler } from "../../types";
import { DateTime } from "luxon";

type LuxonUnit =
  | "years"
  | "quarters"
  | "months"
  | "days"
  | "hours"
  | "minutes"
  | "seconds";
type LuxonStartOf =
  | "year"
  | "quarter"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second";

function handler(
  unit: LuxonStartOf,
  addKey: LuxonUnit,
  diffKey: LuxonUnit
): UnitHandler {
  return {
    startOf: (date) => DateTime.fromJSDate(date).startOf(unit).toJSDate(),
    endOf: (date) => DateTime.fromJSDate(date).endOf(unit).toJSDate(),
    add: (date, amount) =>
      DateTime.fromJSDate(date)
        .plus({ [addKey]: amount })
        .toJSDate(),
    diff: (from, to) => {
      const start = DateTime.fromJSDate(from);
      const end = DateTime.fromJSDate(to);
      return Math.floor(end.diff(start, diffKey)[diffKey]);
    },
  };
}

export const yearHandler = handler("year", "years", "years");
export const quarterHandler = handler("quarter", "quarters", "quarters");
export const monthHandler = handler("month", "months", "months");
export const dayHandler = handler("day", "days", "days");
export const hourHandler = handler("hour", "hours", "hours");
export const minuteHandler = handler("minute", "minutes", "minutes");
export const secondHandler = handler("second", "seconds", "seconds");
