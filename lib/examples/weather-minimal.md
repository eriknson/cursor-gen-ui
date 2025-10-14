Intent: fact
Interactivity: tabs
Components: Card, Tabs, Badge, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [view, setView] = useState('now');
  
  const weather = {
    location: 'Tokyo',
    now: { condition: 'Partly cloudy', temperature: 22, feels: 24, humidity: 65 },
    forecast: [
      { day: 'Tomorrow', temp: 25, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thursday', temp: 23, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Friday', temp: 20, condition: 'Rain', icon: 'CloudRain' }
    ]
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-sky-50/50 to-sky-100/30 dark:from-sky-950/50 dark:to-sky-900/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{weather.location}</CardTitle>
              <CardDescription>{weather.now.condition}</CardDescription>
            </div>
            <Icons.CloudSun className="h-12 w-12 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="now">Now</TabsTrigger>
              <TabsTrigger value="forecast">3-Day</TabsTrigger>
            </TabsList>
            
            <TabsContent value="now" className="mt-4 space-y-4">
              <div className="text-6xl font-bold">
                <NumberFlow value={weather.now.temperature} suffix="°C" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Feels Like</div>
                  <div className="text-xl font-bold">
                    <NumberFlow value={weather.now.feels} suffix="°C" />
                  </div>
                </div>
                <div className="bg-background/50 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Humidity</div>
                  <div className="text-xl font-bold">
                    <NumberFlow value={weather.now.humidity} suffix="%" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="forecast" className="mt-4 space-y-2">
              {weather.forecast.map((day, i) => {
                const Icon = Icons[day.icon] || Icons.Cloud;
                return (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between bg-background/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                      <div>
                        <div className="font-medium text-sm">{day.day}</div>
                        <div className="text-xs text-muted-foreground">{day.condition}</div>
                      </div>
                    </div>
                    <div className="text-xl font-bold">
                      <NumberFlow value={day.temp} suffix="°" />
                    </div>
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

