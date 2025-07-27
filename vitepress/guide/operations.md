# Operations

All operations in useTemporal are pure functions that work with Period objects.

## Using the UNITS Constant

For better type safety and autocomplete support, use the UNITS constant instead of string literals:

```typescript
import { UNITS, divide, period, isSame } from 'usetemporal'

// ✅ Recommended - with autocomplete and type safety
const year = period(temporal, UNITS.YEAR, date)
const months = divide(temporal, year, UNITS.MONTH)
const isSameDay = isSame(temporal, date1, date2, UNITS.DAY)

// ❌ Still works but less ideal
const year = period(temporal, 'year', date)
const months = divide(temporal, year, 'month')
```

### Benefits of UNITS

1. **Autocomplete Support**: IDEs will suggest available units when you type `UNITS.`
2. **Type Safety**: Typos are caught at compile time
3. **Consistency**: Ensures consistent unit references across your codebase
4. **Refactoring**: Easier to rename units if needed

```typescript
// See all available units with autocomplete
const period = period(temporal, UNITS.█)
// IDE shows: YEAR, QUARTER, MONTH, WEEK, DAY, HOUR, MINUTE, SECOND
```

## Navigation Operations

Move through time periods:

### next()

Move to the next period of the same type:

```typescript
import { next, UNITS } from 'usetemporal'

const month = usePeriod(temporal, UNITS.MONTH)
const nextMonth = next(temporal, month.value)

// Update browsing to navigate
temporal.browsing.value = nextMonth
```

### previous()

Move to the previous period:

```typescript
import { previous } from 'usetemporal'

const prevMonth = previous(temporal, month.value)
```

### go()

Navigate by multiple steps:

```typescript
import { go } from 'usetemporal'

// Move forward 3 months
const future = go(temporal, month.value, 3)

// Move backward 2 months
const past = go(temporal, month.value, -2)
```

## Comparison Operations

### contains()

Check if a date or period is within another period:

```typescript
import { contains } from 'usetemporal'

const month = usePeriod(temporal, 'month')
const today = new Date()

if (contains(month.value, today)) {
  console.log('Today is in this month')
}

// Also works with periods
const day = usePeriod(temporal, 'day')
if (contains(month.value, day.value)) {
  console.log('Day is within month')
}
```

### isSame()

Check if two dates fall within the same period:

```typescript
import { isSame, UNITS } from 'usetemporal'

const date1 = new Date('2024-01-15')
const date2 = new Date('2024-01-20')

console.log(isSame(temporal, date1, date2, UNITS.DAY))   // false
console.log(isSame(temporal, date1, date2, UNITS.MONTH)) // true
console.log(isSame(temporal, date1, date2, UNITS.YEAR))  // true
```

## Division Operations

### divide()

The signature operation - divide any period into smaller units:

```typescript
import { divide, UNITS } from 'usetemporal'

const year = usePeriod(temporal, UNITS.YEAR)
const months = divide(temporal, year.value, UNITS.MONTH)     // 12 periods

const month = months[0]
const days = divide(temporal, month, UNITS.DAY)              // 28-31 periods

const day = days[0]  
const hours = divide(temporal, day, 'hour')              // 24 periods
```

## Zooming Operations

Navigate between hierarchy levels using composition:

### Zoom Pattern (v2.0+)

The zoom operations have been removed in v2.0.0. Use these patterns instead:

**Zoom In Pattern:**
```typescript
import { divide, contains } from 'usetemporal'

const year = usePeriod(temporal, 'year')

// Get all months in the year
const months = divide(temporal, year.value, 'month')

// Find March (3rd month, 0-indexed)
const march = months[2]

// Or find the month containing a specific date
const targetMonth = months.find(m => contains(m, someDate)) || months[0]
```

**Zoom Out Pattern:**
```typescript
import { period, toPeriod } from 'usetemporal'

const day = usePeriod(temporal, 'day')

// Zoom out to the containing month
const month = period(temporal, day.value.date, 'month')

// Zoom out to the containing year
const year = toPeriod(temporal, day.value.date, 'year')
```

**Direct Navigation Pattern:**
```typescript
import { period } from 'usetemporal'

const hour = usePeriod(temporal, 'hour')

// Navigate from hour to its year
const year = period(temporal, hour.value.date, 'year')

// Navigate from hour to its month
const month = period(temporal, hour.value.date, 'month')
```

## Advanced Operations

### split()

Split a period into custom segments:

```typescript
import { split } from 'usetemporal'

const month = usePeriod(temporal, 'month')

// Split into 3 equal parts
const thirds = split(temporal, month.value, { count: 3 })

// Split by duration
const biweekly = split(temporal, month.value, { 
  duration: { weeks: 2 } 
})
```

### merge()

Combine adjacent periods:

```typescript
import { merge } from 'usetemporal'

const week1 = usePeriod(temporal, 'week')
const week2 = next(temporal, week1.value)

const fortnight = merge(temporal, [week1.value, week2.value])
```

## Creating Periods

### toPeriod()

Create a period from any date:

```typescript
import { toPeriod } from 'usetemporal'

const someDate = new Date('2024-06-15')
const june = toPeriod(temporal, someDate, 'month')
const year2024 = toPeriod(temporal, someDate, 'year')
```

## Best Practices

1. **Operations are pure** - They don't modify inputs
2. **Chain operations** - Combine for complex navigation
3. **Use proper unit** - Match the unit to your use case
4. **Cache results** - Operations can be memoized

## Next Steps

- See [API Reference](/api/) for detailed signatures
- Check [Examples](/examples/) for real usage
- Learn about [Performance](/guide/performance) optimization