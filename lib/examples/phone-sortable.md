Intent: comparison
Interactivity: tabs
Components: Card, Tabs, Badge, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [view, setView] = useState('specs');
  
  const phones = {
    iphone: { name: 'iPhone 15 Pro', price: 999, camera: '48MP', display: '6.1"', battery: 3877, rating: 4.8 },
    samsung: { name: 'Galaxy S24 Ultra', price: 1199, camera: '200MP', display: '6.8"', battery: 5000, rating: 4.7 }
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/50 dark:to-purple-900/30">
        <CardHeader>
          <CardTitle>Flagship Phones 2025</CardTitle>
          <CardDescription>Top 2 picks • Switch to compare</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specs">Specs</TabsTrigger>
              <TabsTrigger value="verdict">Verdict</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="mt-4 space-y-3">
              {Object.entries(phones).map(([key, phone], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-background/50 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{phone.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Icons.Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-medium">{phone.rating}</span>
                      </div>
                    </div>
                    <div className="text-xl font-bold">
                      <NumberFlow value={phone.price} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0 }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <div className="text-muted-foreground">Camera</div>
                      <div className="font-medium">{phone.camera}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Display</div>
                      <div className="font-medium">{phone.display}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Battery</div>
                      <div className="font-medium">{phone.battery}mAh</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
            
            <TabsContent value="verdict" className="mt-4 space-y-3">
              <div className="bg-background/50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Icons.Camera className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Best Camera:</span>
                  <span className="text-sm">Galaxy S24 Ultra</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Best Performance:</span>
                  <span className="text-sm">iPhone 15 Pro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium">Best Value:</span>
                  <span className="text-sm">iPhone 15 Pro</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

