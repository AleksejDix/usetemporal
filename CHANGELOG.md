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

## [2.0.0] - 2025-07-25

### Added
- Enhanced documentation for UNITS constant with better TypeScript examples
- Comprehensive JSDoc comments for UNITS object properties
- UnitsObject type export for better type inference

### Changed
- **BREAKING:** Removed `stableMonth` unit from core library
  - Removed from Unit type definition
  - Removed STABLE_MONTH constant
  - Removed from UnitRegistry interface
  - Removed all stableMonth handling from operations (divide, createPeriod, next, previous, go, isSame, contains)
  - This feature will be available in the future `@usetemporal/calendar-units` package

### Removed
- **BREAKING:** Removed `stableMonth` unit completely (see Changed section)
- Removed internal mock adapter (functionalMockAdapter.ts) - not user facing
- Removed redundant test files that were using mock adapter

### Migration Guide
For stableMonth removal, see the [Migration Guide](./vitepress/guide/migration.md#breaking-changes-in-v200) for alternatives and workarounds.

## [1.0.0] - Previous Release
- Initial stable release