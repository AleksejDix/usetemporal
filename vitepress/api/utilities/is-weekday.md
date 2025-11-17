# isWeekday

Check if a period falls on a weekday (Monday through Friday).

## Signature

```typescript
function isWeekday(period: Period): boolean
```

## Parameters

- `period` - `Period` - The period to check

## Returns

`boolean` - True if the period's reference date is Monday (1) through Friday (5)

## Description

The `isWeekday` function checks if a period's reference date falls on a weekday. It's the inverse of `isWeekend`, returning true for Monday through Friday.

## Examples

### Basic Usage

```typescript
import { period, isWeekday } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Check specific dates
const monday = period(adapter, new Date('2024-03-18'), 'day')
const wednesday = period(adapter, new Date('2024-03-20'), 'day')
const saturday = period(adapter, new Date('2024-03-16'), 'day')

console.log(isWeekday(monday))    // true
console.log(isWeekday(wednesday)) // true
console.log(isWeekday(saturday))  // false
```

### Business Day Filtering

```typescript
import { period, divide, isWeekday } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Get only weekdays from a month
const month = period(adapter, new Date(), 'month')
const days = divide(adapter, month, 'day')

const weekdays = days.filter(isWeekday)
console.log(`${weekdays.length} weekdays this month`)
```

### Appointment Scheduling

```typescript
import { divide, isWeekday } from '@allystudio/usetemporal/operations'
import type { Period, Adapter } from '@allystudio/usetemporal'

// Only show weekday slots for appointments
function getAvailableSlots(week: Period, adapter: Adapter) {
  const days = divide(adapter, week, 'day')

  return days
    .filter(isWeekday)
    .flatMap(day => {
      const hours = divide(adapter, day, 'hour')
      // Business hours: 9 AM to 5 PM
      return hours.filter(hour => {
        const h = hour.date.getHours()
        return h >= 9 && h < 17
      })
    })
}
```

## Common Patterns

### Business Days Calculation

```typescript
import { period, next, isWeekday } from '@allystudio/usetemporal/operations'
import type { Adapter } from '@allystudio/usetemporal'

// Calculate business days between two dates
function getBusinessDays(startDate: Date, endDate: Date, adapter: Adapter) {
  const start = period(adapter, startDate, 'day')
  const end = period(adapter, endDate, 'day')

  let count = 0
  let current = start

  while (current.start <= end.start) {
    if (isWeekday(current)) {
      count++
    }
    current = next(adapter, current)
  }

  return count
}
```

### Workday Navigation

```typescript
import { next, previous, isWeekday } from '@allystudio/usetemporal/operations'
import type { Period, Adapter } from '@allystudio/usetemporal'

// Navigate to next/previous workday
function nextWorkday(day: Period, adapter: Adapter): Period {
  let nextDay = next(adapter, day)
  while (!isWeekday(nextDay)) {
    nextDay = next(adapter, nextDay)
  }
  return nextDay
}

function previousWorkday(day: Period, adapter: Adapter): Period {
  let prevDay = previous(adapter, day)
  while (!isWeekday(prevDay)) {
    prevDay = previous(adapter, prevDay)
  }
  return prevDay
}
```

### Calendar Highlighting

```typescript
import { isWeekday, isToday } from '@allystudio/usetemporal/operations'
import type { Period, Adapter } from '@allystudio/usetemporal'

// Different styling for weekdays vs weekends
function CalendarDay({ day, adapter }: { day: Period; adapter: Adapter }) {
  const now = new Date()
  const classes = {
    'day': true,
    'weekday': isWeekday(day),
    'weekend': !isWeekday(day),
    'today': isToday(adapter, now, day)
  }

  return (
    <div className={cn(classes)}>
      {day.date.getDate()}
    </div>
  )
}
```

## Relationship to isWeekend

The function is implemented as the logical inverse of `isWeekend`:

```typescript
export function isWeekday(period: Period): boolean {
  return !isWeekend(period)
}
```

This ensures consistency - a day is either a weekday or weekend, never both:

```typescript
import { period, isWeekday, isWeekend } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const day = period(adapter, new Date(), 'day')

// Always opposite values
console.log(isWeekday(day))  // true
console.log(isWeekend(day))  // false

// Never both true or both false
console.log(isWeekday(day) && isWeekend(day))  // always false
console.log(isWeekday(day) || isWeekend(day))  // always true
```

## Business Hours Extension

```typescript
// Extended business day checking
function isBusinessHours(period: Period): boolean {
  if (!isWeekday(period)) return false
  
  const hour = period.date.getHours()
  return hour >= 9 && hour < 17 // 9 AM to 5 PM
}

// Usage
const slots = hours.filter(hour => 
  isWeekday(hour) && isBusinessHours(hour)
)
```

## Holiday Considerations

For complete business day calculation, you may need to consider holidays:

```typescript
import { isWeekday, isSame, period } from '@allystudio/usetemporal/operations'
import type { Period, Adapter } from '@allystudio/usetemporal'

// Business day checker with holidays
function isBusinessDay(
  day: Period,
  adapter: Adapter,
  holidays: Date[] = []
): boolean {
  if (!isWeekday(day)) return false

  // Check if it's a holiday
  const isHoliday = holidays.some(holiday => {
    const holidayPeriod = period(adapter, holiday, 'day')
    return isSame(adapter, holidayPeriod, day, 'day')
  })

  return !isHoliday
}
```

## Performance

Like `isWeekend`, this function is very efficient:

```typescript
// Implementation using isWeekend
export function isWeekday(period: Period): boolean {
  return !isWeekend(period)
}

// Direct implementation would be:
export function isWeekday(period: Period): boolean {
  const day = period.date.getDay()
  return day >= 1 && day <= 5
}
```

## See Also

- [isWeekend](/api/utilities/is-weekend) - Check for weekends
- [isToday](/api/utilities/is-today) - Check if period is today
- [Business Days Guide](/guide/business-days) - Working with business days