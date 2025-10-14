# Component Sync Guide

## Problem: "X is not defined" Runtime Errors

### Root Cause
The error "Separator is not defined" (and similar errors) occurred due to a **mismatch between three critical files**:

1. **`lib/component-registry.ts`** - Lists components available to the AI
2. **`lib/dynamic-renderer.tsx`** - Actually imports and provides components at runtime
3. **`lib/component-validators.ts`** - Validates generated code

When these files are out of sync, the AI can generate code using components that don't exist in the runtime scope, causing "X is not defined" errors.

## Solution Implemented

### 1. Fixed the Immediate Issue
- ✅ Added `Separator` import to `dynamic-renderer.tsx`
- ✅ Added `Separator` to the runtime scope object
- ✅ Added `Separator` to `COMPONENT_SCOPE` in `component-registry.ts`
- ✅ Removed outdated warning about Separator in `component-validators.ts`
- ✅ Removed `ChartConfig` from COMPONENT_SCOPE (it's a type, not a component)

### 2. Added Automatic Validation
Created `validateComponentScope()` function in `component-validators.ts` that:
- Extracts all JSX components used in generated code
- Checks if each component exists in `COMPONENT_SCOPE`
- Blocks code generation if undefined components are detected
- Provides clear error messages with fix instructions

This validation runs during the agent orchestration phase (in `agent-wrapper.ts`) **before** code is sent to the renderer.

### 3. Created Sync Verification Script
Created `scripts/validate-component-sync.ts` that:
- Parses `COMPONENT_SCOPE` from `component-registry.ts`
- Parses the scope object from `dynamic-renderer.tsx`
- Compares them to detect mismatches
- Runs as `npm run validate:components`
- Can be integrated into CI/CD pipeline

## How to Prevent Future Errors

### When Adding a New Component

**✅ DO THIS (3 places):**

1. **Import in `dynamic-renderer.tsx`:**
   ```tsx
   import { NewComponent } from '@/components/ui/new-component';
   ```

2. **Add to scope object in `dynamic-renderer.tsx`:**
   ```tsx
   const scope = {
     // ... other components
     NewComponent,
   };
   ```

3. **Add to `COMPONENT_SCOPE` in `component-registry.ts`:**
   ```tsx
   shadcn: [
     // ... other components
     'NewComponent',
   ],
   ```

4. **Verify sync:**
   ```bash
   npm run validate:components
   ```

### Component Categories

In `component-registry.ts`, organize components by category:

- **`react`**: React hooks (`useState`, `useMemo`, etc.)
- **`shadcn`**: Shadcn UI components (`Card`, `Button`, etc.)
- **`charts`**: Recharts components (`LineChart`, `BarChart`, etc.)
- **`other`**: Utilities (`Icons`, `motion`, `cn`, `NumberFlow`)

⚠️ **Note**: Only add actual components/functions, not TypeScript types (like `ChartConfig`).

### Validation Layers

The system now has **4 layers of protection**:

1. **Component Registry** - Tells AI what components are available
2. **Automatic Validation** - Blocks code with undefined components before rendering
3. **Manual Validation Script** - Checks sync between registry and renderer
4. **Runtime Error Boundary** - Catches any errors that slip through (fallback)

## Testing the Fix

After adding a new component, test that it works:

```bash
# 1. Verify sync
npm run validate:components

# 2. Start dev server
npm run dev

# 3. Test in UI by asking the AI to use the new component
# Example: "Show me a card with a separator"
```

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Validate Component Sync
  run: npm run validate:components
```

This ensures no PRs are merged with component sync issues.

## Common Issues

### Issue: "Component X is not available in runtime scope"

**Solution:**
1. Add import to `dynamic-renderer.tsx`
2. Add to scope object in `dynamic-renderer.tsx`
3. Verify with `npm run validate:components`

### Issue: Validation script reports false positive

**Solution:**
Check if the component is:
- A TypeScript type (should not be in COMPONENT_SCOPE)
- Using a different name in import vs scope object
- Properly formatted in the scope object (check comma/colon)

### Issue: "Function/Component 'High/Low/Max/Min' is not available in runtime scope"

**What happened:**
The validator was catching capitalized variable names like `High`, `Low`, `Max`, `Min` which are common in data/chart contexts (e.g., stock prices, temperature ranges).

**Solution:**
The validator has been improved to skip common data variable patterns. It now:
- Skips common data variables (`High`, `Low`, `Open`, `Close`, `Max`, `Min`, etc.)
- Ignores property access patterns (e.g., `data.High()`)
- Only flags functions that look like actual React components (> 15 chars or contain "component")

If you still see these errors, it means the AI is trying to use non-existent components. Check the generated code to see if it's a legitimate component or just a data variable.

### Issue: Component works locally but fails in production

**Solution:**
1. Check if component is tree-shaken in production build
2. Ensure component is in `dependencies`, not `devDependencies`
3. Check Next.js build output for warnings

## Architecture Notes

### Why Three Files?

1. **`component-registry.ts`** - Single source of truth for AI prompts
   - Used by AI to know what components exist
   - Easy to document and explain to the AI

2. **`dynamic-renderer.tsx`** - Runtime execution environment
   - Actually imports and provides components via scope
   - Uses `new Function()` to execute generated code safely

3. **`component-validators.ts`** - Code safety and validation
   - Checks structure, safety, style, and component availability
   - Prevents invalid code from reaching the renderer

### Security Considerations

The validation also prevents:
- XSS attacks (`dangerouslySetInnerHTML`)
- Code injection (`eval`, `Function()` in generated code)
- Side effects (`useEffect`, `fetch`, `localStorage`)
- DOM access (`window.*`, `document.*`)

## Future Improvements

- [ ] Auto-sync script that updates component-registry.ts from dynamic-renderer.tsx imports
- [ ] Visual dashboard showing which components are most used
- [ ] Automatic detection of new shadcn components added to the project
- [ ] Component usage analytics to identify unused components

## References

- Original issue: "Separator is not defined" error
- Fixed in: PR #XXX (update with actual PR number)
- Related docs: `DYNAMIC_UI_IMPLEMENTATION.md`, `IMPLEMENTATION_SUMMARY.md`

