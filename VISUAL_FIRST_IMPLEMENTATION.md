# Visual-First Chart Generation Implementation

## Overview

Updated the generative UI system to prioritize chart visualizations over tables and text when displaying numeric, temporal, or comparative data. The system now **aggressively avoids boring single-value displays** and defaults to creating visual, glanceable UIs with charts, containers, and metric grids that feel alive and engaging in chat interfaces.

### Key Principle
**ALWAYS make it visual!** Weather gets a forecast chart, stock prices get trend charts, single metrics become grids with related data. Plain text displays are actively avoided.

## Changes Made

### 1. Updated PLANNER_PROMPT (`lib/widget-prompts.ts`)

Added **VISUAL-FIRST APPROACH** guidance:
- PREFER "chart" for temporal data (trends over time, historical data, forecasts)
- PREFER "chart" for comparing numeric values across 2+ entities
- PREFER "chart" for showing progression, distributions, or patterns in data
- PREFER "container" to combine current state + visual trends (weather, stocks)
- PREFER "metric-grid" over single metric-card to show multiple visual data points
- Use "comparison" table only when precise non-numeric features matter
- **AVOID plain "metric-card"** - always try to add visual context

Added **MAKE IT VISUAL** section:
- Weather queries → "container" with current conditions + forecast chart (not just current temp)
- Stock price → "container" with current price + performance chart (not just price)
- Single metrics → "metric-grid" with related metrics (not isolated values)
- Default to showing change over time, comparisons, or related data points

**New Examples:**
- "What's Tesla stock price?" → container with price + chart (timeseries)
- "Weather in Stockholm" → container with current + forecast (timeseries)
- "Tesla stock performance last year" → chart widget (timeseries)
- "Compare Tokyo and London temperature" → chart widget (multi-dataset)
- "GDP growth US vs China" → chart widget (timeseries)

### 2. Updated DATA_PROMPT and DATA_GENERATION_PROMPT (`lib/widget-prompts.ts`)

Added **EXTRACT/GENERATE FOR VISUAL IMPACT** guidance:
- Weather: Extract current conditions + 5-7 day forecast with temps/conditions (for chart)
- Stocks: Extract current price/change + historical points (min 7 days) for trend chart
- Single metrics: Extract related data points, not just single values
- For timeseries: Extract/generate 6-12 granular data points (monthly for yearly, daily for monthly)
- For comparisons: Use multi-dataset format with matching time periods
- For containers: Generate data for multiple child widgets (current state + trend chart)
- **Always prefer extracting time-series data over single snapshots when available**
- Example structure: `{"labels": ["Jan", "Feb", ...], "datasets": [{"name": "Tokyo", "values": [...]}, {"name": "NYC", "values": [...]}]}`
- Emphasized conciseness for chat interface

### 3. Updated WIDGET_GENERATION_PROMPT (`lib/widget-prompts.ts`)

Added comprehensive chart selection guidance:

**VISUAL-FIRST PRINCIPLE:**
- **ALWAYS make it visual!** DEFAULT TO CHARTS, CONTAINERS, or METRIC-GRIDS
- **Actively avoid plain text or single metric cards**
- When data is numeric/temporal, DEFAULT TO CHARTS over tables/text
- Charts are glanceable and engaging

**MAKE IT ENGAGING:**
- Weather → container with current metrics + forecast chart (NOT just temperature text)
- Stock price → container with price card + performance chart (NOT just price)
- Single metrics → metric-grid with 2-3 related values + icons (NOT isolated card)
- Any numeric data → show as chart when possible (line/bar/area for trends)

**WHEN TO USE CHARTS:**
- Temporal data (trends, history, forecasts) - **ALWAYS prefer charts**
- Comparing numeric values across 2+ entities - **ALWAYS use charts**
- Showing distributions, proportions, or patterns - **ALWAYS visualize**
- Any data that changes over time or categories - **CHARTS first**

