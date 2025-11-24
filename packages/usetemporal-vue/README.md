# @allystudio/usetemporal-vue

Vue integration package for `@allystudio/usetemporal`. Built directly on the
Vue 3 runtime and Composition API, it exposes composables that wrap the core
library so `browsing`, `now`, and derived periods remain fully reactive inside
Vue applications.

## Installation

```bash
npm install @allystudio/usetemporal @allystudio/usetemporal-vue
```

Install whichever adapter you need (the core ships the native adapter entry):

```bash
npm install @allystudio/usetemporal/native
```

## Quick Start

```ts
import { ref } from "vue";
import { createTemporal, useTemporal, usePeriod } from "@allystudio/usetemporal-vue";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

const now = ref(new Date());

// Call inside setup to create + provide the temporal instance
const temporal = createTemporal({
  adapter: createNativeAdapter(),
  date: now,
});

const month = usePeriod(temporal, "month");

// Child components can access the same instance via the injector:
const nestedTemporal = useTemporal();

month.value.start; // Reactive!
```

### Reactive adapter settings

```ts
import { computed, ref } from "vue";
import { createTemporal } from "@allystudio/usetemporal-vue";
import { createNativeAdapter } from "@allystudio/usetemporal/native";

const weekStartsOn = ref(1);
const temporal = createTemporal({
  adapter: computed(() =>
    createNativeAdapter({ weekStartsOn: weekStartsOn.value })
  ),
  date: ref(new Date()),
});

weekStartsOn.value = 0; // automatically recalculates browsing periods
```

### API

- `createTemporal(options: CreateTemporalOptions): TemporalBuilder`  
  Creates (and automatically provides) a reactive temporal instance. Options
  accept native dates or refs for both `date` and `now`. Methods from the
  builder delegate to the core operations while passing the adapter
  automatically.

- `useTemporal(): TemporalBuilder`  
  Injects the nearest provided temporal instance so nested components can tap
  into the same builder without prop drilling.

- `usePeriod(temporal: VueTemporal, unit: Unit | Ref<Unit>): ComputedRef<Period>`  
  Returns a computed period that updates when `browsing` changes or the unit
  ref updates.

### Migration from `createTemporal`

```ts
// Before (core package)
import { createTemporal, usePeriod } from "@allystudio/usetemporal";

const temporal = createTemporal({ adapter, date: new Date() });

// After
import { createTemporal, usePeriod } from "@allystudio/usetemporal-vue";

const temporal = createTemporal({ adapter, date: new Date() });
```

## Scripts

- `npm run build --workspace=@allystudio/usetemporal-vue`
- `TZ=UTC npm test --workspace=@allystudio/usetemporal-vue`
- `npm run type-check --workspace=@allystudio/usetemporal-vue`
- `npm run demo --workspace=@allystudio/usetemporal-vue`

## Demo playground

Run the interactive playground directly from this workspace to experiment with
the composables:

```bash
npm run demo --workspace=@allystudio/usetemporal-vue
```

The Vite app lives under `packages/usetemporal-vue/demo` and imports the
library source directly, so any local changes are reflected instantly.

## Documentation

Complete docs live at https://usetemporal.vercel.app.

## License

MIT © Aleksej Dix
