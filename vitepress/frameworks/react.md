# React Integration

`@allystudio/usetemporal-react` exposes idiomatic hooks so React apps get the
same reactive builder API as Vue without any globals.

- Hooks follow standard patterns (`useTemporal`, `usePeriod`).
- Works with `useMemo` adapters for dynamic configuration.
- Builder exposes every operation so advanced flows stay in React land.

## Installation

```bash
npm install @allystudio/usetemporal \
  @allystudio/usetemporal-react \
  @allystudio/usetemporal/native
```

## Hooks example

```tsx
import { useTemporal, usePeriod } from "@allystudio/usetemporal-react";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

export function MonthCalendar() {
  const temporal = useTemporal({
    adapter: createNativeAdapter({ weekStartsOn: 1 }),
    date: new Date(),
  });

  const month = usePeriod(temporal, "month");
  const weeks = temporal.divide(month, "week");

  return (
    <div>
      <header>
        <button onClick={() => temporal.previous(month)}>Prev</button>
        <span>
          {month.date.toLocaleString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button onClick={() => temporal.next(month)}>Next</button>
      </header>

      <div className="weeks">
        {weeks.map((week) => (
          <div key={week.id} className="week">
            {temporal.divide(week, "day").map((day) => (
              <span key={day.id}>{day.date.getDate()}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Reactive adapter with `useMemo`

```tsx
import { useMemo, useState } from "react";
import { useTemporal } from "@allystudio/usetemporal-react";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

export function App() {
  const [weekStartsOn, setWeekStartsOn] = useState(1);

  const adapter = useMemo(
    () => createNativeAdapter({ weekStartsOn }),
    [weekStartsOn]
  );

  const temporal = useTemporal({ adapter, date: new Date() });

  return (
    <div>
      <button onClick={() => setWeekStartsOn(0)}>Sunday start</button>
      <button onClick={() => setWeekStartsOn(1)}>Monday start</button>
    </div>
  );
}
```

## API surface

- `useTemporal(options)` — Creates a reactive builder bound to React state.
- `usePeriod(temporal, unit)` — Derives the target period as component state.
