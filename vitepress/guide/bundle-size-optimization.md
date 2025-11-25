# Bundle Size Optimization

Learn how to minimize your bundle size with useTemporal.

## Understanding Tree-Shaking

useTemporal v2.0 is designed for optimal tree-shaking:
- Only bundle operations you use
- No side effects
- Modular architecture

## Measuring Your Bundle

```bash
# Using Rollup
npx rollup your-app.js --format esm -o dist/bundle.js
gzip -c dist/bundle.js | wc -c

# Using Webpack Bundle Analyzer
npm install -D webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/stats.json

# Using Vite
npm run build
# Check dist/assets for bundle sizes
```

## Optimization Tips

### 1. Use Pure Functions for Hot Paths

```typescript
// Hot path: Use pure functions
import { contains } from '@allystudio/usetemporal/operations';

function filterItems(items, range) {
  return items.filter(item => contains(range, item.date));
}
```

**Bundle Impact:** ~5KB total footprint

### 2. Import Only What You Need

```typescript
// ✅ Good: Specific imports
import { period, divide } from '@allystudio/usetemporal/operations';

// ❌ Bad: Barrel import (though still tree-shakes)
import * as ops from '@allystudio/usetemporal/operations';
```

### 3. Choose the Right Adapter

Different adapters have different bundle impacts:

| Adapter | Size | External Dependency |
|---------|------|---------------------|
| Native | 0KB | None |
| date-fns | ~60KB | date-fns |
| Luxon | ~15KB | luxon |
| Temporal | ~40KB | @js-temporal/polyfill |

**Recommendation:** Use native adapter unless you need specific features.

```typescript
// Minimal bundle
import { createNativeAdapter } from '@allystudio/usetemporal/native';

// Larger bundle but more features
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon';
```

### 4. Lazy Load Calendar Features

```typescript
// Don't import calendar unless needed
const calendar = await import('@allystudio/usetemporal/calendar');
const stable = calendar.createStableMonth(adapter, date, 1);
```

**Bundle Impact:** Removes ~2KB from initial bundle

### 5. Use Custom Periods When Possible

```typescript
// Instead of importing calendar units
const range = period(adapter, {
  start: startDate,
  end: endDate
});

// More flexible and smaller bundle
```

## Real-World Examples

### Example 1: Date Range Picker

**Before v2.0:** 30KB
**After v2.0 (Level 1):** 5KB
**Savings:** 83%

```typescript
import { period, contains } from '@allystudio/usetemporal/operations';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

// Minimal bundle for date range filtering
const adapter = createNativeAdapter();
const range = period(adapter, { start, end });
const filtered = items.filter(item => contains(range, item.date));
```

### Example 2: Full Dashboard

**Before v2.0:** 30KB
**After v2.0:** 10-12KB
**Savings:** 60%+

```typescript
import { period, divide, next, previous } from '@allystudio/usetemporal/operations';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

const adapter = createNativeAdapter();
const month = period(adapter, new Date(), 'month');
const days = divide(adapter, month, 'day');
const nextMonth = next(adapter, month);
const previousMonth = previous(adapter, month);
```

## Advanced Optimization

### Split Code by Route

```typescript
// Route 1: Simple filtering (pure functions)
const FilterRoute = () => import('./FilterRoute.js');

// Route 2: Calendar UI (includes calendar utilities)
const CalendarRoute = () => import('./CalendarRoute.js');
```

### Conditional Imports

```typescript
// Only load calendar in calendar routes
if (route === '/calendar') {
  const { createStableMonth } = await import('@allystudio/usetemporal/calendar');
}
```

### Use Native Adapter by Default

```typescript
// Start with native
import { createNativeAdapter } from '@allystudio/usetemporal/native';

// Upgrade to luxon only when needed
const adapter = needsTimezones
  ? createLuxonAdapter()
  : createNativeAdapter();
```

## Verification

After optimization, verify your bundle size:

```bash
# Build production bundle
npm run build

# Check sizes
ls -lh dist/assets/*.js

# Detailed analysis
npx vite-bundle-visualizer
```

## Common Mistakes

### ❌ Importing Everything

```typescript
import * as temporal from '@allystudio/usetemporal';
```

**Fix:** Import only what you need:

```typescript
import { period, divide } from '@allystudio/usetemporal/operations';
```

### ❌ Using Heavy Adapters Unnecessarily

```typescript
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon';
// +15KB for features you might not need
```

**Fix:** Use native adapter unless you need specific features:

```typescript
import { createNativeAdapter } from '@allystudio/usetemporal/native';
// 0KB additional
```

### ❌ Not Using Lazy Loading

```typescript
import { createStableMonth } from '@allystudio/usetemporal/calendar';
// Always loaded, even if not used
```

**Fix:** Lazy load when needed:

```typescript
const calendar = await import('@allystudio/usetemporal/calendar');
```

## Related

- [Operations Overview](/guide/operations) - Deep dive into period functions
- [Performance Optimization](./performance.md) - Runtime performance tips
- [Level 1 API](/api/level-1-pure-functions.md) - Smallest bundle size
