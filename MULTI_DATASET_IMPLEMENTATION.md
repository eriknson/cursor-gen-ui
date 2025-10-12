# Multi-Dataset Chart Implementation

## Overview

This implementation extends the generative UI system to support multi-dataset visualizations and provides a secure foundation for dynamic component generation.

## Features Implemented

### Phase 1: Extended Chart Components

#### 1. Multi-Dataset LineChart
- **Single Dataset** (backward compatible):
  ```typescript
  data: [
    { label: "Jan", value: 100 },
    { label: "Feb", value: 150 }
  ]
  ```

- **Multi-Dataset** (new):
  ```typescript
  data: {
    labels: ["Jan", "Feb", "Mar"],
    datasets: [
      { name: "Series 1", values: [100, 120, 140], color: "#6366f1" },
      { name: "Series 2", values: [110, 130, 150], color: "#f43f5e" }
    ]
  }
  ```

- **Features**:
  - Auto-detects format
  - Shows legend for multi-dataset
  - Supports custom colors per dataset
  - Maintains backward compatibility

#### 2. Multi-Dataset BarChart
- **Grouped Mode**: Bars side-by-side for comparison
- **Stacked Mode**: Bars stacked for cumulative view
- **Config**: `grouping: "grouped" | "stacked"`

#### 3. Multi-Dataset AreaChart
- **Stacked Areas**: Perfect for showing category contributions over time
- **Transparency Control**: Automatic opacity adjustment for stacked view
- **Config**: `grouping: "stacked"`

### Phase 2: Secure Dynamic Component Generation

#### Validation System (`lib/validators.ts`)
- `validateMultiDatasetFormat()` - Validates multi-dataset structure
- `validateSingleDatasetFormat()` - Validates single dataset structure
- `sanitizeComponentCode()` - Removes dangerous patterns from generated code
- `validateComponentConfig()` - Validates component configuration
- `validateAgentResponse()` - Validates entire response object

#### Component Templates (`lib/component-templates.ts`)
Safe, reusable templates for:
- Cards and containers
- Grids and lists
- Tables and timelines
- Stats and badges
- Progress bars and alerts

#### Component Generator (`lib/component-generator.ts`)
- Secure component generation infrastructure
- Component caching system
- Template-based generation (safer than arbitrary code execution)
- Structured component descriptions

#### Error Boundary (`components/component-error-boundary.tsx`)
- Wraps dynamically generated components
- User-friendly error messages
- Development-mode error details
- Prevents entire app crashes

### Phase 3: Enhanced AI System Prompt

Updated `SYSTEM_PROMPT` in `lib/agent-wrapper.ts` with:
- Multi-dataset format documentation
- Decision tree for component selection
- When to use multi-dataset vs single dataset
- Multi-dataset examples (stock comparison, year-over-year, etc.)
- Guidance to avoid unnecessary custom generation

### Phase 4: Improved Component Renderer

Updated `lib/component-renderer.tsx`:
- Validates all responses before rendering
- Wraps dynamic components in error boundaries
- Secure code sanitization
- Clear fallback UI when dynamic generation is needed

## Usage Examples

### Multi-Line Chart (Stock Comparison)
**User Query**: "Compare Tesla vs Apple stock prices"

```json
{
  "componentType": "line-chart",
  "config": {
    "variant": "smooth",
    "showLegend": true
  },
  "data": {
    "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "datasets": [
      {
        "name": "TSLA",
        "values": [250, 252, 248, 255, 258],
        "color": "#ef4444"
      },
      {
        "name": "AAPL",
        "values": [180, 182, 181, 183, 185],
        "color": "#6366f1"
      }
    ]
  },
  "textResponse": "comparison of tesla and apple stock prices this week"
}
```

### Grouped Bar Chart (Year-over-Year)
**User Query**: "Show quarterly revenue for 2023 vs 2024"

```json
{
  "componentType": "bar-chart",
  "config": {
    "grouping": "grouped",
    "showLegend": true
  },
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "datasets": [
      {
        "name": "2023",
        "values": [125000, 142000, 138000, 165000]
      },
      {
        "name": "2024",
        "values": [138000, 156000, 152000, 182000]
      }
    ]
  },
  "textResponse": "quarterly revenue comparison showing year-over-year growth"
}
```

### Stacked Area Chart
**User Query**: "Show sales breakdown by category over time"

```json
{
  "componentType": "area-chart",
  "config": {
    "grouping": "stacked",
    "showLegend": true
  },
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr"],
    "datasets": [
      {
        "name": "Electronics",
        "values": [120, 130, 125, 140]
      },
      {
        "name": "Clothing",
        "values": [80, 85, 90, 95]
      },
      {
        "name": "Food",
        "values": [60, 65, 70, 75]
      }
    ]
  },
  "textResponse": "sales breakdown by category showing growth trends"
}
```

## Testing Queries

Try these queries to test the new multi-dataset functionality:

1. **Multi-Line Comparison**:
   - "Compare Tesla and Apple stock prices"
   - "Show temperature and humidity over the week"
   - "Plot revenue vs expenses over the year"

2. **Grouped Bars**:
   - "Show sales by quarter for 2023 and 2024"
   - "Compare product sales across regions"
   - "Display before and after metrics"

3. **Stacked Areas**:
   - "Show cumulative sales by category"
   - "Display resource allocation over time"
   - "Show traffic sources breakdown"

4. **Backward Compatibility** (should still work):
   - "Show Tesla stock price last week"
   - "Display monthly revenue"
   - "Show top 5 products by sales"

## Security Considerations

### What Changed
- **Before**: Used `Function` constructor to execute arbitrary code
- **After**: 
  - Validates and sanitizes all code
  - Blocks dangerous patterns (eval, setTimeout, fetch, etc.)
  - Provides informative fallback UI instead of executing unsafe code
  - Recommends using extended chart components instead

### Why This Is Safer
1. **No Arbitrary Code Execution**: Dynamic components are intentionally limited
2. **Input Validation**: All data structures are validated before rendering
3. **Error Boundaries**: Component errors don't crash the app
4. **Sanitization**: Dangerous patterns are blocked
5. **Template-Based**: Safe, pre-defined templates instead of arbitrary code

## Configuration Options

### New Config Properties
- `multiDataset?: boolean` - Flag for multi-dataset charts
- `grouping?: 'grouped' | 'stacked'` - For bar/area charts
- `showLegend?: boolean` - Control legend visibility (auto-shown for multi-dataset)

### Existing Properties (Still Supported)
- `colors?: string[]` - Chart colors
- `variant?: string` - Chart variant
- `theme?: 'default' | 'vibrant' | 'minimal' | 'dark'` - Visual theme
- `showPoints?: boolean` - For line charts
- `showGrid?: boolean` - Grid visibility

## Architecture

```
User Query → AI (SYSTEM_PROMPT with multi-dataset guidance)
    ↓
AgentResponse (validated)
    ↓
Component Renderer (auto-detects format)
    ↓
Chart Component (handles both formats)
    ↓
Rendered UI (with error boundary)
```

## Benefits

1. **More Powerful**: Can handle complex multi-series comparisons
2. **Backward Compatible**: All existing queries still work
3. **Secure**: No arbitrary code execution
4. **User-Friendly**: Clear error messages and fallbacks
5. **Maintainable**: Centralized validation and error handling
6. **Flexible**: Easy to add more dataset types

## Future Enhancements

Potential improvements for future iterations:
1. More chart types (scatter, radar, bubble)
2. Interactive chart features (zoom, pan, drill-down)
3. Data transformation utilities
4. Export chart data
5. Animation controls
6. Theme customization

