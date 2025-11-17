# Choosing the Right API Level

useTemporal offers three API levels to match your needs.

## Quick Decision Tree

```
Do you need reactivity (Vue/React)?
├─ YES → Level 3 (Composables)
└─ NO
    ├─ Performance critical?
    │   └─ YES → Level 1 (Pure Functions)
    └─ NO → Level 2 (Builder)
```

## Detailed Comparison

| Factor | Level 1 | Level 2 | Level 3 |
|--------|---------|---------|---------|
| **Bundle Size** | 5-7KB | 8-12KB | 15-20KB |
| **Tree-Shaking** | Excellent | Good | Good |
| **DX** | Verbose | Convenient | Excellent |
| **Reactivity** | No | No | Yes (Vue) |
| **Boilerplate** | High | Low | Very Low |
| **Learning Curve** | Easy | Easy | Medium |

## Use Case Examples

### E-commerce Product Filters
**Recommended:** Level 1 (Pure Functions)
- Need date range filtering
- Performance matters (hot path)
- Only using period + contains
- Bundle size critical

```typescript
import { period, contains } from '@allystudio/usetemporal/operations';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

const adapter = createNativeAdapter();

function filterByDateRange(items, startDate, endDate) {
  const range = period(adapter, { start: startDate, end: endDate });
  return items.filter(item => contains(range, item.createdAt));
}
```

### Dashboard Analytics
**Recommended:** Level 2 (Builder)
- Multiple time period operations
- Comparing periods, navigation
- Balance performance and convenience

```typescript
import { createTemporal } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  weekStartsOn: 1
});

// Convenient method chaining
const thisMonth = temporal.period(new Date(), 'month');
const lastMonth = temporal.previous(thisMonth);
const weeks = temporal.divide(thisMonth, 'week');
```

### Interactive Calendar UI
**Recommended:** Level 3 (Composables)
- Vue/React component
- Need reactive updates
- User navigates between months
- DX more important than bundle size

```vue
<script setup>
import { createTemporal, usePeriod } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: new Date()
});

const month = usePeriod(temporal, 'month');
</script>

<template>
  <div>{{ month.value.date.toLocaleDateString() }}</div>
</template>
```

## Can I Mix Levels?

**Yes!** Use different levels in different parts of your app:

```typescript
// Hot path: Level 1 for performance
import { contains } from '@allystudio/usetemporal/operations';

function filterByDateRange(items, start, end) {
  const range = { start, end, type: 'custom', date: start };
  return items.filter(item => contains(range, item.date));
}

// UI: Level 3 for convenience
import { createTemporal, usePeriod } from '@allystudio/usetemporal';

const temporal = createTemporal({ adapter, date: new Date() });
const month = usePeriod(temporal, 'month');
```

## Migration Path

Start with the level that fits your current needs, then optimize:

1. **Start:** Use Level 2 (Builder) for most features
2. **Optimize:** Move hot paths to Level 1 (Pure Functions)
3. **Enhance:** Add Level 3 (Composables) where reactivity helps

## Performance Considerations

### Level 1 (Pure Functions)
- **Pros:** Smallest bundle, fastest execution
- **Cons:** More verbose code
- **Best for:** Hot paths, performance-critical code

### Level 2 (Builder)
- **Pros:** Good balance of convenience and size
- **Cons:** Slightly larger than Level 1
- **Best for:** General application code

### Level 3 (Composables)
- **Pros:** Automatic reactivity, excellent DX
- **Cons:** Largest bundle size
- **Best for:** UI components with reactive state

## Decision Checklist

Use this checklist to choose your API level:

- [ ] Is this code in a hot path? → Consider Level 1
- [ ] Do I need reactivity? → Use Level 3
- [ ] Am I using 5+ operations? → Level 2 provides convenience
- [ ] Is bundle size under 10KB critical? → Use Level 1
- [ ] Am I building a Vue/React component? → Level 3 fits well
- [ ] Do I prefer explicit dependencies? → Level 1
- [ ] Want method chaining? → Level 2

## Related

- [Level 1: Pure Functions API](/api/level-1-pure-functions.md)
- [Level 2: Builder API](/api/level-2-builder.md)
- [Level 3: Composables API](/api/level-3-composables.md)
- [Bundle Size Optimization](/guide/bundle-size-optimization.md)
