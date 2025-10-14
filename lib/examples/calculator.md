# Calculator Example

```tsx
const GeneratedComponent = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  // Inline calculation logic (no helper function definition)
  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const buttons = [
    ["7", "8", "9", "÷"],
    ["4", "5", "6", "×"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"]
  ];

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/50 dark:to-slate-900/30">
        <CardHeader>
          <CardTitle>Calculator</CardTitle>
          <CardDescription>Simple arithmetic operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display */}
          <div className="bg-background p-4 rounded-lg text-right">
            <div className="text-xs text-muted-foreground h-4">
              {previousValue !== null && operation ? `${previousValue} ${operation}` : " "}
            </div>
            <div className="text-4xl font-bold font-mono">
              <NumberFlow value={parseFloat(display) || 0} />
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="space-y-2">
            {buttons.map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                {row.map((btn) => (
                  <Button
                    key={btn}
                    onClick={() => {
                      if (btn === "=") handleEquals();
                      else if (btn === ".") handleDecimal();
                      else if (["+", "-", "×", "÷"].includes(btn)) handleOperator(btn);
                      else handleNumber(btn);
                    }}
                    variant={["+", "-", "×", "÷", "="].includes(btn) ? "default" : "outline"}
                    className={`h-14 text-lg font-semibold ${
                      btn === "=" ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            ))}
          </div>

          {/* Clear Button */}
          <Button
            onClick={handleClear}
            variant="destructive"
            className="w-full"
          >
            Clear
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
```

## Key Patterns

1. **State Management**: Multiple `useState` hooks for display, previous value, operation
2. **Event Handlers**: Inline functions that update state
3. **Calculation Logic**: Inline function (not a separate helper component!)
4. **Grid Layout**: 4x4 button grid using `grid grid-cols-4 gap-2`
5. **Conditional Styling**: Different button variants for operators vs numbers
6. **NumberFlow**: Animated number display for the result
7. **Proper Spacing**: `space-y-4` on CardContent, `space-y-2` for button rows

