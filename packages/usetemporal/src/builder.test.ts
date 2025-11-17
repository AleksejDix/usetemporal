import { describe, it, expect, beforeEach } from "vitest";
import { createTemporal } from "./createTemporal";
import { createNativeAdapter } from "./native";
import type { TemporalBuilder } from "./builder";

describe("Temporal Builder API", () => {
  let temporal: TemporalBuilder;
  let testDate: Date;

  beforeEach(() => {
    testDate = new Date(2024, 0, 15); // Jan 15, 2024
    temporal = createTemporal({
      adapter: createNativeAdapter(),
      date: testDate,
    });
  });

  describe("createTemporal returns builder", () => {
    it("should return a TemporalBuilder with methods", () => {
      expect(temporal).toHaveProperty("period");
      expect(temporal).toHaveProperty("divide");
      expect(temporal).toHaveProperty("merge");
      expect(temporal).toHaveProperty("next");
      expect(temporal).toHaveProperty("previous");
      expect(temporal).toHaveProperty("go");
      expect(temporal).toHaveProperty("split");
      expect(temporal).toHaveProperty("contains");
      expect(temporal).toHaveProperty("isSame");
    });

    it("should have base Temporal properties", () => {
      expect(temporal).toHaveProperty("adapter");
      expect(temporal).toHaveProperty("weekStartsOn");
      expect(temporal).toHaveProperty("browsing");
      expect(temporal).toHaveProperty("now");
    });
  });

  describe("period method", () => {
    it("should create a period from date and unit", () => {
      const month = temporal.period(testDate, "month");

      expect(month.type).toBe("month");
      expect(month.date).toEqual(testDate);
      expect(month.start).toBeInstanceOf(Date);
      expect(month.end).toBeInstanceOf(Date);
    });

    it("should create custom period with start/end", () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 0, 31);
      const custom = temporal.period({ start, end });

      expect(custom.type).toBe("custom");
      expect(custom.start).toEqual(start);
      expect(custom.end).toEqual(end);
    });

    it("should create periods for all standard units", () => {
      const units = ["year", "quarter", "month", "week", "day", "hour", "minute", "second"] as const;

      units.forEach((unit) => {
        const p = temporal.period(testDate, unit);
        expect(p.type).toBe(unit);
      });
    });
  });

  describe("divide method", () => {
    it("should divide a year into months", () => {
      const year = temporal.period(testDate, "year");
      const months = temporal.divide(year, "month");

      expect(months).toHaveLength(12);
      expect(months[0].type).toBe("month");
      expect(months[11].type).toBe("month");
    });

    it("should divide a month into days", () => {
      const month = temporal.period(new Date(2024, 0, 1), "month");
      const days = temporal.divide(month, "day");

      expect(days.length).toBe(31); // January has 31 days
      expect(days[0].type).toBe("day");
    });

    it("should divide a week into days", () => {
      const week = temporal.period(testDate, "week");
      const days = temporal.divide(week, "day");

      expect(days).toHaveLength(7);
      expect(days[0].type).toBe("day");
    });
  });

  describe("merge method", () => {
    it("should merge three consecutive months into a quarter", () => {
      const year = temporal.period(new Date(2024, 0, 1), "year");
      const months = temporal.divide(year, "month");
      const firstQuarter = months.slice(0, 3);

      const merged = temporal.merge(firstQuarter);

      expect(merged).not.toBeNull();
      expect(merged!.type).toBe("quarter");
    });

    it("should merge all months into a year with target unit", () => {
      const year = temporal.period(new Date(2024, 0, 1), "year");
      const months = temporal.divide(year, "month");

      const merged = temporal.merge(months, "year");

      expect(merged).not.toBeNull();
      expect(merged!.type).toBe("year");
    });

    it("should merge with target unit", () => {
      const year = temporal.period(new Date(2024, 0, 1), "year");
      const months = temporal.divide(year, "month");
      const firstTwo = months.slice(0, 2);

      // Merge without specifying target - should return custom
      const merged = temporal.merge(firstTwo);

      expect(merged).not.toBeNull();
      expect(merged!.type).toBe("custom");
    });
  });

  describe("next method", () => {
    it("should get next month", () => {
      const month = temporal.period(testDate, "month");
      const nextMonth = temporal.next(month);

      expect(nextMonth.type).toBe("month");
      expect(nextMonth.date.getMonth()).toBe(1); // February
      expect(nextMonth.date.getFullYear()).toBe(2024);
    });

    it("should advance multiple periods", () => {
      const month = temporal.period(testDate, "month");
      const threeMonthsLater = temporal.next(month, 3);

      expect(threeMonthsLater.date.getMonth()).toBe(3); // April (0-indexed)
    });

    it("should handle year boundaries", () => {
      const december = temporal.period(new Date(2024, 11, 15), "month");
      const nextMonth = temporal.next(december);

      expect(nextMonth.date.getMonth()).toBe(0); // January
      expect(nextMonth.date.getFullYear()).toBe(2025);
    });
  });

  describe("previous method", () => {
    it("should get previous month", () => {
      const month = temporal.period(testDate, "month");
      const prevMonth = temporal.previous(month);

      expect(prevMonth.type).toBe("month");
      expect(prevMonth.date.getMonth()).toBe(11); // December
      expect(prevMonth.date.getFullYear()).toBe(2023);
    });

    it("should go back multiple periods", () => {
      const month = temporal.period(testDate, "month");
      const threeMonthsEarlier = temporal.previous(month, 3);

      expect(threeMonthsEarlier.date.getMonth()).toBe(9); // October (0-indexed)
      expect(threeMonthsEarlier.date.getFullYear()).toBe(2023);
    });

    it("should handle year boundaries", () => {
      const january = temporal.period(new Date(2024, 0, 15), "month");
      const prevMonth = temporal.previous(january);

      expect(prevMonth.date.getMonth()).toBe(11); // December
      expect(prevMonth.date.getFullYear()).toBe(2023);
    });
  });

  describe("go method", () => {
    it("should navigate forward", () => {
      const month = temporal.period(testDate, "month");
      const future = temporal.go(month, 5);

      expect(future.date.getMonth()).toBe(5); // June (0-indexed)
    });

    it("should navigate backward", () => {
      const month = temporal.period(testDate, "month");
      const past = temporal.go(month, -3);

      expect(past.date.getMonth()).toBe(9); // October (0-indexed)
      expect(past.date.getFullYear()).toBe(2023);
    });

    it("should stay in place with count 0", () => {
      const month = temporal.period(testDate, "month");
      const same = temporal.go(month, 0);

      expect(same.date.getMonth()).toBe(month.date.getMonth());
      expect(same.date.getFullYear()).toBe(month.date.getFullYear());
    });
  });

  describe("split method", () => {
    it("should split a month into two periods", () => {
      const month = temporal.period(new Date(2024, 0, 1), "month");
      const splitDate = new Date(2024, 0, 15);

      const [before, after] = temporal.split(month, splitDate);

      expect(before.start).toEqual(month.start);
      expect(before.end.getTime()).toBeLessThan(splitDate.getTime());
      expect(after.start).toEqual(splitDate);
      expect(after.end).toEqual(month.end);
    });

    it("should split a year at midpoint", () => {
      const year = temporal.period(new Date(2024, 0, 1), "year");
      const splitDate = new Date(2024, 6, 1); // July 1

      const [first, second] = temporal.split(year, splitDate);

      expect(first.start).toEqual(year.start);
      expect(second.end).toEqual(year.end);
    });
  });

  describe("contains method", () => {
    it("should check if period contains a date", () => {
      const month = temporal.period(new Date(2024, 0, 1), "month");
      const midMonth = new Date(2024, 0, 15);
      const outsideMonth = new Date(2024, 1, 1);

      expect(temporal.contains(month, midMonth)).toBe(true);
      expect(temporal.contains(month, outsideMonth)).toBe(false);
    });

    it("should check if period contains another period", () => {
      const month = temporal.period(new Date(2024, 0, 1), "month");
      const days = temporal.divide(month, "day");
      const firstWeek = temporal.period(new Date(2024, 0, 1), "week");

      expect(temporal.contains(month, days[0])).toBe(true);
      expect(temporal.contains(month, firstWeek)).toBe(true);
    });

    it("should return false for periods outside", () => {
      const january = temporal.period(new Date(2024, 0, 1), "month");
      const february = temporal.period(new Date(2024, 1, 1), "month");

      expect(temporal.contains(january, february)).toBe(false);
    });
  });

  describe("isSame method", () => {
    it("should compare periods at same unit level", () => {
      const month1 = temporal.period(new Date(2024, 0, 1), "month");
      const month2 = temporal.period(new Date(2024, 0, 15), "month");
      const differentMonth = temporal.period(new Date(2024, 1, 1), "month");

      expect(temporal.isSame(month1, month2, "month")).toBe(true);
      expect(temporal.isSame(month1, differentMonth, "month")).toBe(false);
    });

    it("should compare at different unit levels", () => {
      const jan1 = temporal.period(new Date(2024, 0, 1), "day");
      const jan15 = temporal.period(new Date(2024, 0, 15), "day");
      const feb1 = temporal.period(new Date(2024, 1, 1), "day");

      // Same month
      expect(temporal.isSame(jan1, jan15, "month")).toBe(true);
      // Different month
      expect(temporal.isSame(jan1, feb1, "month")).toBe(false);
      // Same year
      expect(temporal.isSame(jan1, feb1, "year")).toBe(true);
    });
  });

  describe("method chaining and composition", () => {
    it("should allow chaining builder methods", () => {
      const year = temporal.period(new Date(2024, 0, 1), "year");
      const months = temporal.divide(year, "month");
      const secondMonth = months[1];
      const nextMonth = temporal.next(secondMonth);
      const days = temporal.divide(nextMonth, "day");

      expect(days[0].type).toBe("day");
      expect(nextMonth.date.getMonth()).toBe(2); // March
    });

    it("should work with operations and builder methods together", () => {
      const month = temporal.period(testDate, "month");
      const days = temporal.divide(month, "day");
      const merged = temporal.merge(days, "month");

      expect(merged).not.toBeNull();
      expect(merged!.type).toBe("month");
    });
  });

  describe("adapter integration", () => {
    it("should use the temporal adapter for all operations", () => {
      expect(temporal.adapter).toBeDefined();

      const period = temporal.period(testDate, "month");
      // Verify period was created using adapter
      expect(period.start).toBeInstanceOf(Date);
      expect(period.end).toBeInstanceOf(Date);
    });

    it("should respect weekStartsOn setting", () => {
      const mondayStart = createTemporal({
        adapter: createNativeAdapter(),
        date: testDate,
        weekStartsOn: 1, // Monday
      });

      const sundayStart = createTemporal({
        adapter: createNativeAdapter(),
        date: testDate,
        weekStartsOn: 0, // Sunday
      });

      expect(mondayStart.weekStartsOn).toBe(1);
      expect(sundayStart.weekStartsOn).toBe(0);
    });
  });
});
