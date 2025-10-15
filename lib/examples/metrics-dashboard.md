Intent: trend
Interactivity: hover
Components: Card, Badge, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const stats = [
    {label:"Revenue",value:2.4,change:"+12%",trend:"up", detail: "$280K increase from last quarter", icon: "DollarSign"},
    {label:"Users",value:18.2,change:"+8%",trend:"up", detail: "1.4K new signups this month", icon: "Users"},
    {label:"Conversion",value:3.2,change:"+0.4%",trend:"up", detail: "Best performance yet", icon: "TrendingUp"}
  ];
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <CardTitle>Q4 Metrics</CardTitle>
          <CardDescription>October 2025 · Hover to see details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.map((s, i) => {
            const isHovered = hoveredIndex === i;
            const Icon = Icons[s.icon] || Icons.Activity;
            
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="border rounded-lg p-4 bg-background cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      s.trend === "up" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                    )}>
                      <Icon className={cn("h-5 w-5", s.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold">
                        <NumberFlow 
                          value={s.value} 
                          suffix={s.label === "Revenue" ? "M" : s.label === "Users" ? "K" : "%"} 
                          format={s.label === "Revenue" ? { style: 'currency', currency: 'USD' } : undefined}
                        />
                      </p>
                    </div>
                  </div>
                  <Badge className={cn("font-medium", s.trend === "up" ? "bg-green-600 dark:bg-green-400" : "bg-red-600 dark:bg-red-400")}>
                    {s.change}
                  </Badge>
                </div>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    height: isHovered ? 'auto' : 0,
                    opacity: isHovered ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t">
                    <p className="text-sm text-muted-foreground">{s.detail}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

