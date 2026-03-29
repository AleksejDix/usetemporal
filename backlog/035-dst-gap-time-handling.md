# No handling for gap times during spring forward

**Effort:** Medium (1-2 hours)

## Problem

During spring forward, a time gap appears (e.g., 2:00–3:00 AM doesn't exist). If a user creates a period starting at 2:30 AM on a spring-forward day, behavior is undefined. This affects:

- Period creation with start/end times inside the gap
- divide producing slots that include the gap
- Adapter consistency — JS Date silently adjusts, Luxon may throw or adjust differently

## Fix

Define behavior for gap times (adjust forward, adjust backward, or error). Add tests with times inside the gap (e.g., 2:30 AM on March 10 2024 in America/New_York). Verify all adapters produce consistent results.
