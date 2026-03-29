# Fall-back (25-hour day) DST tests missing

**Effort:** Medium (1 hour)

## Problem

Existing DST tests only cover spring forward (23-hour day, March US). No tests verify fall-back behavior where clocks repeat an hour:

- divide a day into hours on November 3, 2024 (US fall back) — expect 25 hours
- add 1 day across fall-back boundary preserves wall-clock time
- go() navigation across fall-back boundary
- EU fall back (last Sunday of October) coverage

## Fix

Add fall-back tests across all adapters (native, date-fns-tz, luxon, temporal). Use known transition dates: US November 3 2024, EU October 27 2024.
