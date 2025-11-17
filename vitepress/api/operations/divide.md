# divide()

The revolutionary `divide()` function is the heart of useTemporal's unique time management pattern. It allows you to split any time period into smaller units with perfect synchronization and consistency.

## API Levels

This function is available in multiple API levels:

### Level 1: Pure Function

```typescript
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
const days = divide(adapter, month, 'day')
```

### Level 2: Builder Method

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })
const month = temporal.period(new Date(), 'month')
const days = temporal.divide(month, 'day')
```

### Level 3: Composable + Operations

```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter(), date: new Date() })
const month = usePeriod(temporal, 'month')
const days = divide(temporal.adapter, month.value, 'day')
```

## Signatures

```typescript
// Level 1 (Pure Function)
function divide(adapter: Adapter, period: Period, unit: Unit): Period[]

// Level 2 (Builder Method)
temporal.divide(period: Period, unit: Unit): Period[]
```

## Parameters

### Level 1 (Pure Function)

- `adapter` - `Adapter` - The date adapter instance
- `period` - `Period` - The period to divide
- `unit` - `Unit` - The unit type to divide into

### Level 2 (Builder Method)

- `period` - `Period` - The period to divide
- `unit` - `Unit` - The unit type to divide into

## Return Value

Returns an array of `Period` objects representing the divisions. Each period:

- Contains all standard properties: `type`, `date`, `start`, `end`
- Can be further divided into smaller units
- Represents a complete, non-overlapping time span

## Division Rules

### Valid Divisions

Common division patterns:

| From | To | Typical Result |
|------|----|----------------|
| year | month | 12 months |
| year | week | 52-53 weeks |
| year | day | 365-366 days |
| month | week | 4-6 weeks |
| month | day | 28-31 days |
| week | day | 7 days |
| day | hour | 24 hours |
| hour | minute | 60 minutes |
| minute | second | 60 seconds |

## Examples

### Basic Usage (Level 1)

```typescript
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Divide a month into days
const month = period(adapter, new Date(), 'month')
const days = divide(adapter, month, 'day')
console.log(days.length) // 28-31 depending on month

// Divide a day into hours
const day = period(adapter, new Date(), 'day')
const hours = divide(adapter, day, 'hour')
console.log(hours.length) // 24

// Divide a year into months
const year = period(adapter, new Date(), 'year')
const months = divide(adapter, year, 'month')
console.log(months.length) // 12
```

### Calendar Grid (Level 1)

```typescript
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter({ weekStartsOn: 1 }) // Monday

// Create current month
const month = period(adapter, new Date(), 'month')

// Divide into weeks
const weeks = divide(adapter, month, 'week')

// Divide each week into days
weeks.forEach(week => {
  const days = divide(adapter, week, 'day')
  console.log(days.map(d => d.date.getDate()))
})
```

### Builder API (Level 2)

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1
})

// More convenient syntax
const month = temporal.period(new Date(), 'month')
const weeks = temporal.divide(month, 'week')

weeks.forEach(week => {
  const days = temporal.divide(week, 'day')
  console.log(days.map(d => d.date.getDate()))
})
```

### Custom Period Division

divide() works with any period, including custom periods:

```typescript
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Custom period (e.g., sprint)
const sprint = period(adapter, {
  start: new Date('2024-01-01'),
  end: new Date('2024-01-14')
})

// Divide custom period into days
const sprintDays = divide(adapter, sprint, 'day')
console.log(sprintDays.length) // 14 days
```

### Reactive Usage (Level 3)

```typescript
import { ref, computed } from 'vue'
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: ref(new Date())
})

// Reactive month
const month = usePeriod(temporal, 'month')

// Automatically updates when month changes
const days = computed(() => divide(temporal.adapter, month.value, 'day'))
console.log(days.value.length) // Current month's days
```

## TypeScript

Full type safety across all levels:

```typescript
import type { Adapter, Period, Unit } from '@allystudio/usetemporal'
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter: Adapter = createNativeAdapter()
const month: Period = period(adapter, new Date(), 'month')
const days: Period[] = divide(adapter, month, 'day')

// TypeScript catches invalid units at compile time
// const invalid = divide(adapter, month, 'invalid-unit')
// Error: Argument of type '"invalid-unit"' is not assignable to parameter of type 'Unit'

// Generic helper
function getDaysInPeriod(adapter: Adapter, period: Period): Period[] {
  return divide(adapter, period, 'day')
}
```

## Errors

The function throws errors in these cases:

- `Cannot divide by custom unit` - Custom periods have arbitrary boundaries  
- `Unit 'X' cannot be divided into 'Y'` - When division is not valid (e.g., dividing day into month)

The function also has a safety limit of 1000 periods to prevent memory issues.


## See Also

- [period()](/api/operations/period) - Create periods
- [merge()](/api/operations/merge) - Merge periods
- [usePeriod()](/api/composables/use-period) - Reactive period composable
- [Choosing API Level](/guide/choosing-api-level) - Which level to use
- [Level 1 API](/api/level-1-pure-functions) - Pure functions documentation
- [Level 2 API](/api/level-2-builder) - Builder pattern documentation
- [Level 3 API](/api/level-3-composables) - Composables documentation