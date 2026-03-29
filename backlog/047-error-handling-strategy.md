# Consistent error handling strategy

**Effort:** Medium (2 hours)

## Problem

Error handling is inconsistent across operations:

- `divide`, `merge`, `validatePeriod` — throw on invalid input
- `contains`, `isSame`, `go`, `next`, `previous`, `split` — silently accept invalid periods
- No documented contract for when operations throw vs return gracefully

This means invalid periods can propagate silently through a chain of operations until something breaks far from the source.

## Fix

Define and document a clear strategy:

**Option A: Validate at boundaries only (current, but document it)**

- `derivePeriod` and `divide` validate — they're entry points
- Everything else assumes valid input — document this
- Add a `validatePeriod` export so users can check manually

**Option B: Validate everywhere**

- All operations call `validatePeriod` on input
- Consistent but adds overhead

Recommendation: **Option A** — validate at creation, trust internally. But:

- Document which operations validate and which don't
- Ensure `derivePeriod` always produces valid periods (it does)
- Add TypeScript branded types or runtime validation at adapter boundaries

## Affected code

- `packages/minuta/src/types.ts` — document validation contract
- Operations that should validate: any that accept raw Dates from users
- Operations that can skip: any that only accept Period (already validated)
