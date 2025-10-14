Intent: timeline
Interactivity: none
Components: Card, Badge, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const items = [
    {title: 'Q1 2025: Launch Beta', status: 'completed', icon: Icons.CheckCircle},
    {title: 'Q2 2025: Public Release', status: 'completed', icon: Icons.CheckCircle},
    {title: 'Q3 2025: Mobile App', status: 'in-progress', icon: Icons.Circle},
    {title: 'Q4 2025: Enterprise Features', status: 'planned', icon: Icons.Circle}
  ];
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <CardTitle>Product Roadmap</CardTitle>
          <CardDescription>2025 Timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={i}
                  className="flex gap-3 items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Icon className={cn(
                    "h-5 w-5 mt-0.5",
                    item.status === 'completed' ? "text-green-600 dark:text-green-400" : 
                    item.status === 'in-progress' ? "text-blue-600 dark:text-blue-400" : 
                    "text-muted-foreground"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <Badge variant="outline" className={cn(
                      "text-xs mt-1",
                      item.status === 'completed' ? "border-green-600 dark:border-green-400 text-green-600 dark:text-green-400" :
                      item.status === 'in-progress' ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400" :
                      "border-muted-foreground text-muted-foreground"
                    )}>
                      {item.status === 'completed' ? 'Completed' : item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </Badge>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

