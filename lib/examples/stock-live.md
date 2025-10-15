Intent: metric
Interactivity: tabs
Components: Card, Tabs, Badge, motion, NumberFlow, AreaChart

[[CODE]]
const GeneratedComponent = () => {
  const [view, setView] = useState('chart');
  const data = [{x:1,y:248},{x:2,y:251},{x:3,y:255},{x:4,y:253},{x:5,y:258}];
  const stats = {price: 258.40, change: 8.90, percent: 3.57, symbol: 'TSLA', name: 'Tesla Inc.'};
  const isPositive = stats.change >= 0;
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-4xl font-bold">
                <NumberFlow value={stats.price} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 2 }} />
              </CardTitle>
              <CardDescription className="mt-1">{stats.symbol} · {stats.name}</CardDescription>
            </div>
            <Badge className={cn(
              "text-sm font-medium",
              isPositive ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"
            )}>
              <NumberFlow value={stats.percent} format={{ signDisplay: 'always', minimumFractionDigits: 2 }} suffix="%" />
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="chart" className="mt-4">
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="y" stroke="#10b981" strokeWidth={2} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Change</p>
                  <p className={cn("text-xl font-bold", isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                    <NumberFlow value={stats.change} format={{ signDisplay: 'always', minimumFractionDigits: 2, style: 'currency', currency: 'USD' }} />
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Percent</p>
                  <p className={cn("text-xl font-bold", isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                    <NumberFlow value={stats.percent} format={{ signDisplay: 'always', minimumFractionDigits: 2 }} suffix="%" />
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <p className="text-xs text-muted-foreground">5-day trend · Yahoo Finance</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

