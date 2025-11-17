# date-fns Adapter Guide

The date-fns adapter brings the power of date-fns's extensive utility library to useTemporal while maintaining excellent tree-shaking and performance.

## Overview

- **Bundle Size:** ~2.1KB (adapter only, date-fns tree-shakes)
- **Performance:** Excellent (80-90% of native)
- **Timezone Support:** No (use date-fns-tz separately)
- **Best For:** Applications needing rich date utilities and formatting

## Installation

```bash
npm install @allystudio/usetemporal @allystudio/usetemporal-adapter-date-fns date-fns
```

## Basic Usage

### Simple Setup
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsAdapter } from '@allystudio/usetemporal-adapter-date-fns'

const temporal = createTemporal({
  adapter: createDateFnsAdapter()
})
```

### With Configuration
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsAdapter } from '@allystudio/usetemporal-adapter-date-fns'
import { enUS, es, fr } from 'date-fns/locale'

const temporal = createTemporal({
  adapter: createDateFnsAdapter({
    locale: enUS, // Default locale
    weekStartsOn: 1, // Monday
    firstWeekContainsDate: 4 // ISO week numbering
  })
})
```

## Features

### Rich Formatting

Leverage date-fns formatting alongside useTemporal:

```typescript
import { format, formatDistance, formatRelative } from 'date-fns'

const month = temporal.period( new Date(), 'month')

// Various formatting options
format(month.start, 'MMMM yyyy') // "July 2025"
format(month.start, 'MMM do, yyyy') // "Jul 1st, 2025"
format(month.start, 'yyyy-MM-dd') // "2025-07-01"

// Relative formatting
formatDistance(month.start, month.end) // "1 month"
formatRelative(month.start, new Date()) // "last Monday at 12:00 AM"
```

### Locale Support

Full internationalization support:

```typescript
import { format } from 'date-fns'
import { es, fr, de, ja } from 'date-fns/locale'

const period = temporal.period( new Date(), 'month')

// Format in different locales
format(period.start, 'MMMM yyyy', { locale: es }) // "julio 2025"
format(period.start, 'MMMM yyyy', { locale: fr }) // "juillet 2025"
format(period.start, 'MMMM yyyy', { locale: de }) // "Juli 2025"
format(period.start, 'MMMM yyyy', { locale: ja }) // "7月 2025年"
```

### Advanced Date Operations

Combine useTemporal patterns with date-fns utilities:

```typescript
import { 
  addBusinessDays, 
  isWeekend, 
  isValid,
  parseISO,
  startOfQuarter,
  endOfQuarter
} from 'date-fns'

// Business day calculations
const today = temporal.period( new Date(), 'day')
const nextBusinessDay = addBusinessDays(today.start, 1)

// Validate dates
const userInput = '2025-07-25'
if (isValid(parseISO(userInput))) {
  const period = temporal.period( parseISO(userInput), 'day')
}

// Quarter operations
const quarter = {
  start: startOfQuarter(new Date()),
  end: endOfQuarter(new Date())
}
```

## Unique Capabilities

### 1. Extensive Parse Functions

```typescript
import { parse, parseISO, parseJSON } from 'date-fns'

// Parse various formats
const date1 = parse('25/07/2025', 'dd/MM/yyyy', new Date())
const date2 = parseISO('2025-07-25T10:30:00Z')
const date3 = parseJSON('2025-07-25T10:30:00.000Z')

// Create periods from parsed dates
const period1 = temporal.period( date1, 'day')
const period2 = temporal.period( date2, 'hour')
```

### 2. Date Validation

```typescript
import { isValid, isDate, isPast, isFuture, isToday } from 'date-fns'

function validateAndCreatePeriod(temporal, input, unit) {
  const date = parseISO(input)
  
  if (!isValid(date)) {
    throw new Error('Invalid date')
  }
  
  if (isPast(date)) {
    console.warn('Date is in the past')
  }
  
  return temporal.period( date, unit)
}
```

### 3. Complex Comparisons

```typescript
import { 
  isBefore, isAfter, isEqual,
  isWithinInterval, areIntervalsOverlapping,
  compareAsc, compareDesc
} from 'date-fns'

const period1 = temporal.period( '2025-07-01', 'week')
const period2 = temporal.period( '2025-07-15', 'week')

// Check relationships
isBefore(period1.start, period2.start) // true
isWithinInterval(new Date(), {
  start: period1.start,
  end: period2.end
}) // depends on current date

// Sort periods
const periods = [period2, period1]
periods.sort((a, b) => compareAsc(a.start, b.start))
```

## Common Patterns

### Calendar with Formatting

```typescript
import { format, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'

function createFormattedCalendar(temporal, date, locale = enUS) {
  const month = temporal.period( date, 'month')
  const weeks = divide(temporal.adapter, month, 'week')
  
  return {
    title: format(month.start, 'MMMM yyyy', { locale }),
    weeks: weeks.map(week => ({
      weekNumber: format(week.start, 'w', { locale }),
      days: divide(temporal.adapter, week, 'day').map(day => ({
        date: day.date,
        dayNumber: format(day.start, 'd', { locale }),
        dayName: format(day.start, 'EEEE', { locale }),
        isWeekend: [0, 6].includes(getDay(day.start))
      }))
    }))
  }
}
```

