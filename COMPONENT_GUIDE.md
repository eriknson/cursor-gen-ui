# Component Guide - Dynamic Generative UI

## Overview

This system features 15+ specialized, highly-configurable components that are dynamically selected based on query context. The AI analyzes each query and chooses the most appropriate component with custom styling and configuration.

## Component Types

### Data Visualization Components

#### 1. Line Chart (`line-chart`)
**Use Cases:** Stock prices, trends, time series, progression over time

**Configuration:**
```json
{
  "colors": ["#6366f1"],
  "variant": "smooth" | "linear" | "stepped",
  "showPoints": true,
  "showGrid": true,
  "theme": "default" | "vibrant" | "minimal"
}
```

**Example Query:** "Show me NVIDIA stock price over the last month"

---

#### 2. Bar Chart (`bar-chart`)
**Use Cases:** Comparisons, rankings, categorical data

**Configuration:**
```json
{
  "colors": ["#6366f1"],
  "variant": "vertical" | "horizontal",
  "showValues": false,
  "theme": "default" | "vibrant" | "minimal"
}
```

**Example Query:** "Compare GDP of top 5 countries"

---

#### 3. Pie Chart (`pie-chart`)
**Use Cases:** Proportions, distributions, percentages

**Configuration:**
```json
{
  "colors": ["#6366f1", "#8b5cf6", "#ec4899"],
  "variant": "pie" | "donut",
  "showPercentages": true,
  "theme": "default" | "vibrant"
}
```

**Example Query:** "Show market share distribution of smartphone manufacturers"

---

#### 4. Area Chart (`area-chart`)
**Use Cases:** Cumulative data, ranges, filled regions

**Configuration:**
```json
{
  "colors": ["#6366f1"],
  "variant": "filled" | "stacked",
  "showGrid": true,
  "theme": "default" | "minimal"
}
```

**Example Query:** "Show cumulative sales over time"

---

#### 5. Gauge Chart (`gauge-chart`)
**Use Cases:** Single metrics, scores, progress indicators

**Configuration:**
```json
{
  "color": "#6366f1",
  "variant": "semi" | "full",
  "showValue": true,
  "threshold": {
    "low": 30,
    "mid": 70,
    "high": 90
  }
}
```

**Example Query:** "What's my project completion percentage?"

---

### Content Display Components

#### 6. Timeline (`timeline`)
**Use Cases:** Events, history, step-by-step processes, directions

**Configuration:**
```json
{
  "orientation": "vertical" | "horizontal",
  "variant": "default" | "detailed" | "minimal",
  "showIcons": true,
  "animated": true
}
```

**Example Query:** "How do I get from Times Square to Central Park?"

---

#### 7. Comparison Table (`comparison-table`)
**Use Cases:** Side-by-side comparisons, specs, features

**Configuration:**
```json
{
  "highlightDifferences": true,
  "showWinner": true,
  "variant": "default" | "detailed",
  "colors": ["#0ea5e9", "#22c55e"]
}
```

**Example Query:** "Compare MacBook Pro vs Dell XPS"

---

#### 8. Stat Card (`stat-card`)
**Use Cases:** Key metrics, important numbers, KPIs

**Configuration:**
```json
{
  "size": "sm" | "md" | "lg",
  "variant": "default" | "highlighted" | "minimal",
  "showTrend": true,
  "colors": ["#10b981", "#ef4444"]
}
```

**Example Query:** "Show me key business metrics for Q4"

---

#### 9. List with Icons (`list-with-icons`)
**Use Cases:** Ordered/unordered lists, features, benefits

**Configuration:**
```json
{
  "variant": "default" | "checklist" | "numbered",
  "size": "sm" | "md" | "lg",
  "showIcons": true
}
```

**Example Query:** "What are the benefits of TypeScript?"

---

#### 10. Media Grid (`media-grid`)
**Use Cases:** Image galleries, photo collections, visual content

**Configuration:**
```json
{
  "columns": 2,
  "variant": "grid" | "masonry",
  "size": "sm" | "md" | "lg"
}
```

**Example Query:** "Show me images of the Eiffel Tower"

---

### Specialized Components

#### 11. Weather Card (`weather-card`)
**Use Cases:** Weather information, forecasts

**Configuration:**
```json
{
  "variant": "current" | "forecast" | "detailed",
  "units": "celsius" | "fahrenheit",
  "theme": "default" | "vibrant"
}
```

**Example Query:** "What's the weather in Tokyo?"

---

#### 12. Stock Ticker (`stock-ticker`)
**Use Cases:** Stock prices, financial data

**Configuration:**
```json
{
  "variant": "compact" | "detailed",
  "showSparkline": true,
  "showVolume": false,
  "colors": ["#10b981", "#ef4444"]
}
```

**Example Query:** "What's the stock price of TESLA?"

---

#### 13. Recipe Card (`recipe-card`)
**Use Cases:** Recipes, cooking instructions

