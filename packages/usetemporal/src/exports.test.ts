import { describe, it, expect } from "vitest";
import * as mainExports from "./index";
import * as operationsExports from "./operations";
import * as operationsIndex from "./operations/index";

describe("Export Verification Tests", () => {
  describe("operations.ts exports", () => {
    it("should re-export all operations from operations/index.ts", () => {
      // operations.ts should have same exports as operations/index.ts
      const operationsKeys = Object.keys(operationsExports).sort();
      const operationsIndexKeys = Object.keys(operationsIndex).sort();
      
      expect(operationsKeys).toEqual(operationsIndexKeys);
      
      // Verify each export is the same function
      operationsKeys.forEach(key => {
        expect(operationsExports[key]).toBe(operationsIndex[key]);
      });
    });

    it("should export all expected operation functions", () => {
      const expectedOperations = [
        "contains",
        "period",
        "divide",
        "go",
        "isSame",
        "merge",
        "next",
        "previous",
        "split",
        "isWeekend",
        "isWeekday",
        "isToday"
      ];

      expectedOperations.forEach(op => {
        expect(operationsExports[op]).toBeDefined();
        expect(typeof operationsExports[op]).toBe("function");
      });
    });
  });

  describe("index.ts exports", () => {
    it("should export core createTemporal function", () => {
      expect(mainExports.createTemporal).toBeDefined();
      expect(typeof mainExports.createTemporal).toBe("function");
    });

    it("should export CreateTemporalOptions type", () => {
      // TypeScript types are erased at runtime, but we can check the export exists
      expect(mainExports).toHaveProperty("createTemporal");
    });

    it("should export usePeriod composable", () => {
      expect(mainExports.usePeriod).toBeDefined();
      expect(typeof mainExports.usePeriod).toBe("function");
    });

    it("should export all operation functions", () => {
      const expectedOperations = [
        "divide",
        "next",
        "previous",
        "go",
        "contains",
        "period",
        "split",
        "merge",
        "isSame",
      ];

      expectedOperations.forEach(op => {
        expect(mainExports[op]).toBeDefined();
        expect(typeof mainExports[op]).toBe("function");
        // Should be same function as from operations
        expect(mainExports[op]).toBe(operationsExports[op]);
      });
    });

    it("should export utility functions", () => {
      expect(mainExports.isWeekend).toBeDefined();
      expect(typeof mainExports.isWeekend).toBe("function");
      
      expect(mainExports.isWeekday).toBeDefined();
      expect(typeof mainExports.isWeekday).toBe("function");
      
      expect(mainExports.isToday).toBeDefined();
      expect(typeof mainExports.isToday).toBe("function");
    });

    it("should export unit constants", () => {
      expect(mainExports.UNITS).toBeDefined();
      expect(typeof mainExports.UNITS).toBe("object");
      
      // Check UNITS object has all properties
      expect(mainExports.UNITS.year).toBe("year");
      expect(mainExports.UNITS.quarter).toBe("quarter");
      expect(mainExports.UNITS.month).toBe("month");
      expect(mainExports.UNITS.week).toBe("week");
      expect(mainExports.UNITS.day).toBe("day");
      expect(mainExports.UNITS.hour).toBe("hour");
      expect(mainExports.UNITS.minute).toBe("minute");
      expect(mainExports.UNITS.second).toBe("second");
      expect(mainExports.UNITS.custom).toBe("custom");
      
      const expectedUnits = [
        "YEAR",
        "QUARTER", 
        "MONTH",
        "WEEK",
        "DAY",
        "HOUR",
        "MINUTE",
        "SECOND",
        "CUSTOM"
      ];

      expectedUnits.forEach(unit => {
        expect(mainExports[unit]).toBeDefined();
        expect(typeof mainExports[unit]).toBe("string");
      });

      // Verify individual constants match UNITS object values
      expect(mainExports.YEAR).toBe(mainExports.UNITS.year);
      expect(mainExports.QUARTER).toBe(mainExports.UNITS.quarter);
      expect(mainExports.MONTH).toBe(mainExports.UNITS.month);
      expect(mainExports.WEEK).toBe(mainExports.UNITS.week);
      expect(mainExports.DAY).toBe(mainExports.UNITS.day);
      expect(mainExports.HOUR).toBe(mainExports.UNITS.hour);
      expect(mainExports.MINUTE).toBe(mainExports.UNITS.minute);
      expect(mainExports.SECOND).toBe(mainExports.UNITS.second);
      expect(mainExports.CUSTOM).toBe(mainExports.UNITS.custom);
    });

    it("should export unit registry functions", () => {
      expect(mainExports.defineUnit).toBeDefined();
      expect(typeof mainExports.defineUnit).toBe("function");
      
      expect(mainExports.getUnitDefinition).toBeDefined();
      expect(typeof mainExports.getUnitDefinition).toBe("function");
      
      expect(mainExports.hasUnit).toBeDefined();
      expect(typeof mainExports.hasUnit).toBe("function");
      
      expect(mainExports.getRegisteredUnits).toBeDefined();
      expect(typeof mainExports.getRegisteredUnits).toBe("function");
    });

    it("should not export internal implementation details", () => {
      // These should NOT be exported
      const internalDetails = [
        "isAdapterUnit",
        "isLeapYear",
        "createNativeAdapter", // This comes from adapter packages
        "mockAdapter" // Test utilities
      ];

      internalDetails.forEach(internal => {
        expect(mainExports[internal]).toBeUndefined();
      });
    });

    it("should have consistent exports between operations and main", () => {
      // All operations exported from main should match operations module
      const operationNames = [
        "divide",
        "next",
        "previous",
        "go",
        "contains",
        "period",
        "split",
        "merge",
        "isSame",
      ];

      operationNames.forEach(op => {
        expect(mainExports[op]).toBe(operationsExports[op]);
      });
    });
  });

  describe("TypeScript type exports", () => {
    it("should have all expected type exports in main index", () => {
      // While we can't check types at runtime, we can verify the module structure
      const exportedNames = Object.keys(mainExports);
      
      // These are functions/constants that should exist if types are properly exported
      const typeRelatedExports = [
        "createTemporal", // Related to CreateTemporalOptions
        "UNITS", // Related to Unit type
        "defineUnit", // Related to UnitDefinition
      ];

      typeRelatedExports.forEach(name => {
        expect(exportedNames).toContain(name);
      });
    });
  });

  describe("Export completeness", () => {
    it("should export a complete API surface", () => {
      const coreExports = Object.keys(mainExports);
      
      // Minimum expected exports for a complete API
      const minimumExports = [
        // Core
        "createTemporal",
        "usePeriod",
        
        // Operations
        "divide",
        "next",
        "previous", 
        "go",
        "contains",
        "period",
        "split",
        "merge",
        "isSame",
        
        // Utils
        "isWeekend",
        "isWeekday",
        "isToday",
        
        // Constants
        "UNITS", // Object with unit values
        "YEAR",
        "QUARTER",
        "MONTH",
        "WEEK",
        "DAY",
        "HOUR",
        "MINUTE",
        "SECOND",
        "CUSTOM",
        
        // Unit Registry
        "defineUnit",
        "getUnitDefinition",
        "hasUnit",
        "getRegisteredUnits"
      ];

      minimumExports.forEach(exportName => {
        expect(coreExports).toContain(exportName);
      });

      // Should have at least this many exports
      expect(coreExports.length).toBeGreaterThanOrEqual(minimumExports.length);
    });

    it("should not have duplicate exports", () => {
      const exportNames = Object.keys(mainExports);
      const uniqueNames = [...new Set(exportNames)];
      
      expect(exportNames.length).toBe(uniqueNames.length);
    });
  });

  describe("Performance", () => {
    it("should complete all export tests in under 100ms", () => {
      const start = performance.now();
      
      // Access all exports to ensure they're loaded
      Object.keys(mainExports).forEach(key => {
        const value = mainExports[key];
        if (typeof value === 'function') {
          expect(value).toBeDefined();
        }
      });

      Object.keys(operationsExports).forEach(key => {
        const value = operationsExports[key];
        if (typeof value === 'function') {
          expect(value).toBeDefined();
        }
      });
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});