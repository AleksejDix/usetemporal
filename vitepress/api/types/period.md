# Period Type

The `Period` type represents a time span with a start and end date. It's the fundamental unit of time in useTemporal.

## Structure

```typescript
interface Period {
  type: Unit       // The unit type (e.g., 'month', 'day')
  date: Date       // The representative date for this period
  start: Date      // Start of the period (inclusive)
  end: Date        // End of the period (inclusive)
}
```

## Creating Periods

### Level 1: Pure Functions

```typescript
import { period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Create standard periods
const year = period(adapter, new Date(), 'year')
const month = period(adapter, new Date(), 'month')
const day = period(adapter, new Date(), 'day')

// Create custom periods
const customPeriod = period(adapter, {
  start: new Date(2024, 0, 1),
  end: new Date(2024, 11, 31)
})
```

### Level 2: Builder API

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
})

// Create periods
const year = temporal.period(new Date(), 'year')
const month = temporal.period(new Date(), 'month')
const day = temporal.period(new Date(), 'day')

// Custom periods
const customPeriod = temporal.period({
  start: new Date(2024, 0, 1),
  end: new Date(2024, 11, 31)
})
```

### Level 3: Reactive Composables

```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
})

// Reactive periods that track browsing.value
const year = usePeriod(temporal, 'year')
const month = usePeriod(temporal, 'month')
const day = usePeriod(temporal, 'day')
```

## Period Properties

### date

The representative date for the period. For most units, this is the start date:

```typescript
const month = usePeriod(temporal, 'month')
console.log(month.value.date) // First moment of the month
```

### start

The inclusive start of the period:

```typescript
const week = usePeriod(temporal, 'week')
console.log(week.value.start) // First moment of the week
```

### end

The exclusive end of the period:

```typescript
const day = usePeriod(temporal, 'day')
console.log(day.value.end) // First moment of the next day
```

## Working with Periods

### Navigation

Navigate between periods using navigation functions:

```typescript
import { next, previous, go } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const today = period(adapter, new Date(), 'day')

// Get adjacent periods
const tomorrow = next(adapter, today)
const yesterday = previous(adapter, today)

// Jump multiple periods
const nextWeek = go(adapter, today, 'next', 7)
const lastWeek = go(adapter, today, 'previous', 7)
```

### Division

Divide periods into smaller units:

```typescript
import { divide, period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')

const days = divide(adapter, month, 'day')
const weeks = divide(adapter, month, 'week')

console.log(`This month has ${days.length} days`)
console.log(`This month spans ${weeks.length} weeks`)
```

### Comparison

Compare periods and check containment:

```typescript
import { contains, isSame, period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
const today = new Date()

// Check if date is within period
if (contains(month, today)) {
  console.log('Today is in the current month')
}

// Check if two periods are the same
const period1 = period(adapter, new Date(2024, 5, 15), 'month')
const period2 = period(adapter, new Date(2024, 5, 20), 'month')
console.log(isSame(adapter, period1, period2, 'month')) // true
```

### Navigating Period Hierarchies

Navigate between different period levels using composition:

```typescript
import { divide, period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const year = period(adapter, new Date(), 'year')

// Navigate to specific month (June)
const months = divide(adapter, year, 'month')
const june = months[5] // 0-indexed

// Navigate from day to its containing month
const day = period(adapter, new Date(), 'day')
const containingMonth = period(adapter, day.date, 'month')
```

## Examples

### Calendar Display

```vue
<template>
  <div class="calendar">
    <h2>{{ monthName }}</h2>
    <div class="days-grid">
      <div
        v-for="day in days"
        :key="day.date.toISOString()"
        :class="{ today: isToday(day) }"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { divide } from '@allystudio/usetemporal/operations'
import { isToday } from '@allystudio/usetemporal/utilities'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
})

const month = usePeriod(temporal, 'month')
const days = computed(() => divide(temporal.adapter, month.value, 'day'))

const monthName = computed(() =>
  month.value.date.toLocaleDateString('en', {
    month: 'long',
    year: 'numeric'
  })
)
</script>
```

### Date Range Picker

```typescript
import { period, next, divide } from '@allystudio/usetemporal/operations'
import { isWeekday } from '@allystudio/usetemporal/utilities'
import type { Adapter, Period } from '@allystudio/usetemporal'

function getDateRange(adapter: Adapter, start: Date, end: Date): Period[] {
  const periods: Period[] = []
  let current = period(adapter, start, 'day')
  const endPeriod = period(adapter, end, 'day')

  while (current.start <= endPeriod.start) {
    periods.push(current)
    current = next(adapter, current)
  }

  return periods
}

// Get all days in current month
const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
const monthDays = divide(adapter, month, 'day')

// Get business days only
const businessDays = monthDays.filter(day => isWeekday(day))
```

### Time Slot Generation

```typescript
import { divide } from '@allystudio/usetemporal/operations'
import type { Adapter, Period } from '@allystudio/usetemporal'

function generateTimeSlots(
  adapter: Adapter,
  day: Period,
  slotDuration: number = 30
): { time: Date; label: string }[] {
  const hours = divide(adapter, day, 'hour')
  const slots: { time: Date; label: string }[] = []

  hours.forEach(hour => {
    // Add slot at start of hour
    slots.push({
      time: hour.start,
      label: hour.date.toLocaleTimeString('en', {
        hour: 'numeric',
        minute: '2-digit'
      })
    })

    // Add 30-minute slot if requested
    if (slotDuration === 30) {
      const halfHour = new Date(hour.start)
      halfHour.setMinutes(30)
      slots.push({
        time: halfHour,
        label: halfHour.toLocaleTimeString('en', {
          hour: 'numeric',
          minute: '2-digit'
        })
      })
    }
  })

  return slots
}
```

## TypeScript

Full type safety with TypeScript:

```typescript
import type { Adapter, Period, Unit } from '@allystudio/usetemporal'
import { divide, period } from '@allystudio/usetemporal/operations'

// Period type is fully typed
const month: Period = period(adapter, new Date(), 'month')

// Functions accept and return typed periods
function getMonthDays(adapter: Adapter, month: Period): Period[] {
  return divide(adapter, month, 'day')
}

// Type-safe custom period creation
const customPeriod = period(adapter, {
  start: new Date(2024, 0, 1),
  end: new Date(2024, 11, 31)
})
```

## See Also

- [Unit](/api/types/unit) - Unit type
- [Temporal](/api/types/temporal) - Temporal type
- [Adapter](/api/types/adapter) - Adapter interface