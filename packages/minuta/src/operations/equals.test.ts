import { describe, it, expect } from "vitest";
import { equals, strictEquals } from "./equals";
import { createPeriod } from "./period";
import type { Period, TimePeriod } from "../types";

describe("equals", () => {
  const jan1 = new Date(2024, 0, 1);
  const jan31 = new Date(2024, 0, 31, 23, 59, 59, 999);

  it("same period → true", () => {
    const p = createPeriod(jan1, jan31);
    expect(equals(p, p)).toBe(true);
  });

  it("same range, different types → true", () => {
    const month: TimePeriod = { start: jan1, end: jan31, type: "month" };
    const custom: TimePeriod = { start: jan1, end: jan31, type: "custom" };
    expect(equals(month, custom)).toBe(true);
  });

  it("off by 1ms → false", () => {
    const a = createPeriod(jan1, jan31);
    const b = createPeriod(jan1, new Date(jan31.getTime() - 1));
    expect(equals(a, b)).toBe(false);
  });

  it("different start → false", () => {
    const a = createPeriod(jan1, jan31);
    const b = createPeriod(new Date(2024, 0, 2), jan31);
    expect(equals(a, b)).toBe(false);
  });

  it("zero-length periods at same instant → true", () => {
    const a = createPeriod(jan1, jan1);
    const b = createPeriod(jan1, jan1);
    expect(equals(a, b)).toBe(true);
  });

  it("zero-length periods at different instants → false", () => {
    const a = createPeriod(jan1, jan1);
    const b = createPeriod(jan31, jan31);
    expect(equals(a, b)).toBe(false);
  });

  it("works with PeriodSeries", () => {
    const series: Period = {
      start: jan1,
      end: jan31,
      type: "stableMonth",
      meta: { weekStartsOn: 1, monthStart: jan1 },
    };
    const custom = createPeriod(jan1, jan31);
    expect(equals(series, custom)).toBe(true);
  });
});

describe("strictEquals", () => {
  const jan1 = new Date(2024, 0, 1);
  const jan31 = new Date(2024, 0, 31, 23, 59, 59, 999);

  it("same range and type → true", () => {
    const a: TimePeriod = { start: jan1, end: jan31, type: "month" };
    const b: TimePeriod = { start: jan1, end: jan31, type: "month" };
    expect(strictEquals(a, b)).toBe(true);
  });

  it("same range, different type → false", () => {
    const a: TimePeriod = { start: jan1, end: jan31, type: "month" };
    const b: TimePeriod = { start: jan1, end: jan31, type: "custom" };
    expect(strictEquals(a, b)).toBe(false);
  });

  it("different range, same type → false", () => {
    const a: TimePeriod = { start: jan1, end: jan31, type: "custom" };
    const b: TimePeriod = {
      start: jan1,
      end: new Date(2024, 0, 15),
      type: "custom",
    };
    expect(strictEquals(a, b)).toBe(false);
  });
});
