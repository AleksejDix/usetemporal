import { useMemo, useState } from "react";
import type { Period } from "@allystudio/usetemporal";
import { createNativeAdapter } from "@allystudio/usetemporal/native";
import {
  type TemporalBuilder,
  usePeriod,
  useTemporal,
} from "@allystudio/usetemporal-react";
import { NavigationControls } from "./NavigationControls";
import { PeriodDisplay } from "./PeriodDisplay";
import { WeekStartToggle } from "./WeekStartToggle";

const WEEKDAY_ORDER: Record<0 | 1, string[]> = {
  0: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  1: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

type WeekWithDays = { period: Period; days: Period[] };

export function Calendar() {
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1);

  // PATTERN: Memoize adapters so React can recreate them when config changes.
  const adapter = useMemo(
    () => createNativeAdapter({ weekStartsOn }),
    [weekStartsOn]
  );

  const temporal = useTemporal({
    adapter,
    date: new Date(),
  });

  const month = usePeriod(temporal, "month");

  const weeks = useMemo<WeekWithDays[]>(
    () => buildWeeks(temporal, month),
    [temporal, month]
  );
  const weekdayLabels = WEEKDAY_ORDER[weekStartsOn];

  return (
    <section className="calendar-shell">
      <header className="calendar-header">
        <div>
          <h1>useTemporal React Demo</h1>
          <p className="subheading">
            Derived periods, divide() pattern, and adapter reactivity in one
            hook.
          </p>
        </div>
        <WeekStartToggle
          weekStartsOn={weekStartsOn}
          onChange={setWeekStartsOn}
        />
      </header>

      <PeriodDisplay month={month} now={temporal.now} />

      <NavigationControls temporal={temporal} targetPeriod={month} />

      <div className="weekday-grid">
        {weekdayLabels.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="weeks-grid">
        {weeks.map((week) => (
          <div key={week.period.start.toISOString()} className="week-row">
            {week.days.map((day) => {
              const isOutside = !temporal.contains(month, day.date);
              const isToday = temporal.isSame(day, temporal.now, "day");
              return (
                <button
                  type="button"
                  key={day.start.toISOString()}
                  className={[
                    "day-cell",
                    isOutside ? "is-outside" : "",
                    isToday ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => temporal.go(day, 0)}
                  title={dayFormatter.format(day.date)}
                >
                  <span className="date-number">{day.date.getDate()}</span>
                  <span className="weekday-label">
                    {dayFormatter.format(day.date)}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function buildWeeks(temporal: TemporalBuilder, month: Period): WeekWithDays[] {
  return temporal.divide(month, "week").map((week) => ({
    period: week,
    days: temporal.divide(week, "day"),
  }));
}
