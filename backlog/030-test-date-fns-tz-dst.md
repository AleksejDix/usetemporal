# date-fns-tz adapter has no DST tests

**Effort:** Medium (1 hour)

## Problem

The entire point of the timezone adapter is handling DST correctly, but there are no tests for:

- Spring forward: divide a day that loses an hour (23 hours)
- Fall back: divide a day that gains an hour (25 hours)
- go() across DST boundary
- derive/divide in America/New_York vs UTC for the same instant
- Periods spanning DST transition

## Fix

Add DST-specific multi-adapter tests using known transition dates (e.g., US spring forward March 2024, fall back November 2024).
