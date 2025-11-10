import { describe, it, expect } from "vitest";
import {
  createTemporal,
  period,
  divide,
  contains,
  hasUnit,
  getUnitDefinition,
} from "..";
import { createNativeAdapter } from "../adapters/native";
import { createDateFnsAdapter } from "../adapters/date-fns";
import { createLuxonAdapter } from "../adapters/luxon";
import "./index"; // Import to register units
import { createStableMonth } from "./stableMonth";

describe("StableMonth Unit", () => {
  const adapters = [
    { name: "native", create: createNativeAdapter },
    { name: "date-fns", create: createDateFnsAdapter },
    { name: "luxon", create: createLuxonAdapter },
  ];

  describe("Unit Registration", () => {
    it("should register stableMonth unit with core", () => {
      expect(hasUnit("stableMonth")).toBe(true);
    });

    it("should have correct unit definition", () => {
      const def = getUnitDefinition("stableMonth");
      expect(def).toBeDefined();
      expect(def?.divisions).toEqual(["week", "day"]);
      expect(def?.mergesTo).toBe("year");
    });
  });

  adapters.forEach(({ name, create }) => {
    describe(`with ${name} adapter`, () => {
      it("should create stableMonth period spanning 42 days", () => {
        const date = new Date(2024, 0, 15); // Jan 15, 2024
        const temporal = createTemporal({
          date,
          adapter: create(),
          weekStartsOn: 1, // Monday
        });

        const stableMonthPeriod = period(temporal, temporal.browsing.value.date, "stableMonth");
        
        // Calculate days between start and end
        const days = Math.round(
          (stableMonthPeriod.end.getTime() - stableMonthPeriod.start.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        expect(stableMonthPeriod.type).toBe("stableMonth");
        expect(days).toBe(42); // 42 days total
      });

      describe("divide operation", () => {
        it("should always return exactly 42 days when dividing by day", () => {
          const date = new Date(2024, 1, 1); // Feb 1, 2024
          const temporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1, // Monday
          });

          const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
          const days = divide(temporal, stableMonth, "day");

          expect(days).toHaveLength(42);
          expect(days[0].type).toBe("day");
          expect(days[41].type).toBe("day");
        });

        it("should always return exactly 6 weeks when dividing by week", () => {
          const date = new Date(2024, 1, 1); // Feb 1, 2024
          const temporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1, // Monday
          });

          const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
          const weeks = divide(temporal, stableMonth, "week");

          expect(weeks).toHaveLength(6);
          weeks.forEach((week) => {
            expect(week.type).toBe("week");
          });
        });

        it("should respect weekStartsOn setting", () => {
          const date = new Date(2024, 0, 1); // Jan 1, 2024 (Monday)
          
          // Test with Sunday start
          const sundayTemporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 0, // Sunday
          });
          
          const sundayMonth = createStableMonth(sundayTemporal, date);
          expect(sundayMonth.start.getDay()).toBe(0); // Should start on Sunday
          
          // Test with Monday start
          const mondayTemporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1, // Monday
          });
          
          const mondayMonth = createStableMonth(mondayTemporal, date);
          expect(mondayMonth.start.getDay()).toBe(1); // Should start on Monday
        });

        it("should handle February correctly (shortest month)", () => {
          const date = new Date(2024, 1, 15); // Feb 15, 2024
          const temporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1,
          });

          const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
          const days = divide(temporal, stableMonth, "day");

          expect(days).toHaveLength(42);
          
          // Check that we have days from January and March
          const months = new Set(days.map(d => d.date.getMonth()));
          expect(months.size).toBeGreaterThan(1); // Should span multiple months
        });

        it("should handle year boundaries", () => {
          const date = new Date(2023, 11, 15); // Dec 15, 2023
          const temporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1,
          });

          const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
          const days = divide(temporal, stableMonth, "day");

          expect(days).toHaveLength(42);
          
          // Check that we have days from different years
          const years = new Set(days.map(d => d.date.getFullYear()));
          if (years.size > 1) {
            expect([...years]).toContain(2023);
            expect([...years]).toContain(2024);
          }
        });
      });

      describe("navigation operations", () => {
        it("should create stableMonth for different months", () => {
          const temporal = createTemporal({
            date: new Date(2024, 0, 15),
            adapter: create(),
            weekStartsOn: 1,
          });

          // Create stableMonth for different months manually
          const january = createStableMonth(temporal, new Date(2024, 0, 15));
          const february = createStableMonth(temporal, new Date(2024, 1, 15));
          
          expect(january.type).toBe("stableMonth");
          expect(february.type).toBe("stableMonth");
          
          // Both should be 42 days
          const janDays = Math.round(
            (january.end.getTime() - january.start.getTime()) / (1000 * 60 * 60 * 24)
          );
          const febDays = Math.round(
            (february.end.getTime() - february.start.getTime()) / (1000 * 60 * 60 * 24)
          );
          
          expect(janDays).toBe(42);
          expect(febDays).toBe(42);
        });
      });

      describe("comparison operations", () => {
        it("should check if date is contained in stableMonth", () => {
          const date = new Date(2024, 0, 15); // Jan 15, 2024
          const temporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1,
          });

          const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
          
          // Date in the middle of the month
          const midMonthPeriod = period(temporal, new Date(2024, 0, 20), "day");
          expect(contains(stableMonth, midMonthPeriod)).toBe(true);
          
          // Date from previous month that's included in the grid
          const earlyDate = new Date(stableMonth.start);
          const earlyPeriod = period(temporal, earlyDate, "day");
          expect(contains(stableMonth, earlyPeriod)).toBe(true);
        });

        it("should check if two stableMonths have the same boundaries", () => {
          const date = new Date(2024, 0, 15); // Jan 15, 2024
          const temporal = createTemporal({
            date,
            adapter: create(),
            weekStartsOn: 1,
          });

          const month1 = createStableMonth(temporal, date);
          const month2 = createStableMonth(temporal, date);

          // Same date should produce same boundaries
          expect(month1.start.getTime()).toBe(month2.start.getTime());
          expect(month1.end.getTime()).toBe(month2.end.getTime());
          
          // Different month should have different boundaries
          const february = createStableMonth(temporal, new Date(2024, 1, 15));
          expect(month1.start.getTime()).not.toBe(february.start.getTime());
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle leap years correctly", () => {
      const date = new Date(2024, 1, 15); // Feb 15, 2024 (leap year)
      const temporal = createTemporal({
        date,
        adapter: createNativeAdapter(),
        weekStartsOn: 1,
      });

      const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
      const days = divide(temporal, stableMonth, "day");

      expect(days).toHaveLength(42);
      
      // February 2024 has 29 days
      const febDays = days.filter(d => d.date.getMonth() === 1);
      expect(febDays.length).toBeLessThanOrEqual(29);
    });

    it("should handle different weekStartsOn values", () => {
      const weekStarts = [0, 1, 2, 3, 4, 5, 6]; // Sunday through Saturday
      const date = new Date(2024, 0, 1); // Jan 1, 2024

      weekStarts.forEach((weekStartsOn) => {
        const temporal = createTemporal({
          date,
          adapter: createNativeAdapter(),
          weekStartsOn,
        });

        const stableMonth = createStableMonth(temporal, date);
        expect(stableMonth.start.getDay()).toBe(weekStartsOn);
        
        // Always 42 days
        const days = Math.round(
          (stableMonth.end.getTime() - stableMonth.start.getTime()) / (1000 * 60 * 60 * 24)
        );
        expect(days).toBe(42); // 42 days total
      });
    });
  });
});