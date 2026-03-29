# Week 53 / ISO week year edge cases untested

**Effort:** Small (30 min)

## Problem

Dec 29-31 can belong to week 1 of the next year in ISO week numbering. The stable year grid expects 52-53 weeks but there are no tests verifying correct week assignment at year boundaries.

Examples:

- Dec 31, 2024 (Tuesday) — ISO week 1 of 2025
- Dec 29, 2025 (Monday) — ISO week 1 of 2026
- Jan 1, 2025 (Wednesday) — ISO week 1 of 2025

## Fix

Add tests that:

- Verify Dec 29-31 dates are placed in the correct week across all adapters
- Verify stableYear grid includes/excludes these days correctly depending on week numbering
- Test with both Monday and Sunday week starts
