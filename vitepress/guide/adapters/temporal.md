# Temporal Adapter Guide

The Temporal adapter uses the upcoming Temporal API standard, providing the most precise and feature-rich date/time handling available in JavaScript.

## Overview

- **Bundle Size:** ~3KB (adapter) + ~40KB (polyfill)
- **Performance:** Good (30-35% of native)
- **Timezone Support:** Best-in-class with IANA timezone database
- **Best For:** Future-proof applications requiring precision

::: warning
The Temporal API is not yet standardized. This adapter requires a polyfill until browsers implement native support (expected 2025-2026).
:::

## Installation

```bash
npm install @allystudio/usetemporal @allystudio/usetemporal-adapter-temporal @js-temporal/polyfill
```

## Basic Usage

### Setup with Polyfill
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createTemporalAdapter } from '@allystudio/usetemporal-adapter-temporal'

// Polyfill is auto-loaded by the adapter
const temporal = createTemporal({
  adapter: createTemporalAdapter()
})
```

### With Configuration
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createTemporalAdapter } from '@allystudio/usetemporal-adapter-temporal'
import { Temporal } from '@js-temporal/polyfill'

const temporal = createTemporal({
  adapter: createTemporalAdapter({
    timeZone: 'America/New_York',
    calendar: 'iso8601', // or 'islamic', 'hebrew', etc.
    locale: 'en-US'
  })
})
```

## Unique Features

### Precise Time Handling

The Temporal API provides nanosecond precision and clear distinctions between different time concepts:

```typescript
import { Temporal } from '@js-temporal/polyfill'

// Different time types for different needs
const plainDate = Temporal.PlainDate.from('2025-07-25')
const plainTime = Temporal.PlainTime.from('14:30:00')
const plainDateTime = Temporal.PlainDateTime.from('2025-07-25T14:30:00')
const zonedDateTime = Temporal.ZonedDateTime.from({
  timeZone: 'America/New_York',
  year: 2025,
  month: 7,
  day: 25,
  hour: 14,
  minute: 30
})

// Use with useTemporal
const period = temporal.period( zonedDateTime.toInstant(), 'day')
```

### Advanced Timezone Support

```typescript
import { Temporal } from '@js-temporal/polyfill'

// List all available timezones
const timezones = Temporal.TimeZone.listTimeZones()

// Get timezone details
const tz = Temporal.TimeZone.from('America/New_York')
const now = Temporal.Now.instant()
console.log(tz.getOffsetStringFor(now)) // "-04:00" or "-05:00"

// Precise DST handling
function getDSTTransitions(year: number, timezone: string) {
  const tz = Temporal.TimeZone.from(timezone)
  const transitions = []
  
  // Check each day of the year for offset changes
  let previousOffset = null
  for (let month = 1; month <= 12; month++) {
    for (let day = 1; day <= 31; day++) {
      try {
        const date = Temporal.PlainDate.from({ year, month, day })
        const instant = date.toZonedDateTime(tz).toInstant()
        const offset = tz.getOffsetStringFor(instant)
        
        if (previousOffset && offset !== previousOffset) {
          transitions.push({ date: date.toString(), from: previousOffset, to: offset })
        }
        previousOffset = offset
      } catch {
        // Invalid date (e.g., Feb 31)
      }
    }
  }
  
  return transitions
}
```

### Calendar Systems

Support for non-Gregorian calendars:

```typescript
// Create temporal with different calendar
const islamicTemporal = createTemporal({
  adapter: createTemporalAdapter({
    calendar: 'islamic-umalqura'
  })
})

const hebrewTemporal = createTemporal({
  adapter: createTemporalAdapter({
    calendar: 'hebrew'
  })
})

// Convert between calendars
import { Temporal } from '@js-temporal/polyfill'

const gregorianDate = Temporal.PlainDate.from('2025-07-25')
const islamicDate = gregorianDate.withCalendar('islamic-umalqura')
const hebrewDate = gregorianDate.withCalendar('hebrew')

console.log(islamicDate.toString()) // "2025-07-25[u-ca=islamic-umalqura]"
console.log(hebrewDate.toString())  // "2025-07-25[u-ca=hebrew]"
```

### Duration Arithmetic

Precise duration calculations:

