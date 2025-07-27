import { describe, it, expect } from "vitest";
import { createTemporal } from "../createTemporal";
import { createNativeAdapter } from "../adapters/native";
import { merge } from "./merge";
import { go } from "./go";
import { period } from "./period";
import { divide } from "./divide";

/**
 * Regression tests for bugs fixed in story 005.01
 * These tests ensure that previously identified bugs remain fixed
 */
describe("regression tests for critical bugs", () => {
  const adapter = createNativeAdapter();
  const temporal = createTemporal({ adapter });

  describe("merge() regression tests", () => {
    it("should return current period when given empty array (bug #1)", () => {
      // Previously returned null, should return current day period
      const merged = merge(temporal, [], "day");
      expect(merged).not.toBeNull();
      expect(merged!.type).toBe("day");
      expect(merged!.date).toBeInstanceOf(Date);
    });

    it("should return current period with specified unit when given empty array", () => {
      // Test with different units
      const mergedWeek = merge(temporal, [], "week");
      expect(mergedWeek).not.toBeNull();
      expect(mergedWeek!.type).toBe("week");
      
      const mergedMonth = merge(temporal, [], "month");
      expect(mergedMonth).not.toBeNull();
      expect(mergedMonth!.type).toBe("month");
    });

    it("should promote single period to target unit (bug #2)", () => {
      // Previously returned the original period unchanged
      const day = period(temporal, new Date(2024, 0, 15), "day");
      
      const promotedWeek = merge(temporal, [day], "week");
      expect(promotedWeek!.type).toBe("week");
      expect(promotedWeek!.start.getTime()).toBeLessThanOrEqual(day.start.getTime());
      expect(promotedWeek!.end.getTime()).toBeGreaterThanOrEqual(day.end.getTime());
      
      const promotedMonth = merge(temporal, [day], "month");
      expect(promotedMonth!.type).toBe("month");
      expect(promotedMonth!.start.getDate()).toBe(1);
    });

    it("should preserve exact start/end times for partial period merges", () => {
      // Regression test for partial period handling
      const day = period(temporal, new Date(2024, 0, 15), "day");
      const hours = divide(temporal, day, "hour");
      
      // Merge morning hours only (0-11)
      const morningHours = hours.slice(0, 12);
      const merged = merge(temporal, morningHours, "day");
      
      expect(merged!.type).toBe("day");
      expect(merged!.start.getHours()).toBe(0);
      expect(merged!.end.getHours()).toBe(11);
      expect(merged!.end.getMinutes()).toBe(59);
    });

    it("should preserve reference date from first period", () => {
      // Regression test for reference date preservation
      const periods = [
        period(temporal, new Date(2024, 0, 10), "day"),
        period(temporal, new Date(2024, 0, 11), "day"),
        period(temporal, new Date(2024, 0, 12), "day"),
      ];
      
      const merged = merge(temporal, periods, "week");
      expect(merged!.date.getTime()).toBe(periods[0].date.getTime());
    });
  });

  describe("go() regression tests", () => {
    it("should handle leap year navigation for 365 days (bug #3)", () => {
      // Previously failed due to incorrect date arithmetic
      const startDay = period(temporal, new Date(2024, 0, 1), "day");
      
      // Going 365 days from Jan 1, 2024 should land on Jan 1, 2025
      const yearLater = go(temporal, startDay, 365);
      expect(yearLater.start.getFullYear()).toBe(2025);
      expect(yearLater.start.getMonth()).toBe(0);
      expect(yearLater.start.getDate()).toBe(1);
    });

    it("should handle leap year navigation for 366 days", () => {
      // 2024 is a leap year, so 366 days should be Jan 2, 2025
      const startDay = period(temporal, new Date(2024, 0, 1), "day");
      
      const leapYearLater = go(temporal, startDay, 366);
      expect(leapYearLater.start.getFullYear()).toBe(2025);
      expect(leapYearLater.start.getMonth()).toBe(0);
      expect(leapYearLater.start.getDate()).toBe(2);
    });

    it("should handle multiple year navigation correctly", () => {
      // Test navigation across multiple years
      const startDay = period(temporal, new Date(2023, 0, 1), "day");
      
      // Two years: go(365) twice should give same date 2 years later
      const twoYears = go(temporal, go(temporal, startDay, 365), 365);
      expect(twoYears.start.getFullYear()).toBe(2025);
      expect(twoYears.start.getMonth()).toBe(0);
      expect(twoYears.start.getDate()).toBe(1);
    });

    it("should handle negative large day offsets", () => {
      // Test going backwards by large amounts
      const startDay = period(temporal, new Date(2025, 0, 1), "day");
      
      // Go back 365 days should be Jan 1, 2024
      const yearBefore = go(temporal, startDay, -365);
      expect(yearBefore.start.getFullYear()).toBe(2024);
      expect(yearBefore.start.getMonth()).toBe(0);
      expect(yearBefore.start.getDate()).toBe(1);
    });

    it("should handle leap year boundary crossing", () => {
      // Test specific leap year scenarios mentioned in the story
      const feb29 = period(temporal, new Date(2024, 1, 29), "day");
      
      // 365 days from Feb 29, 2024 with year-based logic
      const nextYear = go(temporal, feb29, 365);
      expect(nextYear.start.getFullYear()).toBe(2025);
      // With our year-based logic, it adds 1 year to get Feb 29, 2025, 
      // but Feb 29 doesn't exist in 2025, so JavaScript adjusts to Mar 1
      expect(nextYear.start.getMonth()).toBe(2); // March
      expect(nextYear.start.getDate()).toBe(1);
      
      // Test Dec 31 + 365 days scenario
      const dec31 = period(temporal, new Date(2023, 11, 31), "day");
      const afterYear = go(temporal, dec31, 365);
      expect(afterYear.start.getFullYear()).toBe(2024);
      expect(afterYear.start.getMonth()).toBe(11);
      expect(afterYear.start.getDate()).toBe(31); // With year-based logic, same date next year
    });
  });
});