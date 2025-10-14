import fs from 'fs';
import path from 'path';

export const COMPONENT_SCOPE = {
  react: ['React', 'useState', 'useMemo', 'useCallback', 'useRef'],
  shadcn: [
    'Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'CardFooter',
    'Badge', 'Button', 'Input', 'Label',
    'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent',
    'Slider', 'Switch', 'Select', 'SelectTrigger', 'SelectValue', 'SelectContent', 'SelectItem',
    'Accordion', 'AccordionItem', 'AccordionTrigger', 'AccordionContent',
    'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHead', 'TableCell',
    'Avatar', 'AvatarImage', 'AvatarFallback',
    'Progress', 'ScrollArea', 'Separator',
    'ChartContainer' // shadcn chart wrapper (ChartConfig is a type, not a component)
  ],
  charts: [
    'ResponsiveContainer', 'LineChart', 'BarChart', 'AreaChart', 'PieChart',
    'Line', 'Bar', 'Area', 'Pie', 'XAxis', 'YAxis', 'CartesianGrid', 'Tooltip', 'Legend', 'Cell'
  ],
  other: ['Icons', 'motion', 'cn', 'NumberFlow']
};

export function formatScope(): string {
  return `React: ${COMPONENT_SCOPE.react.join(', ')}
Shadcn: ${COMPONENT_SCOPE.shadcn.join(', ')}
Charts: ${COMPONENT_SCOPE.charts.join(', ')}
Other: ${COMPONENT_SCOPE.other.join(', ')} (Icons from lucide-react, NumberFlow for numbers, motion from framer-motion)`;
}

const EXAMPLE_MAP: Record<string, string> = {
  metric: 'stock-live.md',
  fact: 'weather-minimal.md',
  list: 'recipe-scannable.md',
  comparison: 'phone-sortable.md',
  trend: 'metrics-dashboard.md',
  status: 'flight-status.md',
  timeline: 'product-roadmap.md',
  profile: 'person-bio.md',
  gallery: 'photo-grid.md',
  calculator: 'tip-calculator.md',
  quote: 'testimonial.md',
  map: 'directions-steps.md'
};

export function getExampleForIntent(intent: string): string {
  const filename = EXAMPLE_MAP[intent] || 'generic-card.md';
  const examplePath = path.join(process.cwd(), 'lib', 'examples', filename);
  
  try {
    return fs.readFileSync(examplePath, 'utf-8');
  } catch (error) {
    console.warn(`Example file not found: ${filename}, using fallback`);
    return '// No specific example available';
  }
}

