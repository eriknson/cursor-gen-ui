# Live Countdown Timer

**Pattern**: useEffect with setInterval + cleanup
**Use Case**: Timers, countdowns, real-time updates
**Hooks**: useState, useEffect

## Example Code

```tsx
const GeneratedComponent = () => {
  const [seconds, setSeconds] = useState(300); // 5 minutes
  const [isRunning, setIsRunning] = useState(true);
  
  // Timer effect with proper cleanup
  useEffect(() => {
    if (!isRunning || seconds <= 0) return;
    
    const interval = setInterval(() => {
      setSeconds(prev => Math.max(0, prev - 1));
    }, 1000);
    
    // CRITICAL: Cleanup prevents memory leak
    return () => clearInterval(interval);
  }, [isRunning, seconds]);
  
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = (seconds / 300) * 100;
  
  return (
    <motion.div 
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/50 dark:to-blue-900/30">
        <CardHeader>
          <CardTitle>Pomodoro Timer</CardTitle>
          <CardDescription>Focus session countdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-7xl font-bold text-center tabular-nums">
            <NumberFlow value={minutes} />
            <span className="text-muted-foreground">:</span>
            <NumberFlow value={secs} format={{ minimumIntegerDigits: 2 }} />
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1"
              variant={isRunning ? "outline" : "default"}
            >
              {isRunning ? 'Pause' : 'Resume'}
            </Button>
            <Button 
              onClick={() => setSeconds(300)}
              variant="outline"
            >
              Reset
            </Button>
          </div>
          
          {seconds === 0 && (
            <div className="text-center text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Session complete!
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
```

## Key Safety Features

1. **Cleanup Function**: `return () => clearInterval(interval)` prevents memory leaks
2. **Dependency Array**: `[isRunning, seconds]` ensures effect runs when needed
3. **Functional Updates**: `setSeconds(prev => ...)` prevents stale closure bugs
4. **Early Return**: Stops timer when not running or complete

