# Native Adapter Guide

The Native adapter is the default adapter for useTemporal. It uses JavaScript's built-in Date object with zero dependencies.

## Overview

- **Bundle Size:** 0KB (no additional code)
- **Performance:** Fastest option
- **Timezone Support:** Local timezone only
- **Best For:** Applications prioritizing performance and bundle size

## Installation

The native adapter is included by default:

```bash
npm install @allystudio/usetemporal
```

Or use only the core with explicit native adapter:

```bash
npm install @allystudio/usetemporal @allystudio/usetemporal-adapter-native
```

## Basic Usage

### Default Setup (Recommended)
```typescript
import { createTemporal } from '@allystudio/usetemporal'

// Native adapter is used automatically
const temporal = createTemporal()
```

### Explicit Setup
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal-adapter-native'

const temporal = createTemporal({
  adapter: createNativeAdapter()
})
```

## Features

### Core Operations

All standard useTemporal operations work seamlessly:

```typescript
// Create periods
const year = period(temporal, new Date(), 'year')
const month = period(temporal, new Date(), 'month')
const week = period(temporal, new Date(), 'week')

// Divide operations
const months = divide(temporal, year, 'month') // 12 months
const weeks = divide(temporal, month, 'week') // 4-6 weeks
const days = divide(temporal, week, 'day')    // 7 days

// Navigation
const nextMonth = next(temporal, month)
const prevWeek = previous(temporal, week)
const futureDate = go(temporal, month, 3) // 3 months ahead
```

### Date Creation

```typescript
// From various inputs
const period1 = period(temporal, new Date(), 'day')
const period2 = period(temporal, '2025-07-25', 'day')
const period3 = period(temporal, Date.now(), 'day')
```

### Comparisons

```typescript
const today = period(temporal, new Date(), 'day')
const tomorrow = next(temporal, today)

// Check relationships
contains(temporal, today, new Date())              // true
isSame(temporal, today, new Date(), 'day')       // true
contains(temporal, today, tomorrow.start)         // false
```

## Limitations

### No Timezone Support

The native adapter only works with the system's local timezone:

```typescript
// Always uses local timezone
const period = period(temporal, new Date(), 'day')
console.log(period.start) // Local midnight
```

### Basic Formatting

Limited formatting options compared to other adapters:

```typescript
const period = period(temporal, new Date(), 'month')

// Basic string representation
console.log(period.start.toLocaleDateString()) // "7/1/2025"

// For advanced formatting, consider date-fns adapter
```

### No Locale Support

The native adapter uses the system locale:

```typescript
// Uses browser/system locale
const date = new Date()
console.log(date.toLocaleDateString()) // Depends on system
```

## Performance Benefits

The native adapter offers the best performance:

```typescript
// Benchmark example
const start = performance.now()

// Create 10,000 periods
for (let i = 0; i < 10000; i++) {
  const period = period(temporal, new Date(), 'day')
  const hours = divide(temporal, period, 'hour')
}

const end = performance.now()
console.log(`Time: ${end - start}ms`) // Typically < 50ms
```

## Common Patterns

### Calendar Generation

```typescript
function generateMonthCalendar(temporal, date) {
  const month = period(temporal, date, 'month')
  const weeks = divide(temporal, month, 'week')
  
  return weeks.map(week => ({
    week,
    days: divide(temporal, week, 'day')
  }))
}
```

### Date Range Iteration

```typescript
function* dateRange(temporal, start, end, unit = 'day') {
  let current = period(temporal, start, unit)
  const endPeriod = period(temporal, end, unit)
  
  while (current.start <= endPeriod.start) {
    yield current
    current = next(temporal, current)
  }
}

// Usage
for (const day of dateRange(temporal, '2025-01-01', '2025-01-31')) {
  console.log(day.date)
}
```

### Working with Today

```typescript
const temporal = createTemporal()

// Various "today" operations
const today = period(temporal, new Date(), 'day')
const thisWeek = period(temporal, new Date(), 'week')
const thisMonth = period(temporal, new Date(), 'month')

// Check if a date is today
function isToday(temporal, date) {
  return isSame(temporal, date, new Date(), 'day')
}
```

## Best Practices

### 1. Use for Local Dates Only

```typescript
// ✅ Good: Local dates
const meeting = period(temporal, meetingDate, 'hour')

// ❌ Bad: Timezone-sensitive operations
// const nycTime = ... // Not possible with native
```

### 2. Leverage Zero-Dependency

```typescript
// ✅ Good: Keep bundle minimal
import { createTemporal } from '@allystudio/usetemporal'

// ❌ Avoid: Don't add complexity if not needed
// import moment from 'moment' // Unnecessary
```

### 3. Consider Future Migration

```typescript
// Structure code for easy adapter switching
const createCalendar = (temporal) => {
  // All logic uses temporal parameter
  return {
    getMonth: (date) => period(temporal, date, 'month'),
    getWeeks: (month) => divide(temporal, month, 'week')
  }
}

// Easy to switch adapters later
const calendar = createCalendar(temporal)
```

## When to Use Native Adapter

✅ **Perfect for:**
- Static websites
- Small web applications  
- Performance-critical applications
- Projects with strict bundle size limits
- Local-only date operations
- Prototypes and MVPs

❌ **Not suitable for:**
- Multi-timezone applications
- International applications needing locale support
- Applications requiring complex date formatting
- Projects needing timezone-aware calculations

## Migration Path

If you outgrow the native adapter, switching is straightforward:

```typescript
// Step 1: Install new adapter
// npm install @allystudio/usetemporal-adapter-date-fns date-fns

// Step 2: Update initialization
import { createDateFnsAdapter } from '@allystudio/usetemporal-adapter-date-fns'

const temporal = createTemporal({
  adapter: createDateFnsAdapter()
})

// Step 3: All existing code continues to work!
```

## Next Steps

- Learn about [divide pattern](/guide/divide-pattern) 
- Explore [calendar examples](/examples/calendars)
- Check [performance guide](/guide/performance)
- Consider [date-fns adapter](./date-fns.md) for formatting
- Consider [Luxon adapter](./luxon.md) for timezones