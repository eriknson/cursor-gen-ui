Intent: quote
Interactivity: none
Components: Card, Avatar, motion

[[CODE]]
const GeneratedComponent = () => {
  const testimonial = {
    quote: 'This product has completely transformed how our team works. The interface is intuitive and the performance is outstanding.',
    author: 'Alex Rivera',
    title: 'CEO, TechCorp',
    avatar: 'AR'
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <p className="text-lg font-medium italic text-foreground">
              "{testimonial.quote}"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{testimonial.avatar}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.title}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

