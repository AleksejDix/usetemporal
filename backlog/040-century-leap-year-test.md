# No test for century leap year rule (2100)

**Effort:** Small (15 min)

## Problem

2100 is NOT a leap year (divisible by 100 but not 400). JS Date handles this correctly, but there is no explicit test. If any adapter has custom leap year logic, it could get this wrong silently.

## Fix

Add a quick sanity test to adapter compliance:

- Feb 28, 2100 + 1 day → Mar 1, 2100 (not Feb 29)
- endOf February 2100 → Feb 28
- Feb 29, 2096 + 4 years → Feb 28, 2100 (clamped, not Feb 29)
- Contrast with 2000 which IS a leap year (divisible by 400)
