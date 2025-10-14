Intent: status
Interactivity: accordion
Components: Card, Badge, Progress, Accordion, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [progress, setProgress] = useState(0);
  
  const flight = {
    number: 'UA 1234',
    from: 'SFO',
    to: 'JFK',
    status: 'On Time',
    departure: '10:30 AM',
    arrival: '6:45 PM',
    gate: 'B12',
    targetProgress: 65,
    details: {
      aircraft: 'Boeing 737-800',
      terminal: 'Terminal 3',
      baggage: 'Carousel 5',
      altitude: '35,000 ft',
      speed: '450 mph'
    }
  };
  
  // Animate progress on mount
  useEffect(() => {
    const timer = setTimeout(() => setProgress(flight.targetProgress), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/50 dark:to-indigo-900/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Flight {flight.number}</CardTitle>
              <CardDescription>{flight.from} → {flight.to}</CardDescription>
            </div>
            <Badge className="bg-green-600 dark:bg-green-400">{flight.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Departure</div>
              <div className="text-2xl font-bold">{flight.departure}</div>
              <div className="text-xs text-muted-foreground mt-1">{flight.from}</div>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <Icons.Plane className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </motion.div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Arrival</div>
              <div className="text-2xl font-bold">{flight.arrival}</div>
              <div className="text-xs text-muted-foreground mt-1">{flight.to}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Flight Progress</span>
              <span><NumberFlow value={progress} suffix="%" /></span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-0">
              <AccordionTrigger className="text-sm font-medium hover:no-underline py-3">
                <div className="flex items-center gap-2">
                  <Icons.Info className="h-4 w-4" />
                  Flight Details
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Gate</div>
                    <div className="font-medium">{flight.gate}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Baggage</div>
                    <div className="font-medium">{flight.details.baggage}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Aircraft</div>
                    <div className="font-medium">{flight.details.aircraft}</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-muted-foreground">Terminal</div>
                    <div className="font-medium">{flight.details.terminal}</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

