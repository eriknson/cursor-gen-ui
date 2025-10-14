Intent: map
Interactivity: accordion
Components: Card, Accordion, Badge, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const steps = [
    {id: 1, icon: 'MapPin', text: 'Start at Times Square', sub: 'Broadway & 7th Ave', detail: 'Exit subway at 42nd St-Times Square station'},
    {id: 2, icon: 'ArrowUp', text: 'Walk north on Broadway', sub: '0.3 mi · 6 min', detail: 'Pass through Theater District. Look for bright billboards.'},
    {id: 3, icon: 'ArrowRight', text: 'Turn right on Central Park South', sub: '0.2 mi · 4 min', detail: 'You\'ll see horse carriages and park entrance ahead'}
  ];
  
  const toggleStep = (id) => {
    setCompletedSteps(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };
  
  const progress = (completedSteps.length / steps.length) * 100;
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-teal-50/50 to-teal-100/30 dark:from-teal-950/50 dark:to-teal-900/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Times Square → Central Park</CardTitle>
              <CardDescription>15 min walk (0.5 mi)</CardDescription>
            </div>
            <Badge variant="secondary">
              {completedSteps.length}/{steps.length}
            </Badge>
          </div>
          <div className="mt-3">
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {steps.map((s, i) => {
              const Icon = Icons[s.icon] || Icons.Navigation;
              const isCompleted = completedSteps.includes(s.id);
              
              return (
                <AccordionItem key={s.id} value={`step-${s.id}`} className="border-b-0">
                  <div className="flex items-start gap-3 py-2">
                    <motion.button
                      onClick={() => toggleStep(s.id)}
                      className="mt-1"
                      whileTap={{ scale: 0.9 }}
                    >
                      {isCompleted ? (
                        <Icons.CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Icons.Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </motion.button>
                    <div className="flex-1">
                      <AccordionTrigger className="py-0 hover:no-underline">
                        <div className="flex items-center gap-2 text-left">
                          <Icon className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                          <div>
                            <p className={cn("text-sm font-medium", isCompleted && "line-through text-muted-foreground")}>
                              {s.text}
                            </p>
                            <p className="text-xs text-muted-foreground">{s.sub}</p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-xs text-muted-foreground pl-6 pt-2">{s.detail}</p>
                      </AccordionContent>
                    </div>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

