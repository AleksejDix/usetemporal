# DST tests only cover US transition dates

**Effort:** Small (30 min)

## Problem

All DST tests use US spring forward (March 10 2024). No coverage for:

- EU transitions (last Sunday of March / October)
- Southern Hemisphere (Australia, Brazil — opposite DST direction)
- Regions with no DST (Asia/Tokyo, UTC)
- Regions with non-1-hour offsets (Lord Howe Island +30 min DST)

## Fix

Extend DST test suite with parameterized timezone/date combinations. At minimum add Europe/London (March 31 / October 27 2024) and Australia/Sydney (April 7 / October 6 2024). Verify divide hour counts match expected values per timezone.
