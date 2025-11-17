# Migration Guide

This guide helps you migrate from various date libraries to useTemporal, or switch between different useTemporal adapters.

## Quick Migration Reference

| From | To | Complexity | Key Changes |
|------|-----|------------|-------------|
| Native Date | useTemporal (native) | Simple | Use Period-based API |
| date-fns | useTemporal + date-fns | Simple | Keep utilities, add structure |
| date-fns-tz | useTemporal + date-fns-tz | Simple | Keep timezone support |
| Luxon | useTemporal + luxon | Simple | Keep timezone features |
| Temporal API | useTemporal + temporal | Simple | Future-proof solution |

## From Vanilla JavaScript

### Basic Date Operations

```javascript
// Before: Vanilla JavaScript
const now = new Date()
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
const tomorrow = new Date(now)
tomorrow.setDate(tomorrow.getDate() + 1)

// After: useTemporal
import { createTemporal, period, next } from '@allystudio/usetemporal'

const temporal = createTemporal()
const month = temporal.period( new Date(), 'month')
const startOfMonth = month.start
const endOfMonth = new Date(month.end.getTime() - 1) // end is exclusive
const tomorrow = next(temporal.adapter, period(temporal, new Date(), 'day'))
```

### Date Comparisons

```javascript
// Before: Vanilla JavaScript
function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

function isDateInRange(date, start, end) {
  return date >= start && date <= end
}

// After: useTemporal
import { isSame, contains } from '@allystudio/usetemporal'

function isSameDay(temporal, date1, date2) {
  return isSame(temporal.adapter, date1, date2, 'day')
}

function isDateInRange(temporal, date, period) {
  return contains(temporal.adapter, period, date)
}
```

### Calendar Generation

```javascript
// Before: Complex vanilla JavaScript
function getMonthDays(year, month) {
  const days = []
  const date = new Date(year, month, 1)
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

// After: Simple with useTemporal
import { divide } from '@allystudio/usetemporal'

function getMonthDays(temporal, date) {
  const month = temporal.period( date, 'month')
  return divide(temporal.adapter, month, 'day')
}
```

## From date-fns

### Basic Operations

```javascript
// Before: date-fns
import { 
  startOfMonth, 
  endOfMonth, 
  addWeeks, 
  format,
  eachDayOfInterval 
} from 'date-fns'

const monthStart = startOfMonth(new Date())
const monthEnd = endOfMonth(new Date())
const nextWeek = addWeeks(new Date(), 1)
const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
const formatted = format(new Date(), 'yyyy-MM-dd')

// After: useTemporal with date-fns adapter
import { createTemporal, period, go, divide } from '@allystudio/usetemporal'
import { createDateFnsAdapter } from '@allystudio/usetemporal-adapter-date-fns'
import { format } from 'date-fns' // Keep using for formatting!

const temporal = createTemporal({ adapter: createDateFnsAdapter() })
const month = temporal.period( new Date(), 'month')
const nextWeek = go(temporal.adapter, period(temporal, new Date(), 'day'), 1, 'week')
const days = divide(temporal.adapter, month, 'day')
const formatted = format(new Date(), 'yyyy-MM-dd') // Still use date-fns!
```

### Locale Operations

```javascript
// Before: date-fns with locale
import { format } from 'date-fns'
import { es, fr } from 'date-fns/locale'

const spanish = format(new Date(), 'MMMM', { locale: es })
const french = format(new Date(), 'MMMM', { locale: fr })

// After: Same! Keep using date-fns for formatting
const period = temporal.period( new Date(), 'month')
const spanish = format(period.start, 'MMMM', { locale: es })
const french = format(period.start, 'MMMM', { locale: fr })
```

### Advanced Patterns

```javascript
// Before: date-fns functions
import { 
  eachWeekOfInterval,
  eachMonthOfInterval,
  isWithinInterval,
  areIntervalsOverlapping 
} from 'date-fns'

const year = { start: startOfYear(date), end: endOfYear(date) }
const months = eachMonthOfInterval(year)
const weeks = eachWeekOfInterval(year)

// After: useTemporal patterns
const year = temporal.period( date, 'year')
const months = divide(temporal.adapter, year, 'month')
const weeks = divide(temporal.adapter, year, 'week')

// Still use date-fns for specific utilities
import { isWithinInterval } from 'date-fns'
const inRange = isWithinInterval(date, { 
  start: period.start, 
  end: period.end 
})
```

