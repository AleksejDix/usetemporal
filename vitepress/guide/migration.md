# Migration Guide

This guide helps you migrate from popular date libraries to useTemporal. Each section provides direct comparisons and migration strategies.

## Breaking Changes in v2.0.0

### Removal of toPeriod Function

The `toPeriod` function has been removed in v2.0.0 as part of our API simplification efforts. `toPeriod` was just a wrapper around `period` with the same functionality.

#### Before (v1.x)
```typescript
import { toPeriod } from '@allystudio/usetemporal';

const dayPeriod = toPeriod(temporal, new Date(), 'day');
const monthPeriod = toPeriod(temporal, date, 'month');
```

#### After (v2.0.0)
```typescript
import { period } from '@allystudio/usetemporal';

const dayPeriod = period(temporal, new Date(), 'day');
const monthPeriod = period(temporal, date, 'month');
```

This is a simple find-and-replace migration - just replace all occurrences of `toPeriod` with `period`. The function signatures are identical.

### Rename of createPeriod to period

The `createPeriod` function has been renamed to `period` in v2.0.0 to follow a cleaner, more mathematical API style. The function behaves identically - only the name has changed.

#### Before (v1.x)
```typescript
import { createPeriod } from '@allystudio/usetemporal';

const dayPeriod = createPeriod(temporal, new Date(), 'day');
const monthPeriod = createPeriod(temporal, date, 'month');
```

#### After (v2.0.0)
```typescript
import { period } from '@allystudio/usetemporal';

const dayPeriod = period(temporal, new Date(), 'day');
const monthPeriod = period(temporal, date, 'month');
```

This is a simple find-and-replace migration - just replace all occurrences of `createPeriod` with `period`. The function signatures are identical.

### Merge of createCustomPeriod into period

The `createCustomPeriod` function has been merged into the `period` function in v2.0.0 through function overloading. This reduces the API surface while maintaining all functionality.

#### Before (v1.x)
```typescript
import { createCustomPeriod } from '@allystudio/usetemporal';

const customPeriod = createCustomPeriod(startDate, endDate);
```

#### After (v2.0.0)
```typescript
import { period } from '@allystudio/usetemporal';

const customPeriod = period(temporal, { start: startDate, end: endDate });
```

The `period` function now accepts two signatures:
- `period(temporal, date, unit)` - Creates a standard period of a specific unit type
- `period(temporal, { start, end })` - Creates a custom period with arbitrary dates

This is a simple migration - replace `createCustomPeriod(start, end)` with `period(temporal, { start, end })`.

### StableMonth Moved to Calendar Units Package

The `stableMonth` unit has been moved from the core library to the `@usetemporal/calendar-units` package in v2.0.0. This keeps the core library focused on fundamental operations while providing calendar-specific features as an optional enhancement.

#### Before (v1.x)
```typescript
import { period, STABLE_MONTH } from '@usetemporal/core';

const stableMonth = period(temporal, 'stableMonth', date);
// or
const stableMonth = period(temporal, STABLE_MONTH, date);
```

#### After (v2.0.0)

Install the calendar units package:

```bash
npm install @usetemporal/calendar-units
```

Then use it:

```typescript
import { period } from '@usetemporal/core';
import '@usetemporal/calendar-units'; // Registers stableMonth unit

const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value);
const days = divide(temporal, stableMonth, 'day'); // Always 42 days
```

#### Manual Implementation (if not using calendar-units)
```typescript
// Generate 6-week calendar grid manually
const month = period(temporal, 'month', date);
const weeks = divide(temporal, month, 'week');

// Get all weeks that touch this month
const firstWeek = weeks[0];
const prevWeek = previous(temporal, firstWeek);
const allWeeks = [prevWeek, ...weeks];

// Ensure 6 weeks total
while (allWeeks.length < 6) {
  const lastWeek = allWeeks[allWeeks.length - 1];
  allWeeks.push(next(temporal, lastWeek));
}

// Get all days
const days = allWeeks.flatMap(week => divide(temporal, week, 'day'));
```

