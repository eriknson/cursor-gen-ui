# Animated Progress Dashboard

**Pattern**: Multiple intervals with independent timers
**Use Case**: Multi-step processes, parallel tasks, loading states
**Hooks**: useState, useEffect

## Example Code

```tsx
const GeneratedComponent = () => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processProgress, setProcessProgress] = useState(0);
  const [syncProgress, setSyncProgress] = useState(0);
  
  // Upload simulation - starts immediately
  useEffect(() => {
    if (uploadProgress >= 100) return;
    
    const timer = setInterval(() => {
      setUploadProgress(prev => Math.min(100, prev + 2));
    }, 100);
    
    return () => clearInterval(timer);
  }, [uploadProgress]);
  
  // Processing - starts after upload reaches 50%
  useEffect(() => {
    if (uploadProgress < 50 || processProgress >= 100) return;
    
    const timer = setInterval(() => {
      setProcessProgress(prev => Math.min(100, prev + 1.5));
    }, 120);
    
    return () => clearInterval(timer);
  }, [uploadProgress, processProgress]);
  
  // Sync - starts after processing reaches 60%
  useEffect(() => {
    if (processProgress < 60 || syncProgress >= 100) return;
    
    const timer = setInterval(() => {
      setSyncProgress(prev => Math.min(100, prev + 3));
    }, 150);
    
    return () => clearInterval(timer);
  }, [processProgress, syncProgress]);
  
  const allComplete = uploadProgress === 100 && processProgress === 100 && syncProgress === 100;
  
  const tasks = [
    { label: 'Upload Files', progress: uploadProgress, icon: 'Upload' },
    { label: 'Process Data', progress: processProgress, icon: 'Cpu' },
    { label: 'Sync to Cloud', progress: syncProgress, icon: 'Cloud' }
  ];
  
  return (
    <motion.div 
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/50 dark:to-green-900/30">
        <CardHeader>
          <CardTitle>Deployment Pipeline</CardTitle>
          <CardDescription>Multi-stage progress tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeMap(tasks, (task, index) => {
            const IconComponent = Icons[task.icon];
            const isComplete = task.progress === 100;
            const isActive = task.progress > 0 && task.progress < 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 ${isComplete ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">{task.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NumberFlow 
                      value={Math.round(task.progress)} 
                      className="text-sm font-mono"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                    {isComplete && (
                      <Badge variant="default" className="h-5">
                        <Icons.Check className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress 
                  value={task.progress} 
                  className={`h-2 ${isActive ? 'animate-pulse' : ''}`}
                />
              </div>
            );
          })}
          
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-center"
            >
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                ✓ All tasks completed successfully!
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
```

## Key Safety Features

1. **Multiple Independent Timers**: Each useEffect has its own cleanup
2. **Conditional Execution**: Early returns prevent unnecessary intervals
3. **Proper Dependencies**: Each effect only re-runs when its deps change
4. **Functional Updates**: `prev => Math.min(100, prev + n)` prevents race conditions
5. **Cleanup on Completion**: Effects stop when progress reaches 100%

