Intent: profile
Interactivity: tabs
Components: Card, Avatar, Badge, Tabs, motion

[[CODE]]
const GeneratedComponent = () => {
  const [view, setView] = useState('about');
  const person = {
    name: 'Sarah Chen',
    title: 'Software Engineer',
    avatar: 'SC',
    bio: 'Passionate about building beautiful user experiences with React and TypeScript. Currently working on generative UI systems.',
    stats: [
      {label: 'Followers', value: '12.5K'},
      {label: 'Following', value: '890'},
      {label: 'Posts', value: '234'}
    ],
    links: [
      {label: 'GitHub', url: 'github.com/sarachen'},
      {label: 'Twitter', url: 'twitter.com/sarachen'}
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
          <div className="flex gap-4 items-start">
            <Avatar className="h-16 w-16">
              <AvatarFallback>{person.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{person.name}</CardTitle>
              <CardDescription>{person.title}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={view} onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-3">
              <p className="text-sm text-muted-foreground">{person.bio}</p>
            </TabsContent>
            <TabsContent value="stats" className="mt-3">
              <div className="grid grid-cols-3 gap-2">
                {person.stats.map((s, i) => (
                  <div key={i} className="text-center p-2 rounded-lg bg-background">
                    <div className="text-lg font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="links" className="mt-3">
              <div className="space-y-2">
                {person.links.map((l, i) => (
                  <div key={i} className="text-sm flex items-center gap-2">
                    <Badge variant="secondary">{l.label}</Badge>
                    <span className="text-muted-foreground">{l.url}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