See [Calendar Units](/extensions/calendar-units) for more details.

## Migration from Moment.js

### Basic Date Operations

#### Moment.js

```javascript
import moment from "moment";

// Current time
const now = moment();

// Specific date
const date = moment("2024-03-14");

// Format
const formatted = moment().format("YYYY-MM-DD");

// Add/subtract
const tomorrow = moment().add(1, "day");
const yesterday = moment().subtract(1, "day");
```

#### useTemporal

```javascript
import { createTemporal } from "@usetemporal/core";
import { createNativeAdapter } from "@usetemporal/core/native";

const temporal = createTemporal({ adapter: createNativeAdapter() });

// Current time
const now = temporal.now;

// Specific date
const date = new Date("2024-03-14");
const day = temporal.periods.day(temporal, { date });

// Format (through adapter or native)
const formatted = day.start.toISOString().split("T")[0];

// Add/subtract
const tomorrow = day.future();
const yesterday = day.past();
```

### Start/End of Period

#### Moment.js

```javascript
// Start of month
const startOfMonth = moment().startOf("month");

// End of month
const endOfMonth = moment().endOf("month");

// Start of week
const startOfWeek = moment().startOf("week");
```

#### useTemporal

```javascript
// Start/end of month
const month = temporal.periods.month(temporal);
const startOfMonth = month.start;
const endOfMonth = month.end;

// Start/end of week
const week = temporal.periods.week(temporal);
const startOfWeek = week.start;
const endOfWeek = week.end;
```

### Working with Weeks

#### Moment.js

```javascript
// Get week number
const weekNumber = moment().week();

// Get all days in week
const days = [];
const startOfWeek = moment().startOf("week");
for (let i = 0; i < 7; i++) {
  days.push(startOfWeek.clone().add(i, "days"));
}
```

#### useTemporal

```javascript
// Get week number
const week = temporal.periods.week(temporal);
const weekNumber = week.number;

// Get all days in week - much simpler!
const days = temporal.divide(week, "day");
```

### Relative Time

#### Moment.js

```javascript
// Check if date is in the past
const isPast = moment("2023-01-01").isBefore(moment());

// Check if date is today
const isToday = moment().isSame(date, "day");

// Get days in month
const daysInMonth = moment().daysInMonth();
```

#### useTemporal

```javascript
// Check if date is in the past
const day = temporal.periods.day(temporal, { date: new Date("2023-01-01") });
const isPast = day.isPast;

// Check if date is today
const isToday = day.isNow;

// Get days in month
const month = temporal.periods.month(temporal);
const daysInMonth = month.days;
```

## Migration from date-fns

### Basic Operations

#### date-fns

```javascript
import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  getWeek,
  eachDayOfInterval,
} from "date-fns";

const now = new Date();

// Format date
const formatted = format(now, "yyyy-MM-dd");

// Add days
const tomorrow = addDays(now, 1);

// Get start/end of month
const monthStart = startOfMonth(now);
const monthEnd = endOfMonth(now);

// Get week number
const weekNum = getWeek(now);

// Get all days in a range
const days = eachDayOfInterval({
  start: monthStart,
  end: monthEnd,
});
```

#### useTemporal

```javascript
const temporal = createTemporal({ adapter: createNativeAdapter() });

// Current date
const now = temporal.now;

// Format date (use adapter or native)
const formatted = now.toISOString().split("T")[0];

// Add days
const today = temporal.periods.day(temporal);
const tomorrow = today.future();

// Get start/end of month
const month = temporal.periods.month(temporal);
const monthStart = month.start;
const monthEnd = month.end;

// Get week number
const week = temporal.periods.week(temporal);
const weekNum = week.number;

// Get all days in month - much simpler!
const days = temporal.divide(month, "day");
```

### Advanced date-fns with useTemporal Adapter

For a smoother migration, use the date-fns adapter:

