# Adapter Overview & Comparison

useTemporal's adapter system allows you to use your preferred date library while maintaining a consistent API. Choose the adapter that best fits your project's needs.

## Quick Comparison

| Adapter | Bundle Size<br/>(min+gzip) | Tree-shakeable | Timezone<br/>Support | Locale<br/>Support | Immutable | Maintenance<br/>Status |
|---------|----------------------------|----------------|---------------------|-------------------|-----------|---------------------|
| **Native** | **0KB** | ✅ | ❌ | ❌ | ✅ | Active |
| **date-fns** | **~2.1KB** | ✅ | ❌ | ✅ | ✅ | Active |
| **date-fns-tz** | **~2.5KB** | ✅ | ✅ | ✅ | ✅ | Active |
| **Luxon** | **~2.3KB** | ✅ | ✅ | ✅ | ✅ | Active |
| **Temporal** | **~3KB** | ✅ | ✅ | ✅ | ✅ | Polyfill |

## Performance Comparison

Performance benchmarks for common operations (operations per second on modern hardware):

| Operation | Native | date-fns | date-fns-tz | Luxon | Temporal |
|-----------|--------|----------|-------------|-------|----------|
| Create Period | 1,200K | 980K | 940K | 420K | 380K |
| Divide Year→Months | 890K | 750K | 720K | 340K | 310K |
| Navigate (next/prev) | 1,100K | 920K | 890K | 380K | 350K |
| Date Math (add) | 1,050K | 880K | 850K | 360K | 330K |

> Note: Performance varies by environment. Run benchmarks on your target platform for accurate results.

## Feature Matrix

| Feature | Native | date-fns | date-fns-tz | Luxon | Temporal |
|---------|--------|----------|-------------|-------|----------|
| **Core Operations** |
| startOf/endOf | ✅ | ✅ | ✅ | ✅ | ✅ |
| add/subtract | ✅ | ✅ | ✅ | ✅ | ✅ |
| diff calculation | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Advanced Features** |
| Timezone conversion | ❌ | ❌ | ✅ | ✅ | ✅ |
| DST handling | ❌ | ❌ | ✅ | ✅ | ✅ |
| Locale formatting | ❌ | ✅ | ✅ | ✅ | ✅ |
| Custom calendars | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Developer Experience** |
| TypeScript support | ✅ | ✅ | ✅ | ✅ | ✅ |
| No dependencies | ✅ | ❌ | ❌ | ❌ | ❌ |
| Immutable operations | ✅ | ✅ | ✅ | ✅ | ✅ |
| Modular imports | ✅ | ✅ | ✅ | ✅ | ✅ |

## When to Use Each Adapter

### Native Adapter (Default)
**Best for:** Applications prioritizing bundle size and performance

✅ **Pros:**
- Zero dependencies
- Fastest performance
- Works everywhere
- No configuration needed

❌ **Cons:**
- No timezone support
- Limited formatting options
- Basic functionality only

**Use when:**
- Building lightweight applications
- Working with local dates only
- Bundle size is critical
- You need maximum performance

### date-fns Adapter
**Best for:** Applications needing rich date utilities without timezone complexity

✅ **Pros:**
- Excellent tree-shaking
- Rich formatting/parsing
- Extensive locale support
- Well-documented

❌ **Cons:**
- No built-in timezone support
- Requires peer dependency
- Slightly larger than native

**Use when:**
- You need advanced formatting
- Locale support is important
- Already using date-fns
- Timezone isn't required

### date-fns-tz Adapter
**Best for:** Applications already using date-fns that need timezone support

✅ **Pros:**
- Extends date-fns with timezone support
- Familiar API for date-fns users
- Good tree-shaking
- Well-maintained

❌ **Cons:**
- Requires both date-fns and date-fns-tz
- Slightly larger than plain date-fns
- Less comprehensive than Luxon

**Use when:**
- Already using date-fns
- Need basic timezone support
- Want to keep familiar API
- Bundle size still matters

### Luxon Adapter
**Best for:** Applications with international users and timezone requirements

✅ **Pros:**
- Full timezone support
- Rich locale handling
- Immutable by design
- Handles DST correctly

❌ **Cons:**
- Larger bundle size
- Slower than native/date-fns
- More complex API

**Use when:**
- Working with multiple timezones
- Need robust DST handling
- Building international apps
- Data accuracy is critical

### Temporal Adapter
**Best for:** Future-proofing and standards compliance

✅ **Pros:**
- Future JavaScript standard
- Most precise calculations
- Best timezone handling
- Custom calendar support

❌ **Cons:**
- Currently requires polyfill
- Larger bundle size
- Still evolving

**Use when:**
- Building new applications
- Need maximum precision
- Want future-proof code
- Complex calendar requirements

## Installation

### Native (Included by default)
```bash
npm install @allystudio/usetemporal
```

### date-fns
```bash
npm install @allystudio/usetemporal date-fns
```

### date-fns-tz
```bash
npm install @allystudio/usetemporal date-fns date-fns-tz
```

### Luxon
```bash
npm install @allystudio/usetemporal luxon
```

### Temporal
```bash
npm install @allystudio/usetemporal @js-temporal/polyfill
```

## Quick Start Examples

### Native (Default)
```typescript
import { createTemporal } from '@allystudio/usetemporal'

const temporal = createTemporal()
```

### date-fns
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsAdapter } from '@allystudio/usetemporal/date-fns'

const temporal = createTemporal({
  adapter: createDateFnsAdapter()
})
```

### date-fns-tz
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsTzAdapter } from '@allystudio/usetemporal/date-fns-tz'

const temporal = createTemporal({
  adapter: createDateFnsTzAdapter({
    timezone: 'America/New_York'
  })
})
```

### Luxon
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon'

const temporal = createTemporal({
  adapter: createLuxonAdapter({
    zone: 'America/New_York'
  })
})
```

### Temporal
```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createTemporalAdapter } from '@allystudio/usetemporal/temporal'

const temporal = createTemporal({
  adapter: createTemporalAdapter()
})
```

## Next Steps

- [Adapter Selection Guide](./selection.md) - Detailed decision flow
- [Migration Guides](./migration.md) - Switch between adapters
- [Performance Guide](/guide/performance) - Optimization tips
- Individual adapter guides:
  - [Native Adapter](./native.md)
  - [date-fns Adapter](./date-fns.md)
  - [date-fns-tz Adapter](./date-fns-tz.md)
  - [Luxon Adapter](./luxon.md)
  - [Temporal Adapter](./temporal.md)