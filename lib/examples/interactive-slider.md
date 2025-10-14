# Interactive Slider Dashboard

**Pattern**: useState for real-time value updates
**Use Case**: Settings, adjustments, comparisons, calculators
**Hooks**: useState

## Example Code

```tsx
const GeneratedComponent = () => {
  const [temperature, setTemperature] = useState(22);
  const [brightness, setBrightness] = useState(75);
  const [volume, setVolume] = useState(50);
  
  // Calculate comfort score based on settings
  const comfortScore = Math.round(
    (temperature >= 20 && temperature <= 24 ? 30 : 0) +
    (brightness >= 60 && brightness <= 80 ? 35 : 0) +
    (volume >= 40 && volume <= 60 ? 35 : 0)
  );
  
  return (
    <motion.div 
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/50 dark:to-purple-900/30">
        <CardHeader>
          <CardTitle>Room Controls</CardTitle>
          <CardDescription>Adjust your environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperature</Label>
              <div className="flex items-center gap-2">
                <NumberFlow value={temperature} />
                <span className="text-sm text-muted-foreground">°C</span>
              </div>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={16}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
          
          {/* Brightness Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Brightness</Label>
              <div className="flex items-center gap-2">
                <NumberFlow value={brightness} />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[brightness]}
              onValueChange={([v]) => setBrightness(v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          
          {/* Volume Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Volume</Label>
              <div className="flex items-center gap-2">
                <NumberFlow value={volume} />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
          
          <Separator />
          
          {/* Comfort Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Comfort Score</span>
              <Badge variant={comfortScore >= 80 ? "default" : "secondary"}>
                <NumberFlow value={comfortScore} />%
              </Badge>
            </div>
            <Progress value={comfortScore} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
```

## Key Features

1. **No useEffect Needed**: Simple state updates don't require side effects
2. **Immediate Feedback**: NumberFlow shows smooth transitions
3. **Derived State**: comfortScore calculated from current values
4. **Interactive Controls**: Sliders provide intuitive adjustment

