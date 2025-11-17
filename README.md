# useTemporal

**Revolutionary time library with the unique `divide()` pattern**

```typescript
// Divide any time unit into smaller units
const months = divide(adapter, year, 'month')
const days = divide(adapter, month, 'day')
const hours = divide(adapter, day, 'hour')
```

## 🚀 Features

- **🧩 Revolutionary divide() Pattern**: Infinitely subdivide time units with perfect synchronization
- **📦 Three API Levels**: Choose between pure functions (5-7KB), builder (8-12KB), or composables (15-20KB)
- **🌳 Optimal Tree-Shaking**: 60-76% bundle size reduction through modular architecture
- **🌍 Framework Agnostic**: Works with Vue, React, Angular, Svelte, and vanilla JavaScript
- **⚡ Zero Dependencies**: Native adapter provides full functionality without external libraries
- **🔄 Reactive by Design**: Built on `@vue/reactivity` for automatic updates
- **🎯 TypeScript First**: Full type safety and excellent IDE support

## 📦 Bundle Size

- **Level 1 (Pure Functions):** 5-7KB gzipped
- **Level 2 (Builder):** 8-12KB gzipped
- **Level 3 (Composables):** 15-20KB gzipped

## 📥 Installation

```bash
npm install @allystudio/usetemporal
```

## 🎯 Quick Start

### Three API Levels - Choose What Fits Your Needs

**Level 1: Pure Functions (Smallest Bundle - 5-7KB)**
```typescript
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter({ weekStartsOn: 1 })
const year = period(adapter, new Date(), 'year')
const months = divide(adapter, year, 'month')
```

**Level 2: Builder (Balanced - 8-12KB)** - Recommended for most users
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1
})

const year = temporal.period(new Date(), 'year')
const months = temporal.divide(year, 'month')
```

**Level 3: Composables (Full DX - 15-20KB)**
```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
})

const month = usePeriod(temporal, 'month')
// month.value is reactive - automatically updates
```

[Learn how to choose the right API level →](./vitepress/guide/choosing-api-level.md)

## 🔄 Migrating from v1.x or alpha.1?

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions. The v2.0 architecture delivers 60-76% bundle size reduction!

### Vue Example (Level 3 - Composables)

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
import { computed } from 'vue'
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
})

const month = usePeriod(temporal, 'month')
const days = computed(() => divide(temporal.adapter, month.value, 'day'))

const monthLabel = computed(() =>
  month.value.date.toLocaleDateString('en', { month: 'long', year: 'numeric' })
)
</script>
```

### React Example (Level 2 - Builder)

```tsx
import { useMemo } from 'react'
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

function Calendar() {
  const temporal = useMemo(() => createTemporal({
    adapter: createNativeAdapter(),
    weekStartsOn: 1
  }), [])

  const month = temporal.period(new Date(), 'month')
  const days = temporal.divide(month, 'day')

  return (
    <div>
      <h2>
        {month.date.toLocaleDateString('en', {
          month: 'long',
          year: 'numeric'
        })}
      </h2>
      {days.map(day => (
        <div key={day.date.toISOString()}>
          {day.date.getDate()}
        </div>
      ))}
    </div>
  )
}
```

## 🔧 Core API

### Choose Your API Level

**Level 1: Pure Functions**
```typescript
import { period, divide, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const year = period(adapter, new Date(), 'year')
const months = divide(adapter, year, 'month')
```

**Level 2: Builder** (Recommended)
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(), // Required
  date: new Date(),              // Optional: initial browsing date
  weekStartsOn: 1                // Optional: 0 = Sunday, 1 = Monday
})

const year = temporal.period(new Date(), 'year')
const months = temporal.divide(year, 'month')
```

**Level 3: Composables**
```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
})

// Reactive period
const month = usePeriod(temporal, 'month')
```

### Period Structure

```typescript
interface Period {
  type: Unit    // 'year' | 'month' | 'week' | 'day' | etc.
  date: Date    // Representative date
  start: Date   // Period start
  end: Date     // Period end (exclusive)
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

- [Getting Started Guide](https://usetemporal.dev/guide/getting-started)
- [Choosing an API Level](./vitepress/guide/choosing-api-level.md)
- [Migration Guide](./MIGRATION.md) - v2.0 breaking changes
- [Level 1: Pure Functions API](./vitepress/api/level-1-pure-functions.md)
- [Level 2: Builder API](./vitepress/api/level-2-builder.md)
- [Level 3: Composables API](./vitepress/api/level-3-composables.md)
- [Bundle Size Optimization](./vitepress/guide/bundle-size-optimization.md)
- [The divide() Pattern](https://usetemporal.dev/guide/divide-pattern)
- [API Reference](https://usetemporal.dev/api/)
- [Examples](https://usetemporal.dev/examples/)

## 🔌 Date Adapters

> **Important**: Starting with v2.0.0, all adapters are bundled in `@allystudio/usetemporal`. Individual adapter packages are deprecated. See the [migration guide](docs/MIGRATION-ADAPTERS.md) for details.

useTemporal supports multiple date libraries through adapters. Choose the one that fits your needs:

| Adapter | Bundle Size | Timezone | Tree-shakeable | Status |
|---------|------------|----------|----------------|---------|
| Native | 0KB | ❌ | ✅ | Stable |
| date-fns | ~2.1KB | ❌ | ✅ | Stable |
| Luxon | ~2.3KB | ✅ | ✅ | Stable |
| Temporal | ~3KB | ✅ | ✅ | Polyfill |

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

📖 See our [comprehensive adapter guide](https://usetemporal.dev/guide/adapters/) for detailed comparisons, selection help, and migration guides.

## 🎯 Why useTemporal?

Traditional date libraries require manual calculation for time subdivisions:

```javascript
// Traditional approach 😢
const year = 2024
const months = []
for (let i = 0; i < 12; i++) {
  const start = new Date(year, i, 1)
  const end = new Date(year, i + 1, 0)
  months.push({ start, end })
}
```

With useTemporal's divide() pattern:

```typescript
// useTemporal approach 🎉 (Level 2 - Builder)
const temporal = createTemporal({ adapter: createNativeAdapter() })
const year = temporal.period(new Date(2024, 0, 1), 'year')
const months = temporal.divide(year, 'month')
// That's it! 12 perfect months, automatically calculated!
```

Or even smaller bundle with Level 1:

```typescript
// Level 1 - Pure Functions (5-7KB bundle)
const adapter = createNativeAdapter()
const year = period(adapter, new Date(2024, 0, 1), 'year')
const months = divide(adapter, year, 'month')
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [useTemporal Contributors](https://github.com/your-username/usetemporal/graphs/contributors)