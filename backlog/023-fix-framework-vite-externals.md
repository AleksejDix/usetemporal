# Fix framework vite configs: missing externals and stale aliases

**Effort:** Low (20 min)
**Impact:** Ship-blocking — minuta core may be bundled into framework packages

## Problem

1. React, Vue, and Svelte vite configs mark old `@allystudio/usetemporal` regex as external but NOT `minuta`. Core library may be double-bundled.
2. Demo aliases still reference `@allystudio/usetemporal-*` — demos are likely broken.
3. Core `minuta/vite.config.ts` has stale externals: `@usetemporal/core`, `@usetemporal/adapter-native`, `@vue/reactivity` — none exist.

## Fix

- Add `"minuta"` and `/^minuta\//` to external arrays in all three framework vite configs
- Remove old `@allystudio/usetemporal` regex patterns
- Update demo aliases to use `minuta-react`, `minuta-vue`, `minuta-svelte`
- Remove stale externals from core vite config
