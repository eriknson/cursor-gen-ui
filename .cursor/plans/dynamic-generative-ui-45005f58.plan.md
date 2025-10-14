<!-- 45005f58-80bb-45ca-8d5e-db8e60e729ea 0817a260-e74d-411c-b174-e4cb9fed0262 -->
# Dynamic Generative UI - Comprehensive Architecture

## Overview

Multi-agent system for generating highly interactive, context-specific UI components using shadcn/ui primitives. **Maintains existing minimal Cursor aesthetic** with motion animations, NumberFlow, and clean typography.

## Design Aesthetic (Must Maintain)

Based on existing components, dynamically generated UIs MUST follow:

**Layout:**
- Responsive wrapper: `md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full`
- Card container always, subtle gradients: `bg-gradient-to-br from-muted/50 to-muted/30`
- Motion animations: `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`

**Typography:**
- Large numbers: `text-4xl` to `text-6xl font-bold`
- Body: `text-sm font-medium`
- Captions: `text-xs text-muted-foreground`
- Font: "uncut sans" (already loaded globally)

**Spacing:**
- Tight, minimal: `p-6`, `gap-2`, `space-y-4`
- NO Separator component - use `border-t border-border` sparingly
- White space over dividers

**Colors:**
- Use CSS variables: `text-foreground`, `text-muted-foreground`, `bg-muted`
- Positive: `text-green-600 dark:text-green-400`
- Negative: `text-red-600 dark:text-red-400`
- Subtle gradients, no vibrant colors unless user-requested

**Animations:**
- Use NumberFlow for number transitions: `<NumberFlow value={data.price} />`
- Framer-motion for entrance: `duration: 0.3`, stagger with `delay: index * 0.1`

**Charts:**
- Use ChartContainer from shadcn with ChartConfig
- Minimal styling, monochrome colors by default
- Small sparklines: `h-[80px]`

## Architecture

```
User Query
    ↓
[Planner Agent]
  - Determines intent, components, data needs
  - Outputs: intent, needsWebSearch, suggestedComponents, interactivity
    ↓
[Data Agent] (if web search needed)
  - Searches web using web_search tool
  - Extracts structured data from results (LLM does parsing naturally)
  - Outputs: data, source, confidence
    ↓
[Renderer Agent]
  - Loads relevant example on-demand
  - Generates React component with interactivity
  - Outputs: component code
    ↓
[Validators] (fast, sync)
  - validateStructure()
  - validateSafety()
  - validateStyle()
    ↓
[Critic Agent] (optional, async)
  - Reviews code quality if style score < 70
  - Suggests improvements
  - Can trigger auto-fix
    ↓
[Dynamic Renderer]
  - Babel transform
  - Inject scope (includes NumberFlow, motion, all shadcn)
  - Render with error boundary
```

## Implementation

### 1. Install Dependencies

```bash
npm install @babel/standalone zod
```

### 2. Create Validators

**New file: `lib/component-validators.ts`**

```typescript
import { z } from 'zod';

export function validateStructure(code: string): { valid: boolean; error?: string } {
  if (!code.includes('const GeneratedComponent')) {
    return { valid: false, error: 'Missing: const GeneratedComponent = () => {...}' };
  }
  if (!code.includes('return')) {
    return { valid: false, error: 'Component must return JSX' };
  }
  if (code.includes('import ')) {
    return { valid: false, error: 'No imports allowed' };
  }
  if (code.includes('export ')) {
    return { valid: false, error: 'No exports allowed' };
  }
  return { valid: true };
}

export function validateSafety(code: string): { safe: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (code.includes('dangerouslySetInnerHTML')) issues.push('XSS risk');
  if (code.includes('eval(') || code.includes('Function(')) issues.push('Code injection');
  if (code.includes('useEffect')) issues.push('No useEffect allowed');
  if (code.includes('fetch(') || code.includes('axios')) issues.push('No fetch allowed');
  if (code.includes('localStorage') || code.includes('sessionStorage')) issues.push('No storage access');
  if (code.includes('window.') || code.includes('document.')) issues.push('No DOM access');
  
  return { safe: issues.length === 0, issues };
}

export function validateStyle(code: string): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  let score = 100;
  
  if (!code.includes('<Card')) {
    warnings.push('Should wrap in Card component');
    score -= 20;
  }
  if (!code.includes('md:max-w-[452px]')) {
    warnings.push('Use correct responsive width: md:max-w-[452px] max-w-[calc(100dvw-80px)]');
    score -= 10;
  }
  if (code.split('\n').length > 120) {
    warnings.push('Code too long (keep under 120 lines)');
    score -= 15;
  }
  if (code.includes('Separator')) {
    warnings.push('Avoid Separator - use border-t border-border instead');
    score -= 5;
  }
  if (!code.includes('motion.div')) {
    warnings.push('Add framer-motion entrance animation');
    score -= 5;
  }
  
  return { score, warnings };
}
```

