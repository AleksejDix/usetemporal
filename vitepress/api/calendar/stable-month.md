# stableMonth Unit

The `stableMonth` unit provides a consistent 42-day (6-week) grid for month visualizations, ensuring calendar components always have the same height.

## Overview

A `stableMonth` period always:
- Spans exactly 42 days (6 weeks)
- Starts on the configured `weekStartsOn` day
- Includes the entire target month plus partial weeks
- Maintains consistent grid dimensions

## Usage

```typescript
import { createTemporal, period, divide } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/adapters/native';

const temporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 1 // Monday
});

// Create a stable month period
const june2024 = period(temporal, new Date(2024, 5, 15), 'stableMonth');

// Divide into weeks (always 6 weeks)
const weeks = divide(temporal, june2024, 'week');
console.log(weeks.length); // 6

// Divide into days (always 42 days)
const days = divide(temporal, june2024, 'day');
console.log(days.length); // 42
```

## Helper Function

For proper weekStartsOn handling, use the `createStableMonth` helper:

```typescript
import { createStableMonth } from '@allystudio/usetemporal/calendar';

const stableMonth = createStableMonth(temporal, new Date(2024, 5, 15));
// Respects temporal's weekStartsOn setting
```

## Calendar Component Example

Perfect for creating calendar grids with consistent dimensions:

```vue
<template>
  <div class="calendar-grid">
    <div v-for="week in weeks" :key="week.start.toISOString()" class="week">
      <div 
        v-for="day in getDaysInWeek(week)" 
        :key="day.date.toISOString()"
        :class="{ 'other-month': !isInTargetMonth(day) }"
        class="day"
      >
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { createTemporal, divide, period } from '@allystudio/usetemporal';
import { createStableMonth } from '@allystudio/usetemporal/calendar';

const temporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 1 
});

// Create stable month for current date
const currentMonth = createStableMonth(temporal, new Date());
const weeks = divide(temporal, currentMonth, 'week');

function getDaysInWeek(week) {
  return divide(temporal, week, 'day');
}

function isInTargetMonth(day) {
  const targetMonth = new Date().getMonth();
  return day.date.getMonth() === targetMonth;
}
</script>

<style>
.calendar-grid {
  display: grid;
  grid-template-rows: repeat(6, 1fr); /* Always 6 rows */
}
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* Always 7 columns */
}
.other-month {
  opacity: 0.5;
}
</style>
```

## Grid Boundaries

The stable month grid includes days from adjacent months:

```typescript
// June 2024 starts on Saturday
const june2024 = period(temporal, new Date(2024, 5, 1), 'stableMonth');
// Grid: May 27 (Mon) to July 7 (Sun) = 42 days

// February 2024 (leap year) starts on Thursday  
const feb2024 = period(temporal, new Date(2024, 1, 1), 'stableMonth');
// Grid: Jan 29 (Mon) to Mar 10 (Sun) = 42 days
```

## Different Week Starts

The grid adapts to different `weekStartsOn` values:

```typescript
// Sunday start
const sundayTemporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 0 
});
const sundayMonth = createStableMonth(sundayTemporal, new Date(2024, 5, 15));
// Starts on Sunday, grid includes Sat June 1

// Wednesday start
const wednesdayTemporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 3 
});
const wednesdayMonth = createStableMonth(wednesdayTemporal, new Date(2024, 5, 15));
// Starts on Wednesday, adjusts grid accordingly
```

## See Also

- [stableYear](./stable-year.md) - 52/53-week grid for year calendars
- [Calendar Units](./index.md) - Overview of calendar units
- [divide operation](../operations/divide.md) - Breaking down periods
- [Month Calendar Example](../../examples/calendars/month-calendar.md) - Complete implementation