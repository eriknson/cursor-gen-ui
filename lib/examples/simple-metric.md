Intent: metric
Interactivity: tabs
Components: Card, Tabs, Badge, motion, NumberFlow

[[CODE]]
const GeneratedComponent = () => {
  const [view, setView] = useState('overview');
  const price = 258.40;
  const change = 8.90;
  const percent = 3.57;
  const isPositive = change >= 0;
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-4xl font-bold">
                <NumberFlow value={price} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 2 }} />
              </CardTitle>
              <CardDescription className="mt-1">Tesla Inc. (TSLA)</CardDescription>
            </div>
            <Badge className={cn(
              "text-sm font-medium",
              isPositive ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400"
            )}>
              <NumberFlow value={percent} format={{ signDisplay: 'always', minimumFractionDigits: 2 }} suffix="%" />
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="text-center space-y-2">
                <p className={cn(
                  "text-2xl font-bold",
                  isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  <NumberFlow value={change} format={{ signDisplay: 'always', minimumFractionDigits: 2, style: 'currency', currency: 'USD' }} />
                </p>
                <p className="text-sm text-muted-foreground">Today's change</p>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Open</span>
                <span className="font-medium">$253.12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">High</span>
                <span className="font-medium">$259.84</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Low</span>
                <span className="font-medium">$252.50</span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

