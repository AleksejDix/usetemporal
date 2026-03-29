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
import { fromZonedTime, toZonedTime } from "date-fns-tz";

function handler(
  timezone: string,
  startOfFn: (d: Date) => Date,
  endOfFn: (d: Date) => Date,
  addKey: string,
  diffFn: (a: Date, b: Date) => number
): UnitHandler {
  return {
    startOf: (date) =>
      fromZonedTime(startOfFn(toZonedTime(date, timezone)), timezone),
    endOf: (date) =>
      fromZonedTime(endOfFn(toZonedTime(date, timezone)), timezone),
    add: (date, amount) =>
      fromZonedTime(
        add(toZonedTime(date, timezone), { [addKey]: amount }),
        timezone
      ),
    diff: (from, to) =>
      diffFn(toZonedTime(to, timezone), toZonedTime(from, timezone)),
  };
}

export function createYearHandler(tz: string) {
  return handler(tz, startOfYear, endOfYear, "years", differenceInYears);
}
export function createQuarterHandler(tz: string): UnitHandler {
  return {
    startOf: (date) => fromZonedTime(startOfQuarter(toZonedTime(date, tz)), tz),
    endOf: (date) => fromZonedTime(endOfQuarter(toZonedTime(date, tz)), tz),
    add: (date, amount) =>
      fromZonedTime(add(toZonedTime(date, tz), { months: amount * 3 }), tz),
    diff: (from, to) =>
      differenceInQuarters(toZonedTime(to, tz), toZonedTime(from, tz)),
  };
}
export function createMonthHandler(tz: string) {
  return handler(tz, startOfMonth, endOfMonth, "months", differenceInMonths);
}
export function createDayHandler(tz: string) {
  return handler(tz, startOfDay, endOfDay, "days", differenceInDays);
}
export function createHourHandler(tz: string) {
  return handler(tz, startOfHour, endOfHour, "hours", differenceInHours);
}
export function createMinuteHandler(tz: string) {
  return handler(
    tz,
    startOfMinute,
    endOfMinute,
    "minutes",
    differenceInMinutes
  );
}
export function createSecondHandler(tz: string) {
  return handler(
    tz,
    startOfSecond,
    endOfSecond,
    "seconds",
    differenceInSeconds
  );
}
