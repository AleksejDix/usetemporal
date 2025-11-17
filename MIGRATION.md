# Migration Guide: v2.0.0-alpha.1 → v2.0.0

## Overview

Version 2.0 introduces significant architectural improvements for better tree-shaking
and bundle size optimization. The core change: operations are now pure functions
accepting adapters explicitly, replacing the global unit registry pattern.

**Bundle Size Impact:**
- Before: 30KB minimum bundle
- After (Level 1): 5-7KB for basic usage (76% reduction)
- After (Level 2): 8-12KB with builder convenience (60% reduction)
- After (Level 3): 15-20KB with full reactivity (33% reduction)

## Breaking Changes Summary

1. **Unit registry removed** - No more `defineUnit()`
2. **Operation signatures changed** - Pure functions require adapter parameter
3. **Calendar extraction** - Must import calendar explicitly
4. **Custom units** - Different registration pattern

## Migration Steps

### 1. Update Imports

**Before:**
```typescript
import { createTemporal } from '@allystudio/usetemporal';
```

**After - Choose your API level:**

**Level 1 (Pure Functions):**
```typescript
import { period, divide } from '@allystudio/usetemporal/operations';
import { createNativeAdapter } from '@allystudio/usetemporal/native';
```

**Level 2 (Builder):**
```typescript
import { createTemporal } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';
```

**Level 3 (Composables):**
```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';
```

### 2. Update Operation Calls

**Before (alpha.1):**
```typescript
import { period, divide } from '@allystudio/usetemporal';
const temporal = createTemporal({ adapter, date: new Date() });
const year = period(temporal, new Date(), 'year');
const months = divide(temporal, year, 'month');
```

**After (Level 1 - Pure Functions):**
```typescript
import { period, divide } from '@allystudio/usetemporal/operations';
const adapter = createNativeAdapter({ weekStartsOn: 1 });
const year = period(adapter, new Date(), 'year');
const months = divide(adapter, year, 'month');
```

**After (Level 2 - Builder):**
```typescript
const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1
});
const year = temporal.period(new Date(), 'year');
const months = temporal.divide(year, 'month');
```

**After (Level 3 - Composables):**
```typescript
const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
});
const month = usePeriod(temporal, 'month');
// month.value is reactive Period
```

### 3. Update Calendar Usage

**Before (auto-imported):**
```typescript
import { createStableMonth } from '@allystudio/usetemporal';
const stable = createStableMonth(temporal, new Date());
```

**After (explicit import):**
```typescript
import { createStableMonth } from '@allystudio/usetemporal/calendar';
const adapter = createNativeAdapter();
const stable = createStableMonth(adapter, new Date(), 1 /* weekStartsOn */);
```

### 4. Update Custom Units

**Before (unit registry):**
```typescript
import { defineUnit } from '@allystudio/usetemporal';

defineUnit('fortnight', {
  period(date, adapter) {
    // ...
  }
});
```

**After (custom adapter or helper):**

**Option A: Custom Adapter**
```typescript
const myAdapter = {
  ...nativeAdapter,
  startOf(date, unit) {
    if (unit === 'fortnight') return fortnightStart(date);
    return nativeAdapter.startOf(date, unit);
  },
  endOf(date, unit) {
    if (unit === 'fortnight') return fortnightEnd(date);
    return nativeAdapter.endOf(date, unit);
  }
};
```

**Option B: Helper Function**
```typescript
function fortnightPeriod(adapter, date) {
  const start = /* calculate */;
  const end = /* calculate */;
  return { start, end, type: 'fortnight', date };
}
```

## Which API Level Should I Use?

| Scenario | Recommended Level | Why |
|----------|------------------|-----|
| Performance-critical app, minimal features | Level 1 (Pure) | Smallest bundle, fastest load |
| Need calendar, divide, basic operations | Level 1 or 2 | Good balance |
| Building complex UI with many operations | Level 2 (Builder) | Convenience without bloat |
| Vue/React app, need reactivity | Level 3 (Composables) | Reactive state management |
| Mixing approaches? | Yes, combine them! | Use Level 1 for hot paths, Level 2/3 elsewhere |

## Bundle Size Comparison

```bash
# Level 1 (period + divide + native)
import { period, divide } from '@allystudio/usetemporal/operations';
import { createNativeAdapter } from '@allystudio/usetemporal/native';
# Bundle: ~5-7KB gzipped

# Level 2 (builder with 3 methods)
import { createTemporal } from '@allystudio/usetemporal';
# Bundle: ~8-12KB gzipped

# Level 3 (full DX with composables)
import { createTemporal, usePeriod } from '@allystudio/usetemporal';
# Bundle: ~15-20KB gzipped

# Before (alpha.1)
import { createTemporal, period } from '@allystudio/usetemporal';
# Bundle: ~30KB gzipped ❌
```

## Common Migration Issues

### Issue 1: "Cannot find module '@allystudio/usetemporal/operations'"

**Cause:** Old TypeScript config or outdated package

**Fix:**
```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler" // or "node16"
  }
}
```

### Issue 2: Tests failing after migration

**Cause:** Operation signatures changed

**Fix:** Update test calls to pass adapter:
```typescript
// Before
const month = period(temporal, new Date(), 'month');

// After
const month = period(temporal.adapter, new Date(), 'month');
```

### Issue 3: Calendar not found

**Cause:** Calendar is now a separate import

**Fix:**
```typescript
import { createStableMonth } from '@allystudio/usetemporal/calendar';
```

## Questions?

Open an issue: https://github.com/AleksejDix/usetemporal/issues
