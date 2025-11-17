# next

Navigate to the next period of the same type.

## API Levels

This function is available in multiple API levels:

### Level 1: Pure Function

```typescript
import { period, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
const nextMonth = next(adapter, month)
```

### Level 2: Builder Method

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })
const month = temporal.period(new Date(), 'month')
const nextMonth = temporal.next(month)
```

## Signatures

```typescript
// Level 1 (Pure Function)
function next(adapter: Adapter, period: Period): Period

// Level 2 (Builder Method)
temporal.next(period: Period): Period
```

## Parameters

### Level 1 (Pure Function)

- `adapter` - `Adapter` - The date adapter instance
- `period` - `Period` - The current period to navigate from

### Level 2 (Builder Method)

- `period` - `Period` - The current period to navigate from

## Returns

`Period` - The next period of the same type and duration

## Description

Creates a new period that immediately follows the given period, maintaining the same unit type and duration. For custom periods, the duration is preserved.

## Examples

### Basic Usage (Level 1)

```typescript
import { period, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Navigate to next day
const today = period(adapter, new Date(), 'day')
const tomorrow = next(adapter, today)

// Navigate to next month
const month = period(adapter, new Date(), 'month')
const nextMonth = next(adapter, month)

// Navigate to next year
const year = period(adapter, new Date(), 'year')
const nextYear = next(adapter, year)
```

### Builder API (Level 2)

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })

const month = temporal.period(new Date(), 'month')
const nextMonth = temporal.next(month)
const monthAfterNext = temporal.next(nextMonth)
```

### Custom Period Navigation

```typescript
import { period, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Custom period (e.g., sprint)
const sprint = period(adapter, {
  start: new Date('2024-01-01'),
  end: new Date('2024-01-14') // 14 days
})

// Next sprint (preserves duration)
const nextSprint = next(adapter, sprint)
// { start: 2024-01-14, end: 2024-01-28, type: 'custom' }
```

### Chaining Navigation

```typescript
import { period, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Navigate multiple steps
const month = period(adapter, new Date(), 'month')
const twoMonthsLater = next(adapter, next(adapter, month))

// Or use go() for better performance
import { go } from '@allystudio/usetemporal/operations'
const twoMonthsLater2 = go(adapter, month, 2)
```

## TypeScript

Full type safety:

```typescript
import type { Adapter, Period } from '@allystudio/usetemporal'
import { period, next } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter: Adapter = createNativeAdapter()
const month: Period = period(adapter, new Date(), 'month')
const nextMonth: Period = next(adapter, month)
```

## See Also

- [previous()](/api/operations/previous) - Navigate backward
- [go()](/api/operations/go) - Navigate multiple steps at once
- [period()](/api/operations/period) - Create periods
- [Choosing API Level](/guide/choosing-api-level) - Which level to use
- [Level 1 API](/api/level-1-pure-functions) - Pure functions documentation
- [Level 2 API](/api/level-2-builder) - Builder pattern documentation
