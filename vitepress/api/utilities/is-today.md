# isToday

Check if a period represents today.

## Signature

```typescript
function isToday(
  temporal: Temporal,
  period: Period
): boolean
```

## Parameters

- `temporal` - `Temporal` - The temporal instance for accessing current time
- `period` - `Period` - The period to check

## Returns

`boolean` - True if the period is a day period that represents today

## Description

The `isToday` function checks if a period is a day period that represents today. It returns `true` only for periods with `type: 'day'` whose date falls on the same day as the current time from `temporal.now`. Periods of other types (week, month, year, etc.) will always return `false`, even if they contain today.

## Examples

### Basic Usage

```typescript
import { isToday, toPeriod, createTemporal } from 'usetemporal'

const temporal = createTemporal({ date: new Date() })

// Check if a date is today
const somePeriod = toPeriod(temporal, new Date(), 'day')
console.log(isToday(temporal, somePeriod)) // true

// Check a different date
const yesterday = toPeriod(temporal, 
  new Date(Date.now() - 24 * 60 * 60 * 1000), 
  'day'
)
console.log(isToday(temporal, yesterday)) // false
```

### Calendar Highlighting

```typescript
// Highlight today in calendar
function CalendarDay({ day, temporal }) {
  return (
    <div className={`
      calendar-day 
      ${isToday(temporal, day) ? 'today' : ''}
      ${isWeekend(day) ? 'weekend' : ''}
    `}>
      <span className="day-number">{day.date.getDate()}</span>
      {isToday(temporal, day) && <span className="today-indicator">●</span>}
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
// Get today's appointments
function getTodaysAppointments(appointments: Appointment[], temporal: Temporal) {
  return appointments.filter(apt => {
    const aptPeriod = toPeriod(temporal, apt.date, 'day')
    return isToday(temporal, aptPeriod)
  })
}

// Dashboard widget
function TodayWidget({ temporal }) {
  const todaysEvents = events.filter(event => {
    const eventPeriod = toPeriod(temporal, event.date, 'hour')
    return isToday(temporal, eventPeriod)
  })
  
  return (
    <div className="today-widget">
      <h3>Today - {temporal.now.value.date.toLocaleDateString()}</h3>
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
// Navigate to today
function TodayButton({ temporal }) {
  const handleClick = () => {
    const today = toPeriod(temporal, new Date(), temporal.browsing.value.type)
    temporal.browsing.value = today
  }
  
  const alreadyToday = isToday(temporal, temporal.browsing.value)
  
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
// Show relative time for recent dates
function formatRelativeDate(period: Period, temporal: Temporal): string {
  if (isToday(temporal, period)) {
    return 'Today'
  }
  
  if (isYesterday(period, temporal)) {
    return 'Yesterday'
  }
  
  if (isTomorrow(period, temporal)) {
    return 'Tomorrow'
  }
  
  // Default to full date
  return period.date.toLocaleDateString()
}
```

### Daily Summary

```typescript
// Generate daily summary
function getDailySummary(temporal: Temporal) {
  const allPeriods = getAllPeriods() // Your data
  
  const todaysPeriods = allPeriods.filter(p => isToday(temporal, p))
  
  return {
    date: temporal.now.value.date,
    totalEvents: todaysPeriods.length,
    completedEvents: todaysPeriods.filter(p => p.completed).length,
    upcomingEvents: todaysPeriods.filter(p => 
      p.date.getTime() > Date.now()
    ).length
  }
}
```

## Only Works with Day Periods

The `isToday` function only returns `true` for day periods. Other period types will always return `false`:

```typescript
// Day period - works as expected
const todayDay = toPeriod(temporal, new Date(), 'day')
console.log(isToday(temporal, todayDay)) // true

// Hour period - returns false (not a day period)
const currentHour = toPeriod(temporal, new Date(), 'hour')
console.log(isToday(temporal, currentHour)) // false

// Month period - returns false (not a day period)
const currentMonth = toPeriod(temporal, new Date(), 'month')
console.log(isToday(temporal, currentMonth)) // false

// Custom period - returns false (type is 'custom')
const customPeriod = period(
  temporal,
  { 
    start: new Date(new Date().setHours(0, 0, 0, 0)),
    end: new Date(new Date().setHours(23, 59, 59, 999))
  }
)
console.log(isToday(temporal, customPeriod)) // false
```

## Time Zone Considerations

The function uses the local time zone of the JavaScript Date objects:

```typescript
// The comparison happens in local time
const now = temporal.now.value.date       // Local time
const period = toPeriod(temporal, someDate, 'day')  // Local time

// Both are compared at day level in local time zone
const result = isToday(period, temporal)
```

## Implementation Details

The function is implemented using `isSame`:

```typescript
export function isToday(temporal: Temporal, period: Period): boolean {
  // Only day periods can be "today"
  if (period.type !== "day") {
    return false;
  }
  return isSame(temporal, period, temporal.now.value, 'day')
}
```

This ensures consistency with other comparison operations.

## Testing Considerations

When testing code that uses `isToday`, you can provide a fixed `now` value:

```typescript
// Create temporal with fixed "now" for testing
const testTemporal = createTemporal({
  now: new Date('2024-03-15T12:00:00'),
  date: new Date('2024-03-15')
})

// This will always be "today" relative to the fixed now
const march15 = toPeriod(testTemporal, new Date('2024-03-15'), 'day')
expect(isToday(testTemporal, march15)).toBe(true)

const march16 = toPeriod(testTemporal, new Date('2024-03-16'), 'day')
expect(isToday(testTemporal, march16)).toBe(false)
```

## See Also

- [isSame](/api/operations/is-same) - General period comparison
- [isWeekend](/api/utilities/is-weekend) - Check for weekends
- [isWeekday](/api/utilities/is-weekday) - Check for weekdays
- [isPast](/api/utilities/is-past) - Check if period is in the past (coming soon)
- [isFuture](/api/utilities/is-future) - Check if period is in the future (coming soon)