```javascript
import { createTemporal } from "@usetemporal/core";
import { createDateFnsAdapter } from "@usetemporal/core/date-fns";
import { format } from "date-fns";

const temporal = createTemporal({
  adapter: createDateFnsAdapter(),
});

// Now you can use date-fns functions on useTemporal dates
const month = temporal.periods.month(temporal);
const formatted = format(month.start, "MMMM yyyy"); // "March 2024"

// But also get useTemporal's powerful features
const weeks = temporal.divide(month, "week");
const days = temporal.divide(month, "day");
```

## Migration from Day.js

### Basic Operations

#### Day.js

```javascript
import dayjs from "dayjs";

// Current time
const now = dayjs();

// Parse date
const date = dayjs("2024-03-14");

// Format
const formatted = dayjs().format("YYYY-MM-DD");

// Chain operations
const result = dayjs().startOf("month").add(1, "week").endOf("day");

// Get/set
const year = dayjs().year();
const month = dayjs().month(); // 0-11
```

#### useTemporal

```javascript
const temporal = createTemporal({ adapter: createNativeAdapter() });

// Current time
const now = temporal.now;

// Work with specific date
const date = new Date("2024-03-14");
const day = temporal.periods.day(temporal, { date });

// Format
const formatted = day.start.toISOString().split("T")[0];

// Equivalent operations
const month = temporal.periods.month(temporal);
const firstWeek = temporal.divide(month, "week")[0];
const endOfFirstWeek = firstWeek.end;

// Get values - note month is 1-12!
const year = temporal.periods.year(temporal);
const monthUnit = temporal.periods.month(temporal);
console.log(year.number); // 2024
console.log(monthUnit.number); // 3 (March, not 2!)
```

## Migration from Luxon

### Basic Operations

#### Luxon

```javascript
import { DateTime } from "luxon";

// Current time
const now = DateTime.now();

// Create date
const date = DateTime.fromISO("2024-03-14");

// With timezone
const ny = DateTime.now().setZone("America/New_York");

// Format
const formatted = now.toFormat("yyyy-MM-dd");

// Start of period
const startOfMonth = now.startOf("month");

// Add duration
const tomorrow = now.plus({ days: 1 });
```

#### useTemporal with Luxon Adapter

```javascript
import { createTemporal } from "@usetemporal/core";
import { createLuxonAdapter } from "@usetemporal/core/luxon";

const temporal = createTemporal({
  adapter: createLuxonAdapter(),
  timeZone: "America/New_York", // planned feature
});

// Current time
const now = temporal.now;

// Work with specific date
const date = new Date("2024-03-14");
const day = temporal.periods.day(temporal, { date });

// Format using Luxon through the adapter
const formatted = temporal.adapter.format(day.start, "yyyy-MM-dd");

// Start of period
const month = temporal.periods.month(temporal);
const startOfMonth = month.start;

// Navigation
const tomorrow = day.future();
```

## Migration from Native Date

### Basic Operations

#### Native JavaScript Date

```javascript
// Current time
const now = new Date();

// Create date
const date = new Date(2024, 2, 14); // March 14 (month is 0-indexed!)

// Get components
const year = date.getFullYear();
const month = date.getMonth(); // 0-11
const day = date.getDate();

// Add days (manual calculation)
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

// Get first day of month (manual)
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

// Get last day of month (manual)
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
```

#### useTemporal

```javascript
const temporal = createTemporal({ adapter: createNativeAdapter() });

// Current time
const now = temporal.now;

// Work with specific date
const date = new Date(2024, 2, 14); // Still March 14
const day = temporal.periods.day(temporal, { date });

// Get components - month is 1-12!
const year = temporal.periods.year(temporal);
const month = temporal.periods.month(temporal);
console.log(year.number); // 2024
console.log(month.number); // 3 (not 2!)
console.log(day.number); // 14

// Add days - much simpler
const tomorrow = day.future();

// Get first/last day of month - automatic
const monthUnit = temporal.periods.month(temporal);
const firstDay = monthUnit.start;
const lastDay = monthUnit.end;
```

