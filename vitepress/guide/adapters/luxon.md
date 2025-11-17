# Luxon Adapter Guide

The Luxon adapter brings powerful timezone support and internationalization features to useTemporal, making it ideal for global applications.

## Overview

- **Bundle Size:** ~2.3KB (adapter) + ~70KB (Luxon)
- **Performance:** Good (30-40% of native)
- **Timezone Support:** Full support with DST handling
- **Best For:** International applications, timezone-critical systems

## Installation

```bash
npm install @allystudio/usetemporal @allystudio/usetemporal-adapter-luxon luxon
```

TypeScript types:
```bash
npm install --save-dev @types/luxon
```

## Basic Usage

### Simple Setup
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createLuxonAdapter } from '@allystudio/usetemporal-adapter-luxon'

const temporal = createTemporal({
  adapter: createLuxonAdapter()
})
```

### With Timezone Configuration
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createLuxonAdapter } from '@allystudio/usetemporal-adapter-luxon'

const temporal = createTemporal({
  adapter: createLuxonAdapter({
    zone: 'America/New_York', // or 'local', 'utc'
    locale: 'en-US',
    weekSettings: {
      firstDay: 1, // Monday
      minimalDays: 4 // ISO week rules
    }
  })
})
```

## Timezone Features

### Working with Timezones

```typescript
import { DateTime } from 'luxon'

// Create temporal with specific timezone
const nyTemporal = createTemporal({
  adapter: createLuxonAdapter({ zone: 'America/New_York' })
})

const tokyoTemporal = createTemporal({
  adapter: createLuxonAdapter({ zone: 'Asia/Tokyo' })
})

// Same moment, different local times
const now = new Date()
const nyPeriod = period(nyTemporal, now, 'day')
const tokyoPeriod = period(tokyoTemporal, now, 'day')

console.log(DateTime.fromJSDate(nyPeriod.start).toISO()) // NY midnight
console.log(DateTime.fromJSDate(tokyoPeriod.start).toISO()) // Tokyo midnight
```

### DST Handling

Luxon automatically handles Daylight Saving Time transitions:

```typescript
// DST transition example (Spring forward in US)
const beforeDST = temporal.period( '2025-03-08', 'day')
const duringDST = temporal.period( '2025-03-09', 'day')

// Luxon handles the missing hour correctly
const hours1 = divide(temporal.adapter, beforeDST, 'hour') // 24 hours
const hours2 = divide(temporal.adapter, duringDST, 'hour') // 23 hours (DST)
```

### Zone Conversion

```typescript
import { DateTime } from 'luxon'

function convertPeriodToZone(period: Period, fromZone: string, toZone: string) {
  const dt = DateTime.fromJSDate(period.start).setZone(fromZone)
  const converted = dt.setZone(toZone)
  
  return {
    original: dt.toISO(),
    converted: converted.toISO(),
    offset: converted.offset - dt.offset
  }
}

const meeting = temporal.period( '2025-07-25 15:00', 'hour')
const conversion = convertPeriodToZone(
  meeting, 
  'America/New_York', 
  'Europe/London'
)
// NY 3:00 PM = London 8:00 PM
```

## Internationalization

### Locale-Aware Formatting

```typescript
import { DateTime } from 'luxon'

const period = temporal.period( new Date(), 'month')
const dt = DateTime.fromJSDate(period.start)

// Different locale formats
dt.setLocale('en-US').toLocaleString(DateTime.DATE_FULL)
// "July 1, 2025"

dt.setLocale('fr-FR').toLocaleString(DateTime.DATE_FULL)
// "1 juillet 2025"

dt.setLocale('ja-JP').toLocaleString(DateTime.DATE_FULL)
// "2025年7月1日"
```

### Relative Time

```typescript
import { DateTime } from 'luxon'

function getRelativeTime(date: Date, locale = 'en') {
  const dt = DateTime.fromJSDate(date)
  return dt.setLocale(locale).toRelative()
}

const yesterday = previous(temporal.adapter, temporal.period( new Date(), 'day'))
console.log(getRelativeTime(yesterday.start)) // "1 day ago"
console.log(getRelativeTime(yesterday.start, 'es')) // "hace 1 día"
```

### Calendar Systems

