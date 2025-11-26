# @usetemporal-examples/react

Interactive React demo showcasing how to pair `@allystudio/usetemporal-react`
with the core divide() operations. The calendar highlights:

- `useTemporal` + `usePeriod` coordination
- Derived navigation (next/previous) that keeps browsing state in sync
- Adapter reactivity via a week-start toggle
- `divide()` chains for month → week → day rendering

## Getting started

```bash
cd examples/react
npm install
npm run dev
```

- `npm run dev` – Vite dev server with Fast Refresh
- `npm run build` – Type-checks then builds the production bundle
- `npm run preview` – Serves the build output locally
- `npm run lint` – ESLint (flat config)

## Project structure

```
examples/react/
├── src/
│   ├── components/
│   │   ├── Calendar.tsx
│   │   ├── NavigationControls.tsx
│   │   ├── PeriodDisplay.tsx
│   │   └── WeekStartToggle.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Features demonstrated

- **Reactive adapters** – `WeekStartToggle` flips between Sunday/Monday while
  `useMemo` recreates the adapter so browsing + derived periods recalc
- **Derived navigation** – `NavigationControls` passes the active month to
  `temporal.previous/next`, mirroring the Vue behavior
- **divide() pattern** – Calendar rows come from `temporal.divide(month, "week")`
  and each week divides into its days for rendering
- **Educational comments** – Components call out the patterns most teams should
  follow when wiring useTemporal into React apps

For more details visit [usetemporal.vercel.app](https://usetemporal.vercel.app).
