# Factory Functions

Factory functions are used to create temporal instances.

## Core Factory Function

### [createTemporal](/api/factory-functions/create-temporal)
Creates a new temporal instance with date adapter and configuration.

```typescript
const temporal = createTemporal({
  adapter: nativeAdapter,
  weekStartsOn: 1 // Monday
})
```

## Usage Examples

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/adapters/native'

// Create temporal instance with native adapter
const temporal = createTemporal({
  adapter: createNativeAdapter()
})

// Create temporal instance with custom week start
const temporalWithMonday = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1
})
```

## See Also

- [Operations](/api/operations/) - Functions for working with periods
- [Date Adapters](/guide/adapters) - Different date library integrations