## Common Migration Patterns

### 1. Calendar Generation

#### Traditional Approach

```javascript
// Complex logic to generate calendar with any library
function generateCalendar(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Add padding days from previous month
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add padding days from next month
  // ... more complex logic

  return days;
}
```

#### useTemporal Approach

```javascript
// Simple and clear with useTemporal
function generateCalendar(temporal) {
  const month = temporal.periods.month(temporal);
  const weeks = temporal.divide(month, "week");
  
  // Get all days from all weeks that touch this month
  const days = weeks.flatMap(week => temporal.divide(week, "day"));
  return days; // Includes padding days for complete weeks
}
```

### 2. Week-Based Calculations

#### Traditional Approach

```javascript
// Get all weeks in a month (complex)
function getWeeksInMonth(date) {
  const startOfMonth = moment(date).startOf("month");
  const endOfMonth = moment(date).endOf("month");
  const weeks = [];

  let current = startOfMonth.clone().startOf("week");
  while (current.isSameOrBefore(endOfMonth)) {
    weeks.push(current.clone());
    current.add(1, "week");
  }

  return weeks;
}
```

#### useTemporal Approach

```javascript
// Get all weeks in a month (simple)
function getWeeksInMonth(temporal) {
  const month = temporal.periods.month(temporal);
  const weeks = temporal.divide(month, "week");
  return weeks; // That's it!
}
```

### 3. Reactive Date Updates

#### Traditional Approach

```javascript
// Manual tracking with other libraries
let currentDate = moment();
let subscribers = [];

function updateDate(newDate) {
  currentDate = newDate;
  subscribers.forEach((fn) => fn(currentDate));
}

function subscribe(fn) {
  subscribers.push(fn);
}
```

#### useTemporal Approach

```javascript
// Automatic reactivity
import { watch } from "@vue/reactivity";

const temporal = createTemporal({ adapter: createNativeAdapter() });
const month = temporal.periods.month(temporal);

// Automatically updates when date changes
watch(
  () => month.number,
  (newMonth) => {
    console.log(`Month changed to ${newMonth}`);
  }
);
```

## Migration Checklist

When migrating to useTemporal:

1. **Install useTemporal and choose an adapter**

   ```bash
   npm install @usetemporal/core
   # or with your preferred adapter (luxon or date-fns)
   npm install @usetemporal/core luxon
   # or
   npm install @usetemporal/core date-fns
   ```

2. **Update imports**
   - Remove old date library imports
   - Import createTemporal and your chosen adapter

3. **Initialize temporal instance**

   ```javascript
   const temporal = createTemporal({
     adapter: createNativeAdapter({ weekStartsOn: 1 }), // Configure as needed
   });
   ```

4. **Replace date operations**
   - Use periods for accessing time units
   - Use divide() for getting collections
   - Use future()/past() for navigation

5. **Update month indexing**
   - Remember: useTemporal months are 1-12, not 0-11

6. **Leverage reactive features**
   - Use isNow, isPast, isFuture properties
   - Set up watchers for reactive updates

7. **Simplify complex date logic**
   - Replace manual calculations with divide()
   - Use week-based calendar generation

## Gradual Migration Strategy

You don't have to migrate everything at once:

```javascript
// Phase 1: Use useTemporal for new features
const temporal = createTemporal({ adapter: createNativeAdapter() });

// Phase 2: Keep existing date library for formatting
import { format } from "date-fns";

// Phase 3: Combine both during transition
const month = temporal.periods.month(temporal);
const formatted = format(month.start, "MMMM yyyy");

// Phase 4: Gradually replace old patterns
const days = temporal.divide(month, "day"); // Instead of eachDayOfInterval
```

## Need Help?

- Check the [API Reference](/api/create-temporal) for detailed documentation
- See [Examples](/examples/basic-usage) for common use cases
- Review [Advanced Patterns](/guide/advanced-patterns) for complex scenarios

The useTemporal community is here to help make your migration smooth and successful!
