# Cursor Gen UI

Ask questions, generate custom UI components on-the-fly. Powered by Cursor Agent CLI with dynamic JSX generation.

## Features

- **Dynamic JSX Generation**: AI generates React components in real-time, no predefined templates
- **130+ Shadcn/ui Components**: Beautiful, accessible, theme-aware components
- **Safe Execution**: Babel-powered JSX transformation with sandboxed component scope
- **Real-time Data**: Fetches live data (stocks, weather, etc.) via web search
- **Chart Support**: Recharts integration via shadcn for beautiful data visualization
- **System Theme**: Automatically matches light/dark mode to your OS settings

## Quick Start

```bash
# Install Cursor CLI
curl https://cursor.com/install -fsS | bash
cursor-agent login

# Clone and run
git clone git@github.com:eriknson/cursor-gen-ui.git
cd cursor-gen-ui
npm install
npm run dev
```

Open http://localhost:3000 and start asking questions.

## Customization

**Change model:** Add `?model=MODEL_NAME` to the URL (default: cheetah)

Examples:
- `http://localhost:3000/?model=gpt-5` - Use GPT-5
- `http://localhost:3000/?model=sonnet-4` - Use Claude Sonnet 4
- `http://localhost:3000/?model=opus-4.1` - Use Claude Opus 4.1
- `http://localhost:3000/?model=sonnet-4.5` - Use Claude Sonnet 4.5

Supported models: `cheetah`, `gpt-5`, `sonnet-4`, `sonnet-4.5`, `sonnet-4-thinking`, `opus-4.1`, `grok`

## Configuration

Optional `.env.local` for advanced usage:
```bash
CURSOR_MODEL=cheetah  # Override default model (cheetah, gpt-5, sonnet-4.5, etc.)
CURSOR_API_KEY=xxx    # Only needed for CI/CD or to override login credentials
```

## Architecture

### How It Works

1. **User Query**: You ask a question or request data
2. **AI Analysis**: Cursor Agent analyzes the request and determines the best UI approach
3. **JSX Generation**: AI writes React/JSX code using available components
4. **Safe Execution**: Babel transforms JSX to JavaScript at runtime
5. **Sandboxed Rendering**: Component executes with access only to approved components

### Available Components

The AI can use **130+ components** when generating UIs:

**Shadcn UI Core:**
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Badge`, `Button`, `Separator`, `Avatar`, `Progress`, `Tabs`

**Charts (Recharts via shadcn):**
- `ChartContainer`, `AreaChart`, `BarChart`, `LineChart`, `PieChart`
- `Area`, `Bar`, `Line`, `Pie`, `CartesianGrid`, `XAxis`, `YAxis`
- `ChartTooltip`, `ChartLegend`

**Layout Components:**
- `Accordion`, `Table`, `Carousel`, `Collapsible`, `ScrollArea`
- `AspectRatio`, `Breadcrumb`, `Calendar`, `ResizablePanel`

**Display Components:**
- `Alert`, `Skeleton`, `HoverCard`, `Popover`, `Tooltip`
- `Drawer`, `Command`, `AlertDialog`

**Navigation:**
- `Menubar`, `Pagination`, `Breadcrumb`

**Input Components (for display):**
- `Checkbox`, `RadioGroup`, `Slider`, `Toggle`, `Textarea`

**Utilities:**
- `Container`, `Grid`, `Flex` (layouts)
- `Text`, `Heading` (typography)
- `List`, `Image`, `Stat` (content display)

### Security

- **No arbitrary code execution**: JSX is transformed and executed in a sandboxed scope
- **Component whitelist**: Only approved components are accessible
- **Code sanitization**: Dangerous patterns (eval, fetch, etc.) are blocked
- **Error boundaries**: Graceful error handling for invalid components

### Extending

**Add new components to the sandbox:**

1. Add to `lib/component-registry.tsx`:
```typescript
export const componentRegistry = {
  // ... existing components
  MyNewComponent: MyNewComponent,
};
```

2. AI automatically gets access in its system prompt

**Modify the AI behavior:**

Edit `SYSTEM_PROMPT` in `lib/agent-wrapper.ts` to change how the AI generates components.

## Troubleshooting

**Command not found:** Restart terminal after installing Cursor CLI

**Not authenticated:** Run `cursor-agent login`

**Component rendering error:** Check browser console for detailed error messages

**Babel transformation failed:** JSX code may be invalid, check syntax

## License

MIT
