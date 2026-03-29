# Half-hour / 45-min timezone offsets not tested in adapters

**Effort:** Medium (1 hour)

## Problem

The OffsetsEvidence.vue slide showcases all 39 real-world UTC offsets including fractional ones, but no adapter compliance tests run against these timezones. Operations like startOf/endOf day, divide into hours, and add could behave incorrectly with non-whole-hour offsets.

Affected offsets:

- India +5:30 (Asia/Kolkata)
- Nepal +5:45 (Asia/Kathmandu)
- Chatham Islands +12:45 (Pacific/Chatham)
- Lord Howe +10:30 with 30-min DST (Australia/Lord_Howe)

## Fix

Add adapter compliance tests for date-fns-tz and luxon adapters using at least Asia/Kolkata (+5:30) and Asia/Kathmandu (+5:45). Verify:

- startOf/endOf day produces correct boundaries
- divide day into hours gives correct count (24)
- add 1 day preserves wall-clock time