```typescript
// Different calendar systems
const dt = DateTime.fromJSDate(new Date())

// Islamic calendar
dt.reconfigure({ outputCalendar: 'islamic' }).toLocaleString()

// Hebrew calendar
dt.reconfigure({ outputCalendar: 'hebrew' }).toLocaleString()

// Japanese calendar
dt.reconfigure({ outputCalendar: 'japanese' }).toLocaleString()
```

## Advanced Features

### Duration Support

```typescript
import { Duration } from 'luxon'

// Calculate working hours between periods
function getWorkingHours(start: Period, end: Period) {
  const startDT = DateTime.fromJSDate(start.start)
  const endDT = DateTime.fromJSDate(end.start)
  
  const duration = endDT.diff(startDT, ['days', 'hours'])
  const weekdays = Math.floor(duration.days * 5/7) // Rough estimate
  
  return weekdays * 8 // 8 hours per weekday
}
```

### Interval Operations

```typescript
import { Interval, DateTime } from 'luxon'

// Create Luxon interval from useTemporal period
function periodToInterval(period: Period): Interval {
  return Interval.fromDateTimes(
    DateTime.fromJSDate(period.start),
    DateTime.fromJSDate(period.end)
  )
}

const week1 = temporal.period( '2025-07-01', 'week')
const week2 = temporal.period( '2025-07-08', 'week')

const interval1 = periodToInterval(week1)
const interval2 = periodToInterval(week2)

// Check overlap
interval1.overlaps(interval2) // false
interval1.abutsStart(interval2) // true
```

### Business Days

```typescript
import { DateTime } from 'luxon'

function addBusinessDays(date: Date, days: number): Date {
  let dt = DateTime.fromJSDate(date)
  let added = 0
  
  while (added < days) {
    dt = dt.plus({ days: 1 })
    if (dt.weekday <= 5) { // Monday = 1, Friday = 5
      added++
    }
  }
  
  return dt.toJSDate()
}

// Usage with useTemporal
const today = temporal.period( new Date(), 'day')
const in5BusinessDays = period(
  temporal, 
  addBusinessDays(today.start, 5), 
  'day'
)
```

## Common Patterns

### Multi-Timezone Dashboard

```typescript
interface TimezoneDisplay {
  zone: string
  label: string
  temporal: Temporal
}

const timezones: TimezoneDisplay[] = [
  {
    zone: 'America/New_York',
    label: 'New York',
    temporal: createTemporal({
      adapter: createLuxonAdapter({ zone: 'America/New_York' })
    })
  },
  {
    zone: 'Europe/London',
    label: 'London',
    temporal: createTemporal({
      adapter: createLuxonAdapter({ zone: 'Europe/London' })
    })
  },
  {
    zone: 'Asia/Tokyo',
    label: 'Tokyo',
    temporal: createTemporal({
      adapter: createLuxonAdapter({ zone: 'Asia/Tokyo' })
    })
  }
]

// Show current time in each timezone
function getWorldClock() {
  const now = new Date()
  
  return timezones.map(tz => ({
    ...tz,
    currentTime: DateTime.fromJSDate(now)
      .setZone(tz.zone)
      .toLocaleString(DateTime.TIME_24_WITH_SECONDS)
  }))
}
```

### Meeting Scheduler

```typescript
import { DateTime } from 'luxon'

interface MeetingSlot {
  start: Date
  end: Date
  zones: { [zone: string]: string }
}

function findMeetingSlots(
  date: Date,
  durationMinutes: number,
  zones: string[]
): MeetingSlot[] {
  const slots: MeetingSlot[] = []
  const baseDT = DateTime.fromJSDate(date).startOf('day')
  
  // Check each hour of the day
  for (let hour = 0; hour < 24; hour++) {
    const slotStart = baseDT.plus({ hours: hour })
    const slotEnd = slotStart.plus({ minutes: durationMinutes })
    
    // Check if slot is during business hours in all zones
    const validForAllZones = zones.every(zone => {
      const localStart = slotStart.setZone(zone)
      return localStart.hour >= 9 && localStart.hour < 17
    })
    
    if (validForAllZones) {
      slots.push({
        start: slotStart.toJSDate(),
        end: slotEnd.toJSDate(),
        zones: zones.reduce((acc, zone) => {
          acc[zone] = slotStart.setZone(zone).toLocaleString(DateTime.TIME_SIMPLE)
          return acc
        }, {} as { [zone: string]: string })
      })
    }
  }
  
  return slots
}
```

