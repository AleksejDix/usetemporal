# period

Creates a period of a specific unit type from a date.

## Signature

```typescript
function period(
  temporal: Temporal,
  date: Date,
  unit: Unit
): Period
```

## Parameters

- `temporal` - `Temporal` - The temporal instance containing adapter and configuration
- `date` - `Date` - The date to create the period from
- `unit` - `Unit` - The unit type to create (`'year'`, `'month'`, `'week'`, `'day'`, etc.)

## Returns

`Period` - A new period of the specified type containing the date

## Description

Creates a new period of the specified unit type from a given date. The period will have start and end boundaries according to the unit type.

## Example

```typescript
const yearPeriod = period(temporal, new Date(), 'year')
const monthPeriod = period(temporal, new Date(), 'month')
const dayPeriod = period(temporal, new Date(), 'day')
```

## See Also

- [usePeriod](/api/composables/use-period) - Create reactive periods
- [Period Type](/api/types/period) - Period interface