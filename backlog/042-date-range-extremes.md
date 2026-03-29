# No tests for date range extremes (pre-1970, post-2038)

**Effort:** Small (30 min)

## Problem

No tests verify behavior with dates outside the common range. JS Date supports a much wider range than Unix epoch, but edge cases exist:

- Pre-1970: negative timestamps, different timezone rules (historical IANA data)
- Post-2038: 32-bit overflow (not a JS issue, but relevant if timestamps are passed to external systems)
- JS Date limits: year 275760 max

## Fix

Add boundary sanity tests across all adapters:

- 1969-12-31 → startOf/endOf day, add 1 day → 1970-01-01
- 1900-02-28 + 1 day → 1900-03-01 (1900 is NOT a leap year)
- 2040-06-15 → basic operations work (post-2038)
- Verify adapters don't silently produce Invalid Date
