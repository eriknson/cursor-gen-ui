Intent: fact
Interactivity: accordion
Components: Card, Accordion, Badge, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const specs = {
    name: 'SpaceX Starship',
    status: 'In Development',
    height: 120,
    diameter: 9,
    sections: [
      { title: 'Propulsion', icon: 'Rocket', details: ['33 Raptor engines', 'Liquid methane & oxygen', '7,600 tons thrust'] },
      { title: 'Capacity', icon: 'Package', details: ['100+ tons to LEO', '100-150 passengers', 'Fully reusable'] },
      { title: 'Mission', icon: 'Target', details: ['Mars colonization', 'Moon missions', 'Earth-to-Earth transport'] }
    ]
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/50 dark:to-blue-900/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{specs.name}</CardTitle>
              <CardDescription className="mt-1">Next-gen spacecraft</CardDescription>
            </div>
            <Badge className="bg-blue-600 dark:bg-blue-400">{specs.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Height</div>
              <div className="text-2xl font-bold">
                <NumberFlow value={specs.height} suffix=" m" />
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-1">Diameter</div>
              <div className="text-2xl font-bold">
                <NumberFlow value={specs.diameter} suffix=" m" />
              </div>
            </div>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {specs.sections.map((section, idx) => {
              const Icon = Icons[section.icon] || Icons.Info;
              return (
                <AccordionItem key={idx} value={`section-${idx}`}>
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      {section.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pt-2">
                      {section.details.map((detail, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Icons.ChevronRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
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

