# isSame has minimal test coverage

**Effort:** Low (20 min)

## Problem

Only basic same-year and same-month comparisons are tested. Missing:

- Cross-unit: `isSame(day1, day2, "week")` — same week?
- Cross-unit: `isSame(hour1, hour2, "day")` — same day?
- Boundary: Dec 31 vs Jan 1 with `isSame(..., "year")` — false
- Boundary: last day of month vs first day of next with `isSame(..., "month")`
- Different period types: `isSame(month, week, "quarter")`
- Custom periods: `isSame(custom1, custom2, "custom")`
