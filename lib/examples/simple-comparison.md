Intent: comparison
Interactivity: switch
Components: Card, Switch, Badge, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [showFirst, setShowFirst] = useState(true);
  
  const items = {
    first: { name: 'iPhone 15 Pro', price: 999, rating: 4.8, storage: '256GB' },
    second: { name: 'Samsung S24 Ultra', price: 1199, rating: 4.7, storage: '256GB' }
  };
  
  const current = showFirst ? items.first : items.second;
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Flagship Phones</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className={cn("font-medium transition-opacity", showFirst ? "opacity-100" : "opacity-40")}>
                iPhone
              </span>
              <Switch checked={!showFirst} onCheckedChange={(checked) => setShowFirst(!checked)} />
              <span className={cn("font-medium transition-opacity", !showFirst ? "opacity-100" : "opacity-40")}>
                Samsung
              </span>
            </div>
          </div>
          <CardDescription>Compare top models</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <motion.div
            key={current.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-2xl font-bold">{current.name}</h3>
              <div className="text-4xl font-bold mt-2">
                <NumberFlow value={current.price} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0 }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Rating</div>
                <div className="flex items-center gap-1">
                  <Icons.Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-xl font-bold">{current.rating}</span>
                </div>
              </div>
              <div className="bg-background rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">Storage</div>
                <div className="text-xl font-bold">{current.storage}</div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

