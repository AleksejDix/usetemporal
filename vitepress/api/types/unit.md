# Unit

Time unit types supported by useTemporal.

## Type Definition

```typescript
type Unit = 
  | 'year'
  | 'quarter' 
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'custom'
  | (string & {})  // Extensible for custom units
```

## Description

The `Unit` type represents all possible time units in useTemporal. It includes standard calendar units, special units, and is extensible to support custom units through the unit plugin system.

## Standard Units

### Calendar Units

- **`year`** - Calendar year (January 1 to December 31)
- **`quarter`** - Three-month period (Q1: Jan-Mar, Q2: Apr-Jun, etc.)
- **`month`** - Calendar month
- **`week`** - 7-day period (start day configurable via `weekStartsOn`)
- **`day`** - 24-hour period (midnight to midnight)

### Time Units

- **`hour`** - 60-minute period
- **`minute`** - 60-second period  
- **`second`** - Base time unit

### Special Units

- **`custom`** - Arbitrary date ranges created with `period({ start, end })`

## Usage Examples

### With Operations

```typescript
import { divide, period, isSame } from '@allystudio/usetemporal/operations'

// All operations accept Unit type
divide(adapter, yearPeriod, 'month')
period(adapter, new Date(), 'month')
isSame(adapter, periodA, periodB, 'day')
```

### With Period Creation

```typescript
import { period } from '@allystudio/usetemporal/operations'
import { usePeriod } from '@allystudio/usetemporal'

// Level 1: Pure function
period(adapter, new Date(), 'month')

// Level 2: Builder
temporal.period(new Date(), 'week')

// Level 3: Composable
usePeriod(temporal, 'day')
```

### Type Safety

```typescript
// TypeScript provides autocomplete
const unit: Unit = 'month' // ✓ Valid

// Type errors for invalid units
const invalid: Unit = 'fortnight' // ✗ Type error (unless registered)
```

## Unit Hierarchy

Units have a natural hierarchy from largest to smallest:

```
year
  └── quarter (3 months)
      └── month
          └── week*
              └── day
                  └── hour
                      └── minute
                          └── second
```

*Note: weeks can overlap month boundaries

## Extensibility

The Unit type is extensible through TypeScript module augmentation:

```typescript
// Register a custom unit
declare module '@allystudio/usetemporal' {
  interface UnitRegistry {
    'fiscal-year': true
    'sprint': true
  }
}

// Now these are valid Unit values
const fiscalYear: Unit = 'fiscal-year' // ✓
const sprint: Unit = 'sprint'           // ✓
```


## Special Unit Behaviors

### Custom

The `custom` unit represents arbitrary date ranges:

```typescript
import { period, next } from '@allystudio/usetemporal/operations'

const customPeriod = period(adapter, { start, end })
console.log(customPeriod.type) // 'custom'

// Custom periods maintain their duration when navigating
const nextPeriod = next(adapter, customPeriod)
// Same duration, shifted forward
```

## Unit Validation

Operations validate unit compatibility:

```typescript
import { divide } from '@allystudio/usetemporal/operations'

// Valid: can divide year into months
divide(adapter, yearPeriod, 'month') // ✓

// Invalid: can't divide day into months
divide(adapter, dayPeriod, 'month') // ✗ Error
```

## Adapter Units

Some units require adapter support:

```typescript
type AdapterUnit = 
  | 'year'
  | 'quarter'
  | 'month' 
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
```

Custom units are handled by useTemporal internally.

## See Also

- [Period](/api/types/period) - Period type
- [Temporal](/api/types/temporal) - Temporal type
- [Adapter](/api/types/adapter) - Adapter interface