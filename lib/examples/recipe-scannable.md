Intent: list
Interactivity: accordion
Components: Card, Badge, Accordion, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const recipe = {
    title: 'Chocolate Chip Cookies',
    prepTime: '15 min',
    cookTime: '12 min',
    ingredients: [
      '2¼ cups flour',
      '1 tsp baking soda',
      '1 cup butter, softened',
      '2 eggs',
      '2 cups chocolate chips'
    ],
    steps: [
      'Preheat oven to 375°F',
      'Mix dry ingredients',
      'Cream butter and sugar',
      'Combine and fold in chips',
      'Bake 9-11 minutes'
    ]
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">{recipe.prepTime} prep</Badge>
            <Badge variant="outline" className="text-xs">{recipe.cookTime} cook</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ingredients">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Icons.ShoppingCart className="h-4 w-4" />
                  Ingredients
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {recipe.ingredients.map((i, idx) => <li key={idx}>• {i}</li>)}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="steps">
              <AccordionTrigger className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Icons.Flame className="h-4 w-4" />
                  Steps
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="text-sm space-y-1 text-muted-foreground">
                  {recipe.steps.map((s, idx) => <li key={idx}>{idx+1}. {s}</li>)}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

