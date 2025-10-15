Intent: list
Interactivity: accordion
Components: Card, Accordion, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const steps = [
    { title: 'Preheat oven', detail: 'Set your oven to 375°F (190°C) and let it warm up for 10 minutes.', time: '10 min' },
    { title: 'Mix ingredients', detail: 'Combine flour, sugar, and eggs in a large bowl. Mix until smooth.', time: '5 min' },
    { title: 'Bake', detail: 'Pour mixture into pan and bake for 25-30 minutes until golden brown.', time: '30 min' }
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
          <CardTitle>Chocolate Cake Recipe</CardTitle>
          <CardDescription>3 simple steps · 45 min total</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {steps.map((step, i) => (
              <AccordionItem key={i} value={`step-${i}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-xs text-muted-foreground">{step.time}</div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-11 pr-4 text-sm text-muted-foreground">
                    {step.detail}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