```typescript
import { Temporal } from '@js-temporal/polyfill'

// Create durations
const workDay = Temporal.Duration.from({ hours: 8 })
const sprint = Temporal.Duration.from({ weeks: 2 })
const quarter = Temporal.Duration.from({ months: 3 })

// Calculate project timeline
function calculateProjectEnd(start: Date, sprints: number) {
  const startDate = Temporal.PlainDate.from(start.toISOString().split('T')[0])
  const duration = Temporal.Duration.from({ weeks: sprints * 2 })
  const endDate = startDate.add(duration)
  
  return endDate.toPlainDate().toString()
}

// Working with business days
function addBusinessDays(start: Date, days: number): Date {
  let current = Temporal.PlainDate.from(start.toISOString().split('T')[0])
  let added = 0
  
  while (added < days) {
    current = current.add({ days: 1 })
    if (current.dayOfWeek >= 1 && current.dayOfWeek <= 5) {
      added++
    }
  }
  
  return new Date(current.toString())
}
```

## Common Patterns

### Timezone-Aware Scheduling

```typescript
import { Temporal } from '@js-temporal/polyfill'

interface Meeting {
  title: string
  startZoned: Temporal.ZonedDateTime
  duration: Temporal.Duration
  attendeeTimezones: string[]
}

function scheduleMeeting(
  title: string,
  startLocal: string,
  hostTimezone: string,
  durationMinutes: number,
  attendeeTimezones: string[]
): Meeting {
  const startZoned = Temporal.ZonedDateTime.from({
    timeZone: hostTimezone,
    ...Temporal.PlainDateTime.from(startLocal)
  })
  
  const duration = Temporal.Duration.from({ minutes: durationMinutes })
  
  return {
    title,
    startZoned,
    duration,
    attendeeTimezones
  }
}

function getMeetingTimesForAllAttendees(meeting: Meeting) {
  return meeting.attendeeTimezones.map(tz => {
    const attendeeTime = meeting.startZoned.withTimeZone(tz)
    return {
      timezone: tz,
      start: attendeeTime.toLocaleString(),
      end: attendeeTime.add(meeting.duration).toLocaleString()
    }
  })
}
```

### Recurring Events with Temporal

```typescript
import { Temporal } from '@js-temporal/polyfill'

type RecurrenceRule = {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  until?: Temporal.PlainDate
  count?: number
  byWeekDay?: number[] // 1-7
  byMonthDay?: number[] // 1-31
}

function* generateRecurrences(
  start: Temporal.ZonedDateTime,
  rule: RecurrenceRule
) {
  let current = start
  let count = 0
  
  while (true) {
    // Check end conditions
    if (rule.until && current.toPlainDate().compare(rule.until) > 0) break
    if (rule.count && count >= rule.count) break
    
    // Check if current matches rule constraints
    if (rule.byWeekDay && !rule.byWeekDay.includes(current.dayOfWeek)) {
      current = current.add({ days: 1 })
      continue
    }
    
    if (rule.byMonthDay && !rule.byMonthDay.includes(current.day)) {
      current = current.add({ days: 1 })
      continue
    }
    
    yield current
    count++
    
    // Move to next occurrence
    switch (rule.frequency) {
      case 'daily':
        current = current.add({ days: rule.interval })
        break
      case 'weekly':
        current = current.add({ weeks: rule.interval })
        break
      case 'monthly':
        current = current.add({ months: rule.interval })
        break
      case 'yearly':
        current = current.add({ years: rule.interval })
        break
    }
  }
}

// Usage
const start = Temporal.ZonedDateTime.from({
  timeZone: 'America/New_York',
  year: 2025,
  month: 7,
  day: 25,
  hour: 10
})

const rule: RecurrenceRule = {
  frequency: 'weekly',
  interval: 2,
  count: 10,
  byWeekDay: [1, 3, 5] // Mon, Wed, Fri
}

const occurrences = Array.from(generateRecurrences(start, rule))
```

### Working with Different Time Representations

```typescript
import { Temporal } from '@js-temporal/polyfill'

// Convert between different Temporal types
function convertTimeRepresentations(input: Date) {
  // JS Date to various Temporal types
  const instant = Temporal.Instant.fromEpochMilliseconds(input.getTime())
  const zonedDateTime = instant.toZonedDateTimeISO('America/New_York')
  const plainDateTime = zonedDateTime.toPlainDateTime()
  const plainDate = zonedDateTime.toPlainDate()
  const plainTime = zonedDateTime.toPlainTime()
  
  return {
    instant: instant.toString(),
    zoned: zonedDateTime.toString(),
    dateTime: plainDateTime.toString(),
    date: plainDate.toString(),
    time: plainTime.toString()
  }
}

// Use with useTemporal
const temporal = createTemporal({
  adapter: createTemporalAdapter({ timeZone: 'America/New_York' })
})

const period = temporal.period( new Date(), 'day')
const representations = convertTimeRepresentations(period.start)
```

### High-Precision Timestamps

