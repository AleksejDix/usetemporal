# isToday

Check if a period represents today.

## Signature

```typescript
function isToday(adapter: Adapter, now: Date, period: Period): boolean
```

## Parameters

- `adapter` - `Adapter` - The date adapter instance
- `now` - `Date` - The current date/time to compare against
- `period` - `Period` - The period to check

## Returns

`boolean` - `true` if the period is a day period representing today, `false` otherwise

## Description

The `isToday` function checks if a period is a day period that represents today. It returns `true` only for periods with `type: 'day'` whose date falls on the same day as the current time from `temporal.now`. Periods of other types (week, month, year, etc.) will always return `false`, even if they contain today.

## Examples

### Basic Usage

```typescript
import { isToday } from '@allystudio/usetemporal/operations'
import { period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const now = new Date()

// Check if a date is today
const somePeriod = period(adapter, new Date(), 'day')
console.log(isToday(adapter, now, somePeriod)) // true

// Check a different date
const yesterday = period(adapter,
  new Date(Date.now() - 24 * 60 * 60 * 1000),
  'day'
)
console.log(isToday(adapter, now, yesterday)) // false
```

### Calendar Highlighting

```typescript
import { isToday, isWeekend } from '@allystudio/usetemporal/operations'
import type { Adapter, Period } from '@allystudio/usetemporal'

// Highlight today in calendar
function CalendarDay({ day, adapter }: { day: Period; adapter: Adapter }) {
  const now = new Date()

  return (
    <div className={`
      calendar-day
      ${isToday(adapter, now, day) ? 'today' : ''}
      ${isWeekend(day) ? 'weekend' : ''}
    `}>
      <span className="day-number">{day.date.getDate()}</span>
      {isToday(adapter, now, day) && <span className="today-indicator">●</span>}
    </div>
  )
}

// CSS
.calendar-day.today {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
```

### Filtering Today's Items

```typescript
import { isToday, period } from '@allystudio/usetemporal/operations'
import type { Adapter } from '@allystudio/usetemporal'

// Get today's appointments
function getTodaysAppointments(appointments: Appointment[], adapter: Adapter) {
  const now = new Date()
  return appointments.filter(apt => {
    const aptPeriod = period(adapter, apt.date, 'day')
    return isToday(adapter, now, aptPeriod)
  })
}

// Dashboard widget
function TodayWidget({ adapter, events }: { adapter: Adapter; events: Event[] }) {
  const now = new Date()
  const todaysEvents = events.filter(event => {
    const eventPeriod = period(adapter, event.date, 'day')
    return isToday(adapter, now, eventPeriod)
  })

  return (
    <div className="today-widget">
      <h3>Today - {now.toLocaleDateString()}</h3>
      <ul>
        {todaysEvents.map(event => (
          <li key={event.id}>
            {event.time} - {event.title}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## Common Patterns

### Today Button

```typescript
import { isToday, period } from '@allystudio/usetemporal/operations'
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

// Navigate to today
function TodayButton() {
  const temporal = createTemporal({
    adapter: createNativeAdapter(),
    date: new Date()
  })

  const handleClick = () => {
    const today = period(temporal.adapter, new Date(), temporal.browsing.value.type)
    temporal.browsing.value = today
  }

  const alreadyToday = isToday(
    temporal.adapter,
    new Date(),
    temporal.browsing.value
  )

  return (
    <button
      onClick={handleClick}
      disabled={alreadyToday}
      className="today-button"
    >
      Today
    </button>
  )
}
```

### Relative Time Display

```typescript
import { isToday } from '@allystudio/usetemporal/operations'
import type { Period, Adapter } from '@allystudio/usetemporal'

// Show relative time for recent dates
function formatRelativeDate(period: Period, adapter: Adapter): string {
  const now = new Date()

  if (isToday(adapter, now, period)) {
    return 'Today'
  }

  // For yesterday/tomorrow, you'd need to implement similar utilities
  // or use period comparison

  // Default to full date
  return period.date.toLocaleDateString()
}
```

### Daily Summary

```typescript
import { isToday } from '@allystudio/usetemporal/operations'
import type { Period, Adapter } from '@allystudio/usetemporal'

// Generate daily summary
function getDailySummary(adapter: Adapter, allPeriods: Period[]) {
  const now = new Date()

  const todaysPeriods = allPeriods.filter(p => isToday(adapter, now, p))

  return {
    date: now,
    totalEvents: todaysPeriods.length,
    completedEvents: todaysPeriods.filter((p: any) => p.completed).length,
    upcomingEvents: todaysPeriods.filter(p =>
      p.date.getTime() > Date.now()
    ).length
  }
}
```

## Only Works with Day Periods

The `isToday` function only returns `true` for day periods. Other period types will always return `false`:

```typescript
import { isToday, period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const now = new Date()

// Day period - works as expected
const todayDay = period(adapter, new Date(), 'day')
console.log(isToday(adapter, now, todayDay)) // true

// Hour period - returns false (not a day period)
const currentHour = period(adapter, new Date(), 'hour')
console.log(isToday(adapter, now, currentHour)) // false

// Month period - returns false (not a day period)
const currentMonth = period(adapter, new Date(), 'month')
console.log(isToday(adapter, now, currentMonth)) // false

// Custom period - returns false (type is 'custom')
const customPeriod = period(
  adapter,
  {
    start: new Date(new Date().setHours(0, 0, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 59, 999))
  }
)
console.log(isToday(adapter, now, customPeriod)) // false
```

## Time Zone Considerations

The function uses the local time zone of the JavaScript Date objects:

```typescript
import { isToday, period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// The comparison happens in local time
const now = new Date()                           // Local time
const somePeriod = period(adapter, someDate, 'day')  // Local time

// Both are compared at day level in local time zone
const result = isToday(adapter, now, somePeriod)
```

## Implementation Details

The function checks if the period is a day period and compares dates:

```typescript
export function isToday(adapter: Adapter, now: Date, p: Period): boolean {
  // Only day periods can be "today"
  if (p.type !== "day") {
    return false;
  }

  // Compare the period's date with now at the day level
  const nowStart = adapter.startOf(now, "day");
  const periodStart = adapter.startOf(p.date, "day");

  return nowStart.getTime() === periodStart.getTime();
}
```

This ensures consistent day-level comparison using the adapter's date manipulation.

## Testing Considerations

When testing code that uses `isToday`, you can provide a fixed `now` value:

```typescript
import { isToday, period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Use a fixed "now" for testing
const fixedNow = new Date('2024-03-15T12:00:00')

// This will always be "today" relative to the fixed now
const march15 = period(adapter, new Date('2024-03-15'), 'day')
expect(isToday(adapter, fixedNow, march15)).toBe(true)

const march16 = period(adapter, new Date('2024-03-16'), 'day')
expect(isToday(adapter, fixedNow, march16)).toBe(false)
```

## See Also

- [isSame](/api/operations/is-same) - General period comparison
- [isWeekend](/api/utilities/is-weekend) - Check for weekends
- [isWeekday](/api/utilities/is-weekday) - Check for weekdays
- [isPast](/api/utilities/is-past) - Check if period is in the past (coming soon)
- [isFuture](/api/utilities/is-future) - Check if period is in the future (coming soon)