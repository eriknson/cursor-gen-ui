Intent: gallery
Interactivity: hover
Components: Card, motion, Icons

[[CODE]]
const GeneratedComponent = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  const photos = [
    {url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', caption: 'Mountain Vista', location: 'Swiss Alps', likes: 234},
    {url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538', caption: 'Ocean Sunset', location: 'Malibu Beach', likes: 189},
    {url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901', caption: 'Forest Trail', location: 'Redwood Park', likes: 156}
  ];
  
  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/50 dark:to-amber-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Camera className="h-5 w-5" />
            Travel Gallery
          </CardTitle>
          <CardDescription>{photos.length} featured photos • Hover for details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {photos.map((photo, i) => {
            const isHovered = hoveredIndex === i;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
                className="relative aspect-video rounded-lg overflow-hidden bg-muted cursor-pointer group"
              >
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h4 className="text-white font-semibold text-sm">{photo.caption}</h4>
                  <motion.div
                    initial={false}
                    animate={{ 
                      height: isHovered ? 'auto' : 0,
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center justify-between mt-2 text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <Icons.MapPin className="h-3 w-3" />
                        <span>{photo.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Icons.Heart className="h-3 w-3" />
                        <span>{photo.likes}</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