## From Luxon

### Basic Migration

```javascript
// Before: Luxon
import { DateTime } from 'luxon'

const now = DateTime.now()
const startOfMonth = now.startOf('month')
const inTokyo = now.setZone('Asia/Tokyo')
const formatted = now.toFormat('yyyy-MM-dd')

// After: useTemporal with Luxon adapter
import { createTemporal, period } from '@allystudio/usetemporal'
import { createLuxonAdapter } from '@allystudio/usetemporal-adapter-luxon'
import { DateTime } from 'luxon' // Keep for formatting!

const temporal = createTemporal({ 
  adapter: createLuxonAdapter({ zone: 'local' }) 
})
const now = temporal.period( new Date(), 'day')
const month = temporal.period( new Date(), 'month')

// For timezone operations, create new temporal
const tokyoTemporal = createTemporal({
  adapter: createLuxonAdapter({ zone: 'Asia/Tokyo' })
})
const inTokyo = period(tokyoTemporal, new Date(), 'day')

// Still use Luxon for formatting
const formatted = DateTime.fromJSDate(now.start).toFormat('yyyy-MM-dd')
```

### Timezone Operations

```javascript
// Before: Luxon timezone handling
const meeting = DateTime.fromObject({
  year: 2025,
  month: 7,
  day: 25,
  hour: 14,
  zone: 'America/New_York'
})
const londonTime = meeting.setZone('Europe/London')

// After: Multiple temporal instances
const nyTemporal = createTemporal({
  adapter: createLuxonAdapter({ zone: 'America/New_York' })
})
const londonTemporal = createTemporal({
  adapter: createLuxonAdapter({ zone: 'Europe/London' })
})

// Same moment in different timezones
const sameMoment = new Date('2025-07-25T14:00:00-04:00')
const nyMeeting = period(nyTemporal, sameMoment, 'hour')
const londonMeeting = period(londonTemporal, sameMoment, 'hour')
```

## From date-fns-tz

### Basic Migration

```javascript
// Before: date-fns-tz
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'

const nyDate = utcToZonedTime(new Date(), 'America/New_York')
const utcDate = zonedTimeToUtc(nyDate, 'America/New_York')
const formatted = format(nyDate, 'yyyy-MM-dd HH:mm:ss zzz', {
  timeZone: 'America/New_York'
})

// After: useTemporal with date-fns-tz adapter
import { createTemporal, period } from '@allystudio/usetemporal'
import { createDateFnsTzAdapter } from '@allystudio/usetemporal/date-fns-tz'
import { format } from 'date-fns-tz' // Keep for formatting!

const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({ timezone: 'America/New_York' })
})

const nyPeriod = temporal.period( new Date(), 'hour')
// The period is already in NY timezone

// Still use date-fns-tz for formatting
const formatted = format(nyPeriod.start, 'yyyy-MM-dd HH:mm:ss zzz', {
  timeZone: 'America/New_York'
})
```

### Working with Multiple Timezones

```javascript
// Before: Manual timezone conversions
import { utcToZonedTime, format } from 'date-fns-tz'

function showMeetingTimes(utcDate) {
  const zones = ['America/New_York', 'Europe/London', 'Asia/Tokyo']
  return zones.map(zone => ({
    zone,
    time: format(utcToZonedTime(utcDate, zone), 'PPpp', { timeZone: zone })
  }))
}

// After: Cleaner with multiple temporal instances
function showMeetingTimes(date) {
  const zones = ['America/New_York', 'Europe/London', 'Asia/Tokyo']
  return zones.map(zone => {
    const temporal = createTemporal({
      adapter: createDateFnsTzAdapter({ timezone: zone })
    })
    const period = temporal.period( date, 'hour')
    return {
      zone,
      time: format(period.start, 'PPpp', { timeZone: zone })
    }
  })
}
```

## Switching Between Adapters

### Runtime Adapter Switching

