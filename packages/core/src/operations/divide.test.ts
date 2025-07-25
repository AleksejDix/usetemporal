import { describe, it, expect } from "vitest";
import { divide } from "./divide";
import { createTemporal } from "../createTemporal";
import { createMockAdapter } from "../test/functionalMockAdapter";
import { TEST_DATE, testDates } from "../test/testDates";
import type { Period } from "../types";

describe("divide", () => {
  const temporal = createTemporal({
    date: TEST_DATE,
    adapter: createMockAdapter({ weekStartsOn: 1 }),
    weekStartsOn: 1, // Monday
  });

  it("should divide year into months", () => {
    const year: Period = {
      start: testDates.jan1,
      end: testDates.dec31,
      type: "year",
      date: testDates.jun15,
    };

    const months = divide(temporal, year, "month");

    expect(months).toHaveLength(12);
    expect(months[0].start.getMonth()).toBe(0);
    expect(months[11].start.getMonth()).toBe(11);
  });

  it("should divide month into days", () => {
    const january: Period = {
      start: testDates.jan1,
      end: new Date(2024, 0, 31, 23, 59, 59, 999),
      type: "month",
      date: testDates.jan15,
    };

    const days = divide(temporal, january, "day");

    expect(days).toHaveLength(31); // January has 31 days
  });

  it("should divide week into days", () => {
    const week: Period = {
      start: new Date(2024, 0, 8), // Monday
      end: new Date(2024, 0, 14, 23, 59, 59, 999), // Sunday
      type: "week",
      date: testDates.jan10,
    };

    const days = divide(temporal, week, "day");

    expect(days).toHaveLength(7);
    expect(days[0].start.getDay()).toBe(1); // Monday
    expect(days[6].start.getDay()).toBe(0); // Sunday
  });

  it("should divide day into hours", () => {
    const day: Period = {
      start: new Date(2024, 0, 15, 0, 0, 0),
      end: new Date(2024, 0, 15, 23, 59, 59, 999),
      type: "day",
      date: testDates.jan15,
    };

    const hours = divide(temporal, day, "hour");

    expect(hours).toHaveLength(24);
  });


  it("should respect weekStartsOn when dividing by week", () => {
    const sundayTemporal = createTemporal({
      date: TEST_DATE,
      adapter: createMockAdapter({ weekStartsOn: 0 }),
      weekStartsOn: 0, // Sunday
    });

    const january: Period = {
      start: testDates.jan1,
      end: new Date(2024, 0, 31, 23, 59, 59, 999),
      type: "month",
      date: testDates.jan15,
    };

    const weeks = divide(sundayTemporal, january, "week");

    // Check that weeks respect Sunday as start day
    // Since Jan 1, 2024 is Monday, the first partial week starts on Monday
    // But the second week should start on Sunday
    if (weeks.length > 1) {
      const secondWeekStart = weeks[1].start.getDay();
      expect(secondWeekStart).toBe(0); // Sunday
    }
  });
});
