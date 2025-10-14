Intent: map
Interactivity: none
Components: Card, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const steps = [
    {icon: Icons.MapPin, text: 'Start at Times Square', sub: 'Broadway & 7th Ave'},
    {icon: Icons.ArrowUp, text: 'Walk north on Broadway', sub: '0.3 mi · 6 min'},
    {icon: Icons.ArrowRight, text: 'Turn right on Central Park South', sub: '0.2 mi · 4 min'},
    {icon: Icons.Trees, text: 'Enter Central Park', sub: '6th Ave entrance'}
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
          <CardTitle>Times Square → Central Park</CardTitle>
          <CardDescription>15 min walk (0.5 mi)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex gap-3 items-start">
                  <div className="mt-0.5">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{s.text}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