```typescript
import { Temporal } from '@js-temporal/polyfill'

// Nanosecond precision timing
function preciseBenchmark(fn: () => void): bigint {
  const start = Temporal.Now.instant()
  fn()
  const end = Temporal.Now.instant()
  
  return end.epochNanoseconds - start.epochNanoseconds
}

// Compare with Date precision
function comparePrecision() {
  // JavaScript Date (millisecond precision)
  const dateStart = Date.now()
  const dateEnd = Date.now()
  console.log(`Date precision: ${dateEnd - dateStart}ms`)
  
  // Temporal (nanosecond precision)
  const duration = preciseBenchmark(() => {
    // Some operation
  })
  console.log(`Temporal precision: ${duration}ns`)
}
```

## Best Practices

### 1. Choose the Right Type

```typescript
import { Temporal } from '@js-temporal/polyfill'

// For dates without times
const birthday = Temporal.PlainDate.from('1990-07-25')

// For times without dates  
const meetingTime = Temporal.PlainTime.from('14:30')

// For local date-times (no timezone)
const appointment = Temporal.PlainDateTime.from('2025-07-25T14:30')

// For absolute moments in time
const timestamp = Temporal.Instant.from('2025-07-25T14:30:00Z')

// For timezone-aware date-times
const event = Temporal.ZonedDateTime.from({
  timeZone: 'America/New_York',
  year: 2025,
  month: 7,
  day: 25,
  hour: 14,
  minute: 30
})
```

### 2. Explicit Timezone Handling

```typescript
// Always specify timezone for ZonedDateTime
const meeting = Temporal.ZonedDateTime.from({
  timeZone: 'America/New_York', // Explicit
  year: 2025,
  month: 7,
  day: 25,
  hour: 14
})

// Convert between timezones explicitly
const londonTime = meeting.withTimeZone('Europe/London')
```

### 3. Use Appropriate Arithmetic

```typescript
import { Temporal } from '@js-temporal/polyfill'

// Calendar-aware arithmetic
const date = Temporal.PlainDate.from('2025-01-31')
const nextMonth = date.add({ months: 1 }) // 2025-02-28 (handles month-end)

// Exact duration arithmetic
const zoned = Temporal.ZonedDateTime.from({
  timeZone: 'America/New_York',
  year: 2025,
  month: 3,
  day: 9,
  hour: 1,
  minute: 30
})
const afterDST = zoned.add({ hours: 1 }) // Handles DST correctly
```

## Performance Considerations

### Lazy Loading

```typescript
// Load Temporal adapter only when needed
async function loadTemporalAdapter() {
  const { createTemporalAdapter } = await import('@usetemporal/adapter-temporal')
  return createTemporal({
    adapter: createTemporalAdapter()
  })
}

// Use native for non-timezone operations
const simpleTemporal = createTemporal()

// Load Temporal for complex operations
const complexTemporal = await loadTemporalAdapter()
```

### Caching Temporal Objects

```typescript
import { Temporal } from '@js-temporal/polyfill'

// Cache frequently used Temporal objects
const timezoneCache = new Map<string, Temporal.TimeZone>()

function getCachedTimezone(id: string): Temporal.TimeZone {
  if (!timezoneCache.has(id)) {
    timezoneCache.set(id, Temporal.TimeZone.from(id))
  }
  return timezoneCache.get(id)!
}
```

## Migration Path

### From Date to Temporal

```typescript
// Before: Using Date
const date = new Date('2025-07-25T14:30:00')
const tomorrow = new Date(date)
tomorrow.setDate(tomorrow.getDate() + 1)

// After: Using Temporal
import { Temporal } from '@js-temporal/polyfill'

const dateTime = Temporal.PlainDateTime.from('2025-07-25T14:30:00')
const tomorrow = dateTime.add({ days: 1 })
```

### Future-Proofing

```typescript
// Write code that works with both polyfill and future native implementation
const TemporalAPI = globalThis.Temporal || require('@js-temporal/polyfill').Temporal

// Feature detection
const hasNativeTemporal = typeof globalThis.Temporal !== 'undefined'
console.log(`Using ${hasNativeTemporal ? 'native' : 'polyfilled'} Temporal`)
```

## Next Steps

- Explore [Temporal documentation](https://tc39.es/proposal-temporal/docs/)
- Learn about [Temporal cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html)
- Understand [timezone handling](https://tc39.es/proposal-temporal/docs/timezone.html)
- Check [calendar systems](https://tc39.es/proposal-temporal/docs/calendar.html)
- Review [API reference](https://tc39.es/proposal-temporal/docs/reference.html)