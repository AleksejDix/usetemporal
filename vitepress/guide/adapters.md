# Date Adapters

::: tip Comprehensive Documentation
This page provides a quick overview. For detailed adapter comparisons, selection guides, and migration help, see our **[comprehensive adapter documentation](./adapters/index.md)**.
:::

useTemporal supports multiple date libraries through a simple adapter pattern.

## Available Adapters

### Native JavaScript Date (Default)

Zero dependencies, works everywhere:

```typescript
import { createTemporal } from '@allystudio/usetemporal'

const temporal = createTemporal()
// Native adapter is included by default
```

### Using date-fns

For advanced date operations:

```bash
npm install @allystudio/usetemporal date-fns
```

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createDateFnsAdapter } from '@allystudio/usetemporal/date-fns'
import { enUS } from 'date-fns/locale'

const temporal = createTemporal({
  adapter: createDateFnsAdapter({ 
    locale: enUS,
    weekStartsOn: 1
  })
})
```

### Using Luxon

For timezone support:

```bash
npm install @allystudio/usetemporal luxon
```

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon'

const temporal = createTemporal({
  adapter: createLuxonAdapter({
    zone: 'America/New_York',
    locale: 'en-US'
  })
})
```

### Using Temporal API

Future-proof with the upcoming Temporal API:

```bash
npm install @allystudio/usetemporal @js-temporal/polyfill
```

```typescript
import { createTemporal } from '@allystudio/usetemporal'
import { createTemporalAdapter } from '@allystudio/usetemporal/temporal'

const temporal = createTemporal({
  adapter: createTemporalAdapter()
})
```

## Choosing an Adapter

| Adapter | Bundle Size | Features | Use When |
|---------|------------|----------|----------|
| Native | 0KB | Basic date operations | You want minimal bundle size |
| date-fns | ~20KB | Extensive date utilities | You need advanced formatting/parsing |
| Luxon | ~70KB | Timezone support, i18n | You need timezone handling |
| Temporal | ~40KB | Modern API, immutable | You want future-proof code |

## Creating Custom Adapters

Implement the minimal adapter interface:

```typescript
interface Adapter {
  startOf(date: Date, unit: Unit): Date
  endOf(date: Date, unit: Unit): Date
  add(date: Date, value: number, unit: Unit): Date
  diff(start: Date, end: Date, unit: Unit): number
}
```

Example custom adapter:

```typescript
const myAdapter = {
  startOf(date, unit) {
    // Your implementation
  },
  endOf(date, unit) {
    // Your implementation
  },
  add(date, value, unit) {
    // Your implementation
  },
  diff(start, end, unit) {
    // Your implementation
  }
}

const temporal = createTemporal({ adapter: myAdapter })
```

## Next Steps

- **[Adapter Comparison & Selection Guide](./adapters/index.md)** - Detailed feature matrix and performance data
- **[Adapter Selection Helper](./adapters/selection.md)** - Interactive guide to choose the right adapter
- **[Migration Guide](./adapters/migration.md)** - Migrate from other libraries or switch adapters
- Learn about [TypeScript Support](/guide/typescript)
- See [Performance](/guide/performance) comparisons