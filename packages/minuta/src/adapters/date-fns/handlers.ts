import type { UnitHandler } from "../../types";
import {
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
  startOfHour,
  endOfHour,
  startOfMinute,
  endOfMinute,
  startOfSecond,
  endOfSecond,
  add,
  differenceInYears,
  differenceInQuarters,
  differenceInMonths,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

function handler(
  startOf: (d: Date) => Date,
  endOf: (d: Date) => Date,
  addKey: string,
  diffFn: (a: Date, b: Date) => number
): UnitHandler {
  return {
    startOf: (date) => startOf(date),
    endOf: (date) => endOf(date),
    add: (date, amount) => add(date, { [addKey]: amount }),
    diff: (from, to) => diffFn(to, from),
  };
}

export const yearHandler = handler(
  startOfYear,
  endOfYear,
  "years",
  differenceInYears
);
export const quarterHandler: UnitHandler = {
  startOf: (date) => startOfQuarter(date),
  endOf: (date) => endOfQuarter(date),
  add: (date, amount) => add(date, { months: amount * 3 }),
  diff: (from, to) => differenceInQuarters(to, from),
};
export const monthHandler = handler(
  startOfMonth,
  endOfMonth,
  "months",
  differenceInMonths
);
export const dayHandler = handler(
  startOfDay,
  endOfDay,
  "days",
  differenceInDays
);
export const hourHandler = handler(
  startOfHour,
  endOfHour,
  "hours",
  differenceInHours
);
export const minuteHandler = handler(
  startOfMinute,
  endOfMinute,
  "minutes",
  differenceInMinutes
);
export const secondHandler = handler(
  startOfSecond,
  endOfSecond,
  "seconds",
  differenceInSeconds
);
