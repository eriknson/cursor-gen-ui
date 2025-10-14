Intent: calculator
Interactivity: slider
Components: Card, Slider, Label, motion, NumberFlow, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [years, setYears] = useState(30);
  
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = years * 12;
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/50 dark:to-emerald-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Home className="h-5 w-5" />
            Mortgage Calculator
          </CardTitle>
          <CardDescription>Adjust to see your monthly payment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <div className="text-xs text-muted-foreground mb-1">Monthly Payment</div>
            <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              <NumberFlow value={monthlyPayment} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0 }} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Loan Amount</Label>
                <span className="font-medium">
                  <NumberFlow value={loanAmount} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0 }} />
                </span>
              </div>
              <Slider value={[loanAmount]} onValueChange={([v]) => setLoanAmount(v)} min={50000} max={1000000} step={10000} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Interest Rate</Label>
                <span className="font-medium">
                  <NumberFlow value={interestRate} format={{ minimumFractionDigits: 1 }} suffix="%" />
                </span>
              </div>
              <Slider value={[interestRate]} onValueChange={([v]) => setInterestRate(v)} min={2} max={12} step={0.1} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <Label>Loan Term</Label>
                <span className="font-medium">
                  <NumberFlow value={years} suffix=" years" />
                </span>
              </div>
              <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={10} max={30} step={5} />
            </div>
          </div>
          
          <div className="pt-3 border-t border-border space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Interest</span>
              <span className="font-medium">
                <NumberFlow value={totalInterest} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 0 }} />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

