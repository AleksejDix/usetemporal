# previous

Navigate to the previous period of the same type.

## API Levels

This function is available in multiple API levels:

### Level 1: Pure Function

```typescript
import { period, previous } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const month = period(adapter, new Date(), 'month')
const lastMonth = previous(adapter, month)
```

### Level 2: Builder Method

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })
const month = temporal.period(new Date(), 'month')
const lastMonth = temporal.previous(month)
```

## Signatures

```typescript
// Level 1 (Pure Function)
function previous(adapter: Adapter, period: Period): Period

// Level 2 (Builder Method)
temporal.previous(period: Period): Period
```

## Parameters

### Level 1 (Pure Function)

- `adapter` - `Adapter` - The date adapter instance
- `period` - `Period` - The current period to navigate from

### Level 2 (Builder Method)

- `period` - `Period` - The current period to navigate from

## Returns

`Period` - The previous period of the same type and duration

## Description

Creates a new period that immediately precedes the given period, maintaining the same unit type and duration. For custom periods, the duration is preserved.

## Examples

### Basic Usage (Level 1)

```typescript
import { period, previous } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Navigate to previous day
const today = period(adapter, new Date(), 'day')
const yesterday = previous(adapter, today)

// Navigate to previous month
const month = period(adapter, new Date(), 'month')
const lastMonth = previous(adapter, month)

// Navigate to previous year
const year = period(adapter, new Date(), 'year')
const lastYear = previous(adapter, year)
```

### Builder API (Level 2)

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })

const month = temporal.period(new Date(), 'month')
const lastMonth = temporal.previous(month)
const twoMonthsAgo = temporal.previous(lastMonth)
```

### Custom Period Navigation

```typescript
import { period, previous } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Custom period (e.g., sprint)
const sprint = period(adapter, {
  start: new Date('2024-01-15'),
  end: new Date('2024-01-29') // 14 days
})

// Previous sprint (preserves duration)
const previousSprint = previous(adapter, sprint)
// { start: 2024-01-01, end: 2024-01-15, type: 'custom' }
```

### Chaining Navigation

```typescript
import { period, previous } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()

// Navigate multiple steps backward
const month = period(adapter, new Date(), 'month')
const twoMonthsAgo = previous(adapter, previous(adapter, month))

// Or use go() for better performance
import { go } from '@allystudio/usetemporal/operations'
const twoMonthsAgo2 = go(adapter, month, -2)
```

## TypeScript

Full type safety:

```typescript
import type { Adapter, Period } from '@allystudio/usetemporal'
import { period, previous } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter: Adapter = createNativeAdapter()
const month: Period = period(adapter, new Date(), 'month')
const lastMonth: Period = previous(adapter, month)
```

## See Also

- [next()](/api/operations/next) - Navigate forward
- [go()](/api/operations/go) - Navigate multiple steps at once
- [period()](/api/operations/period) - Create periods
- [Choosing API Level](/guide/choosing-api-level) - Which level to use
- [Level 1 API](/api/level-1-pure-functions) - Pure functions documentation
- [Level 2 API](/api/level-2-builder) - Builder pattern documentation
