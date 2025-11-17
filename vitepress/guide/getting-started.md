# Getting Started

Welcome to useTemporal! This guide provides a quick overview to get you up and running.

## What is useTemporal?

useTemporal is a revolutionary time library featuring the unique `divide()` pattern for hierarchical time management. It offers **three API levels** optimized for different use cases, from minimal bundle size to maximum convenience.

## Quick Start Path

Follow these steps to get started:

1. **[Installation](#installation)** - Add useTemporal to your project
2. **[Choose Your API Level](#choose-your-api-level)** - Pick the right approach
3. **[Basic Example](#basic-example)** - See it in action
4. **[Examples](/examples/)** - Explore complete implementations

## Installation

::: code-group

```bash [npm]
npm install @allystudio/usetemporal
```

```bash [yarn]
yarn add @allystudio/usetemporal
```

```bash [pnpm]
pnpm add @allystudio/usetemporal
```

```bash [bun]
bun add @allystudio/usetemporal
```

:::

## Choose Your API Level

useTemporal offers three API levels to match your needs:

| Level | Use Case | Bundle Size | Best For |
|-------|----------|-------------|----------|
| **[Level 1: Pure Functions](/api/level-1-pure-functions)** | Maximum tree-shaking | 5-7 KB | Node.js, serverless, CLIs |
| **[Level 2: Builder](/api/level-2-builder)** | Balanced convenience | 8-12 KB | Most applications (recommended) |
| **[Level 3: Composables](/api/level-3-composables)** | Reactive UI | 15-20 KB | Vue/React apps with reactivity |

::: tip Recommended
**Level 2 (Builder API)** offers the best balance of convenience and bundle size for most applications.
:::

[📖 Read the full API level comparison](/guide/choosing-api-level)

## Key Features

✨ **Revolutionary divide() Pattern**
```typescript
// Split any period into smaller units
const months = temporal.divide(year, 'month')
const days = temporal.divide(month, 'day')
```

🎯 **Three Optimized API Levels**
- Pure functions for minimal bundles
- Builder pattern for convenience
- Reactive composables for UIs

⚡ **Zero Core Dependencies**
- Native adapter requires no external libraries
- Optional adapters for date-fns, Luxon, Temporal

🔄 **Reactive by Design**
- Built on `@vue/reactivity`
- Works with Vue, React, and vanilla JS

## Basic Example

Here's a quick example using the **recommended Level 2 (Builder) API**:

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

// Create temporal instance with adapter
const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1 // Monday
})

// Create a month period
const month = temporal.period(new Date(), 'month')

// Divide into weeks, then days
const weeks = temporal.divide(month, 'week')
const days = weeks.flatMap(week => temporal.divide(week, 'day'))

console.log(`${month.start.toDateString()} has ${days.length} days`)

// Navigate to next month
const nextMonth = temporal.next(month)
console.log(`Next month: ${nextMonth.start.toDateString()}`)
```

::: details See other API levels

**Level 1 (Pure Functions)** - Minimal bundle:
```typescript
import { period, divide, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
const days = divide(adapter, month, 'day')
const nextMonth = next(adapter, month)
```

**Level 3 (Composables)** - Reactive UI:
```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { divide } from '@allystudio/usetemporal/operations'

const temporal = createTemporal({ adapter, date: new Date() })
const month = usePeriod(temporal, 'month') // Reactive!

// Automatically updates when month changes
const days = computed(() => divide(temporal.adapter, month.value, 'day'))
```

:::

## Learn More

### Concepts & Patterns
- [Core Concepts](/guide/core-concepts) - Periods, reactivity, and operations
- [divide() Pattern](/guide/divide-pattern) - Our revolutionary approach
- [Operations](/guide/operations) - Navigation, comparison, and more

### Practical Guides
- [Date Adapters](/guide/adapters) - Support for different date libraries
- [TypeScript](/guide/typescript) - Full type safety
- [Performance](/guide/performance) - Optimization tips

### Reference
- [API Reference](/api/) - Complete API documentation
- [Examples](/examples/) - Real-world implementations

## Ready to Start?

→ [Install useTemporal](/guide/installation) and build your first time-based interface!