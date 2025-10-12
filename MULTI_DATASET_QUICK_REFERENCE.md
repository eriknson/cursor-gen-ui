# Multi-Dataset Charts - Quick Reference

## 🚀 Quick Start

### Single Dataset (Backward Compatible)
```typescript
{
  "componentType": "line-chart",
  "data": [
    { "label": "Jan", "value": 100 },
    { "label": "Feb", "value": 120 }
  ]
}
```

### Multi-Dataset (New!)
```typescript
{
  "componentType": "line-chart",
  "data": {
    "labels": ["Jan", "Feb"],
    "datasets": [
      { "name": "Series 1", "values": [100, 120] },
      { "name": "Series 2", "values": [110, 130] }
    ]
  }
}
```

## 📊 Chart Types

### Line Chart
**Single Dataset:**
```json
{
  "componentType": "line-chart",
  "data": [{"label": "A", "value": 10}]
}
```

**Multi-Dataset:**
```json
{
  "componentType": "line-chart",
  "data": {
    "labels": ["A", "B"],
    "datasets": [
      {"name": "Series 1", "values": [10, 20]},
      {"name": "Series 2", "values": [15, 25]}
    ]
  }
}
```

### Bar Chart
**Grouped:**
```json
{
  "componentType": "bar-chart",
  "config": {"grouping": "grouped"},
  "data": {
    "labels": ["Q1", "Q2"],
    "datasets": [
      {"name": "2023", "values": [100, 120]},
      {"name": "2024", "values": [110, 130]}
    ]
  }
}
```

**Stacked:**
```json
{
  "componentType": "bar-chart",
  "config": {"grouping": "stacked"},
  "data": {
    "labels": ["North", "South"],
    "datasets": [
      {"name": "Product A", "values": [100, 120]},
      {"name": "Product B", "values": [80, 90]}
    ]
  }
}
```

### Area Chart
**Stacked:**
```json
{
  "componentType": "area-chart",
  "config": {"grouping": "stacked"},
  "data": {
    "labels": ["Jan", "Feb"],
    "datasets": [
      {"name": "Category A", "values": [100, 120]},
      {"name": "Category B", "values": [80, 90]}
    ]
  }
}
```

## ⚙️ Configuration Options

### Common Config
```typescript
{
  "colors": ["#6366f1", "#f43f5e"],  // Optional: custom colors
  "theme": "default" | "vibrant" | "minimal" | "dark",
  "showLegend": true,  // Auto-shown for multi-dataset
  "variant": "smooth" | "linear" | "stepped"  // Line charts only
}
```

### Bar/Area Specific
```typescript
{
  "grouping": "grouped" | "stacked"  // Multi-dataset only
}
```

## 🎨 Color Defaults

If you don't specify colors, these are used in order:
```typescript
[
  "#6366f1",  // Blue
  "#f43f5e",  // Red
  "#10b981",  // Green
  "#f59e0b",  // Orange
  "#8b5cf6",  // Purple
  "#14b8a6",  // Teal
  "#ec4899",  // Pink
  "#06b6d4"   // Cyan
]
```

## 📝 Data Format Rules

### Multi-Dataset Format
```typescript
{
  labels: string[],              // X-axis labels (required)
  datasets: Array<{
    name: string,                // Series name for legend (required)
    values: number[],            // Y-axis values (required, must match labels length)
    color?: string               // Optional: custom color for this series
  }>
}
```

### Single Dataset Format
```typescript
Array<{
  label: string,      // or "x" or "date"
  value: number       // or "y" or "price"
}>
```

## ✅ When to Use Multi-Dataset

Use **multi-dataset** format when:
- ✅ Comparing multiple series (e.g., "Tesla vs Apple stock")
- ✅ Year-over-year comparisons (e.g., "2023 vs 2024 sales")
- ✅ Multiple metrics (e.g., "temperature and humidity")
- ✅ Category breakdowns (e.g., "sales by product category")
- ✅ A/B testing results
- ✅ Before/after comparisons

Use **single dataset** format when:
- ✅ Showing one metric over time
- ✅ Simple rankings
- ✅ One data series

## 🎯 Example Queries

### Comparisons
- "Compare Tesla and Apple stock prices"
- "Show iPhone vs Samsung sales"
- "Plot revenue vs expenses"

### Year-over-Year
- "Show Q1-Q4 sales for 2023 and 2024"
- "Compare monthly revenue this year vs last year"
- "Display before and after metrics"

### Multiple Metrics
- "Show temperature and humidity trends"
- "Plot CPU and memory usage"
- "Display open, high, low, close prices"

### Category Breakdowns
- "Show sales breakdown by product category"
- "Display traffic sources over time"
- "Show revenue by region"

## 🔍 Format Detection

Charts automatically detect the format:

```typescript
// Detects as single dataset (Array)
Array.isArray(data) → Single Dataset

// Detects as multi-dataset (Object with labels & datasets)
!Array.isArray(data) && 'labels' in data && 'datasets' in data → Multi-Dataset
```

## 🎨 Legend Behavior

- **Multi-dataset**: Legend shown automatically (can override with `showLegend: false`)
- **Single dataset**: No legend shown (can show with `showLegend: true`)

## 🚨 Common Mistakes

### ❌ Mismatched Lengths
```json
{
  "labels": ["A", "B", "C"],
  "datasets": [
    {"name": "Series", "values": [1, 2]}  // ❌ Only 2 values for 3 labels
  ]
}
```

### ✅ Correct
```json
{
  "labels": ["A", "B", "C"],
  "datasets": [
    {"name": "Series", "values": [1, 2, 3]}  // ✅ 3 values for 3 labels
  ]
}
```

### ❌ Missing Required Fields
```json
{
  "labels": ["A", "B"],
  "datasets": [
    {"values": [1, 2]}  // ❌ Missing "name"
  ]
}
```

### ✅ Correct
```json
{
  "labels": ["A", "B"],
  "datasets": [
    {"name": "Series 1", "values": [1, 2]}  // ✅ Has name
  ]
}
```

## 📏 Size Considerations

The chart automatically adjusts height:
- Without legend: 200px
- With legend: 240px (line/area), 240px (bar vertical), 320px (bar horizontal)

## 🎓 Best Practices

1. **Use Descriptive Names**: `"Tesla (TSLA)"` better than `"Data 1"`
2. **Consistent Colors**: Use brand colors or semantic colors (green for positive, red for negative)
3. **Limit Series**: 2-5 series is optimal, >5 can be hard to read
4. **Meaningful Labels**: Use readable labels (dates, names, not "data1")
5. **Group Related Data**: Keep comparisons relevant and related

## 🔗 See Also

- 📘 `MULTI_DATASET_IMPLEMENTATION.md` - Full documentation
- 🧪 `MULTI_DATASET_TEST_EXAMPLES.json` - Test cases
- 📋 `HYBRID_IMPLEMENTATION_SUMMARY.md` - Implementation details

