# Adapter Migration Guide

## Overview

Starting with useTemporal v2.0.0, all adapter packages have been consolidated into the core package for better maintainability and smaller bundle sizes. The individual adapter packages are now deprecated and will be removed in v3.0.0.

## Migration Timeline

- **Now**: Deprecation warnings active in all adapter packages
- **3 months from release**: Legacy packages will be removed
- **v3.0.0**: Complete removal of legacy adapter packages

## Required Changes

### Before (Deprecated)
```typescript
// ❌ Old imports - will stop working in v3.0.0
import { createNativeAdapter } from '@usetemporal/adapter-native';
import { createDateFnsAdapter } from '@usetemporal/adapter-date-fns';
import { createLuxonAdapter } from '@usetemporal/adapter-luxon';
import { createTemporalAdapter } from '@usetemporal/adapter-temporal';
```

### After (Recommended)
```typescript
// ✅ New imports - use these instead
import { createNativeAdapter } from '@usetemporal/core/native';
import { createDateFnsAdapter } from '@usetemporal/core/date-fns';
import { createLuxonAdapter } from '@usetemporal/core/luxon';
import { createTemporalAdapter } from '@usetemporal/core/temporal';
```

## Package Mapping

| Old Package | New Import Path |
|------------|-----------------|
| `@usetemporal/adapter-native` | `@usetemporal/core/native` |
| `@usetemporal/adapter-date-fns` | `@usetemporal/core/date-fns` |
| `@usetemporal/adapter-luxon` | `@usetemporal/core/luxon` |
| `@usetemporal/adapter-temporal` | `@usetemporal/core/temporal` |

## Benefits of Migration

1. **Smaller Bundle Size**: Only import the adapter you need
2. **Faster Installation**: Fewer packages to download
3. **Simpler Dependencies**: One core package instead of multiple
4. **Better Tree-Shaking**: Modern bundlers can optimize better
5. **Easier Version Management**: Single package versioning

## Migration Steps

### 1. Update Your Imports

Find and replace all adapter imports in your codebase:

```bash
# Example using VS Code search/replace or similar tools
# Search: from '@usetemporal/adapter-native'
# Replace: from '@usetemporal/core/native'
```

### 2. Update package.json

Remove the individual adapter packages and ensure you have the core package:

```json
{
  "dependencies": {
    // Remove these
    - "@usetemporal/adapter-native": "^1.x.x",
    - "@usetemporal/adapter-date-fns": "^1.x.x",
    
    // Keep only this
    "@usetemporal/core": "^2.0.0"
  }
}
```

### 3. Run Tests

After updating imports, run your test suite to ensure everything works correctly.

### 4. Optional: Suppress Deprecation Warnings

If you need more time to migrate, you can temporarily suppress console warnings:

```typescript
// Temporary workaround - remove after migration
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0]?.includes('@usetemporal/adapter')) return;
  originalWarn(...args);
};
```

## Troubleshooting

### TypeScript Import Errors

If TypeScript can't find the new imports, try:

1. Restart your TypeScript service
2. Clear node_modules and reinstall
3. Update your tsconfig.json `moduleResolution` to "bundler" or "node16"

### Build Tool Issues

Some older build tools might have issues with subpath exports. Solutions:

1. Update to latest versions of your build tools
2. Configure your bundler to handle package.json exports field
3. For Webpack 4 users, upgrade to Webpack 5

## Need Help?

- Check our [GitHub Discussions](https://github.com/usetemporal/usetemporal/discussions)
- Report issues at [GitHub Issues](https://github.com/usetemporal/usetemporal/issues)
- See full documentation at [useTemporal Docs](https://usetemporal.dev)

## Example Migration

Here's a complete before/after example:

### Before
```typescript
// old-code.ts
import { createDateFnsAdapter } from '@usetemporal/adapter-date-fns';
import { createTemporal } from '@usetemporal/core';

const adapter = createDateFnsAdapter();
const temporal = createTemporal({ adapter });
```

### After
```typescript
// new-code.ts
import { createDateFnsAdapter } from '@usetemporal/core/date-fns';
import { createTemporal } from '@usetemporal/core';

const adapter = createDateFnsAdapter();
const temporal = createTemporal({ adapter });
```

The API remains exactly the same - only the import path changes!