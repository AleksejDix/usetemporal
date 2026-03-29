import { describe, it, expect } from "vitest";
import { moveTo } from "./moveTo";
import { createPeriod } from "./period";
import type { TimePeriod } from "../types";

describe("moveTo", () => {
  it("relocates a period to a target date", () => {
    const appointment = createPeriod(
      new Date(2026, 2, 29, 9, 0),
      new Date(2026, 2, 29, 10, 0)
    );
    const result = moveTo(appointment, new Date(2026, 3, 2, 14, 0));

    expect(result.start).toEqual(new Date(2026, 3, 2, 14, 0));
    expect(result.end).toEqual(new Date(2026, 3, 2, 15, 0));
  });

  it("preserves duration", () => {
    const period = createPeriod(
      new Date(2024, 0, 1, 0, 0),
      new Date(2024, 0, 3, 12, 0) // 2.5 days
    );
    const target = new Date(2024, 5, 15, 8, 0);
    const result = moveTo(period, target);

    const originalMs = period.end.getTime() - period.start.getTime();
    const resultMs = result.end.getTime() - result.start.getTime();
    expect(resultMs).toBe(originalMs);
  });

  it("returns type custom", () => {
    const period: TimePeriod = {
      start: new Date(2024, 0, 1),
      end: new Date(2024, 0, 31, 23, 59, 59, 999),
      type: "month",
    };
    const result = moveTo(period, new Date(2024, 5, 1));
    expect(result.type).toBe("custom");
  });

  it("handles zero-duration period", () => {
    const point = createPeriod(
      new Date(2024, 0, 1, 12, 0),
      new Date(2024, 0, 1, 12, 0)
    );
    const result = moveTo(point, new Date(2024, 5, 15));

    expect(result.start).toEqual(new Date(2024, 5, 15));
    expect(result.end).toEqual(new Date(2024, 5, 15));
  });

  it("works with sub-second precision", () => {
    const period = createPeriod(
      new Date(2024, 0, 1, 0, 0, 0, 0),
      new Date(2024, 0, 1, 0, 0, 0, 500)
    );
    const target = new Date(2024, 5, 15, 12, 30);
    const result = moveTo(period, target);

    expect(result.end.getTime() - result.start.getTime()).toBe(500);
  });
});
