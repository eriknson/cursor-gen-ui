# Defensive Coding Fixes

## Issue
Runtime error: `TypeError: Cannot convert undefined or null to object` when widget data was missing or incomplete.

## Root Cause
Widget components were directly accessing nested properties without checking if parent objects existed, causing crashes when LLM generated incomplete or malformed widget JSON.

## Fixes Applied

### 1. Widget Renderer (`lib/widget-renderer.tsx`)
Added validation before passing data to components:

```typescript
case 'metric-card':
  if (!widget.data) return <ErrorWidget message="Metric card requires data" />;
  return <MetricCard data={widget.data} ... />;

case 'metric-grid':
  if (!widget.data?.metrics) return <ErrorWidget message="Metric grid requires metrics data" />;
  return <MetricGrid data={widget.data} ... />;

case 'list':
  if (!widget.data?.items) return <ErrorWidget message="List requires items data" />;
  return <ListWidget data={widget.data} ... />;

case 'comparison':
  if (!widget.data?.options) return <ErrorWidget message="Comparison requires options data" />;
  return <ComparisonWidget data={widget.data} ... />;

case 'form':
  if (!widget.data?.fields) return <ErrorWidget message="Form requires fields data" />;
  return <FormWidget data={widget.data} ... />;

case 'container':
  if (!widget.config?.variant) return <ErrorWidget message="Container requires variant config" />;
  if (!Array.isArray(widget.children) || widget.children.length === 0) {
    return <ErrorWidget message="Container requires children widgets" />;
  }
  return <ContainerWidget ... />;
```

### 2. Comparison Widget (`components/widgets/comparison-widget.tsx`)
Protected all array/object operations:

```typescript
// Before: data.options.flatMap(...)
// After:
const allFeatures = Array.from(
  new Set((data.options || []).flatMap(opt => Object.keys(opt?.features || {})))
);

// Before: data.options.map(...)
// After:
{(data.options || []).map((option, index) => ...)}

// Before: Object.entries(option.features).map(...)
// After:
{Object.entries(option.features || {}).map(([key, value]) => ...)}

// Before: option.features[feature]
// After:
{renderValue(option.features?.[feature] ?? '-')}
```

### 3. List Widget (`components/widgets/list-widget.tsx`)
Protected array operations:

```typescript
// Before: let items = [...data.items];
// After:
let items = [...(data.items || [])];
```

### 4. Metric Grid (`components/widgets/metric-card.tsx`)
Protected metrics array:

```typescript
// Before: {data.metrics.map(...)}
// After:
{(data.metrics || []).map((metric, index) => ...)}
```

### 5. Form Widget (`components/widgets/form-widget.tsx`)
Protected fields array:

```typescript
// Before: data.fields.forEach(...)
// After:
(data.fields || []).forEach(field => ...)

// Before: {data.fields.map(...)}
// After:
{(data.fields || []).map(field => ...)}
```

### 6. Container Widget (`components/widgets/container-widget.tsx`)
Protected children array in all variants:

```typescript
// Before: {children.map(...)}
// After:
{(children || []).map((child, index) => ...)}
```

## Defensive Coding Pattern

### General Rule
Always wrap array/object operations with null checks:

```typescript
// ❌ BAD - Can crash
array.map(...)
Object.keys(obj)
Object.entries(obj)
obj.property.nested

// ✅ GOOD - Safe
(array || []).map(...)
Object.keys(obj || {})
Object.entries(obj || {})
obj?.property?.nested
```

### For Widget Data
Always validate required data before rendering:

```typescript
if (!widget.data?.requiredField) {
  return <ErrorWidget message="Widget requires field" />;
}
```

### For Arrays
Always provide empty array fallback:

```typescript
{(items || []).map(item => ...)}
```

### For Objects
Always provide empty object fallback:

```typescript
Object.keys(data || {})
Object.entries(config || {})
```

### For Optional Chaining
Use optional chaining for nested properties:

```typescript
option.features?.[feature] ?? '-'
widget.data?.events
```

## Benefits

1. **No Runtime Crashes**: Widgets gracefully handle missing/incomplete data
2. **Better Error Messages**: Users see helpful "X requires Y" instead of cryptic errors
3. **More Reliable**: System continues working even when LLM generates imperfect JSON
4. **Better UX**: Errors are caught and displayed, not crashing the entire app

## Testing

Test these edge cases:
- Empty arrays: `{ items: [] }`
- Missing properties: `{ data: {} }` (no items/metrics/options)
- Null/undefined: `{ data: null }` or `{ data: undefined }`
- Deeply nested missing: `{ data: { options: [{ features: null }] } }`

All should now show helpful error messages instead of crashing.

## Prevention

Going forward, when creating new widgets:
1. ✅ Always check required data exists before using it
2. ✅ Wrap all `.map()` with `(array || [])`
3. ✅ Wrap all `Object.keys/entries/values` with `(obj || {})`
4. ✅ Use optional chaining `?.` for nested access
5. ✅ Provide fallback values with `??` operator
6. ✅ Return `<ErrorWidget>` for missing required data

## Related Files

- `lib/widget-renderer.tsx` - Validation layer
- `components/widgets/comparison-widget.tsx` - Array/object safety
- `components/widgets/list-widget.tsx` - Array safety
- `components/widgets/metric-card.tsx` - Array safety
- `components/widgets/form-widget.tsx` - Array safety
- `components/widgets/container-widget.tsx` - Array safety