### Recurring Events

```typescript
import { DateTime } from 'luxon'

function generateRecurringEvents(
  start: Date,
  pattern: 'daily' | 'weekly' | 'monthly',
  count: number,
  timezone: string
): Period[] {
  const temporal = createTemporal({
    adapter: createLuxonAdapter({ zone: timezone })
  })
  
  const periods: Period[] = []
  let current = DateTime.fromJSDate(start).setZone(timezone)
  
  for (let i = 0; i < count; i++) {
    periods.push(temporal.period( current.toJSDate(), 'day'))
    
    switch (pattern) {
      case 'daily':
        current = current.plus({ days: 1 })
        break
      case 'weekly':
        current = current.plus({ weeks: 1 })
        break
      case 'monthly':
        // Keep same day of month, handling edge cases
        current = current.plus({ months: 1 })
        break
    }
  }
  
  return periods
}
```

## Performance Optimization

### Reuse DateTime Instances

```typescript
// ❌ Bad: Creating new DateTime for each operation
function inefficient(dates: Date[]) {
  return dates.map(date => 
    DateTime.fromJSDate(date).toFormat('yyyy-MM-dd')
  )
}

// ✅ Good: Reuse DateTime instance
function efficient(dates: Date[]) {
  const dt = DateTime.now()
  return dates.map(date => 
    dt.set({ 
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }).toFormat('yyyy-MM-dd')
  )
}
```

### Cache Timezone Data

```typescript
// Cache temporal instances for each timezone
const temporalCache = new Map<string, Temporal>()

function getTemporalForZone(zone: string): Temporal {
  if (!temporalCache.has(zone)) {
    temporalCache.set(zone, createTemporal({
      adapter: createLuxonAdapter({ zone })
    }))
  }
  return temporalCache.get(zone)!
}
```

## Limitations

### Bundle Size

Luxon is larger than other options:

```typescript
// Consider lazy loading for better performance
async function loadLuxonTemporal() {
  const { createLuxonAdapter } = await import('@allystudio/usetemporal/luxon')
  return createTemporal({
    adapter: createLuxonAdapter()
  })
}
```

### Performance

Luxon is slower than native operations:

```typescript
// For performance-critical paths, consider hybrid approach
const simpleTemporal = createTemporal() // Native for speed
const luxonTemporal = createTemporal({  // Luxon for timezone ops
  adapter: createLuxonAdapter()
})

// Use native for local operations
const localPeriods = divide(simpleTemporal, month, 'day')

// Use Luxon only when timezone matters
const tzAwarePeriod = period(luxonTemporal, date, 'day')
```

## Best Practices

### 1. Explicit Timezone Handling

```typescript
// Always be explicit about timezones
const temporal = createTemporal({
  adapter: createLuxonAdapter({ 
    zone: 'America/New_York' // Explicit > implicit
  })
})
```

### 2. Consistent Locale Usage

```typescript
// Set locale at adapter level for consistency
const temporal = createTemporal({
  adapter: createLuxonAdapter({ 
    locale: 'en-US',
    zone: 'America/New_York'
  })
})
```

### 3. Type Safety with Luxon

```typescript
import type { Zone, DateTime as LuxonDateTime } from 'luxon'

interface TimezoneConfig {
  zone: string | Zone
  locale?: string
}

function createTzAwareTemporal(config: TimezoneConfig) {
  return createTemporal({
    adapter: createLuxonAdapter(config)
  })
}
```

## Migration from Luxon

```typescript
// Before: Pure Luxon
import { DateTime } from 'luxon'

const start = DateTime.now().startOf('month')
const end = DateTime.now().endOf('month')
const days = end.diff(start, 'days').days

// After: useTemporal with Luxon adapter
const month = temporal.period( new Date(), 'month')
const days = divide(temporal.adapter, month, 'day').length

// Still use Luxon for formatting!
const formatted = DateTime.fromJSDate(month.start).toFormat('MMMM yyyy')
```

## Next Steps

- Learn about [timezone best practices](https://moment.github.io/luxon/#/zones)
- Explore [Luxon documentation](https://moment.github.io/luxon/)
- See [Temporal adapter](./temporal.md) for future standard
- Check [performance guide](/guide/performance)
- Review [internationalization guide](https://moment.github.io/luxon/#/intl)