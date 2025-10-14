Intent: gallery
Interactivity: none
Components: Card, motion

[[CODE]]
const GeneratedComponent = () => {
  const photos = [
    {url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba', caption: 'Mountain landscape'},
    {url: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538', caption: 'Ocean sunset'},
    {url: 'https://images.unsplash.com/photo-1682687221038-404cb8830901', caption: 'Forest path'},
    {url: 'https://images.unsplash.com/photo-1682687221073-2e2f1a5e9e7a', caption: 'Desert dunes'}
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
          <CardTitle>Photo Gallery</CardTitle>
          <CardDescription>{photos.length} photos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((photo, i) => (
              <motion.div
                key={i}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-xs text-white font-medium">{photo.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