### 3. Component Registry & Example Loader

**New file: `lib/component-registry.ts`**

```typescript
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
    'Progress', 'ScrollArea',
    'ChartContainer' // shadcn chart wrapper
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
```

### 4. Loading States

**New file: `lib/loading-states.ts`**

```typescript
export type LoadingPhase = 
  | 'analyzing'
  | 'planning'
  | 'searching'
  | 'extracting'
  | 'designing'
  | 'generating'
  | 'validating'
  | 'reviewing'
  | 'complete';

export interface LoadingState {
  phase: LoadingPhase;
  message: string;
  progress: number;
  subtext?: string;
}

export function getLoadingState(phase: LoadingPhase): LoadingState {
  const states: Record<LoadingPhase, LoadingState> = {
    analyzing: { phase: 'analyzing', message: 'Understanding your question', progress: 5, subtext: 'Analyzing intent and requirements' },
    planning: { phase: 'planning', message: 'Planning the UI', progress: 15, subtext: 'Choosing components and layout' },
    searching: { phase: 'searching', message: 'Searching the web', progress: 35, subtext: 'Finding live data sources' },
    extracting: { phase: 'extracting', message: 'Processing results', progress: 50, subtext: 'Extracting structured data' },
    designing: { phase: 'designing', message: 'Designing the interface', progress: 65, subtext: 'Creating interactive layout' },
    generating: { phase: 'generating', message: 'Generating component', progress: 80, subtext: 'Building React code' },
    validating: { phase: 'validating', message: 'Validating', progress: 90, subtext: 'Running safety checks' },
    reviewing: { phase: 'reviewing', message: 'Reviewing quality', progress: 95, subtext: 'Final polish' },
    complete: { phase: 'complete', message: 'Complete', progress: 100 }
  };
  
  return states[phase];
}
```

### 5. Multi-Agent Prompts

**New file: `lib/agent-prompts.ts`**

```typescript
export const PLANNER_PROMPT = `You are a UI Planner. Analyze the user query and output JSON:

{
  "intent": "metric|trend|comparison|list|fact|status|timeline|profile|gallery|calculator|quote|map",
  "needsWebSearch": boolean,
  "searchQuery": string | null,
  "suggestedComponents": string[],
  "interactivityType": "none|sort|filter|calculate|toggle|tabs|accordion|slider"
}

Rules:
- needsWebSearch: true

### To-dos

- [ ] Install @babel/standalone for JSX transformation
- [ ] Create lib/dynamic-renderer.tsx with Babel transformation and component injection
- [ ] Rewrite SYSTEM_PROMPT in agent-wrapper.ts with minimal examples and strict protocol
- [ ] Update AgentResponse interface to include componentCode, summary, source
- [ ] Update parseFinalResponse to extract [[CODE]] and [[FINAL]] blocks
- [ ] Simplify component-renderer.tsx to use dynamic renderer with fallback
- [ ] Update streaming logic to parse [[CHUNK]] stages and show progressive UI
- [ ] Test with diverse queries: stocks, weather, recipes, comparisons, directions