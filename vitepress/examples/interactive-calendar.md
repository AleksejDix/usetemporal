# Interactive Calendar

An interactive calendar component built with useTemporal, demonstrating the powerful `stableMonth` pattern for creating consistent calendar grids.

## Live Demo

<CalendarView />

## How It Works

This calendar component uses several key features of useTemporal:

### 1. Stable Month Pattern

The calendar uses `createStableMonth()` which creates a consistent **42-day (6-week) grid**. This ensures the calendar layout never jumps in height when navigating between months.

```typescript
import { createStableMonth } from '@allystudio/usetemporal/calendar'

// Creates a 6-week grid containing the month
const stableMonth = createStableMonth(adapter, 1, new Date())
```

### 2. Navigation

Navigate between months using simple date manipulation:

```typescript
const nextMonth = () => {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  )
}
```

### 3. Day Division

The stable month is divided into individual days using the `divide()` operation:

```typescript
import { divide } from '@allystudio/usetemporal/operations'

// Get all 42 days from the stable month
const days = divide(adapter, stableMonth, 'day')
```

## Key Features

- **Stable Grid**: Always shows 6 weeks (42 days) for consistent layout
- **Native Adapter**: Uses only native JavaScript Date operations
- **Reactive**: Built with Vue's reactivity system
- **Accessible**: Keyboard navigation support
- **Weekend Highlighting**: Automatically highlights weekends
- **Today Indicator**: Current day is clearly marked

## Component Structure

The calendar component follows best practices:

1. **Level 1 API (Pure Functions)**: Uses `@allystudio/usetemporal/operations` for tree-shakable imports
2. **Native Adapter**: Zero dependencies beyond the library itself
3. **Composable Pattern**: Easy to integrate into any Vue application

## Implementation Code

Here's the complete implementation:

```vue
<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <button @click="previousMonth">‹</button>
      <h3>{{ monthName }}</h3>
      <button @click="nextMonth">›</button>
    </div>

    <div class="calendar-grid">
      <!-- Weekday headers -->
      <div v-for="day in weekDays" :key="day" class="weekday-header">
        {{ day }}
      </div>

      <!-- Calendar days -->
      <div
        v-for="(day, index) in days"
        :key="index"
        :class="getDayClasses(day)"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'
import { createStableMonth } from '@allystudio/usetemporal/calendar'
import { divide } from '@allystudio/usetemporal/operations'

// Create temporal instance with native adapter
const adapter = createNativeAdapter()
const temporal = createTemporal({ adapter, weekStartsOn: 1 })

// Current browsing month
const currentMonth = ref<Date>(new Date())

// Weekday names
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Month name for header
const monthName = computed(() =>
  currentMonth.value.toLocaleDateString('en', {
    month: 'long',
    year: 'numeric'
  })
)

// Create stable month period (42 days / 6 weeks)
const stableMonth = computed(() =>
  createStableMonth(adapter, 1, currentMonth.value)
)

// Divide stable month into days
const days = computed(() =>
  divide(adapter, stableMonth.value, 'day')
)
</script>
```

## Why Use Stable Month?

Traditional calendar implementations often have issues:

1. **Variable Height**: Different months have different numbers of weeks (4-6), causing layout shifts
2. **Complex Logic**: Calculating which days from adjacent months to show
3. **Edge Cases**: Handling months that start on different days of the week

The `stableMonth` pattern solves all of these by providing a **consistent 42-day grid** that:
- Always shows exactly 6 weeks
- Includes necessary days from previous/next months
- Maintains consistent layout across all months

## Next Steps

- Learn more about [divide() pattern](/guide/patterns/divide-pattern)
- Explore [calendar utilities](/api/calendar/stable-month)
- See more [calendar examples](/examples/calendars/)
- Check out [other adapters](/guide/adapters/) for timezone support

## Bundle Size

This implementation is extremely lightweight:

- **Core library**: ~5-7KB
- **Native adapter**: ~1KB
- **Calendar utilities**: ~2KB
- **Total**: ~8-10KB minified + gzipped

Perfect for documentation sites and applications where bundle size matters!
