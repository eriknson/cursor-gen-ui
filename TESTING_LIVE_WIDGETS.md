# Testing Live Widgets & Error Recovery

## Quick Start

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Open** http://localhost:3000

## Test Cases

### 1. Live Stock Widget

**Query**: "Show me Tesla stock price"

**Expected Result**:
- ✅ Widget displays with current stock price
- ✅ Green pulsing dot in top-right corner
- ✅ Hover over dot shows "Live • Updates every 5s"
- ✅ Watch the number animate when data updates (NumberFlow)
- ✅ After ~10 seconds, you should see an update (if using web search)

**What to Check**:
- Live indicator visible and pulsing
- Tooltip shows update interval and last updated time
- Numbers animate smoothly on update
- Console shows "🔄 Refreshing widget data..."

### 2. Live Weather Widget

**Query**: "What's the weather in San Francisco?"

**Expected Result**:
- ✅ Widget displays with temperature
- ✅ Green pulsing dot (updates every 5 minutes)
- ✅ Hover shows "Updates every 5m"
- ✅ Much slower update rate than stocks

### 3. Static Widget (No Live Updates)

**Query**: "Show me a recipe for guacamole"

**Expected Result**:
- ✅ Widget displays recipe
- ✅ NO live indicator (recipes don't need updates)
- ✅ No auto-refresh happening

### 4. Live Sports Scores

**Query**: "Show me Lakers game score"

**Expected Result**:
- ✅ Widget displays score
- ✅ Updates every 10 seconds
- ✅ Live indicator present

### 5. Tab Visibility Test

**Steps**:
1. Generate a live widget (stock price)
2. Switch to another browser tab
3. Wait 30 seconds
4. Switch back

**Expected Result**:
- ✅ Console shows "🛑 Tab hidden - pausing widget refresh"
- ✅ Console shows "▶️ Tab visible - resuming widget refresh"
- ✅ Updates resume automatically

### 6. Rate Limit Test

**Steps**:
1. Generate a stock widget with 5s updates
2. Wait for 50+ updates (~4-5 minutes)

**Expected Result**:
- ✅ After 50 updates, live indicator turns gray
- ✅ Tooltip shows "Updates paused - Refresh limit reached"
- ✅ Console shows rate limit warning
- ✅ No more updates happen

### 7. Error Recovery Test - Example Data Fallback

**Steps**:
1. Set data mode to "Example Data"
2. Query: "Show me invalid nonsense data xyz"

**Expected Result**:
- ✅ Progress shows "Trying alternative approach" (if first attempt fails)
- ✅ A widget still appears (fallback widget)
- ✅ NO error message shown to user
- ✅ Widget displays something reasonable

### 8. Error Recovery Test - Complete Fallback

**Steps**:
1. Create a query that's impossible to handle
2. Watch the console for fallback attempts

**Expected Result**:
- ✅ Console shows "⚠️ Attempt 1 failed, trying alternative approach"
- ✅ Console shows "⚠️ Attempt 2 failed, using guaranteed fallback"
- ✅ User sees a metric-card with helpful message
- ✅ NO error or crash

## Visual Checks

### Live Indicator States

**Active (Green Pulsing)**:
- Small green dot in top-right corner
- Pulsing animation
- Tooltip shows update info

**Paused (Gray Static)**:
- Small gray dot
- No animation
- Tooltip shows "Updates paused"

### NumberFlow Animation

When a number updates:
- ✅ Smooth counting animation
- ✅ No jarring jumps
- ✅ Direction-aware (if trend data available)

## Console Messages to Watch For

**Good Messages** (Normal Operation):
```
📋 Plan: {...}
📊 Data: {...}
🎨 Widget: {...}
🔄 Refreshing widget data...
✅ Widget data refreshed
```

**Warning Messages** (Handled Gracefully):
```
⚠️ Attempt 1 failed, trying alternative approach
⚠️ Rate limit exceeded: ...
🛑 Tab hidden - pausing widget refresh
▶️ Tab visible - resuming widget refresh
```

**Should NOT See**:
```
❌ Unhandled error
Uncaught exception
```

## Browser DevTools Checks

### Network Tab
- Watch for `/api/refresh` calls every 5-30s (depending on widget)
- Should return 200 status
- Eventually returns 429 when rate limit hit

### Performance
- Initial widget load: ~2-3 seconds
- Refresh calls: ~1-2 seconds
- No memory leaks (check in Performance tab)

## Multi-Widget Test

**Query 1**: "Tesla stock price"
**Query 2**: "Weather in Tokyo"
**Query 3**: "Recipe for pasta"

**Expected Result**:
- ✅ First widget updates every 5s (live dot)
- ✅ Second widget updates every 5m (live dot)
- ✅ Third widget has no live updates (no dot)
- ✅ All three work independently
- ✅ Each has its own rate limit counter

## Edge Cases

### Rapid Fire Queries
Try generating 5 widgets quickly:
- ✅ Each should succeed (no failures)
- ✅ Rate limits are per-widget, not global

### Model Switching
1. Generate widget with "cheetah" model
2. Switch to "sonnet-4.5"
3. Generate another widget
- ✅ Both should work
- ✅ Live updates work regardless of model

### Data Mode Switching
1. Generate with "Web Search"
2. Generate with "Example Data"
- ✅ Live updates work in both modes
- ✅ Example data is faster but less accurate

## Troubleshooting

### Widget Not Updating

**Check**:
1. Is there a live indicator? (If no, widget doesn't have updateInterval)
2. Is the indicator green? (If gray, rate limit hit)
3. Is the tab visible? (Updates pause when hidden)
4. Check console for errors

### Rate Limit Hit Too Soon

**Possible Causes**:
- Multiple widgets refreshing simultaneously
- Left tab open for long time
- Rate limit counters persisted from previous session

**Solution**:
- Restart dev server to reset rate limiters
- Increase limits in `lib/rate-limiter.ts` if needed

### Numbers Not Animating

**Check**:
1. Is NumberFlow imported correctly?
2. Is the value actually changing? (check network tab)
3. Try hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

## Success Criteria

All these should be TRUE:
- [ ] Live widgets show pulsing green dot
- [ ] Static widgets show no indicator
- [ ] Numbers animate smoothly on updates
- [ ] Tab visibility pauses/resumes correctly
- [ ] Rate limits are enforced (50 max per widget)
- [ ] No user-facing error messages
- [ ] Fallback system works (always shows something)
- [ ] Build passes with no TypeScript errors
- [ ] No console errors in browser

## Performance Benchmarks

**Initial Load**:
- Target: < 3 seconds
- Measured: ___________

**Refresh Speed**:
- Target: < 2 seconds
- Measured: ___________

**Memory Usage**:
- No leaks after 100 refreshes
- Stable memory profile

**Credits Used**:
- Initial: 1 request (normal pipeline)
- Each refresh: 1 request (data only)
- 50 refreshes max = 51 total requests per widget

## Notes

- Rate limiters are in-memory (reset on server restart)
- For production, consider Redis for persistent rate limiting
- NumberFlow requires numeric values (strings won't animate)
- Live updates only work with plan + query stored (must use streaming endpoint)

## Ready for Production?

Check these before deploying:
- [ ] All tests pass
- [ ] No memory leaks
- [ ] Rate limits appropriate for production
- [ ] Error recovery working smoothly
- [ ] Visual feedback clear to users
- [ ] Documentation updated

---

**Last Updated**: Implementation complete, ready for testing
**Status**: ✅ All features implemented, build passing