### Working Days Calculator

```typescript
import { 
  addBusinessDays, 
  differenceInBusinessDays,
  isWeekend,
  isWithinInterval
} from 'date-fns'

function getWorkingDaysInPeriod(temporal, period) {
  const days = divide(temporal.adapter, period, 'day')
  return days.filter(day => !isWeekend(day.start))
}

function getNextWorkingDay(temporal, date) {
  const nextDay = addBusinessDays(date, 1)
  return temporal.period( nextDay, 'day')
}

// Calculate project timeline
const project = temporal.period( '2025-07-01', 'month')
const workingDays = getWorkingDaysInPeriod(temporal, project)
console.log(`Project has ${workingDays.length} working days`)
```

### Date Range Formatting

```typescript
import { format, isSameMonth, isSameYear } from 'date-fns'

function formatDateRange(start, end, locale) {
  if (isSameMonth(start, end)) {
    // Same month: "July 1-15, 2025"
    return `${format(start, 'MMMM d', { locale })}-${format(end, 'd, yyyy', { locale })}`
  } else if (isSameYear(start, end)) {
    // Same year: "July 1 - August 15, 2025"
    return `${format(start, 'MMMM d', { locale })} - ${format(end, 'MMMM d, yyyy', { locale })}`
  } else {
    // Different years: "December 25, 2024 - January 5, 2025"
    return `${format(start, 'MMMM d, yyyy', { locale })} - ${format(end, 'MMMM d, yyyy', { locale })}`
  }
}

const period = temporal.period( new Date(), 'quarter')
console.log(formatDateRange(period.start, period.end, enUS))
```

## Performance Considerations

### Tree-Shaking

Import only what you need:

```typescript
// ✅ Good: Specific imports
import { format, parseISO } from 'date-fns'

// ❌ Bad: Importing everything
import * as dateFns from 'date-fns'
```

### Locale Loading

Load locales dynamically:

```typescript
// Static import (adds to bundle)
import { es } from 'date-fns/locale'

// Dynamic import (loaded when needed)
async function loadLocale(code) {
  const locale = await import(`date-fns/locale/${code}`)
  return locale.default
}

// Usage
const locale = await loadLocale('es')
format(date, 'MMMM', { locale })
```

## Migration from date-fns

If you're already using date-fns, migration is straightforward:

```typescript
// Before: Pure date-fns
import { startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'

const start = startOfMonth(new Date())
const end = endOfMonth(new Date())
const days = eachDayOfInterval({ start, end })

// After: useTemporal with date-fns
const month = temporal.period( new Date(), 'month')
const days = divide(temporal.adapter, month, 'day')

// You can still use date-fns utilities!
const formatted = days.map(day => format(day.start, 'yyyy-MM-dd'))
```

## Best Practices

### 1. Combine Strengths

Use useTemporal for structure, date-fns for utilities:

```typescript
// useTemporal for time hierarchy
const year = temporal.period( new Date(), 'year')
const quarters = divide(temporal.adapter, year, 'quarter')

// date-fns for formatting and utilities
const quarterReports = quarters.map(q => ({
  period: q,
  label: format(q.start, 'Qo yyyy'),
  workingDays: differenceInBusinessDays(q.end, q.start)
}))
```

### 2. Consistent Locale Handling

```typescript
// Create a locale-aware temporal instance
function createLocaleTemporal(localeCode) {
  const locale = await import(`date-fns/locale/${localeCode}`)
  
  return {
    temporal: createTemporal({
      adapter: createDateFnsAdapter({
        locale: locale.default
      })
    }),
    locale: locale.default
  }
}

// Use consistently throughout app
const { temporal, locale } = await createLocaleTemporal('es')
```

### 3. Type Safety

```typescript
import type { Locale } from 'date-fns'

interface DateConfig {
  temporal: Temporal
  locale: Locale
  format: string
}

function formatPeriod(
  period: Period, 
  config: DateConfig
): string {
  return format(period.start, config.format, { 
    locale: config.locale 
  })
}
```

## Limitations

### No Built-in Timezone Support

For timezone support, combine with date-fns-tz:

```typescript
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz'

// Convert to specific timezone
const utcDate = zonedTimeToUtc('2025-07-25 10:00:00', 'America/New_York')
const period = temporal.period( utcDate, 'hour')
```

### Quarter Handling

date-fns has limited quarter support:

```typescript
// date-fns quarters are calendar quarters (Q1 = Jan-Mar)
// For fiscal quarters, implement custom logic
function getFiscalQuarter(date, fiscalYearStart = 4) {
  const month = date.getMonth()
  const adjustedMonth = (month - fiscalYearStart + 12) % 12
  return Math.floor(adjustedMonth / 3) + 1
}
```

## Next Steps

- Explore [date-fns documentation](https://date-fns.org/)
- Learn about [format strings](https://date-fns.org/docs/format)
- See [locale guide](https://date-fns.org/docs/I18n)
- Consider [Luxon adapter](./luxon.md) for timezones
- Check [performance guide](/guide/performance)