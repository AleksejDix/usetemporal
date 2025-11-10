# Sprint Kickoff: Adapter Consolidation Sprint - July 2025

## 🎯 Sprint Mission
Transform the useTemporal developer experience by consolidating all adapters into the core package, delivering cleaner imports, better tree-shaking, and improved reliability.

## 🚀 Why This Sprint Matters

### For Our Users:
- **Simpler Setup**: One package install instead of multiple
- **Smaller Bundles**: Better tree-shaking means only pay for what you use
- **Better DX**: Intuitive imports that just make sense
- **More Reliable**: Actually see test coverage for adapters

### For Maintainers:
- **Easier to Maintain**: All adapter code in one place
- **Better Testing**: Coverage metrics that reflect reality
- **Faster Builds**: Simplified monorepo structure

## 📋 Sprint Scope - 8 Stories, 3 Days

### Day 1 (Friday) - Foundation & Quick Wins
1. **Morning**: Create the new adapter structure (006.01)
2. **Afternoon**: Migrate Native & Temporal adapters (006.02, 006.03)

### Day 2 (Monday) - Complete Migration
3. **Morning**: Migrate Luxon & Date-fns adapters (006.04, 006.05)
4. **Afternoon**: Configure entry points for clean imports (006.06)

### Day 3 (Tuesday) - Polish & Ship
5. **Morning**: Update all tests and imports (006.07)
6. **Afternoon**: Update documentation with migration guide (006.09)

## 🎁 What Users Get

### Before (Current Pain):
```bash
npm install @usetemporal/core @usetemporal/adapter-native @usetemporal/adapter-temporal
```
```typescript
import { createTemporal } from '@usetemporal/core'
import { createNativeAdapter } from '@usetemporal/adapter-native'
// Coverage shows 0% for adapters 😢
```

### After (New Joy):
```bash
npm install @usetemporal/core  # That's it!
```
```typescript
import { createTemporal } from '@usetemporal/core'
import { createNativeAdapter } from '@usetemporal/core/native'
// Coverage shows real 85%+ 🎉
```

## ⚡ Quick Start Guide

### First Task - Create Structure (006.01)
```bash
# Create the new structure
mkdir -p packages/core/src/adapters/{native,temporal,luxon,date-fns}

# Each adapter needs:
# - adapter.ts (main implementation)
# - index.ts (exports)
# - units/ (unit handlers)
```

### Key Principles
1. **Backward Compatibility**: Old imports must still work
2. **Tree-Shaking First**: Each adapter in its own entry point
3. **Type Safety**: Full TypeScript support at every entry
4. **Test Everything**: Every change needs test verification

## 🛡️ Risk Management

| Risk | Mitigation |
|------|------------|
| Breaking existing apps | Keep old packages as facades during transition |
| Complex build issues | Test in both Node.js and browser environments |
| User confusion | Comprehensive migration guide with examples |
| Coverage not improving | Verify imports use source files, not dist |

## 📊 Definition of Success

✅ All adapters in core package  
✅ Tree-shaking reduces bundle by 20%+  
✅ Coverage shows real percentages  
✅ Zero breaking changes  
✅ Migration guide published  
✅ All tests passing  

## 🔥 Day 1 Action Items

1. **Pull latest** and create feature branch
2. **Start with Story 006.01** - Create the directory structure
3. **Test continuously** - Run tests after each migration
4. **Document decisions** - Note any important choices

## 💡 Pro Tips

- Start with Native adapter - it's the simplest
- Temporal adapter needs special attention for polyfill
- Test tree-shaking with a real build after each adapter
- Keep the migration guide updated as you learn

## 📢 Communication

- Update story status as you progress
- Flag any blockers immediately
- Share bundle size improvements
- Celebrate each successful migration!

---

Let's deliver a massive DX improvement to our users! This architectural change will make useTemporal more attractive, easier to use, and more maintainable. 

**Remember**: Every import we simplify is a developer smile we create! 😊