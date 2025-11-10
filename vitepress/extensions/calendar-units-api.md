# Calendar Units API

## Installation

```bash
npm install @usetemporal/calendar-units
```

## Import

```typescript
import '@usetemporal/calendar-units';
```

## Units

### stableMonth

A time unit that always returns a 42-day period (6 complete weeks) for consistent calendar layouts.

#### Type Definition

```typescript
interface StableMonthUnit extends Unit {
  type: 'stableMonth';
  divisions: ['week', 'day'];
  mergesTo: 'year';
}
```

#### Behavior

- Always returns exactly 42 days (6 weeks)
- Starts on the configured `weekStartsOn` day
- Includes days from previous/next months as needed
- Validated by checking the period spans exactly 42 days

#### Usage

```typescript
import { period, divide } from '@usetemporal/core';
import '@usetemporal/calendar-units';

// Create a stableMonth period
const period = period(temporal, 'stableMonth', temporal.browsing.value);

// Divide into weeks (always returns 6)
const weeks = divide(temporal, period, 'week');

// Divide into days (always returns 42)
const days = divide(temporal, period, 'day');
```

#### Grid Calculation

1. Find the first day of the target month
2. Back up to the start of that week (based on `weekStartsOn`)
3. Extend forward exactly 42 days (6 complete weeks)

#### Examples

##### Different Week Starts
```typescript
// Sunday start (US convention)
const sundayTemporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 0,
});

// Monday start (ISO convention)
const mondayTemporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1,
});
```

##### Edge Cases
```typescript
// February - shortest month
const feb2024 = period(temporal, 'stableMonth', {
  date: new Date(2024, 1, 1)
});
// Still returns 42 days, including Jan and March days

// December - year boundary
const dec2024 = period(temporal, 'stableMonth', {
  date: new Date(2024, 11, 1)
});
// May include days from January 2025
```

## Helper Functions

### createStableMonth

Utility function for creating stableMonth periods with proper week alignment.

```typescript
function createStableMonth(temporal: Temporal, date: Date): Period
```

#### Parameters

- `temporal` - The temporal instance with adapter and weekStartsOn configuration
- `date` - Any date within the target month

#### Returns

A Period object with:
- `type: 'stableMonth'`
- `start` - First day of the 6-week grid
- `end` - Last moment of the 42nd day
- `date` - Reference date (first of the month)

#### Example

```typescript
import { createStableMonth } from '@usetemporal/calendar-units';

const stableMonth = createStableMonth(temporal, new Date(2024, 0, 15));
// Returns 42-day grid for January 2024
```

## Integration with Core Operations

### divide()

```typescript
const stableMonth = period(temporal, 'stableMonth', browsing);

// By week - always returns 6 periods
const weeks = divide(temporal, stableMonth, 'week');
console.log(weeks.length); // 6

// By day - always returns 42 periods  
const days = divide(temporal, stableMonth, 'day');
console.log(days.length); // 42
```

### contains()

```typescript
const stableMonth = period(temporal, 'stableMonth', browsing);
const someDay = period(temporal, 'day', { date: someDate });

if (contains(stableMonth, someDay)) {
  // Date is within the 42-day grid
}
```

### Navigation

Note: Navigation operations (next/previous) work with the underlying month, not the stable grid:

```typescript
// Navigate to next month
const nextMonth = next(temporal, temporal.browsing.value);

// Create stable grid for that month
const nextStable = period(temporal, 'stableMonth', nextMonth);
```

## TypeScript

### Module Augmentation

The package automatically augments the UnitRegistry when imported:

```typescript
declare module '@usetemporal/core' {
  interface UnitRegistry {
    stableMonth: true;
  }
}
```

### Type Safety

All useTemporal functions recognize 'stableMonth' as a valid unit:

```typescript
// Full type checking and autocompletion
period(temporal, 'stableMonth', browsing); // ✓
hasUnit('stableMonth'); // true
getUnitDefinition('stableMonth'); // Returns unit definition
```

## Performance

### Computational Cost
- Period creation: O(1)
- Division by day: O(42) - fixed iterations
- Division by week: O(6) - fixed iterations

### Memory Usage
- Single period: ~200 bytes
- Full day grid: ~8.4 KB (42 periods)
- Full week grid: ~1.2 KB (6 periods)

### Optimization Tips

```typescript
// Cache for repeated access
const cache = new Map<string, Period[]>();

function getCachedGrid(temporal: Temporal, date: Date) {
  const key = `${date.getFullYear()}-${date.getMonth()}`;
  
  if (!cache.has(key)) {
    const period = period(temporal, 'stableMonth', { date });
    cache.set(key, divide(temporal, period, 'day'));
  }
  
  return cache.get(key)!;
}
```

## Compatibility

- Works with all useTemporal adapters
- No additional dependencies
- Tree-shakeable
- ~1KB gzipped