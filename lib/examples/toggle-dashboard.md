# Toggle Dashboard

**Pattern**: Multiple useState for independent controls
**Use Case**: Settings panels, feature flags, preferences
**Hooks**: useState, useMemo

## Example Code

```tsx
const GeneratedComponent = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  
  // Calculate security score using useMemo
  const securityScore = useMemo(() => {
    let score = 0;
    if (twoFactor) score += 40;
    if (!analytics) score += 30; // Privacy = security
    if (notifications) score += 15; // Stay informed
    if (autoSave) score += 15; // Data protection
    return score;
  }, [twoFactor, analytics, notifications, autoSave]);
  
  const settings = [
    {
      id: 'notifications',
      label: 'Push Notifications',
      description: 'Receive alerts for important updates',
      icon: 'Bell',
      enabled: notifications,
      onChange: setNotifications
    },
    {
      id: 'darkMode',
      label: 'Dark Mode',
      description: 'Reduce eye strain in low light',
      icon: 'Moon',
      enabled: darkMode,
      onChange: setDarkMode
    },
    {
      id: 'autoSave',
      label: 'Auto-Save',
      description: 'Automatically save your work',
      icon: 'Save',
      enabled: autoSave,
      onChange: setAutoSave
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      description: 'Help improve the app',
      icon: 'BarChart',
      enabled: analytics,
      onChange: setAnalytics
    },
    {
      id: 'twoFactor',
      label: 'Two-Factor Auth',
      description: 'Enhanced account security',
      icon: 'Shield',
      enabled: twoFactor,
      onChange: setTwoFactor
    }
  ];
  
  return (
    <motion.div 
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-slate-50/50 to-slate-100/30 dark:from-slate-950/50 dark:to-slate-900/30">
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>Customize your experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Security Score Banner */}
          <div className="p-3 bg-background rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Security Score</span>
              <Badge variant={securityScore >= 70 ? "default" : "secondary"}>
                <NumberFlow value={securityScore} />%
              </Badge>
            </div>
            <Progress value={securityScore} />
          </div>
          
          <Separator />
          
          {/* Settings List */}
          <div className="space-y-3">
            {safeMap(settings, (setting) => {
              const IconComponent = Icons[setting.icon];
              
              return (
                <div 
                  key={setting.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-md ${setting.enabled ? 'bg-primary/10' : 'bg-muted'}`}>
                      <IconComponent 
                        className={`h-4 w-4 ${setting.enabled ? 'text-primary' : 'text-muted-foreground'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{setting.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {setting.description}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={setting.onChange}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
```

## Key Features

1. **Independent State**: Each setting has its own useState
2. **useMemo for Performance**: Security score only recalculates when deps change
3. **No useEffect Needed**: Simple state updates don't require side effects
4. **Clean State Updates**: Direct setter functions passed to Switch
5. **Derived State**: Security score computed from settings without additional state

