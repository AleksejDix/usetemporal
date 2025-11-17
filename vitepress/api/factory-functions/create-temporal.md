# createTemporal

Creates a new temporal instance - the central controller for time operations in useTemporal.

## Signature

```typescript
createTemporal(options: CreateTemporalOptions): TemporalBuilder
```

## Parameters

- `options` - `CreateTemporalOptions` - Configuration options

### CreateTemporalOptions

```typescript
interface CreateTemporalOptions {
  date: Date | Ref<Date>     // Initial browsing date (required)
  adapter: Adapter           // Date operations adapter (required)
  now?: Date | Ref<Date>     // Current time reference (optional)
  weekStartsOn?: number      // 0-6, default: 1 (Monday)
}
```

## Returns

`TemporalBuilder` - The temporal builder instance with reactive properties and convenience methods

### TemporalBuilder Interface

```typescript
interface TemporalBuilder extends Temporal {
  // Temporal base properties
  adapter: Adapter           // Date operations adapter
  weekStartsOn: number       // 0-6
  browsing: Ref<Period>      // Currently browsed period
  now: Ref<Period>           // Current time period

  // Builder methods (convenience wrappers for operations)
  period(date: Date, unit: Unit): Period
  period(options: CustomPeriodOptions): Period
  divide(period: Period, unit: Unit): Period[]
  merge(periods: Period[]): Period
  split(period: Period, date: Date): [Period, Period]
  next(period: Period): Period
  previous(period: Period): Period
  go(period: Period, direction: number, count?: number): Period
  contains(period: Period, date: Date): boolean
  isSame(period1: Period, period2: Period, unit: Unit): boolean
}
```

## Description

The `createTemporal` function initializes the core temporal system. It manages two key reactive states: the browsing period (for navigation) and the current time period. All time operations in useTemporal flow through this central instance.

## Basic Usage

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

// Create with current date (adapter is required)
const temporal = createTemporal({
  date: new Date(),
  adapter: createNativeAdapter()
})

// Create with specific configuration
const temporal = createTemporal({
  date: new Date(2024, 2, 14),
  adapter: createNativeAdapter(),
  weekStartsOn: 0, // Sunday
  now: new Date() // Optional: override current time
})

// Access reactive properties
console.log(temporal.browsing.value) // Current browsing period
console.log(temporal.now.value)      // Current time period

// Use builder methods
const year = temporal.period(new Date(), 'year')
const months = temporal.divide(year, 'month')
```

## Using Different Adapters

The adapter determines which date library handles date operations. All adapters must be explicitly imported and provided.

```typescript
// Native JavaScript Date
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  date: new Date(),
  adapter: createNativeAdapter()
})

// Luxon
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon'

const temporal = createTemporal({
  date: new Date(),
  adapter: createLuxonAdapter()
})

// date-fns
import { createDateFnsAdapter } from '@allystudio/usetemporal/date-fns'

const temporal = createTemporal({
  date: new Date(),
  adapter: createDateFnsAdapter()
})

// Temporal API
import { createTemporalAdapter } from '@allystudio/usetemporal/temporal'

const temporal = createTemporal({
  date: new Date(),
  adapter: createTemporalAdapter()
})
```

## API Levels

useTemporal provides three API levels. `createTemporal` is part of **Level 2 (Builder API)**:

### Level 1: Pure Functions (Minimal Bundle)
```typescript
import { period, divide } from '@allystudio/usetemporal/operations'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const adapter = createNativeAdapter()
const year = period(adapter, new Date(), 'year')
const months = divide(adapter, year, 'month')
```

### Level 2: Builder API (Recommended)
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  date: new Date(),
  adapter: createNativeAdapter()
})

// Builder methods wrap pure functions
const year = temporal.period(new Date(), 'year')
const months = temporal.divide(year, 'month')
```

### Level 3: Composables (Reactive)
```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({
  date: new Date(),
  adapter: createNativeAdapter()
})

// Reactive period that updates automatically
const month = usePeriod(temporal, 'month')
```

## See Also

- [usePeriod](/api/composables/use-period) - Create reactive periods
- [Adapters](/guide/adapters) - Available date adapters
- [Getting Started](/guide/getting-started) - Basic usage guide
- [Core Concepts](/guide/core-concepts) - Understanding temporal instances