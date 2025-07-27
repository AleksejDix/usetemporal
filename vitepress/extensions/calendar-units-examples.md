# Calendar Units Examples

Examples demonstrating the `@usetemporal/calendar-units` package for building calendar interfaces.

## Basic stableMonth Usage

```typescript
import { createTemporal, period, divide } from '@usetemporal/core';
import { createNativeAdapter } from '@usetemporal/adapter-native';
import '@usetemporal/calendar-units';

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1, // Monday
});

// Create a stable 42-day grid
const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value);
const days = divide(temporal, stableMonth, 'day');

console.log(days.length); // Always 42
```

## Calendar Grid Component

### Vue 3 Example

```vue
<template>
  <div class="calendar-grid">
    <div
      v-for="day in days"
      :key="day.date.toISOString()"
      :class="getDayClasses(day)"
    >
      {{ day.date.getDate() }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { createTemporal, period, divide } from '@usetemporal/core';
import { createNativeAdapter } from '@usetemporal/adapter-native';
import '@usetemporal/calendar-units';

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1,
});

const stableMonth = computed(() => 
  period(temporal, 'stableMonth', temporal.browsing.value)
);

const days = computed(() => 
  divide(temporal, stableMonth.value, 'day')
);

function getDayClasses(day) {
  const currentMonth = temporal.browsing.value.date.getMonth();
  return {
    'calendar-day': true,
    'current-month': day.date.getMonth() === currentMonth,
    'other-month': day.date.getMonth() !== currentMonth,
  };
}
</script>

<style>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.other-month {
  color: #ccc;
}
</style>
```

### React Example

```tsx
import { useMemo } from 'react';
import { createTemporal, period, divide } from '@usetemporal/core';
import { createNativeAdapter } from '@usetemporal/adapter-native';
import '@usetemporal/calendar-units';

function CalendarGrid() {
  const temporal = useMemo(() => createTemporal({
    adapter: createNativeAdapter(),
    weekStartsOn: 1,
  }), []);

  const stableMonth = useMemo(() => 
    period(temporal, 'stableMonth', temporal.browsing.value),
    [temporal.browsing.value]
  );

  const days = useMemo(() => 
    divide(temporal, stableMonth, 'day'),
    [stableMonth]
  );

  const currentMonth = temporal.browsing.value.date.getMonth();

  return (
    <div className="calendar-grid">
      {days.map(day => (
        <div
          key={day.date.toISOString()}
          className={`calendar-day ${
            day.date.getMonth() === currentMonth ? 'current-month' : 'other-month'
          }`}
        >
          {day.date.getDate()}
        </div>
      ))}
    </div>
  );
}
```

## Week-Based Layout

```typescript
// Create 6 rows of 7 days each
const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value);
const weeks = divide(temporal, stableMonth, 'week');

const calendarRows = weeks.map(week => ({
  week,
  days: divide(temporal, week, 'day')
}));

// Render as table
calendarRows.forEach((row, weekIndex) => {
  console.log(`Week ${weekIndex + 1}:`);
  row.days.forEach(day => {
    console.log(`  ${day.date.toLocaleDateString()}`);
  });
});
```

## Highlighting Special Days

```typescript
const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value);
const days = divide(temporal, stableMonth, 'day');

const enrichedDays = days.map(day => {
  const date = day.date;
  const currentMonth = temporal.browsing.value.date.getMonth();
  
  return {
    ...day,
    isCurrentMonth: date.getMonth() === currentMonth,
    isToday: isToday(temporal, day),
    isWeekend: date.getDay() === 0 || date.getDay() === 6,
    isFirstOfMonth: date.getDate() === 1,
    weekNumber: Math.ceil(date.getDate() / 7),
  };
});
```

## Navigation Between Months

```typescript
import { next, previous } from '@usetemporal/core';

function CalendarNavigation({ temporal }) {
  const navigateToNextMonth = () => {
    temporal.browsing.value = next(temporal, temporal.browsing.value);
    // stableMonth will automatically update for the new month
  };

  const navigateToPreviousMonth = () => {
    temporal.browsing.value = previous(temporal, temporal.browsing.value);
  };

  const goToToday = () => {
    temporal.browsing.value = period(temporal, 'month', {
      date: new Date()
    });
  };

  return { navigateToNextMonth, navigateToPreviousMonth, goToToday };
}
```

## Performance Optimization

### Caching Grid Data

```typescript
const gridCache = new Map();

function getCachedGrid(temporal, yearMonth) {
  if (!gridCache.has(yearMonth)) {
    const [year, month] = yearMonth.split('-').map(Number);
    const date = new Date(year, month, 1);
    
    const tempPeriod = period(temporal, 'month', { date });
    const stableMonth = period(temporal, 'stableMonth', tempPeriod);
    const days = divide(temporal, stableMonth, 'day');
    
    gridCache.set(yearMonth, days);
  }
  
  return gridCache.get(yearMonth);
}

// Usage
const januaryGrid = getCachedGrid(temporal, '2024-0');
const februaryGrid = getCachedGrid(temporal, '2024-1');
```

### Lazy Loading Year View

```typescript
function* generateYearView(temporal, year) {
  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 1);
    const monthPeriod = period(temporal, 'month', { date });
    const stableMonth = period(temporal, 'stableMonth', monthPeriod);
    
    yield {
      month,
      period: stableMonth,
      getDays: () => divide(temporal, stableMonth, 'day')
    };
  }
}

// Usage - only compute days when needed
const yearView = [...generateYearView(temporal, 2024)];
const marchDays = yearView[2].getDays(); // Computed on demand
```

## Styling Considerations

### CSS Grid Layout

```css
/* Fixed 6x7 grid */
.stable-month-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  background: #e0e0e0;
  aspect-ratio: 7/6; /* Maintains proportion */
}

.day-cell {
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
}

/* No need for complex height calculations! */
```

### Responsive Design

```css
.calendar-container {
  max-width: 100%;
  width: min(100%, 600px);
}

.stable-month-grid {
  /* Grid automatically maintains aspect ratio */
  width: 100%;
}

@media (max-width: 480px) {
  .day-cell {
    font-size: 0.875rem;
    min-height: 35px;
  }
}
```

## Complete Example

See the full working examples in the calendar-units package:
- [Vue Calendar](/packages/calendar-units/examples/vue-calendar/)
- [React Calendar](/packages/calendar-units/examples/react-calendar/)
- [Vanilla JS Calendar](/packages/calendar-units/examples/vanilla-calendar/)