# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0-alpha.1] - 2025-11-10

### Changed
- **BREAKING:** Removed global `unitRegistry` and all related functions (`defineUnit`, `getUnitDefinition`, `hasUnit`, `getRegisteredUnits`).
  - Operations no longer rely on global state for unit definitions.
  - Custom unit registration now requires alternative patterns (e.g., custom adapters or helper functions).
- **BREAKING:** Operation signatures changed from `(temporal: Temporal, ...)` to `(adapter: Adapter, ...)`.
  - All core operations (`period`, `divide`, `merge`, `next`, `previous`, `go`, `isSame`, `isToday`) now accept an `Adapter` instance as their first argument.
- **BREAKING:** `createStableMonth` and `createStableYear` helper functions now accept `(adapter: Adapter, weekStartsOn: number, date: Date)` instead of `(temporal: Temporal, date: Date)`.

### Removed
- `src/unit-registry.ts`
- `src/units/definitions.ts`

## [2.0.0] - 2025-11-XX

### 🚀 Major Changes

**Architecture Refactor for Tree-Shaking**

This release completely refactors the internal architecture to enable optimal
tree-shaking, reducing bundle sizes by 60-76% depending on usage patterns.

### Breaking Changes

#### 1. Global Unit Registry Removed

**Before:**
```typescript
import { defineUnit } from '@allystudio/usetemporal';
defineUnit('custom', { /* ... */ });
```

**After:**
See [Custom Units Guide](./MIGRATION.md#4-update-custom-units)

#### 2. Operation Signatures Changed

**Before:**
```typescript
const month = period(temporal, new Date(), 'month');
```

**After (Pure Functions):**
```typescript
const month = period(adapter, new Date(), 'month');
```

**After (Builder):**
```typescript
const month = temporal.period(new Date(), 'month');
```

#### 3. Calendar Utilities Separated

**Before:**
```typescript
import { createStableMonth } from '@allystudio/usetemporal';
```

**After:**
```typescript
import { createStableMonth } from '@allystudio/usetemporal/calendar';
```

### Added

- ✨ Level 1 API: Pure functions (`@allystudio/usetemporal/operations`)
- ✨ Level 2 API: Builder pattern with tree-shakable methods
- ✨ Level 3 API: Composables for reactive applications
- ✨ Subpath exports for better tree-shaking
- ✨ Comprehensive migration guide (MIGRATION.md)
- 📚 Documentation for all three API levels
- 📚 Bundle size optimization guide
- 📚 API level selection guide

### Improved

- 📦 Bundle size: 5-7KB for minimal usage (was 30KB)
- 🌳 Tree-shaking: Only bundle what you use
- 📚 Documentation: Three API levels fully documented
- 🎯 TypeScript: Improved type inference

### Migration

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

### Bundle Size Comparison

| Usage | v1.x | v2.0 | Savings |
|-------|------|------|---------|
| Minimal (period + divide) | 30KB | 5-7KB | 76% |
| Builder (5 operations) | 30KB | 8-12KB | 60% |
| Full DX (composables) | 30KB | 15-20KB | 33% |

## [1.0.0] - Previous Release
- Initial stable release