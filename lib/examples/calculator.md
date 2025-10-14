# Calculator Example

[[CODE]]
const GeneratedComponent = () => {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);

  const calc = (a, b, operation) => {
    if (operation === "+") return a + b;
    if (operation === "-") return a - b;
    if (operation === "×") return a * b;
    if (operation === "÷") return b !== 0 ? a / b : 0;
    return b;
  };

  const handleNum = (n) => setDisplay(display === "0" ? n : display + n);
  const handleOp = (operation) => {
    const curr = parseFloat(display);
    if (prev !== null && op) {
      const result = calc(prev, curr, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(curr);
    }
    setOp(operation);
    setDisplay("0");
  };

  const buttons = [
    ["7","8","9","÷"],
    ["4","5","6","×"],
    ["1","2","3","-"],
    ["0","C","=","+"]
  ];

  return (
    <motion.div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}>
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/50 dark:to-slate-900/30">
        <CardHeader>
          <CardTitle>Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-background p-4 rounded-lg text-right">
            <div className="text-4xl font-bold"><NumberFlow value={parseFloat(display) || 0} /></div>
          </div>
          <div className="space-y-2">
            {(buttons || []).map((row, i) => (
              <div key={i} className="grid grid-cols-4 gap-2">
                {(row || []).map((btn) => (
                  <Button
                    key={btn}
                    onClick={() => {
                      if (btn === "C") { setDisplay("0"); setPrev(null); setOp(null); }
                      else if (btn === "=") { 
                        if (op && prev !== null) {
                          setDisplay(String(calc(prev, parseFloat(display), op)));
                          setPrev(null); setOp(null);
                        }
                      }
                      else if (["+","-","×","÷"].includes(btn)) handleOp(btn);
                      else handleNum(btn);
                    }}
                    variant={["+","-","×","÷","="].includes(btn) ? "default" : "outline"}
                    className="h-14 text-lg"
                  >
                    {btn}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

