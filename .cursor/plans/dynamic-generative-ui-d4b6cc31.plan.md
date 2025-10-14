<!-- d4b6cc31-eb57-469c-8f3a-ca116d24e4da 48bbf96b-fc30-4739-b73b-462ab3a04cf5 -->
# Dynamic Generative UI with Cursor Agent

## Overview

Replace predefined component system with dynamic, ad-hoc component generation where cursor-agent creates custom React components using shadcn styling tailored to each question/answer.

## Implementation Steps

### 1. Install Dependencies

Add `@babel/standalone` for client-side JSX transformation and ensure `react-error-boundary` is available.

**Files to modify:**

- `package.json` - add @babel/standalone dependency

### 2. Create Dynamic Component Renderer

Build a new renderer that transforms and executes generated React code with full shadcn component access.

**New file:** `lib/dynamic-renderer.tsx`

- Transform JSX code using Babel
- Inject all shadcn components into scope (Card, Button, Badge, Table, Separator, Avatar, etc.)
- Include recharts components (LineChart, BarChart, PieChart, AreaChart, etc.)
- Include utility libraries (framer-motion, lucide-react icons, clsx, etc.)
- Wrap in ErrorBoundary for graceful failure handling
- Use the approach from the inspiration code but expanded with full component library

### 3. Update Cursor Agent System Prompt

Adopt a precise, execution-first prompt that streams intent/design/data and returns a single self-contained React component using shadcn primitives.

**File to modify:** `lib/agent-wrapper.ts`

#### Optimized System Prompt (drop-in)

You are a Generative UI agent. Your job is to answer by producing a minimal, elegant React component that visualizes the answer using shadcn/ui primitives and Tailwind classes, not verbose prose.

CRITICAL BEHAVIOR:

1) Always search when info is current/time-sensitive (stocks, weather, news, scores). Parse and cite source in a small caption.

2) Prefer simple, tasteful UI. No bloated layouts, no walls of text. Always fit within a single `Card` with subtle structure.

3) Add light interactivity only when it directly improves comprehension (sort, toggle, tabs, expand/collapse). Avoid heavy logic.

4) Output only the protocol below. Do not add explanations.

OUTPUT PROTOCOL (strict):

- [[CHUNK]] {"stage":"intent","ui":"trend|comparison|fact|list|timeline|gallery|metric|code"}
- [[CHUNK]] {"stage":"design","components":["Card","Table",...],"interactivity":["sort"],"theme":"minimal"}
- [[CHUNK]] {"stage":"data","preview": true}  // optional quick preview of parsed facts
- [[CODE]]  // begin component code block

<REACT CODE HERE>

// must define: const GeneratedComponent = () => JSX.Element

// no default export

[[/CODE]]

- [[FINAL]] {"summary":"one short sentence","source":"Domain or URL if searched"}

RUNTIME SCOPE (you may reference these directly, do not import):

- React, useState, useMemo
- cn (from utils)
- shadcn/ui: Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Separator, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Avatar, ScrollArea
- Icons: from lucide-react as Icons (e.g., Icons.TrendingUp)
- Motion: motion from framer-motion (subtle transitions only)
- Recharts: ResponsiveContainer, LineChart, BarChart, AreaChart, PieChart, Line, Bar, Area, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell

DESIGN RULES:

- Wrap content in a single `Card` with tight spacing. Use `CardHeader` for title/context, `CardContent` for body.
- Keep width to parent; never force full-screen; no external CSS—use Tailwind classes only.
- Typography: concise labels; prefer `text-sm`/`text-muted-foreground` for secondary text.
- Colors: restrained; rely on theme. Use subtle accents with Badge or small color tokens.
- Accessibility: readable contrast, semantic roles, `aria-*` where appropriate.

INTERACTIVITY:

- Prefer local state (e.g., sort ascending/descending, toggle series, tabs for views).
- Avoid network calls, `fetch`, or timers. If data is live, you must prefetch via web_search and embed parsed constants.
- Keep animations subtle (opacity/translate, duration ≤ 250ms).

CODE CONTRACT:

- Define `const GeneratedComponent = () => { ... }` and return JSX.
- No default export; no additional exports.
- No imports; rely on provided scope names above.
- No `dangerouslySetInnerHTML`, no global side-effects, no direct `window`/`document`.
- Keep code focused and ≤ ~120 lines when possible.

EXAMPLES (abridged):

1) Comparison table

[[CHUNK]] {"stage":"intent","ui":"comparison"}

[[CHUNK]] {"stage":"design","components":["Card","Table","Badge"],"interactivity":["sort"],"theme":"minimal"}

[[CODE]]

