Intent: calculator
Interactivity: slider
Components: Card, Slider, Label, motion, NumberFlow

[[CODE]]
const GeneratedComponent = () => {
  const [bill, setBill] = useState(50);
  const [tip, setTip] = useState(18);
  const total = bill * (1 + tip / 100);
  const tipAmount = bill * (tip / 100);
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <CardTitle>Tip Calculator</CardTitle>
          <CardDescription>Adjust bill amount and tip percentage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label>Bill Amount</Label>
              <span className="font-medium"><NumberFlow value={bill} format={{ style: 'currency', currency: 'USD' }} /></span>
            </div>
            <Slider value={[bill]} onValueChange={([v]) => setBill(v)} min={1} max={500} step={1} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Label>Tip Percentage</Label>
              <span className="font-medium"><NumberFlow value={tip} suffix="%" /></span>
            </div>
            <Slider value={[tip]} onValueChange={([v]) => setTip(v)} min={0} max={30} step={1} />
          </div>
          
          <div className="bg-muted rounded-lg p-4 space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tip</span>
              <span className="font-medium"><NumberFlow value={tipAmount} format={{ style: 'currency', currency: 'USD' }} /></span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span><NumberFlow value={total} format={{ style: 'currency', currency: 'USD' }} /></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

