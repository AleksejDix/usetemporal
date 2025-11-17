# Level 2: Builder API

Balanced approach - convenience methods with good tree-shaking.

## When to Use

- You want convenient syntax
- You use multiple operations frequently
- Bundle size matters but not critical
- You prefer method-chaining style

## Bundle Size

**8-12KB gzipped** for common usage scenarios

## Import Pattern

```typescript
import { createTemporal } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';
```

## Example: Calendar Grid

```typescript
import { createTemporal } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1
});

// Create current month
const month = temporal.period(new Date(), 'month');

// Divide into weeks
const weeks = temporal.divide(month, 'week');

// Render calendar
weeks.forEach(week => {
  const days = temporal.divide(week, 'day');
  console.log(days.map(d => d.date.getDate()));
});
```

## Builder Methods

All operations available as methods on the temporal object:

```typescript
const temporal = createTemporal({ adapter, weekStartsOn: 1 });

temporal.period(date, unit)         // Create period
temporal.divide(period, unit)       // Divide period
temporal.merge(periods, targetUnit) // Merge periods
temporal.next(period, count)        // Get next
temporal.previous(period, count)    // Get previous
temporal.go(period, direction, count) // Navigate
temporal.split(period, date)        // Split period
temporal.contains(period, date)     // Check containment
temporal.isSame(period1, period2, unit) // Compare
```

## Mixing with Level 1

You can mix builder and pure functions:

```typescript
import { createTemporal } from '@allystudio/usetemporal';
import { divide } from '@allystudio/usetemporal/operations';

const temporal = createTemporal({ adapter, weekStartsOn: 1 });

// Use builder for some operations
const month = temporal.period(new Date(), 'month');

// Use pure function for others (maybe in hot path)
const weeks = divide(temporal.adapter, month, 'week');
```

## Configuration

```typescript
interface CreateTemporalOptions {
  adapter: Adapter;          // Required: date adapter
  date?: Date | Ref<Date>;   // Optional: initial browsing date
  now?: Date | Ref<Date>;    // Optional: current time override
  weekStartsOn?: number;     // Optional: 0-6 (Sunday-Saturday)
}
```

## Reactive State

The temporal object includes reactive state for browsing:

```typescript
const temporal = createTemporal({ adapter, date: new Date() });

console.log(temporal.browsing.value);  // Current browsing period
console.log(temporal.now.value);       // Current time period

// Update browsing date (triggers reactivity)
temporal.browsing.value = {
  ...temporal.browsing.value,
  date: new Date(2024, 0, 1)
};
```

## Related

- [Level 1: Pure Functions API](./level-1-pure-functions.md) - Minimal bundle size
- [Level 3: Composables API](./level-3-composables.md) - Reactive composables for Vue/React
- [Choosing an API Level](/guide/choosing-api-level.md) - Decision guide
