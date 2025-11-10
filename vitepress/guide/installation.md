# Installation

This guide covers how to install useTemporal in your project.

## Quick Install

The fastest way to get started is to install the main package which includes the core library and native adapter:

::: code-group

```bash [npm]
npm install @allystudio/usetemporal
```

```bash [yarn]
yarn add @allystudio/usetemporal
```

```bash [pnpm]
pnpm add @allystudio/usetemporal
```

```bash [bun]
bun add @allystudio/usetemporal
```

:::

## What's Included

The `@allystudio/usetemporal` package includes:
- Core library with all functionality
- Native JavaScript Date adapter (zero dependencies)
- Optional adapter integrations for date-fns, Luxon, and Temporal API
- Calendar units (stableMonth)

## Optional Dependencies

If you want to use a specific date library adapter, install it as an optional dependency:

### With date-fns

```bash
npm install @allystudio/usetemporal date-fns
```

### With Luxon

```bash
npm install @allystudio/usetemporal luxon
```

### With Temporal API

```bash
npm install @allystudio/usetemporal @js-temporal/polyfill
```


## Calendar Units

The package includes specialized calendar units like `stableMonth` for consistent calendar grids. These are automatically available when you import the library:

```typescript
import { createTemporal, period } from '@allystudio/usetemporal'
import { createNativeAdapter } from '@allystudio/usetemporal/native'

const temporal = createTemporal({ adapter: createNativeAdapter() })
const stableMonth = period(temporal, 'stableMonth', temporal.browsing.value)
```

Calendar units provide:
- 6-week (42-day) stable calendar grids
- Calendar-specific time units
- Consistent layouts for calendar UIs

See [Calendar Units](/extensions/calendar-units) for more information.

## Requirements

- **Node.js**: 16.0 or higher
- **ESM Support**: All packages are ESM-only
- **TypeScript**: 4.5+ (optional but recommended)

## Verify Installation

Create a simple test file to verify everything is working:

```typescript
import { createTemporal } from 'usetemporal'

const temporal = createTemporal()
console.log('useTemporal installed successfully!')
console.log('Current date:', temporal.now.value.date)
```

## Next Steps

- Continue to [First App](/guide/first-app) to build something
- Learn about [Core Concepts](/guide/core-concepts)
- Explore [Date Adapters](/guide/adapters)