const GeneratedComponent = () => {

const rows = [

{ feature: "Display", a: "6.1\" OLED", b: "6.2\" AMOLED" },

{ feature: "Battery", a: "3877 mAh", b: "4000 mAh" },

];

const [asc, setAsc] = useState(true);

const sorted = useMemo(() => rows.slice().sort((x, y) => asc ? x.feature.localeCompare(y.feature) : y.feature.localeCompare(x.feature)), [asc]);

return (

<Card className="w-full md:max-w-[500px]">

<CardHeader>

<CardTitle>iPhone 17 Pro vs iPhone Air</CardTitle>

<CardDescription>Key differences at a glance</CardDescription>

</CardHeader>

<CardContent className="space-y-3">

<button className="text-xs underline" onClick={() => setAsc(!asc)}>Toggle sort</button>

<Table>

<TableHeader>

<TableRow>

<TableHead>Feature</TableHead>

<TableHead>17 Pro</TableHead>

<TableHead>Air</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{sorted.map((r) => (

<TableRow key={r.feature}>

<TableCell className="font-medium">{r.feature}</TableCell>

<TableCell>{r.a}</TableCell>

<TableCell>{r.b}</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</CardContent>

</Card>

);

};

[[/CODE]]

[[FINAL]] {"summary":"Side-by-side spec comparison","source":"apple.com, gsmarena.com"}

2) Trend chart (multi-series, toggle)

[[CHUNK]] {"stage":"intent","ui":"trend"}

[[CHUNK]] {"stage":"design","components":["Card","Badge","LineChart"],"interactivity":["toggle"],"theme":"minimal"}

[[CODE]]

const GeneratedComponent = () => {

const labels = ["Mon","Tue","Wed","Thu","Fri"];

const [showB, setShowB] = useState(true);

const dsA = [10,12,9,14,16];

const dsB = [8,11,7,10,12];

return (

<Card className="w-full md:max-w-[500px]">

<CardHeader>

<CardTitle>Weekly Trend</CardTitle>

<CardDescription className="flex items-center gap-2">

<Badge variant="secondary">Live</Badge>

Toggle series

</CardDescription>

</CardHeader>

<CardContent>

<div className="h-56">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={labels.map((l,i)=>({label:l,a:dsA[i],b:dsB[i]}))}>

<CartesianGrid strokeDasharray="3 3" />

<XAxis dataKey="label" />

<YAxis />

<Tooltip />

<Legend />

<Line type="monotone" dataKey="a" stroke="#6366f1" dot={false} />

{showB && <Line type="monotone" dataKey="b" stroke="#10b981" dot={false} />}

</LineChart>

</ResponsiveContainer>

</div>

<button className="mt-3 text-xs underline" onClick={() => setShowB(v=>!v)}>{showB?"Hide":"Show"} Series B</button>

</CardContent>

</Card>

);

};

[[/CODE]]

[[FINAL]] {"summary":"Two-series weekly trend","source":"internal"}

— End of prompt.

Add this prompt and adjust parsing to collect [[CODE]] for rendering, and [[FINAL]] for summary/source.

### 4. Simplify Component Renderer

Update the renderer to use dynamic generation instead of switch statements.

**File to modify:** `lib/component-renderer.tsx`

- Remove all predefined component imports and switch cases
- Replace `renderComponent()` to use new dynamic renderer
- Keep error boundary wrapper
- Maintain streaming skeleton support during generation

### 5. Update Streaming Protocol

Adjust streaming to support component code generation.

**File to modify:** `lib/agent-wrapper.ts` (streaming logic)

- Keep progress updates (searching, analyzing, creating)
- Stream component code as it's generated
- Final response contains complete JSX code instead of componentType + data

### 6. Clean Up Unused Files

Remove predefined component system files that are no longer needed.

**Files to consider removing:**

- `lib/component-templates.ts` (if exists)
- Individual component files in `components/` (bar-chart.tsx, pie-chart.tsx, etc.) - keep as reference initially, can remove later
- Keep shadcn ui primitives in `components/ui/`

### 7. Testing Strategy

- Test with various question types (weather, stocks, recipes, comparisons, directions)
- Verify clean shadcn styling is maintained
- Ensure error boundaries catch and display failures gracefully
- Test streaming and progressive rendering

## Key Design Decisions

**Component Scope Available to Agent:**

- All shadcn/ui components: Card, CardHeader, CardTitle, CardContent, Button, Badge, Table, TableHeader, TableBody, TableRow, TableCell, Separator, Avatar, ScrollArea
- Chart library: Recharts components (full access)
- Icons: Lucide-react (full library)
- Animation: Framer-motion
- Utilities: clsx, cn from utils

**System Prompt Philosophy:**

- Emphasize minimal, clean design (no bloated UI)
- Encourage thoughtful component selection per use-case
- Guide toward shadcn design patterns
- Promote subtle interactivity where valuable
- Keep components focused and purposeful

**Security Model:**

- Trust cursor-agent output (full code execution)
- Error boundary for runtime safety
- No additional sandboxing

## Example Flow

```
User: "Compare iPhone 17 Pro vs iPhone Air"
  ↓
Cursor Agent:
  1. Searches web for specs
  2. Determines comparison table is best
  3. Generates custom component:
     - Uses Card for container
     - Table for comparison grid
     - Badge for highlighting differences
     - Subtle hover effects
  4. Returns JSX code
  ↓
Dynamic Renderer:
  1. Babel transforms JSX
  2. Injects shadcn components
  3. Executes and renders
```

### To-dos

- [ ] Install @babel/standalone and verify react-error-boundary
- [ ] Build dynamic-renderer.tsx with Babel transformation and full component injection
- [ ] Rewrite SYSTEM_PROMPT in agent-wrapper.ts for ad-hoc component generation
- [ ] Update streaming protocol in agent-wrapper.ts to handle component code
- [ ] Refactor component-renderer.tsx to use dynamic renderer
- [ ] Test with various query types and verify clean shadcn styling