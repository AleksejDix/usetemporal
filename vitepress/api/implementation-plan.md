# API Documentation Implementation Plan

## Current Status

### ✅ Already Exists
- `/api/index.md` - Main API overview
- `/api/operations/index.md` - Operations overview
- `/api/operations/divide.md` - divide operation
- `/api/operations/navigation.md` - Navigation operations (needs split)
- `/api/operations/comparison.md` - Comparison operations (needs split)

### 🚧 Needs Creation

#### Operations - Time Division (2 pages)
1. `split.md` - Advanced splitting with options
2. `merge.md` - Merge periods into larger units

#### Operations - Navigation (3 pages)
1. `next.md` - Navigate to next period
2. `previous.md` - Navigate to previous period
3. `go.md` - Navigate by steps

#### Operations - Comparison (2 pages)
1. `is-same.md` - Check period equality
2. `contains.md` - Check containment


#### Utilities (optional)
1. `is-weekend.md`
2. `is-weekday.md`
3. `is-today.md`

## Implementation Order

### Phase 1: Core Operations
1. Split existing navigation.md into next, previous, go
2. Split existing comparison.md into is-same, contains
3. Split existing zooming.md into zoom-in, zoom-out, zoom-to
4. Create split.md and merge.md

### Phase 2: Utilities (Optional)
1. is-weekend.md
2. is-weekday.md
3. is-today.md

## Template for Each Page

```markdown
# {Function Name}

{Brief description of what the function does}

## Signature

```typescript
{Function signature with types}
```

## Parameters

- `param1` - {Type} - {Description}
- `param2` - {Type} - {Description}

## Returns

{Type} - {Description of return value}

## Examples

### Basic Usage

```typescript
{Basic example}
```

### Advanced Usage

```typescript
{More complex example}
```

## Edge Cases

- {Edge case 1}
- {Edge case 2}

## See Also

- [{Related Function}]({link})
- [{Related Concept}]({link})
```
