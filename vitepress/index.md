---
layout: home

hero:
  name: "useTemporal"
  text: "Calculus for Time"
  tagline: A minimal time library with fundamental operations that compose into powerful temporal manipulations
  image:
    src: /logo.svg
    alt: useTemporal
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/AleksejDix/usetemporal

features:
  - icon: ∫
    title: Fundamental Operations
    details: Like calculus provides dx and ∫, we provide period, divide, merge, and navigate. Everything else emerges through composition.
    link: /guide/core-concepts

  - icon: 🔄
    title: Revolutionary divide() Pattern
    details: The only library that treats time as hierarchical periods that can be infinitely subdivided.
    link: /guide/divide-pattern

  - icon: 📦
    title: Ultra Minimal
    details: Less than 15 core functions, each under 1KB. Import only what you need with perfect tree-shaking.
    link: /guide/installation

  - icon: ⚡
    title: Framework Agnostic
    details: Built on Vue's reactivity system but works with Vue, React, Angular, Svelte, and vanilla JavaScript.
    link: /guide/framework-agnostic

  - icon: 🎯
    title: Pure Functions
    details: Every function is pure, returning new values without mutations. Predictable and testable.

  - icon: 🧩
    title: Extensible
    details: Define custom time units through a simple module augmentation system.
    link: /api/unit-system/define-unit

---

## Quick Start

::: code-group

```bash [npm]
npm install usetemporal
```

```bash [pnpm]
pnpm add usetemporal
```

```bash [yarn]
yarn add usetemporal
```

:::

```typescript
import { createTemporal, usePeriod, divide } from 'usetemporal'

const temporal = createTemporal({ date: new Date() })
const month = usePeriod(temporal, 'month')
const days = divide(temporal, month.value, 'day')
```

## Philosophy: Calculus for Time

Like calculus provides fundamental operations (dx, ∫) that compose into powerful tools, useTemporal provides fundamental time operations that compose into complex temporal manipulations.

```typescript
// Fundamental operations - like dx and ∫
period(temporal, date, unit)        // Create any period
divide(temporal, period, unit)      // Hierarchical subdivision
merge(temporal, periods)            // Combine periods
next/previous/go                    // Relative navigation

// Everything else is composition
const daysInMonth = (month) => divide(temporal, month, 'day')
const businessDays = (period) => divide(temporal, period, 'day')
  .filter(day => ![0, 6].includes(day.date.getDay()))
```

## Why useTemporal?

**Traditional Approach** - Manual and error-prone:
```javascript
const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
const days = []
for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
  days.push(new Date(d))
}
```

**useTemporal** - Elegant and reactive:
```typescript
const month = usePeriod(temporal, 'month')
const days = divide(temporal, month.value, 'day')
// Automatically updates when month changes
```

## Key Features

### Hierarchical Time
```typescript
const year = usePeriod(temporal, 'year')
const months = divide(temporal, year.value, 'month')
const days = divide(temporal, months[0], 'day')
const hours = divide(temporal, days[0], 'hour')
```

### Built-in Reactivity
```typescript
import { watch } from '@vue/reactivity'

watch(month, (newMonth) => {
  console.log('Month changed:', newMonth.date)
})
```

### Custom Units
```typescript
import { defineUnit } from 'usetemporal'

defineUnit('fortnight', {
  duration: { weeks: 2 },
  validate: (adapter, date) => true
})

const fortnight = usePeriod(temporal, 'fortnight')
```

## Ready to Start?

<div class="cta-section">
  <a href="/guide/getting-started" class="cta-button primary">
    Get Started
  </a>
  <a href="/api/" class="cta-button secondary">
    API Reference
  </a>
  <a href="/examples/basic-usage" class="cta-button secondary">
    Examples
  </a>
</div>

<style>
.cta-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.cta-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-block;
}

.cta-button.primary {
  background: var(--vp-c-brand);
  color: white;
}

.cta-button.primary:hover {
  background: var(--vp-c-brand-dark);
}

.cta-button.secondary {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.cta-button.secondary:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}
</style>