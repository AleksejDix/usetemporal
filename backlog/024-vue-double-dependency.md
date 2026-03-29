# Vue listed as both dependency and peerDependency

**Effort:** Trivial (5 min)
**Impact:** Ship-blocking — users may get two copies of Vue

## Problem

`minuta-vue/package.json` has `vue: ^3.5.18` in `dependencies` AND `vue: ^3.0.0` in `peerDependencies`. The dependency version gets bundled; the peer version is what users provide. Two copies of Vue = broken reactivity.

## Fix

Remove `vue` from `dependencies`. Keep only in `peerDependencies` and `devDependencies`.
