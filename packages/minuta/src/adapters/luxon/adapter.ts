import type { Adapter } from "../../types";
import { createAdapter } from "../createAdapter";
import {
  yearHandler,
  quarterHandler,
  monthHandler,
  dayHandler,
  hourHandler,
  minuteHandler,
  secondHandler,
} from "./handlers";
import { createWeekHandler } from "./units/week";

export function createLuxonAdapter({
  weekStartsOn = 1,
}: { weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 } = {}): Adapter {
  return createAdapter({
    year: yearHandler,
    quarter: quarterHandler,
    month: monthHandler,
    week: createWeekHandler(weekStartsOn),
    day: dayHandler,
    hour: hourHandler,
    minute: minuteHandler,
    second: secondHandler,
  });
}

export const luxonAdapter = createLuxonAdapter({ weekStartsOn: 1 });
