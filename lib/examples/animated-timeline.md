Intent: timeline
Interactivity: animate
Components: Card, Badge, Accordion, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  const milestones = [
    { date: 'Q1 2025', title: 'Beta Launch', status: 'completed', description: 'Initial release to select users', metrics: '500 beta testers' },
    { date: 'Q2 2025', title: 'Public Release', status: 'in-progress', description: 'Full public availability', metrics: 'Target: 10K users' },
    { date: 'Q4 2025', title: 'Enterprise Features', status: 'planned', description: 'Advanced security and analytics', metrics: 'Goal: 100 companies' }
  ];
  
  const statusColors = {
    completed: 'bg-green-600 dark:bg-green-400',
    'in-progress': 'bg-blue-600 dark:bg-blue-400',
    planned: 'bg-gray-400 dark:bg-gray-600'
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-violet-50/50 to-violet-100/30 dark:from-violet-950/50 dark:to-violet-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Calendar className="h-5 w-5" />
            Product Roadmap 2025
          </CardTitle>
          <CardDescription>Click milestones for details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {milestones.map((milestone, i) => {
            const isExpanded = expandedIndex === i;
            const Icon = milestone.status === 'completed' ? Icons.CheckCircle2 : 
                        milestone.status === 'in-progress' ? Icons.Loader2 : Icons.Circle;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                className="relative"
              >
                <div
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="flex gap-3 p-3 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.15 + 0.2 }}
                    >
                      <Icon className={cn("h-5 w-5", statusColors[milestone.status])} />
                    </motion.div>
                    {i < milestones.length - 1 && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: i * 0.15 + 0.3, duration: 0.3 }}
                        className="w-0.5 flex-1 bg-border mt-1"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground">{milestone.date}</span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">{milestone.title}</h4>
                    
                    <motion.div
                      initial={false}
                      animate={{ 
                        height: isExpanded ? 'auto' : 0,
                        opacity: isExpanded ? 1 : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 space-y-2">
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <Icons.Target className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                          <span className="font-medium">{milestone.metrics}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

