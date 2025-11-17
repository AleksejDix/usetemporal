# Level 3: Composables API

Full DX - reactive composables for Vue-style applications.

## When to Use

- Building Vue or React applications
- Need reactive state management
- Want automatic updates on date changes
- Bundle size less critical

## Bundle Size

**15-20KB gzipped** with full reactivity features

## Import Pattern

```typescript
import { createTemporal, usePeriod } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';
```

## Example: Reactive Calendar

```vue
<script setup>
import { ref, computed } from 'vue';
import { createTemporal, usePeriod } from '@allystudio/usetemporal';
import { divide } from '@allystudio/usetemporal/operations';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: ref(new Date()),
  weekStartsOn: 1
});

// Reactive month period
const month = usePeriod(temporal, 'month');

// Weeks automatically update when month changes
const weeks = computed(() => divide(temporal.adapter, month.value, 'week'));

function nextMonth() {
  month.value = temporal.next(month.value);
}

function previousMonth() {
  month.value = temporal.previous(month.value);
}
</script>

<template>
  <div class="calendar">
    <header>
      <button @click="previousMonth">←</button>
      <h2>{{ month.value.date.toLocaleDateString('en', { month: 'long', year: 'numeric' }) }}</h2>
      <button @click="nextMonth">→</button>
    </header>

    <div v-for="week in weeks" :key="week.start.getTime()">
      <div v-for="day in divide(temporal.adapter, week, 'day')" :key="day.date.getTime()">
        {{ day.date.getDate() }}
      </div>
    </div>
  </div>
</template>
```

## Available Composables

- `usePeriod(temporal, unit)` - Reactive period of any unit type

## Reactivity Integration

Works with Vue's reactivity system:

```typescript
import { ref, computed } from 'vue';
import { createTemporal, usePeriod } from '@allystudio/usetemporal';

const currentDate = ref(new Date());
const temporal = createTemporal({ adapter, date: currentDate });

// Automatically updates when currentDate changes
const month = usePeriod(temporal, 'month');

// Change date - month automatically recalculates
currentDate.value = new Date(2024, 5, 15);
console.log(month.value); // June 2024
```

## Combining with Builder API

Use composables for reactive state, builder for imperatives:

```typescript
const temporal = createTemporal({ adapter, date: new Date() });

// Reactive current month
const month = usePeriod(temporal, 'month');

// Imperative operations
function navigateToNext() {
  const next = temporal.next(month.value);
  temporal.browsing.value = { ...temporal.browsing.value, date: next.date };
}
```

## React Integration

While built with Vue's reactivity, you can use with React hooks:

```typescript
import { useState, useEffect } from 'react';
import { createTemporal } from '@allystudio/usetemporal';
import { createNativeAdapter } from '@allystudio/usetemporal/native';

function useMonth() {
  const [month, setMonth] = useState(() => {
    const temporal = createTemporal({
      adapter: createNativeAdapter(),
      date: new Date()
    });
    return temporal.period(new Date(), 'month');
  });

  return { month, setMonth };
}
```

## Related

- [Level 1: Pure Functions API](./level-1-pure-functions.md) - Minimal bundle size
- [Level 2: Builder API](./level-2-builder.md) - Balanced convenience
- [Choosing an API Level](/guide/choosing-api-level.md) - Decision guide
