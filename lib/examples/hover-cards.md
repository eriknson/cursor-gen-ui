Intent: list
Interactivity: hover
Components: Card, Badge, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const languages = [
    { name: 'Python', usage: 48.2, trend: 'up', icon: 'Code2', color: 'from-blue-500 to-blue-600', strengths: ['AI/ML', 'Data Science', 'Web'] },
    { name: 'JavaScript', usage: 63.6, trend: 'up', icon: 'Braces', color: 'from-yellow-500 to-yellow-600', strengths: ['Web Dev', 'Full Stack', 'Mobile'] },
    { name: 'TypeScript', usage: 38.9, trend: 'up', icon: 'FileCode', color: 'from-blue-600 to-blue-700', strengths: ['Type Safety', 'Scale', 'Tooling'] }
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
          <CardTitle>Top Programming Languages</CardTitle>
          <CardDescription>Most popular in 2025 • Hover for details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {languages.map((lang, i) => {
            const Icon = Icons[lang.icon] || Icons.Code;
            const isHovered = hoveredIndex === i;
            
            return (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative bg-background rounded-lg p-4 cursor-pointer border-2 transition-colors"
                style={{
                  borderColor: isHovered ? 'hsl(var(--primary))' : 'transparent'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center", lang.color)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{lang.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <NumberFlow value={lang.usage} format={{ minimumFractionDigits: 1 }} suffix="% usage" />
                      </div>
                    </div>
                  </div>
                  {lang.trend === 'up' && (
                    <Icons.TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isHovered ? 'auto' : 0,
                    opacity: isHovered ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-border">
                    <div className="text-xs font-medium text-muted-foreground mb-2">BEST FOR</div>
                    <div className="flex flex-wrap gap-1">
                      {lang.strengths.map((strength) => (
                        <Badge key={strength} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

