# useTemporal

**Revolutionary time library with the unique `divide()` pattern**

```typescript
// Divide any time unit into smaller units
const months = divide(adapter, year, "month");
const days = divide(adapter, month, "day");
const hours = divide(adapter, day, "hour");
```

## 🚀 Features

- **🧩 Revolutionary divide() Pattern**: Infinitely subdivide time units with perfect synchronization
- **📦 Pure Functional API**: Import only what you need for optimal tree-shaking
- **🌳 Optimal Tree-Shaking**: 60-76% bundle size reduction through modular architecture
- **🌍 Framework Agnostic**: Works with Vue, React, Angular, Svelte, and vanilla JavaScript
- **⚡ Zero Dependencies**: Native adapter provides full functionality without external libraries
- **🔄 Reactive by Design**: Built on `@vue/reactivity` for automatic updates
- **🎯 TypeScript First**: Full type safety and excellent IDE support

## 📦 Bundle Size

- **Core operations + native adapter:** 5-7KB gzipped

## 📥 Installation

```bash
npm install @allystudio/usetemporal
```

## 🎯 Quick Start

### Pure Functions Only

```typescript
import { period, divide } from "@allystudio/usetemporal/operations";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

const adapter = createNativeAdapter({ weekStartsOn: 1 });
const year = period(adapter, new Date(), "year");
const months = divide(adapter, year, "month");
```

[Learn more patterns →](./vitepress/guide/divide-pattern.md)

### Vue Example (Pure Functions)

```vue
<template>
  <div>
    <h2>{{ monthLabel }}</h2>
    <div v-for="day in days" :key="day.date.toISOString()">
      {{ day.date.getDate() }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { period, divide, next, previous } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter({ weekStartsOn: 1 })
const browsing = ref(new Date())

const month = computed(() => period(adapter, browsing.value, 'month'))
const days = computed(() => divide(adapter, month.value, 'day'))

const monthLabel = computed(() =>
  month.value.date.toLocaleDateString('en', { month: 'long', year: 'numeric' })
)

function go(direction: 'next' | 'previous') {
  const updated = direction === 'next'
    ? next(adapter, month.value)
    : previous(adapter, month.value)
  browsing.value = updated.date
}
</script>
```

### React Example (Pure Functions)

```tsx
import { useMemo, useState } from "react";
import {
  period,
  divide,
  next,
  previous,
} from "@allystudio/usetemporal/operations";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

const adapter = createNativeAdapter({ weekStartsOn: 1 });

function Calendar() {
  const [browsing, setBrowsing] = useState(() => new Date());
  const month = useMemo(() => period(adapter, browsing, "month"), [browsing]);
  const days = useMemo(() => divide(adapter, month, "day"), [month]);

  const navigate = (direction: "next" | "previous") => {
    const updated =
      direction === "next" ? next(adapter, month) : previous(adapter, month);
    setBrowsing(updated.date);
  };

  return (
    <div>
      <header>
        <button onClick={() => navigate("previous")}>←</button>
        <h2>
          {month.date.toLocaleDateString("en", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => navigate("next")}>→</button>
      </header>
      {days.map((day) => (
        <div key={day.date.toISOString()}>{day.date.getDate()}</div>
      ))}
    </div>
  );
}
```

## 🔧 Core API

### Pure Functions Overview

```typescript
import {
  period,
  divide,
  next,
  previous,
  go,
} from "@allystudio/usetemporal/operations";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

const adapter = createNativeAdapter();

const month = period(adapter, new Date(), "month");
const days = divide(adapter, month, "day");
const nextMonth = next(adapter, month);
const previousMonth = previous(adapter, month);
const threeMonthsAhead = go(adapter, month, "next", 3);
```

### Period Structure

```typescript
interface Period {
  type: Unit; // 'year' | 'month' | 'week' | 'day' | etc.
  date: Date; // Representative date
  start: Date; // Period start
  end: Date; // Period end (exclusive)
}
```

### Available Operations

All operations work across all API levels:

- `period(adapter, date, unit)` - Create a period
- `divide(adapter, period, unit)` - Subdivide periods
- `merge(adapter, periods)` - Merge multiple periods
- `next(adapter, period, count?)` - Get next period
- `previous(adapter, period, count?)` - Get previous period
- `go(adapter, period, direction, count)` - Navigate by steps
- `contains(period, date | period)` - Check containment
- `isSame(adapter, period1, period2, unit)` - Compare periods
- `split(period, date)` - Split period at date
- `isToday(period)`, `isWeekday(period)`, `isWeekend(period)` - Utility checks

## 📚 Documentation

Visit our [documentation site](https://usetemporal.dev) for:

- [Getting Started Guide](./vitepress/guide/getting-started.md)
- [Operations Overview](./vitepress/guide/operations.md)
- [Level 1: Pure Functions API](./vitepress/api/level-1-pure-functions.md)
- [Bundle Size Optimization](./vitepress/guide/bundle-size-optimization.md)
- [The divide() Pattern](./vitepress/guide/divide-pattern.md)
- [API Reference](https://usetemporal.dev/api/)
- [Examples](https://usetemporal.dev/examples/)

## 🔌 Date Adapters

> **Important**: Starting with v2.0.0, all adapters are bundled in `@allystudio/usetemporal`. Individual adapter packages are deprecated. See the [migration guide](docs/MIGRATION-ADAPTERS.md) for details.

useTemporal supports multiple date libraries through adapters. Choose the one that fits your needs:

| Adapter  | Bundle Size | Timezone | Tree-shakeable | Status   |
| -------- | ----------- | -------- | -------------- | -------- |
| Native   | 0KB         | ❌       | ✅             | Stable   |
| date-fns | ~2.1KB      | ❌       | ✅             | Stable   |
| Luxon    | ~2.3KB      | ✅       | ✅             | Stable   |
| Temporal | ~3KB        | ✅       | ✅             | Polyfill |

```bash
# Native JavaScript Date (included by default)
npm install @allystudio/usetemporal

# With date-fns
npm install @allystudio/usetemporal date-fns

# With Luxon
npm install @allystudio/usetemporal luxon

# With Temporal API (future)
npm install @allystudio/usetemporal @js-temporal/polyfill
```

## 🎯 Why useTemporal?

Traditional date libraries require manual calculation for time subdivisions:

```javascript
// Traditional approach 😢
const year = 2024;
const months = [];
for (let i = 0; i < 12; i++) {
  const start = new Date(year, i, 1);
  const end = new Date(year, i + 1, 0);
  months.push({ start, end });
}
```

With useTemporal's divide() pattern:

```typescript
const adapter = createNativeAdapter();
const year = period(adapter, new Date(2024, 0, 1), "year");
const months = divide(adapter, year, "month");
// That's it—12 perfect months, automatically calculated!
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [useTemporal Contributors](https://github.com/your-username/usetemporal/graphs/contributors)
