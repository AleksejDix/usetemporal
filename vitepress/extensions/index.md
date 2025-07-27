# Extensions

useTemporal extensions provide additional functionality beyond the core library while maintaining the philosophy of minimalism and composability.

## Available Extensions

### [@usetemporal/calendar-units](/extensions/calendar-units)

Specialized time units for calendar user interfaces.

- **stableMonth** - Always returns 42-day (6-week) grid for consistent calendar layouts
- Tree-shakeable and lightweight (~1KB gzipped)
- Full TypeScript support

```bash
npm install @usetemporal/calendar-units
```

## Philosophy

Extensions follow these principles:

1. **Optional Enhancement** - Core functionality works without any extensions
2. **Single Purpose** - Each extension package has a focused goal
3. **Composable** - Extensions work together seamlessly
4. **Lightweight** - Minimal overhead and tree-shakeable

## Creating Extensions

Extensions use useTemporal's unit registry system:

```typescript
import { defineUnit } from '@usetemporal/core';

defineUnit('customUnit', {
  // Unit definition
});
```

## Future Extensions

Planned extension packages:

- **@usetemporal/business** - Business days, hours, and fiscal periods
- **@usetemporal/formatting** - Advanced date/time formatting utilities
- **@usetemporal/parsing** - Natural language date parsing
- **@usetemporal/timezones** - Timezone handling utilities

## Contributing

We welcome community extensions! See our [contribution guide](https://github.com/usetemporal/usetemporal/blob/main/CONTRIBUTING.md) for details on creating your own extension package.