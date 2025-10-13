# Architecture: JSX-Based Dynamic Component System

## Overview

The app now uses **AI-generated JSX** with **runtime Babel transformation** instead of predefined component templates. This enables the AI to create custom, tailored UIs for any query without being limited to preset component types.

## Key Components

### 1. React Renderer (`lib/react-renderer.tsx`)

Safely transforms and executes AI-generated JSX code:

- Uses `@babel/standalone` to transform JSX to JavaScript at runtime
- Executes code in a sandboxed scope with only approved components
- Includes error boundaries for graceful failure handling
- Validates code before execution

```typescript
<ReactRenderer 
  code={jsxCode} 
  components={componentRegistry}
  onError={(error) => console.error(error)}
/>
```

### 2. Component Registry (`lib/component-registry.tsx`)

Defines all components available in the sandbox:

**Shadcn UI Core Components:**
- Card family (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter)
- Badge, Button, Separator, Avatar, Progress, Tabs

**Chart Components (Recharts via shadcn):**
- ChartContainer, AreaChart, BarChart, LineChart, PieChart
- Chart elements: Area, Bar, Line, Pie, CartesianGrid, XAxis, YAxis
- ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, Cell

**Layout Components:**
- Accordion, AccordionItem, AccordionTrigger, AccordionContent
- AspectRatio, Breadcrumb, Calendar, Carousel
- Collapsible, ResizablePanel, ScrollArea
- Table, TableHeader, TableBody, TableRow, TableCell, TableHead, TableCaption

**Display Components:**
- Alert, AlertDescription, AlertTitle
- Skeleton, HoverCard, Popover, Tooltip
- Drawer, Command, AlertDialog

**Input Components (for display):**
- Checkbox, RadioGroup, Slider, Toggle, ToggleGroup, Textarea

**Navigation Components:**
- Menubar, Pagination, Breadcrumb

**Utility Components:**
- Container, Grid, Flex (layout)
- Text, Heading (typography)
- List, Image, Stat (content display)

**Total: 130+ components** providing maximum flexibility for custom layouts.

Adding new components is simple:
```typescript
export const componentRegistry = {
  // ... existing
  MyNewComponent: MyNewComponent,
};
```

### 3. Agent Wrapper (`lib/agent-wrapper.ts`)

Manages AI interaction and response parsing:

**AgentResponse Interface:**
```typescript
{
  componentType: "jsx" | "text",
  jsxCode?: string,  // JSX function code
  textResponse: string,
  progressSteps?: string[]
}
```

**System Prompt:**
- Teaches AI to write JSX using available components
- Provides examples of common UI patterns
- Emphasizes security constraints (no imports, no dangerous APIs)
- Instructs on data fetching with web_search for real-time data

### 4. Component Renderer (`lib/component-renderer.tsx`)

Simple renderer that delegates to ReactRenderer or markdown:

```typescript
if (componentType === "jsx" && jsxCode) {
  return <ReactRenderer code={jsxCode} components={registry} />;
}
return <Markdown>{textResponse}</Markdown>;
```

### 5. Validators (`lib/validators.ts`)

Security and validation layer:

- `sanitizeComponentCode()` - Blocks dangerous patterns (eval, fetch, etc.)
- `validateAgentResponse()` - Ensures response structure is correct
- Validates JSX code before execution

## Security Model

### Sandboxing Strategy

1. **Component Whitelist**: Only pre-approved components are accessible
2. **No Imports**: AI cannot import external modules
3. **Code Sanitization**: Dangerous patterns are blocked:
   - `eval()`, `Function()`, `setTimeout()`, `setInterval()`
   - `fetch()`, `XMLHttpRequest`
   - `window`, `document`, `localStorage`
   - `import`, `require`

4. **Babel Transformation**: JSX is transformed in isolated scope
5. **Error Boundaries**: All rendered components are wrapped in error boundaries

### What AI Can Do

✅ Use 130+ components from the registry
✅ Create nested structures and layouts
✅ Define local data variables
✅ Use Tailwind CSS classes
✅ Render charts with Recharts (via shadcn)
✅ Use web_search for real-time data
✅ Create custom, tailored layouts with Accordion, Table, Alert, etc.

### What AI Cannot Do

❌ Import external libraries
❌ Make network requests
❌ Access browser APIs
❌ Execute arbitrary code
❌ Access file system
❌ Modify global scope

## Data Flow

```
User Query
    ↓
AI Agent (Cursor CLI)
    ↓
Generate JSX Code
    ↓
Babel Transform (runtime)
    ↓
Sandboxed Execution
    ↓
React Render
    ↓
Display to User
```

## Example AI Output

```json
{
  "componentType": "jsx",
  "jsxCode": "function GeneratedComponent() { const data = [/*...*/]; return (<Card><CardHeader><CardTitle>Weather</CardTitle></CardHeader><CardContent>{/* JSX */}</CardContent></Card>); }",
  "textResponse": "here's the current weather in san francisco"
}
```

## Comparison: Before vs After

### Before (Template-Based)

- **19 predefined components** (weather-card, stock-ticker, recipe-card, etc.)
- AI selects from fixed set
- Limited flexibility
- Complex system prompt (~900 lines)
- Data passed as structured JSON

### After (JSX-Based)

- **No predefined components**
- AI generates custom JSX
- Unlimited flexibility
- Simpler system prompt (~250 lines)
- Code is the data

## Benefits

1. **Flexibility**: AI can create any layout, not limited to templates
2. **Simplicity**: No need to maintain dozens of component files
3. **Extensibility**: Easy to add new primitives to the sandbox
4. **Natural**: AI trained on React code, no custom DSL to learn
5. **Powerful**: Full React capabilities (hooks, composition, etc.)
6. **Safe**: Sandboxed execution with validation

## Theming

The app supports system-based dark/light mode:

- Uses `next-themes` to automatically detect system preference
- Switches between light/dark based on OS settings
- Updates when user changes their system theme
- All shadcn components are theme-aware with CSS variables

## Future Enhancements

- Support for interactivity (onClick handlers with message passing)
- Component preview/debugging tools
- AI-generated animations with Framer Motion
- More advanced chart types (Scatter, Radar, Sankey, etc.)
- Real-time data streaming for live charts
- Export generated components as standalone files

