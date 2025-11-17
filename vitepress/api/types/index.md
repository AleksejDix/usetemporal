# Types

TypeScript type definitions for useTemporal.

## Core Types

### [Period](/api/types/period)
The fundamental data structure representing a time period.

```typescript
interface Period {
  start: Date     // Inclusive start
  end: Date       // Exclusive end
  type: Unit      // Time unit type
  date: Date      // Reference date
}
```

### [Unit](/api/types/unit)
Supported time unit types.

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
  | (string & {}) // Extensible for custom units
```

### [Temporal](/api/types/temporal)
The central state container for time navigation.

```typescript
interface Temporal {
  adapter: Adapter
  browsing: Ref<Period>
  now: Ref<Period>
  weekStartsOn: number
}
```

### [Adapter](/api/types/adapter)
Interface for date library adapters.

```typescript
interface Adapter {
  startOf(date: Date, unit: AdapterUnit): Date
  endOf(date: Date, unit: AdapterUnit): Date
  add(date: Date, amount: number, unit: AdapterUnit): Date
  diff(start: Date, end: Date, unit: AdapterUnit): number
}
```

## Configuration Types

### [CreateTemporalOptions](/api/types/create-temporal-options)
Options for creating a temporal instance.

```typescript
interface CreateTemporalOptions {
  date: Date | Ref<Date>
  now?: Date | Ref<Date>
  adapter: Adapter
  weekStartsOn?: number // 0-6 (Sunday to Saturday)
}
```

### [SplitOptions](/api/types/split-options)
Options for the split operation.

```typescript
interface SplitOptions {
  unit?: Unit
  count?: number
  duration?: Duration
}
```