**CHART TYPE SELECTION:**
- **line**: Time series trends, continuous data, comparing multiple series
- **bar**: Categorical comparisons, rankings, discrete values
- **area**: Cumulative values, filled trends, emphasizing magnitude
- **pie**: Part-to-whole relationships, percentages (use sparingly)
- **radial**: Progress/completion metrics, circular gauges, compact single percentage

**New Examples:**
- **Container with tabs (weather)**: Stockholm weather with current metrics grid + 7-day forecast chart
- **Container with tabs (stock)**: TSLA stock with current price/change metrics + 5-day performance chart
- **Metric grid**: Website analytics with 3 related metrics (visitors, bounce rate, avg session)
- Line chart with multi-dataset comparison (Tokyo vs London temperature)
- Bar chart for categorical data (Sales by Region)
- Area chart for trends (Revenue Growth)
- Pie chart for proportions (Market Share)
- Radial chart for progress (Goal Progress 73%)
- Comparison table (iPhone Models - non-numeric features)

**Conciseness Emphasis:**
- Rule #1: "KEEP IT CONCISE - this appears in a chat interface, not a dashboard"
- All examples optimized for chat display

### 4. Added Radial Chart Support

**New Files:**
- `/components/radial-chart.tsx` - New radial chart component using Recharts RadialBarChart

**Modified Files:**
- `lib/widget-schema.ts` - Added 'radial' to ChartType union
- `lib/widget-renderer.tsx` - Added RadialChart import and case in renderChart()

**Features:**
- Single value mode: Progress/gauge style with percentage display
- Multiple values mode: Stacked radial chart for comparing multiple metrics
- Automatic color coding based on thresholds (optional)
- NumberFlow animations for values
- Consistent with other chart components

## Multi-Dataset Format

For comparing entities over time/categories, the system now uses:

```json
{
  "type": "chart",
  "config": {"chartType": "line", "showLegend": true},
  "data": {
    "title": "Temperature Comparison",
    "subtitle": "Average monthly temperature",
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "datasets": [
      {"name": "Tokyo", "values": [5, 7, 11, 15, 20, 24]},
      {"name": "NYC", "values": [0, 2, 8, 14, 19, 25]}
    ]
  }
}
```

This format is already supported by LineChart, BarChart, and AreaChart components.

## Example Use Cases

The system will now generate visually rich displays for queries like:

**Weather queries** → Container with tabs:
- "What's the weather in Stockholm?" → Tab 1: Current conditions (temp, feels-like, humidity) + Tab 2: 7-day forecast chart
- "Weather in Tokyo" → Metric grid with current metrics + line chart for forecast

**Stock queries** → Container with tabs:
- "What's Tesla stock price?" → Tab 1: Current price & change metrics + Tab 2: 5-day performance chart
- "AAPL stock performance" → Area chart showing historical trend

**Comparison queries** → Multi-dataset charts:
- "Compare temperature between Tokyo and London" → Line chart with 2 datasets (12 monthly points)
- "GDP growth US vs China" → Line chart comparing two countries over time

**Progress/completion** → Radial charts:
- "My sales goal is 73% complete" → Radial gauge chart

**Distributions** → Pie/bar charts:
- "Market share breakdown" → Pie chart with segments
- "Sales by region" → Bar chart

**Analytics/metrics** → Metric grids:
- "Website traffic stats" → Metric grid with 3-4 key metrics (visitors, bounce rate, etc.)

While still using comparison tables appropriately for:
- "Compare iPhone 15 Pro specs" → Comparison table (non-numeric features like display type, storage)

## Testing

To test the new visual-first behavior, try queries involving:
- Temporal data (trends over time)
- Numeric comparisons between entities
- Progress/completion metrics
- Market share or distribution data

The system should now default to chart visualizations instead of tables or text lists when the data is numeric/temporal.

## Design Inspiration

Implementation follows shadcn/ui chart patterns:
- Clean, modern chart aesthetics using Recharts
- Monochrome color palette by default
- Consistent card-based layouts
- Smooth animations with Framer Motion
- NumberFlow for animated value transitions
- Responsive and optimized for chat interface display

