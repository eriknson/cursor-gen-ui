# Legacy Code Generation System

This folder contains the old code generation system that was replaced with the widget-based approach.

## What was removed

The old system attempted to generate React code dynamically, which was unreliable due to:
- Complex validation logic (7 different validators)
- Runtime code execution with Babel transforms
- Multiple retry loops for different failure modes
- Fragile code extraction from LLM responses
- CSS validation and safety transformations

## New system

The new widget-based system generates structured JSON instead of code:
- Single Zod schema validator
- No runtime code execution
- No retry logic needed
- Simple JSON parsing
- Pre-built, tested widget components

## Files archived here

- `agent-wrapper-legacy.ts` - Old agent orchestration with code generation
- `component-validators.ts` - 7 validators for code validation
- `dynamic-renderer.tsx` - Babel-based runtime code execution
- `css-validator.ts` - CSS safety validation
- `component-templates.ts` - Code generation templates
- `component-renderer.tsx` - Old component rendering logic
- `component-registry.ts` - Old component scope management
- `component-error-boundary.tsx` - Error boundary for dynamic components

## Migration date

December 2024

## Can we bring this back?

If needed for edge cases, the code generation system could be added back as a fallback. However, the widget system should handle 95%+ of use cases more reliably.

