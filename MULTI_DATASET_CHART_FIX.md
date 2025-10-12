# Multi-Dataset Chart Rendering Fix

## Issue
When users asked questions like "Compare Tesla vs Nvidia stock prices", the system would return only text without the chart visualization, even though the agent was correctly generating multi-dataset chart data.

## Root Cause
The chart components (`LineChart`, `BarChart`, `AreaChart`) support **two data formats**:

1. **Single dataset** (array format):
```typescript
data: [
  { label: "Jan", value: 100 },
  { label: "Feb", value: 150 }
]
```

2. **Multi-dataset** (object format):
```typescript
data: {
  labels: ["Jan", "Feb", "Mar"],
  datasets: [
    { name: "Tesla", values: [100, 150, 200], color: "#ef4444" },
    { name: "Nvidia", values: [120, 180, 240], color: "#6366f1" }
  ]
}
```

However, the `component-renderer.tsx` only checked if `data` was an array:
```typescript
case "line-chart":
  if (Array.isArray(data) && data.length > 0) {
    return <LineChart data={data} config={config} />;
  }
  break;
```

This meant:
- ✅ Single dataset (array) → Rendered correctly
- ❌ Multi-dataset (object) → Failed validation and fell back to text-only

## Solution
Created a helper function `isValidChartData()` that checks for both formats:

```typescript
function isValidChartData(data: any): boolean {
  // Check for single dataset format (array)
  if (Array.isArray(data) && data.length > 0) {
    return true;
  }
  // Check for multi-dataset format (object with labels and datasets)
  if (data && typeof data === 'object' && 'labels' in data && 'datasets' in data) {
    const multiData = data as { labels: any[]; datasets: any[] };
    return Array.isArray(multiData.labels) && 
           Array.isArray(multiData.datasets) && 
           multiData.datasets.length > 0;
  }
  return false;
}
```

Updated all chart cases to use this helper:
```typescript
case "line-chart":
  if (isValidChartData(data)) {
    return <LineChart data={data} config={config} />;
  } else {
    console.warn("line-chart: Invalid data format...", data);
  }
  break;
```

## Files Changed
- `/lib/component-renderer.tsx`:
  - Added `isValidChartData()` helper function
  - Updated `line-chart`, `bar-chart`, and `area-chart` cases to use the new validation
  - Added console warnings for debugging when chart data is invalid

## Testing
To test the fix:
1. Start the dev server: `npm run dev`
2. Ask: "Compare Tesla vs Nvidia stock prices last month"
3. The response should now include both the text explanation AND the line chart visualization with both stocks plotted

## Related Components
The following components already supported multi-dataset format:
- `components/line-chart.tsx` - Lines 60-99 handle multi-dataset
- `components/bar-chart.tsx` - Lines 52-88 handle multi-dataset  
- `components/area-chart.tsx` - Lines 54-100 handle multi-dataset

The issue was purely in the renderer validation logic, not in the components themselves.

