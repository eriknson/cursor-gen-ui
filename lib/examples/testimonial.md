Intent: quote
Interactivity: animate
Components: Card, Avatar, Badge, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const testimonial = {
    quote: 'This product has completely transformed how our team works. The interface is intuitive and the performance is outstanding.',
    author: 'Alex Rivera',
    title: 'CEO, TechCorp',
    avatar: 'AR',
    rating: 5,
    company: 'TechCorp',
    metrics: { productivity: '+45%', satisfaction: '9.8/10' }
  };
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/50 dark:to-orange-900/30">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex items-center gap-1 mb-3"
            >
              {[...Array(testimonial.rating)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <Icons.Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg font-medium italic text-foreground"
            >
              "{testimonial.quote}"
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3 pt-2 border-t border-border"
            >
              <Avatar className="h-12 w-12 ring-2 ring-orange-200 dark:ring-orange-800">
                <AvatarFallback className="bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100">
                  {testimonial.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">{testimonial.author}</p>
                <p className="text-xs text-muted-foreground">{testimonial.title}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {testimonial.company}
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="grid grid-cols-2 gap-2 pt-2"
            >
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-xs text-muted-foreground">Productivity</div>
                <div className="text-sm font-bold text-green-600 dark:text-green-400">{testimonial.metrics.productivity}</div>
              </div>
              <div className="bg-background/50 rounded-lg p-2 text-center">
                <div className="text-xs text-muted-foreground">Satisfaction</div>
                <div className="text-sm font-bold">{testimonial.metrics.satisfaction}</div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

