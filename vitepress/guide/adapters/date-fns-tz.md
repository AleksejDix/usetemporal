# date-fns-tz Adapter Guide

The date-fns-tz adapter extends the date-fns adapter with comprehensive timezone support, providing a familiar API for date-fns users who need to work with multiple timezones.

## Overview

The date-fns-tz adapter combines the lightweight, functional approach of date-fns with robust timezone handling capabilities. It's ideal for applications that need timezone support without the complexity of Luxon or the experimental nature of Temporal.

### Key Features

- ✅ Full timezone support via IANA database
- ✅ DST (Daylight Saving Time) handling
- ✅ Extends familiar date-fns API
- ✅ Tree-shakeable and modular
- ✅ TypeScript support
- ✅ ~2.5KB gzipped (excluding peer dependencies)

## Installation

```bash
npm install @usetemporal/core date-fns date-fns-tz
```

## Basic Usage

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsTzAdapter } from '@usetemporal/core/date-fns-tz'

// Create temporal with timezone support
const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({
    timezone: 'America/New_York'
  })
})

// All operations now respect the timezone
const now = usePeriod(temporal, 'day')
console.log(now.value.start) // Start of day in New York time
```

## Configuration Options

### Timezone Configuration

```typescript
// Fixed timezone
const nyTemporal = createTemporal({
  adapter: createDateFnsTzAdapter({
    timezone: 'America/New_York'
  })
})

// User's local timezone
const localTemporal = createTemporal({
  adapter: createDateFnsTzAdapter({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })
})

// UTC
const utcTemporal = createTemporal({
  adapter: createDateFnsTzAdapter({
    timezone: 'UTC'
  })
})
```

### Locale Support

```typescript
import { enUS, es, fr } from 'date-fns/locale'

const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({
    timezone: 'Europe/Paris',
    locale: fr // French locale
  })
})
```

## Working with Timezones

### Creating Periods in Different Timezones

```typescript
// Create temporal instances for different timezones
const nyTemporal = createTemporal({
  adapter: createDateFnsTzAdapter({ timezone: 'America/New_York' })
})

const tokyoTemporal = createTemporal({
  adapter: createDateFnsTzAdapter({ timezone: 'Asia/Tokyo' })
})

// Same moment in time, different local representations
const utcDate = new Date('2025-07-25T12:00:00Z')

const nyPeriod = period(nyTemporal, utcDate, 'day')
const tokyoPeriod = period(tokyoTemporal, utcDate, 'day')

console.log(nyPeriod.start)    // 2025-07-25 00:00:00 EDT
console.log(tokyoPeriod.start) // 2025-07-25 00:00:00 JST
```

### Timezone Conversions

```typescript
import { formatInTimeZone } from 'date-fns-tz'

const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({ timezone: 'America/New_York' })
})

const meeting = temporal.period( new Date(), 'hour')

// Display in different timezones
const nyTime = formatInTimeZone(meeting.start, 'America/New_York', 'PPpp')
const laTime = formatInTimeZone(meeting.start, 'America/Los_Angeles', 'PPpp')
const londonTime = formatInTimeZone(meeting.start, 'Europe/London', 'PPpp')
```

## Common Patterns

### Business Hours Across Timezones

```typescript
function getBusinessHours(temporal: Temporal, date: Date) {
  const day = temporal.period( date, 'day')
  const hours = divide(temporal.adapter, day, 'hour')
  
  // Filter business hours (9 AM - 5 PM local time)
  return hours.filter((hour, index) => index >= 9 && index < 17)
}

// Get business hours for different offices
const nyHours = getBusinessHours(nyTemporal, new Date())
const londonHours = getBusinessHours(londonTemporal, new Date())
```

### Scheduling Across Timezones

```typescript
function scheduleGlobalMeeting(date: Date) {
  const timezones = [
    { zone: 'America/New_York', label: 'New York' },
    { zone: 'Europe/London', label: 'London' },
    { zone: 'Asia/Tokyo', label: 'Tokyo' }
  ]
  
  return timezones.map(({ zone, label }) => {
    const temporal = createTemporal({
      adapter: createDateFnsTzAdapter({ timezone: zone })
    })
    
    const meetingHour = temporal.period( date, 'hour')
    
    return {
      location: label,
      localTime: formatInTimeZone(meetingHour.start, zone, 'PPpp'),
      isBusinessHours: meetingHour.date.getHours() >= 9 && 
                       meetingHour.date.getHours() < 17
    }
  })
}
```

### DST Handling

```typescript
// The adapter automatically handles DST transitions
const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({ timezone: 'America/New_York' })
})

