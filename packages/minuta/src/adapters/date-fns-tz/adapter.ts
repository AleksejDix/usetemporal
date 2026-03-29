import type { Adapter } from "../../types";
import { createAdapter } from "../createAdapter";
import {
  createYearHandler,
  createQuarterHandler,
  createMonthHandler,
  createDayHandler,
  createHourHandler,
  createMinuteHandler,
  createSecondHandler,
} from "./handlers";
import { createWeekHandler } from "./units/week";

export function createDateFnsTzAdapter({
  timezone = "UTC",
  weekStartsOn = 1,
}: {
  timezone?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
} = {}): Adapter {
  return createAdapter({
    year: createYearHandler(timezone),
    quarter: createQuarterHandler(timezone),
    month: createMonthHandler(timezone),
    week: createWeekHandler(timezone, weekStartsOn),
    day: createDayHandler(timezone),
    hour: createHourHandler(timezone),
    minute: createMinuteHandler(timezone),
    second: createSecondHandler(timezone),
  });
}

export const dateFnsTzAdapter = createDateFnsTzAdapter({
  timezone: "UTC",
  weekStartsOn: 1,
});
