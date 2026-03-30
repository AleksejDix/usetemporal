import type { UnitHandler } from "../../types";
import dayjs, { type ManipulateType, type OpUnitType } from "dayjs";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(quarterOfYear);

function handler(
  startEndUnit: OpUnitType,
  addUnit: ManipulateType
): UnitHandler {
  return {
    startOf: (date) => dayjs(date).startOf(startEndUnit).toDate(),
    endOf: (date) => dayjs(date).endOf(startEndUnit).toDate(),
    add: (date, amount) => dayjs(date).add(amount, addUnit).toDate(),
    diff: (from, to) => dayjs(to).diff(dayjs(from), startEndUnit),
  };
}

export function createWeekHandler(weekStartsOn: number): UnitHandler {
  const base = handler("week", "week");
  return {
    startOf: (date) => {
      const d = dayjs(date);
      const day = d.day();
      const diff = (day - weekStartsOn + 7) % 7;
      return d.subtract(diff, "day").startOf("day").toDate();
    },
    endOf: (date) => {
      const d = dayjs(date);
      const day = d.day();
      const diff = (day - weekStartsOn + 7) % 7;
      return d.subtract(diff, "day").add(6, "day").endOf("day").toDate();
    },
    add: base.add,
    diff: base.diff,
  };
}

export const yearHandler = handler("year", "year");
export const quarterHandler: UnitHandler = {
  startOf: (date) => dayjs(date).startOf("quarter").toDate(),
  endOf: (date) => dayjs(date).endOf("quarter").toDate(),
  add: (date, amount) =>
    dayjs(date)
      .add(amount * 3, "month")
      .toDate(),
  diff: (from, to) => dayjs(to).diff(dayjs(from), "quarter"),
};
export const monthHandler = handler("month", "month");
export const dayHandler = handler("day", "day");
export const hourHandler = handler("hour", "hour");
export const minuteHandler = handler("minute", "minute");
export const secondHandler = handler("second", "second");