```typescript
// Start with native for performance
let temporal = createTemporal()

// Switch to Luxon when timezone needed
function enableTimezoneSupport(timezone: string) {
  temporal = createTemporal({
    adapter: createLuxonAdapter({ zone: timezone })
  })
}

// All code continues to work!
const period = temporal.period( new Date(), 'day')
```

### Gradual Migration Strategy

```typescript
// Phase 1: Use adapter matching your current library
const temporal = createTemporal({
  adapter: createDateFnsAdapter() // If using date-fns
})

// Phase 2: Migrate code to useTemporal patterns
// Old date library code and new useTemporal code coexist

// Phase 3: Switch to more modern adapter
const temporal = createTemporal({
  adapter: createDateFnsAdapter() // Smaller, maintained
})

// Phase 4: Optimize - use native where possible
const temporal = createTemporal() // Zero dependencies!
```

### Feature-Based Selection

```typescript
// Create different temporal instances for different features
const adapters = {
  // Fast local operations
  local: createTemporal(),
  
  // Formatting and locales
  formatting: createTemporal({
    adapter: createDateFnsAdapter()
  }),
  
  // Timezone operations
  timezone: createTemporal({
    adapter: createLuxonAdapter()
  })
}

// Use appropriate adapter for each operation
function formatDate(date: Date, locale: Locale) {
  const period = period(adapters.formatting, date, 'day')
  return format(period.start, 'PPP', { locale })
}

function convertTimezone(date: Date, from: string, to: string) {
  const fromTemporal = createTemporal({
    adapter: createLuxonAdapter({ zone: from })
  })
  const toTemporal = createTemporal({
    adapter: createLuxonAdapter({ zone: to })
  })
  // ... conversion logic
}
```

## Common Migration Patterns

### Replace Loops with divide()

```javascript
// Before: Manual date loops
const days = []
const current = new Date(startDate)
while (current <= endDate) {
  days.push(new Date(current))
  current.setDate(current.getDate() + 1)
}

// After: Clean divide pattern
const period = { start: startDate, end: endDate }
const days = divide(temporal.adapter, period, 'day')
```

### Replace Complex Calculations

```javascript
// Before: Complex month calculations
function getWeeksInMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return Math.ceil((firstDay + daysInMonth) / 7)
}

// After: Simple divide
function getWeeksInMonth(temporal, date) {
  const month = temporal.period( date, 'month')
  return divide(temporal.adapter, month, 'week').length
}
```

### Simplify Relative Date Logic

```javascript
// Before: Relative date calculations
function getLastMonday() {
  const today = new Date()
  const day = today.getDay()
  const diff = today.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(today.setDate(diff))
}

// After: Clear intent
function getThisMonday(temporal) {
  const week = temporal.period( new Date(), 'week')
  return week.start // Weeks start on configured day
}
```

## Performance Migration Tips

### 1. Benchmark Critical Paths

```javascript
// Measure performance impact
console.time('operation')
// Your date operations
console.timeEnd('operation')

// Compare adapters
const adapters = [
  { name: 'Native', temporal: createTemporal() },
  { name: 'date-fns', temporal: createTemporal({ adapter: createDateFnsAdapter() }) },
  // ... other adapters
]

adapters.forEach(({ name, temporal }) => {
  console.time(name)
  // Run same operations
  for (let i = 0; i < 1000; i++) {
    const period = temporal.period( new Date(), 'month')
    const days = divide(temporal.adapter, period, 'day')
  }
  console.timeEnd(name)
})
```

### 2. Lazy Load Adapters

```javascript
// Load adapters only when needed
async function getTemporalWithTimezone() {
  const { createLuxonAdapter } = await import('@allystudio/usetemporal-adapter-luxon')
  return createTemporal({ adapter: createLuxonAdapter() })
}
```

### 3. Use Native for Hot Paths

```javascript
// Use native adapter for performance-critical code
const fastTemporal = createTemporal() // Native

// Use feature-rich adapter only when needed
const richTemporal = await loadRichAdapter()
```

## Next Steps

- Review [adapter comparison](./index.md) to choose the right adapter
- Check [performance guide](/guide/performance) for optimization
- See individual adapter guides for specific features
- Explore [examples](/examples) for real-world usage