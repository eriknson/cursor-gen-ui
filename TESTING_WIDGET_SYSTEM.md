# Testing the Widget System

## Quick Start

The widget system should work with your existing setup. No configuration changes needed.

## Test Queries

Try these queries to test different widget types:

### 1. Metric Card
```
"What's the temperature in Tokyo?"
"Show me Tesla stock price"
"How many users signed up today?"
```

Expected: Single stat with optional trend

### 2. Metric Grid
```
"Show me dashboard metrics for my app"
"What are the key stats for this quarter?"
```

Expected: 2-4 metrics in a grid

### 3. List
```
"Show me the recipe for tacos"
"What are the steps to deploy on Vercel?"
"List the features of iPhone 17 Pro"
```

Expected: 3-5 items with icons and descriptions

### 4. Comparison
```
"Compare iPhone 17 Pro and iPhone Air"
"What's the difference between React and Vue?"
"Compare pricing plans"
```

Expected: Side-by-side table or cards

### 5. Chart
```
"Show Tesla stock trend over the last week"
"Graph my revenue for this year"
"Show sales by category"
```

Expected: Line/bar/area/pie chart

### 6. Timeline
```
"Show me the history of Apple products"
"What's the project timeline?"
"Track order status for #12345"
```

Expected: Chronological events

### 7. Form/Calculator
```
"Create a tip calculator"
"Build a temperature converter"
"Make a loan calculator"
```

Expected: Interactive form with sliders/inputs

### 8. Gallery
```
"Show me photos of Tokyo landmarks"
"Display team member photos"
```

Expected: Image grid

### 9. Profile
```
"Show me Elon Musk's profile"
"Display user profile for john@example.com"
```

Expected: Person/entity card

### 10. Container (Tabs/Accordion)
```
"Show me iPhone specs with tabs for features and pricing"
"Create an FAQ accordion"
```

Expected: Tabs or accordion with nested widgets

## What to Check

### ✅ Success Indicators
- Widget renders correctly
- Data appears (real or mocked)
- Interactions work (hover, click, filter, etc.)
- Loading states display smoothly
- No console errors
- Response time < 3 seconds

### ❌ Failure Indicators
- Red error message displayed
- Console shows validation errors
- Widget doesn't match query intent
- Missing or placeholder data
- Interactions don't work
- Long loading times (>5 seconds)

## Debugging

### Check Browser Console
Look for these log messages:
```
📋 Plan: { widgetType: "...", ... }
📊 Data: { data: {...}, source: "..." }
🎨 Widget: { type: "...", data: {...} }
```

### Common Issues

**"Widget validation failed"**
- The LLM didn't generate valid JSON
- Check console for Zod validation errors
- Try rephrasing the query

**"Chart requires data points"**
- Data extraction failed or returned empty
- Check if web search was needed but failed
- Try a query with clearer data requirements

**Widget doesn't match query**
- Planning phase picked wrong widget type
- Try being more specific in your query
- Example: "Show me a list of..." vs "What are..."

**Error: "Failed to parse JSON response"**
- LLM didn't follow the JSON format
- This should be rare (<5%)
- Try the query again or rephrase

## Performance Testing

Time these phases (visible in loading indicator):
1. **Planning**: Should be <1s
2. **Data fetching**: Should be 1-2s (if web search) or <1s (mock data)
3. **Widget generation**: Should be <1s
4. **Total**: Should be 2-3s

If any phase is consistently slow:
- Check network conditions
- Check Cursor API availability
- Check model selection (some models are slower)

## Comparison with Old System

Try the same query on a version with the old system:
- **Reliability**: New system should have fewer errors
- **Speed**: New system should be 2-3x faster
- **Errors**: New system should have clearer errors

## Reporting Issues

If you find issues, note:
1. **Query**: Exact text you typed
2. **Widget type**: What it tried to create
3. **Error**: Console errors or user-facing message
4. **Expected**: What you wanted to see
5. **Model**: Which model you selected

## Advanced Testing

### Test Interactions
- Hover over metric cards (should show details)
- Click comparison toggle (should switch views)
- Type in list filter (should narrow results)
- Adjust form sliders (should update calculation)

### Test Composition
- Tabs should switch content
- Accordion should expand/collapse
- Nested widgets should render correctly

### Test Edge Cases
- Very long queries
- Ambiguous queries
- Queries with multiple intents
- Queries in different languages

## Success Criteria

The system is working well if:
- ✅ 95%+ of queries return valid widgets
- ✅ Average response time <3 seconds
- ✅ No runtime errors in console
- ✅ Widgets match user intent
- ✅ Data is relevant and realistic
- ✅ Interactions work smoothly

## Next Steps

Once basic testing passes:
1. Test with real users
2. Collect feedback
3. Add new widget types as needed
4. Optimize slow queries
5. Expand interaction patterns

