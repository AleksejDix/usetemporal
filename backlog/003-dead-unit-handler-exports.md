# Adapter index files export unused unit handlers

**Effort:** Low (10 min)
**Savings:** ~32 lines

## Problem

4 adapter index files re-export individual unit handlers (yearHandler, monthHandler, etc.) that nothing imports. They exist for a public API that nobody uses.

## Files

- adapters/native/index.ts
- adapters/date-fns/index.ts
- adapters/luxon/index.ts
- adapters/temporal/index.ts

## Fix

Remove unit handler exports. Keep only the factory function and default instance.
