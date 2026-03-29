# Periods spanning multiple DST transitions untested

**Effort:** Medium (1 hour)

## Problem

A 6-month period (e.g., January–June or March–November) spans both spring forward and fall back. No tests verify that divide, contains, or isOverlapping behave correctly across both transitions within a single period.

## Fix

Add tests using date-fns-tz adapter with America/New_York:

- Divide Jan 1 – Dec 31, 2024 into months — verify all 12 present
- Divide Mar 1 – Nov 30, 2024 into days — verify correct total (spring forward = 23h day, fall back = 25h day)
- Divide Mar 1 – Nov 30, 2024 into hours — verify total accounts for DST
- contains for a date during spring forward gap
- contains for a date during fall back ambiguous hour