// Spring forward (DST starts)
const beforeDST = new Date('2025-03-08T12:00:00')
const afterDST = new Date('2025-03-10T12:00:00')

const day1 = temporal.period( beforeDST, 'day')
const day2 = temporal.period( afterDST, 'day')

// day2 will be 23 hours long due to DST
```

## Performance Considerations

### Caching Temporal Instances

```typescript
// Cache temporal instances for frequently used timezones
const temporalCache = new Map()

function getTemporal(timezone: string) {
  if (!temporalCache.has(timezone)) {
    temporalCache.set(timezone, createTemporal({
      adapter: createDateFnsTzAdapter({ timezone })
    }))
  }
  return temporalCache.get(timezone)
}
```

### Batch Operations

```typescript
// When working with multiple timezones, batch operations
const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo']
const date = new Date()

// Efficient: Create all periods at once
const periods = timezones.map(tz => {
  const temporal = getTemporal(tz)
  return temporal.period( date, 'day')
})
```

## Integration with date-fns-tz

The adapter works seamlessly with date-fns-tz utilities:

```typescript
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz'

const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({ timezone: 'America/New_York' })
})

const period = usePeriod(temporal, 'day')

// Convert to UTC
const utcDate = zonedTimeToUtc(period.value.start, 'America/New_York')

// Format with timezone
const formatted = format(period.value.start, 'yyyy-MM-dd HH:mm:ss zzz', {
  timeZone: 'America/New_York'
})
```

## Migration from date-fns

If you're already using date-fns and need timezone support:

```typescript
// Before: date-fns without timezone
import { startOfDay, addHours } from 'date-fns'

const start = startOfDay(new Date())
const later = addHours(start, 3)

// After: date-fns-tz adapter
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsTzAdapter } from '@usetemporal/core/date-fns-tz'

const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({ 
    timezone: 'America/New_York' 
  })
})

const day = temporal.period( new Date(), 'day')
const later = go(temporal.adapter, day, 3, 'hour')
```

## Comparison with Other Adapters

### vs date-fns Adapter
- ✅ Adds timezone support
- ✅ Handles DST automatically
- ❌ Slightly larger bundle size
- ❌ Requires additional dependency

### vs Luxon Adapter
- ✅ Lighter weight
- ✅ Familiar date-fns API
- ❌ Less comprehensive timezone features
- ❌ Fewer locale options

### vs Temporal Adapter
- ✅ Stable and production-ready
- ✅ Well-documented
- ❌ Less precise for complex calculations
- ❌ Not a future standard

## Best Practices

1. **Choose the Right Timezone**
   ```typescript
   // User's timezone
   const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone
   
   // Server timezone (usually UTC)
   const serverTz = 'UTC'
   
   // Specific business timezone
   const businessTz = 'America/New_York'
   ```

2. **Handle Timezone Changes**
   ```typescript
   // Allow users to change timezone
   function createUserTemporal(timezone: string) {
     return createTemporal({
       adapter: createDateFnsTzAdapter({ timezone })
     })
   }
   ```

3. **Store UTC, Display Local**
   ```typescript
   // Store in UTC
   const utcDate = zonedTimeToUtc(localDate, userTimezone)
   
   // Display in user's timezone
   const localDate = utcToZonedTime(utcDate, userTimezone)
   ```

## Common Issues

### Invalid Timezone

```typescript
// Handle invalid timezones gracefully
try {
  const temporal = createTemporal({
    adapter: createDateFnsTzAdapter({ 
      timezone: 'Invalid/Timezone' 
    })
  })
} catch (error) {
  console.error('Invalid timezone, falling back to UTC')
  const temporal = createTemporal({
    adapter: createDateFnsTzAdapter({ timezone: 'UTC' })
  })
}
```

### DST Ambiguity

```typescript
// During DST transitions, some times occur twice
// The adapter handles this automatically, but be aware:
const ambiguousTime = new Date('2025-11-02T01:30:00')
// This could be 1:30 AM EDT or 1:30 AM EST
```

## Next Steps

- Explore [Timezone Best Practices](https://date-fns.org/docs/Time-Zones)
- Learn about [date-fns-tz documentation](https://github.com/marnusw/date-fns-tz)
- See [Performance Guide](/guide/performance) for optimization tips
- Review [Migration Guide](./migration.md) for switching from other libraries