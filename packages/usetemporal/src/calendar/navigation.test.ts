import { describe, it, expect } from "vitest";
import { createNativeAdapter } from "../adapters/native";
import { createContext } from "../context";
import { createStableMonth } from "./stableMonth";
import { createStableYear } from "./stableYear";
import { calendarNavigators } from "./index";
import { next, previous, go } from "../operations";
import { divide } from "../operations/divide";

const adapter = createNativeAdapter({ weekStartsOn: 1 });
const ctx = createContext({ adapter, navigators: calendarNavigators });

describe("stableMonth navigation", () => {
  const jan2024 = createStableMonth(adapter, 1, new Date(2024, 0, 15));

  it("should preserve type on next()", () => {
    const feb = next(ctx, jan2024);
    expect(feb.type).toBe("stableMonth");
  });

  it("should preserve type on previous()", () => {
    const dec = previous(ctx, jan2024);
    expect(dec.type).toBe("stableMonth");
  });

  it("should preserve type on go()", () => {
    const march = go(ctx, jan2024, 2);
    expect(march.type).toBe("stableMonth");
  });

  it("should reconstruct correct grid for next month", () => {
    const feb = next(ctx, jan2024);
    const monthStart = feb.meta?.monthStart as Date;
    expect(monthStart.getMonth()).toBe(1);
    expect(monthStart.getFullYear()).toBe(2024);
    const days = divide(adapter, feb, "day");
    expect(days.length).toBe(42);
  });

  it("should not just shift by duration", () => {
    const feb = next(ctx, jan2024);
    const shiftedStart = new Date(
      jan2024.start.getTime() +
        (jan2024.end.getTime() - jan2024.start.getTime() + 1)
    );
    expect(feb.start.getTime()).not.toBe(shiftedStart.getTime());
  });

  it("should preserve weekStartsOn through navigation", () => {
    const sundayCtx = createContext({
      adapter: createNativeAdapter({ weekStartsOn: 0 }),
      navigators: calendarNavigators,
    });
    const sundayStart = createStableMonth(
      sundayCtx.adapter,
      0,
      new Date(2024, 0, 15)
    );
    const nextSunday = next(sundayCtx, sundayStart);
    if (nextSunday.type === "stableMonth") {
      expect(nextSunday.meta.weekStartsOn).toBe(0);
    }
    expect(nextSunday.start.getDay()).toBe(0);
  });

  it("should round-trip: previous(next(p)) returns same month", () => {
    const roundTrip = previous(ctx, next(ctx, jan2024));
    expect(roundTrip.start.getTime()).toBe(jan2024.start.getTime());
    expect(roundTrip.end.getTime()).toBe(jan2024.end.getTime());
  });

  it("should handle year boundary crossing", () => {
    const dec2024 = createStableMonth(adapter, 1, new Date(2024, 11, 15));
    const jan2025 = next(ctx, dec2024);
    if (jan2025.type === "stableMonth") {
      expect(jan2025.meta.monthStart.getMonth()).toBe(0);
      expect(jan2025.meta.monthStart.getFullYear()).toBe(2025);
    }
    expect(jan2025.type).toBe("stableMonth");
  });
});

describe("stableYear navigation", () => {
  const year2024 = createStableYear(adapter, 1, new Date(2024, 5, 15));

  it("should preserve type on next()", () => {
    const year2025 = next(ctx, year2024);
    expect(year2025.type).toBe("stableYear");
  });

  it("should reconstruct correct grid for next year", () => {
    const year2025 = next(ctx, year2024);
    if (year2025.type === "stableYear") {
      expect(year2025.meta.yearStart.getFullYear()).toBe(2025);
    }
    const weeks = divide(adapter, year2025, "week");
    expect(weeks.length).toBeGreaterThanOrEqual(52);
    expect(weeks.length).toBeLessThanOrEqual(54);
  });

  it("should preserve weekStartsOn through navigation", () => {
    const sundayCtx = createContext({
      adapter: createNativeAdapter({ weekStartsOn: 0 }),
      navigators: calendarNavigators,
    });
    const sundayYear = createStableYear(
      sundayCtx.adapter,
      0,
      new Date(2024, 5, 15)
    );
    const nextYear = next(sundayCtx, sundayYear);
    if (nextYear.type === "stableYear") {
      expect(nextYear.meta.weekStartsOn).toBe(0);
    }
    expect(nextYear.start.getDay()).toBe(0);
  });

  it("should round-trip: previous(next(p)) returns same year", () => {
    const roundTrip = previous(ctx, next(ctx, year2024));
    if (roundTrip.type === "stableYear") {
      expect(roundTrip.meta.yearStart.getFullYear()).toBe(
        year2024.type === "stableYear"
          ? year2024.meta.yearStart.getFullYear()
          : 0
      );
    }
  });
});

describe("plain custom periods still use duration shifting", () => {
  it("should shift custom period by duration", () => {
    const custom = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 10, 23, 59, 59, 999),
      type: "custom" as const,
    };

    const shifted = next(ctx, custom);
    expect(shifted.type).toBe("custom");
    expect(shifted.start.getTime()).toBe(custom.end.getTime() + 1);
  });
});
