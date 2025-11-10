# Calendar Units

Special unit types designed for consistent calendar grid layouts.

## Available Units

### [stableMonth](./stable-month.md)

Always returns a 42-day (6-week) grid for month visualizations. Perfect for calendar components that need consistent height.

```typescript
const month = period(temporal, new Date(), 'stableMonth');
// Always 42 days, regardless of month length
```

### [stableYear](./stable-year.md)

Always returns a 52 or 53 full-week grid for year visualizations. Ideal for GitHub-style contribution grids.

```typescript
const year = period(temporal, new Date(), 'stableYear');
// Always 52 or 53 full weeks
```

## Helper Functions

For proper `weekStartsOn` handling, use the helper functions:

```typescript
import { createStableMonth, createStableYear } from '@allystudio/usetemporal/calendar';

// These respect temporal's weekStartsOn setting
const stableMonth = createStableMonth(temporal, new Date());
const stableYear = createStableYear(temporal, new Date());
```

## Use Cases

### Calendar Components

```typescript
// Month calendar with consistent 6-week grid
const month = createStableMonth(temporal, selectedDate);
const weeks = divide(temporal, month, 'week');
// Always returns 6 weeks

// Year overview with full weeks
const year = createStableYear(temporal, selectedDate);
const weeks = divide(temporal, year, 'week');
// Always returns 52 or 53 full weeks
```

### Contribution Grids

```typescript
// GitHub-style contribution grid
const year = createStableYear(temporal, new Date());
const days = divide(temporal, year, 'day');

// Group into weeks for display
const grid = [];
for (let i = 0; i < days.length; i += 7) {
  grid.push(days.slice(i, i + 7));
}
```

## See Also

- [Custom Units](../unit-system/define-unit.md) - Create your own units
- [divide operation](../operations/divide.md) - Breaking down periods
- [Calendar Examples](../../examples/calendars/index.md) - Complete calendar implementations