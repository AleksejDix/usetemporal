# period

Creates a period of a specific unit type from a date, or a custom period with start/end dates.

## API Levels

This function is available in multiple API levels:

### Level 1: Pure Function

```typescript
import { period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
```

### Level 2: Builder Method

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })
const month = temporal.period(new Date(), 'month')
```

### Level 3: Reactive Composable

For reactive periods, use `usePeriod()`:

```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'

const temporal = createTemporal({ adapter, date: new Date() })
const month = usePeriod(temporal, 'month') // Returns Ref<Period>
```

## Signatures

### Standard Period

```typescript
// Level 1 (Pure Function)
function period(adapter: Adapter, date: Date, unit: Unit): Period

// Level 2 (Builder Method)
temporal.period(date: Date, unit: Unit): Period
```

### Custom Period

```typescript
// Level 1 (Pure Function)
function period(adapter: Adapter, options: { start: Date; end: Date }): Period

// Level 2 (Builder Method)
temporal.period(options: { start: Date; end: Date }): Period
```

## Parameters

### Standard Period

- `adapter` - `Adapter` - (Level 1 only) The date adapter instance
- `date` - `Date` - The date to create the period from
- `unit` - `Unit` - The unit type (`'year'` | `'month'` | `'week'` | `'day'` | `'hour'` | `'minute'` | `'second'` | `'quarter'`)

### Custom Period

- `adapter` - `Adapter` - (Level 1 only) The date adapter instance
- `options` - `{ start: Date; end: Date }` - Custom period boundaries

## Returns

`Period` - A new period with `start`, `end`, `type`, and `date` properties

## Examples

### Basic Usage (Level 1)

```typescript
import { period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Create different period types
const year = period(adapter, new Date(2024, 0, 15), 'year')
// { type: 'year', date: 2024-01-15, start: 2024-01-01, end: 2024-12-31 23:59:59.999 }

const month = period(adapter, new Date(2024, 5, 15), 'month')
// { type: 'month', date: 2024-06-15, start: 2024-06-01, end: 2024-06-30 23:59:59.999 }

const week = period(adapter, new Date(2024, 0, 15), 'week')
// { type: 'week', date: 2024-01-15, start: 2024-01-14 (Sun), end: 2024-01-20 23:59:59.999 }
```

### Custom Period (Level 1)

```typescript
import { period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Create a custom period (e.g., sprint, fiscal period)
const sprint = period(adapter, {
  start: new Date('2024-01-01'),
  end: new Date('2024-01-14')
})
// { type: 'custom', start: 2024-01-01, end: 2024-01-14, date: 2024-01-07 (midpoint) }
```

### Builder API (Level 2)

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1 // Monday
})

// More convenient syntax
const month = temporal.period(new Date(), 'month')
const custom = temporal.period({
  start: new Date('2024-01-01'),
  end: new Date('2024-03-31')
})
```

### Reactive Composable (Level 3)

```typescript
import { ref } from 'vue'
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const currentDate = ref(new Date())
const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: currentDate
})

// Reactive period that updates when currentDate changes
const month = usePeriod(temporal, 'month')
console.log(month.value) // Current period

// Change date - month automatically recalculates
currentDate.value = new Date(2024, 5, 1)
console.log(month.value) // June 2024 period
```

## TypeScript

Full type safety across all levels:

```typescript
import type { Adapter, Period, Unit } from '@allystudio/usetemporal'
import { period } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter: Adapter = createNativeAdapter()
const month: Period = period(adapter, new Date(), 'month')

// Custom period type
const custom: Period = period(adapter, {
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31')
})
```

## See Also

- [divide()](/api/operations/divide) - Divide periods into smaller units
- [usePeriod()](/api/composables/use-period) - Reactive period composable
- [Period Type](/api/types/period) - Period interface
- [Choosing API Level](/guide/choosing-api-level) - Which level to use
- [Level 1 API](/api/level-1-pure-functions) - Pure functions documentation
- [Level 2 API](/api/level-2-builder) - Builder pattern documentation
- [Level 3 API](/api/level-3-composables) - Composables documentation