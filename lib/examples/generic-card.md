Intent: generic
Interactivity: none
Components: Card, motion

[[CODE]]
const GeneratedComponent = () => {
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardHeader>
          <CardTitle>Information</CardTitle>
          <CardDescription>Clean and minimal</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a generic card component with the Cursor aesthetic.
            Use this as a starting point for custom layouts.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

