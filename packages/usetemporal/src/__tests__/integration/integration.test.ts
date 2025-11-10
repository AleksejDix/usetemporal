import { describe, it, expect } from "vitest";
import { createTemporal, period, divide, hasUnit } from "../..";
import { createNativeAdapter } from "../../adapters/native";
import { createStableMonth, createStableYear } from "../../calendar";
import "../../calendar"; // Import to register units

describe("Calendar Units Integration", () => {
  describe("Unit Registration", () => {
    it("should register stableMonth unit with core", () => {
      expect(hasUnit("stableMonth")).toBe(true);
    });

    it("should register stableYear unit with core", () => {
      expect(hasUnit("stableYear")).toBe(true);
    });
  });

  describe("StableMonth Integration", () => {
    it("should create period with stableMonth unit", () => {
      const date = new Date(2024, 0, 1); // Jan 1, 2024
      const temporal = createTemporal({ 
        date,
        adapter: createNativeAdapter() 
      });
      
      const stableMonthPeriod = period(temporal, temporal.browsing.value.date, "stableMonth");
      
      expect(stableMonthPeriod).toBeDefined();
      expect(stableMonthPeriod.type).toBe("stableMonth");
      expect(stableMonthPeriod.start).toBeInstanceOf(Date);
      expect(stableMonthPeriod.end).toBeInstanceOf(Date);
    });

    it("should work with divide operation", () => {
      const date = new Date(2024, 0, 1); // Jan 1, 2024
      const temporal = createTemporal({ 
        date,
        adapter: createNativeAdapter() 
      });
      
      const stableMonth = period(temporal, temporal.browsing.value.date, "stableMonth");
      const days = divide(temporal, stableMonth, "day");
      
      expect(days).toBeInstanceOf(Array);
      expect(days).toHaveLength(42); // Always 42 days
      expect(days[0].type).toBe("day");
    });
  });

  describe("StableYear Integration", () => {
    const adapter = createNativeAdapter();
    const temporal = createTemporal({
      date: new Date(2024, 5, 15),
      adapter,
      weekStartsOn: 1
    }); // Monday start

    it("should create period with stableYear unit", () => {
      const stableYearPeriod = period(temporal, new Date(2024, 5, 15), "stableYear");
      
      expect(stableYearPeriod).toBeDefined();
      expect(stableYearPeriod.type).toBe("stableYear");
      expect(stableYearPeriod.start).toBeInstanceOf(Date);
      expect(stableYearPeriod.end).toBeInstanceOf(Date);
    });

    it("should create GitHub-style contribution grid", () => {
      const year2024 = createStableYear(temporal, new Date(2024, 5, 15));
      const days = divide(temporal, year2024, "day");
      
      // Should have 52 or 53 weeks worth of days
      expect([364, 371]).toContain(days.length);
      
      // Group into weeks
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }
      
      // Verify grid structure
      expect([52, 53]).toContain(weeks.length);
      weeks.forEach(week => {
        expect(week).toHaveLength(7);
      });
      
      // First day should be Monday
      expect(days[0].date.getDay()).toBe(1);
      
      // Last day should be Sunday
      expect(days[days.length - 1].date.getDay()).toBe(0);
    });

    it("should handle year transitions correctly", () => {
      // Test multiple years
      const years = [2022, 2023, 2024, 2025];
      
      years.forEach(year => {
        const stableYear = createStableYear(temporal, new Date(year, 0, 1));
        const weeks = divide(temporal, stableYear, "week");
        
        // Each year should have 52 or 53 full weeks
        expect([52, 53]).toContain(weeks.length);
        
        // Each week should have exactly 7 days
        weeks.forEach(week => {
          const days = divide(temporal, week, "day");
          expect(days).toHaveLength(7);
        });
      });
    });
  });

  describe("Combined Calendar Usage", () => {
    it("should create consistent month grids for a full year", () => {
      const temporal = createTemporal({
        date: new Date(2024, 0, 1),
        adapter: createNativeAdapter(),
        weekStartsOn: 1
      });
      
      // Test all months in 2024
      for (let month = 0; month < 12; month++) {
        const date = new Date(2024, month, 15);
        const stableMonth = createStableMonth(temporal, date);
        const weeks = divide(temporal, stableMonth, "week");
        
        // Always 6 weeks
        expect(weeks).toHaveLength(6);
        
        // Always 42 days total
        const days = divide(temporal, stableMonth, "day");
        expect(days).toHaveLength(42);
      }
    });

    it("should allow drilling from year to months", () => {
      const temporal = createTemporal({
        date: new Date(2024, 5, 15),
        adapter: createNativeAdapter(),
        weekStartsOn: 1
      });

      // Get regular year to find months
      const regularYear = period(temporal, new Date(2024, 5, 15), "year");
      const months = divide(temporal, regularYear, "month");
      
      // Each month can be converted to stable month
      months.forEach(month => {
        const stableMonth = createStableMonth(temporal, month.date);
        const weeks = divide(temporal, stableMonth, "week");
        expect(weeks).toHaveLength(6);
      });
    });
  });

  describe("Different weekStartsOn configurations", () => {
    it("should adapt stableYear to Sunday start", () => {
      const sundayTemporal = createTemporal({
        date: new Date(2024, 0, 1),
        adapter: createNativeAdapter(),
        weekStartsOn: 0
      });
      const year = createStableYear(sundayTemporal, new Date(2024, 0, 1));
      const days = divide(sundayTemporal, year, "day");
      
      // First day should be Sunday
      expect(days[0].date.getDay()).toBe(0);
      
      // Last day should be Saturday
      expect(days[days.length - 1].date.getDay()).toBe(6);
    });

    it("should adapt stableMonth to Wednesday start", () => {
      const wednesdayTemporal = createTemporal({ 
        adapter: createNativeAdapter(), 
        weekStartsOn: 3 
      });
      const month = createStableMonth(wednesdayTemporal, new Date(2024, 5, 15));
      const days = divide(wednesdayTemporal, month, "day");
      
      // First day should be Wednesday
      expect(days[0].date.getDay()).toBe(3);
      
      // Grid should still be 42 days
      expect(days).toHaveLength(42);
    });
  });
});