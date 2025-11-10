# stableYear Unit

The `stableYear` unit provides a consistent grid of 52 or 53 full weeks for year visualizations, ideal for GitHub-style contribution grids and week-based year overviews.

## Overview

A `stableYear` period always:
- Starts on the configured `weekStartsOn` day
- Includes all weeks that contain any days of the target year
- Results in exactly 52 or 53 full weeks
- Maintains consistent alignment across years

## Usage

```typescript
import { createTemporal, period, divide } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/adapters/native';

const temporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 1 // Monday
});

// Create a stable year period
const year2024 = period(temporal, new Date(2024, 5, 15), 'stableYear');

// Divide into weeks (always 52 or 53 full weeks)
const weeks = divide(temporal, year2024, 'week');
console.log(weeks.length); // 53 for 2024

// Divide into days (always 364 or 371 days)
const days = divide(temporal, year2024, 'day');
console.log(days.length); // 371 for 2024
```

## Helper Function

For proper weekStartsOn handling, use the `createStableYear` helper:

```typescript
import { createStableYear } from '@allystudio/usetemporal/calendar';

const stableYear = createStableYear(temporal, new Date(2024, 0, 1));
// Respects temporal's weekStartsOn setting
```

## GitHub-Style Contribution Grid

Perfect for creating contribution grids with consistent week alignment:

```typescript
// Create a year grid for contributions
const currentYear = createStableYear(temporal, new Date());
const days = divide(temporal, currentYear, 'day');

// Group days into weeks (7 days each)
const weeks = [];
for (let i = 0; i < days.length; i += 7) {
  weeks.push(days.slice(i, i + 7));
}

// Each week has exactly 7 days
// First day is always weekStartsOn
// Grid maintains consistent alignment
```

## Year Boundaries

The stable year grid includes partial weeks at year boundaries:

```typescript
// 2024 starts on Monday, ends on Tuesday
const year2024 = period(temporal, new Date(2024, 0, 1), 'stableYear');
// Grid: Jan 1, 2024 (Mon) to Jan 5, 2025 (Sun) = 53 weeks

// 2023 starts on Sunday, ends on Sunday  
const year2023 = period(temporal, new Date(2023, 0, 1), 'stableYear');
// Grid: Dec 26, 2022 (Mon) to Dec 31, 2023 (Sun) = 53 weeks
```

## Different Week Starts

The grid adapts to different `weekStartsOn` values:

```typescript
// Sunday start
const sundayTemporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 0 
});
const sundayYear = createStableYear(sundayTemporal, new Date(2024, 0, 1));
// Starts on Sunday, ends on Saturday

// Saturday start
const saturdayTemporal = createTemporal({ 
  adapter: createNativeAdapter(),
  weekStartsOn: 6 
});
const saturdayYear = createStableYear(saturdayTemporal, new Date(2024, 0, 1));
// Starts on Saturday, ends on Friday
```

## See Also

- [stableMonth](./stable-month.md) - 42-day grid for month calendars
- [Calendar Units](./index.md) - Overview of calendar units
- [divide operation](../operations/divide.md) - Breaking down periods