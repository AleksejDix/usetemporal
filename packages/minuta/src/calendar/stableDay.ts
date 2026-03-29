import type { Adapter, TimePeriod } from "../types";

/**
 * A single hour slot in a stable 24-hour day grid.
 */
export interface HourSlot extends TimePeriod {
  /** Wall-clock hour (0-23) */
  hour: number;
}

/**
 * A stable 24-hour grid for a given day, with DST metadata.
 */
export interface StableDay {
  slots: HourSlot[];
  /** Wall-clock hour that doesn't exist due to spring forward, or null */
  gapHour: number | null;
  /** Wall-clock hour that occurs twice due to fall back, or null */
  ambiguousHour: number | null;
}

const ONE_HOUR_MS = 3600000;
const NORMAL_DAY_MS = 24 * ONE_HOUR_MS;

/**
 * Creates a stable 24-hour grid for a given day.
 * Always returns exactly 24 hour slots (0-23), regardless of DST.
 *
 * On spring-forward days: the skipped hour is marked isGap=true
 * On fall-back days: the repeated hour is marked isAmbiguous=true
 * On normal days: all slots have isGap=false, isAmbiguous=false
 *
 * @example
 * import { createStableDay } from "minuta/calendar";
 * const { slots, gapHour, ambiguousHour } = createStableDay(adapter, new Date(2024, 2, 10));
 * slots.length // always 24
 * gapHour      // 2 — 2 AM doesn't exist (US spring forward)
 */
export function createStableDay(adapter: Adapter, date: Date): StableDay {
  const dayStart = adapter.startOf(date, "day");
  const dayEnd = adapter.endOf(date, "day");
  const dayDurationMs = dayEnd.getTime() - dayStart.getTime() + 1;

  // Detect DST type from total day duration
  const isShortDay = dayDurationMs < NORMAL_DAY_MS; // spring forward (23h)
  const isLongDay = dayDurationMs > NORMAL_DAY_MS; // fall back (25h)

  const slots: HourSlot[] = [];
  let gapHour: number | null = null;
  let ambiguousHour: number | null = null;

  for (let hour = 0; hour < 24; hour++) {
    const start = adapter.add(dayStart, hour, "hour");
    const end = new Date(start.getTime() + ONE_HOUR_MS - 1);

    if (hour > 0) {
      const prevStart = slots[hour - 1].start;
      const jumpMs = start.getTime() - prevStart.getTime();

      // Gap (spring forward): the adapter can't represent the non-existent hour,
      // so add(dayStart, N) and add(dayStart, N-1) land on the same UTC instant.
      if (isShortDay && jumpMs === 0) {
        gapHour = hour;
      }

      // Ambiguous (fall back): the adapter skips the second occurrence of
      // the repeated hour, producing a 2h UTC jump. Which wall-clock hour
      // repeats depends on how the adapter resolves the ambiguous time,
      // so we use diff() on the skipped UTC instant to find the true hour.
      if (isLongDay && jumpMs >= 2 * ONE_HOUR_MS) {
        const skippedUtc = new Date(prevStart.getTime() + ONE_HOUR_MS);
        ambiguousHour = adapter.diff(dayStart, skippedUtc, "hour");
      }
    }

    slots.push({ start, end, type: "hour", hour });
  }

  return { slots, gapHour, ambiguousHour };
}
