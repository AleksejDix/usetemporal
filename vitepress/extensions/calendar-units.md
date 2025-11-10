# Calendar Units Package

The `@usetemporal/calendar-units` package provides specialized time units designed for calendar user interfaces, following useTemporal's philosophy of keeping the core minimal while offering powerful extensions.

## Overview

While useTemporal's core provides fundamental time operations, calendar UIs often need specialized behavior. The calendar-units package addresses these needs without bloating the core library.

## Installation

```bash
npm install @usetemporal/calendar-units @usetemporal/core
```

## Available Units

### stableMonth

The `stableMonth` unit always returns a 42-day (6-week) period, ensuring calendar grids maintain consistent height regardless of the actual month length.

```typescript
import { createTemporal, period, divide } from '@usetemporal/core';
import { createNativeAdapter } from '@usetemporal/core/native';
import '@usetemporal/calendar-units'; // Registers units

const temporal = createTemporal({
  adapter: createNativeAdapter({ weekStartsOn: 1 }), // Monday
});

const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value);
const days = divide(temporal, stableMonth, 'day');
console.log(days.length); // Always 42
```

## Why Use Calendar Units?

### Consistent Layouts
Regular months vary from 28-31 days and can span 4-6 weeks when displayed in a grid. This causes:
- Layout shifts when navigating between months
- Complex CSS calculations
- Poor user experience with jumping content

### Better Performance
With a fixed 42-day grid:
- Predictable memory allocation
- Cacheable layouts
- Optimized rendering

### Simplified Development
- No edge case handling for different month lengths
- Consistent styling rules
- Easier responsive design

## Integration with Core

Calendar units integrate seamlessly with all useTemporal operations:

```typescript
// Navigation
const nextMonth = next(temporal, temporal.browsing.value);
const nextStable = period(temporal, 'stableMonth', nextMonth);

// Division
const weeks = divide(temporal, stableMonth, 'week'); // Always 6 weeks
const days = divide(temporal, stableMonth, 'day');   // Always 42 days

// Comparison
const isInGrid = contains(stableMonth, someDayPeriod);
```

## Examples

### Basic Calendar Grid
```typescript
function createCalendarGrid(date: Date) {
  const temporal = createTemporal({
    adapter: createNativeAdapter(),
    weekStartsOn: 1,
    date,
  });

  const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value);
  const weeks = divide(temporal, stableMonth, 'week');
  
  return weeks.map(week => divide(temporal, week, 'day'));
}
```

### Identifying Current Month Days
```typescript
const currentMonth = temporal.browsing.value.date.getMonth();
const days = divide(temporal, stableMonth, 'day');

const currentMonthDays = days.filter(day => 
  day.date.getMonth() === currentMonth
);
const paddingDays = days.filter(day => 
  day.date.getMonth() !== currentMonth
);
```

## Migration Guide

If you're currently using manual stable month implementations, see our [migration guide](/guide/migration-calendar-units) for step-by-step instructions.

## Performance Considerations

- **Generation**: O(1) - Fixed 42 iterations
- **Memory**: ~8.4KB for full day grid
- **Caching**: Results are cacheable by month/year key

See the [performance guide](/guide/performance-calendar-units) for optimization strategies.

## TypeScript Support

Full TypeScript support with automatic type augmentation:

```typescript
// Automatically registered when imported
import '@usetemporal/calendar-units';

// TypeScript knows about the new unit
const period = period(temporal, 'stableMonth', browsing);
```

## Future Units

The calendar-units package sets the foundation for additional calendar-specific units:
- `businessWeek` - 5-day business weeks
- `fiscalQuarter` - Company fiscal quarters
- `academicSemester` - School calendar periods

## Resources

- [API Documentation](/api/calendar-units)
- [Examples](/examples/calendar-units)
- [GitHub Repository](https://github.com/usetemporal/usetemporal/tree/main/packages/calendar-units)