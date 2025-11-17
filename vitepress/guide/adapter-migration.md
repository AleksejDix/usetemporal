# Adapter Migration Guide

This guide helps you migrate from the old separate adapter packages to the new consolidated structure in v2.1.0.

## Why the Change?

We've consolidated all adapters into the core package for several important benefits:

1. **Better Tree-shaking**: Only bundle the adapter you actually use
2. **Accurate Coverage**: Adapters now show real test coverage (80-90% vs 0%)
3. **Simplified Imports**: Cleaner, more intuitive import paths
4. **Smaller Bundles**: Reduced package overhead and duplication
5. **Better DX**: Everything in one place with TypeScript support

## Migration Steps

### Step 1: Update Your Dependencies

Remove the old adapter packages and ensure you have the latest core:

```bash
# Remove old packages (if you had separate adapter packages)
npm uninstall @usetemporal/adapter-native
npm uninstall @usetemporal/adapter-temporal
npm uninstall @usetemporal/adapter-luxon
npm uninstall @usetemporal/adapter-date-fns

# Install latest version
npm install @allystudio/usetemporal@latest
```

### Step 2: Update Your Imports

#### Native Adapter

```typescript
// Old (deprecated)
import { createNativeAdapter } from '@allystudio/usetemporal/native'

// New (recommended)
import { createNativeAdapter } from '@allystudio/usetemporal/native'
```

#### Temporal Adapter

```typescript
// Old (deprecated)
import { createTemporalAdapter } from '@usetemporal/adapter-temporal'

// New (recommended)
import { createTemporalAdapter } from '@allystudio/usetemporal/temporal'
// Note: Polyfill still loads automatically
```

#### Luxon Adapter

```typescript
// Old (deprecated)
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon'

// New (recommended)
import { createLuxonAdapter } from '@allystudio/usetemporal/luxon'
// Note: You still need to install luxon separately
```

#### Date-fns Adapter

```typescript
// Old (deprecated)
import { createDateFnsAdapter } from '@allystudio/usetemporal/date-fns'

// New (recommended)
import { createDateFnsAdapter } from '@allystudio/usetemporal/date-fns'
// Note: You still need to install date-fns separately
```

### Step 3: Update Your Build Configuration (Optional)

If you have specific build configurations for the old adapter packages, you can remove them. The new structure handles everything automatically.

### Step 4: Verify Tree-shaking

Build your application and check the bundle size. You should see improvements:

```bash
# Example bundle analysis
npm run build
npm run analyze
```

Each adapter adds only ~1KB to your bundle when imported.

## Compatibility Mode

During the transition period, the old adapter packages still work as re-export facades:

```typescript
// This still works but shows a deprecation warning
import { createNativeAdapter } from '@allystudio/usetemporal/native'
```

You'll see a console warning:
```
[@usetemporal/adapter-native] DEPRECATED: This package has been moved to @allystudio/usetemporal/native.
Please update your imports to use '@allystudio/usetemporal/native' instead.
```

## Common Issues

### Issue: TypeScript Can't Find Types

Make sure you're using the latest version of @allystudio/usetemporal:

```json
{
  "dependencies": {
    "@allystudio/usetemporal": "^2.1.0"
  }
}
```

### Issue: Peer Dependency Warnings

The adapters that require external libraries (Luxon, date-fns) now list them as optional dependencies. Install them if you use those adapters:

```bash
# For Luxon adapter
npm install luxon

# For date-fns adapter
npm install date-fns
```

### Issue: Build Errors

Clear your build cache and node_modules:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Timeline

- **v2.1.0**: New import paths available, old packages deprecated
- **v3.0.0**: Old adapter packages will be removed (planned for 2025 Q3)

## Need Help?

- Check the [API documentation](/api) for detailed usage
- See [examples](/examples) for working code
- Open an issue on [GitHub](https://github.com/usetemporal/usetemporal) for support

## Summary

The migration is straightforward:

1. Update your imports to use `@allystudio/usetemporal/[adapter-name]`
2. Remove old adapter packages from dependencies
3. Enjoy better tree-shaking and accurate coverage metrics

The new structure makes useTemporal more efficient and easier to use while maintaining full backward compatibility during the transition period.