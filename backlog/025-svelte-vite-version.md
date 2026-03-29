# Svelte package on Vite 5, rest of monorepo on Vite 7

**Effort:** Trivial (5 min)

## Problem

`minuta-svelte/package.json` has `vite: ^5.4.10`. All other packages use `^7.2.4`. Major version mismatch may cause build inconsistencies.

## Fix

Update to `^7.2.4` to match the rest of the monorepo.