**Configuration:**
```json
{
  "layout": "modern" | "classic",
  "showTimings": true,
  "showDifficulty": true
}
```

**Example Query:** "How do I make chocolate chip cookies?"

---

#### 14. Profile Card (`profile-card`)
**Use Cases:** Person/entity information, bios

**Configuration:**
```json
{
  "variant": "default" | "detailed" | "compact",
  "showStats": true,
  "theme": "default" | "minimal"
}
```

**Example Query:** "Tell me about Elon Musk"

---

#### 15. Quote Block (`quote-block`)
**Use Cases:** Quotes, testimonials, highlights

**Configuration:**
```json
{
  "variant": "default" | "emphasized" | "minimal",
  "size": "md" | "lg",
  "theme": "default" | "dark"
}
```

**Example Query:** "Give me a famous quote by Maya Angelou"

---

## Component Selection Strategy

The AI automatically selects components based on query semantics:

1. **Stock/Financial queries** → `stock-ticker`
2. **Weather queries** → `weather-card`
3. **Recipe/cooking queries** → `recipe-card`
4. **Directions/steps/how-to** → `timeline`
5. **Comparisons (A vs B)** → `comparison-table`
6. **Trends over time** → `line-chart` or `area-chart`
7. **Rankings/categorical comparisons** → `bar-chart`
8. **Proportions/distributions** → `pie-chart`
9. **Single metrics/scores** → `gauge-chart` or `stat-card`
10. **Person/entity info** → `profile-card`
11. **Quotes/testimonials** → `quote-block`
12. **Lists/features** → `list-with-icons`
13. **Images/gallery** → `media-grid`
14. **Historical events** → `timeline`
15. **Dashboard metrics** → `stat-card`

## Color Guidelines

The AI uses contextually appropriate colors:

- **Positive/growth:** `#10b981` (green), `#22c55e`
- **Negative/decline:** `#ef4444` (red), `#f87171`
- **Neutral:** `#6366f1` (blue), `#8b5cf6` (purple)
- **Warning:** `#f59e0b` (orange), `#eab308` (yellow)
- **Professional:** `#0ea5e9` (cyan), `#06b6d4` (teal)

## Example Queries

Try these to see the dynamic component system in action:

### Financial
- "What's the stock price of TESLA last week?"
- "Show me Bitcoin price trend for the last month"

### Information
- "What's the weather in San Francisco?"
- "Tell me about Marie Curie"
- "Give me a quote by Albert Einstein"

### Instructions
- "How do I make chocolate chip cookies?"
- "How do I get from point A to point B?"
- "Steps to deploy a Next.js app"

### Comparisons
- "Compare iPhone 15 vs Samsung S24"
- "React vs Vue performance"
- "Python vs JavaScript for beginners"

### Data
- "Top 10 most populous countries"
- "Market share of electric vehicles"
- "Website traffic stats for Q4"

### Lists
- "What are the benefits of exercise?"
- "Features of TypeScript"
- "Top programming languages to learn"

## Dynamic TSX Generation

For edge cases that don't fit any pre-built component, the system can generate custom TSX on-the-fly. This is automatically triggered when needed.

## Adding New Components

To add a new component:

1. Create component file in `/components/your-component.tsx`
2. Add import and case in `/lib/component-renderer.tsx`
3. Update system prompt in `/lib/agent-wrapper.ts`
4. Document in this guide

## Performance

- **Pre-built components:** ~1-2s response time
- **Dynamic generation:** ~3-5s response time
- **90% of queries** use pre-built components
- **10% edge cases** use dynamic generation

## Architecture

```
User Query
    ↓
AI Analyzes Context
    ↓
Selects Component Type
    ↓
Generates Configuration
    ↓
Fetches/Creates Data
    ↓
Renders Component
```

## Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Charts:** Chart.js + react-chartjs-2
- **Animation:** Framer Motion
- **Styling:** Tailwind CSS
- **AI:** Cursor Agent CLI

## Best Practices

1. **Be specific in queries** - More context helps the AI choose the right component
2. **Try different phrasings** - The AI adapts to natural language
3. **Use domain-specific terms** - "stock price" triggers financial components
4. **Ask for comparisons explicitly** - "Compare X vs Y" uses comparison tables
5. **Request visualizations** - "Show me a chart of..." guides component selection

## Troubleshooting

### Component not rendering?
- Check console for errors
- Verify data structure matches component expectations
- Try rephrasing the query

### Wrong component selected?
- Be more specific in your query
- Use domain keywords (stock, weather, recipe, etc.)
- The AI learns from context

### Styling looks off?
- Check theme configuration
- Verify color values in config
- Dark mode may affect appearance

## Future Enhancements

- Map components (when API key available)
- More chart variants (scatter, radar, etc.)
- Interactive components (filters, sorting)
- Real-time data updates
- Component analytics
- Custom themes

