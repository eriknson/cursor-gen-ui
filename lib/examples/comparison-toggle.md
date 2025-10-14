Intent: comparison
Interactivity: switch
Components: Card, Switch, Badge, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [showFirst, setShowFirst] = useState(true);
  
  const items = {
    first: { name: 'Nike ZoomX', price: 180, rating: 4.8, weight: '6.8 oz', features: ['Carbon plate', 'ZoomX foam', 'Breathable mesh'] },
    second: { name: 'Adidas Ultraboost', price: 190, rating: 4.7, weight: '9.2 oz', features: ['Boost cushioning', 'Primeknit upper', 'Continental rubber'] }
  };
  
  const current = showFirst ? items.first : items.second;
  const label = showFirst ? items.first.name : items.second.name;
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Running Shoes</CardTitle>
            <div className="flex items-center gap-2 text-sm">
              <span className={cn("font-medium transition-opacity", showFirst ? "opacity-100" : "opacity-40")}>
                Nike
              </span>
              <Switch checked={!showFirst} onCheckedChange={(checked) => setShowFirst(!checked)} />
              <span className={cn("font-medium transition-opacity", !showFirst ? "opacity-100" : "opacity-40")}>
                Adidas
              </span>
            </div>
          </div>
          <CardDescription>Compare top running shoes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            key={label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{current.name}</h3>
              <div className="text-3xl font-bold">
                <NumberFlow value={current.price} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0 }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Rating</div>
                <div className="flex items-center gap-1">
                  <Icons.Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-bold">{current.rating}</span>
                </div>
              </div>
              <div className="bg-background rounded-lg p-3">
                <div className="text-xs text-muted-foreground mb-1">Weight</div>
                <div className="text-lg font-bold">{current.weight}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">KEY FEATURES</div>
              {current.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Icons.Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

