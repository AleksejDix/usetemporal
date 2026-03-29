# Period serialization — toJSON / fromJSON

**Effort:** Small (1 hour)

## Problem

Periods can't survive a JSON round-trip. `JSON.stringify` converts Dates to ISO strings, but there's no `fromJSON` to reconstruct them. This blocks:

- Persisting periods in localStorage or sessionStorage
- Sending periods over network APIs
- Storing periods in Redux/Pinia/Svelte stores that serialize state
- Server-side rendering hydration

Users must manually reconstruct: `{ start: new Date(json.start), end: new Date(json.end), type: json.type }`.

## Fix

Add `toJSON` and `fromJSON` helpers:

```ts
toJSON(period: Period): SerializedPeriod
fromJSON(json: SerializedPeriod): Period
```

- Serialize Dates as ISO strings
- Preserve `type`, `meta`, and `anchor` (backlog 037) fields
- Validate on deserialization — reject invalid dates, missing fields
- Round-trip guarantee: `fromJSON(toJSON(period))` equals original

## Affected code

- New file: `packages/minuta/src/operations/serialize.ts`
- New tests: `packages/minuta/src/operations/serialize.test.ts`
- Export from operations index

## Test cases

- Round-trip TimePeriod (all unit types)
- Round-trip PeriodSeries (stableMonth with meta)
- Round-trip custom period
- Round-trip period with anchor
- fromJSON rejects invalid/missing fields
- fromJSON rejects invalid date strings
