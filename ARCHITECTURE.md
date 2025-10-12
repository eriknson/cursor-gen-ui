# Architecture Guide

## System Overview

Cursor Agent GenUI is a Next.js 14 application using the App Router with React Server Components and Server Actions. The system integrates with Cursor Agent CLI to provide generative UI capabilities.

## Directory Structure

```
cursor-agent-genui/
├── app/
│   └── (preview)/
│       ├── actions.tsx        # Server actions (AI integration)
│       ├── layout.tsx         # Root layout
│       ├── page.tsx           # Main chat interface
│       └── globals.css        # Global styles
├── components/
│   ├── message.tsx            # Base message wrapper
│   ├── markdown.tsx           # Markdown renderer
│   ├── chart-view.tsx         # Chart component
│   ├── table-view.tsx         # Table component
│   ├── card-grid.tsx          # Card grid component
│   ├── code-view.tsx          # Code display component
│   ├── image-gallery.tsx      # Image gallery component
│   ├── camera-view.tsx        # Legacy camera component
│   ├── hub-view.tsx           # Legacy hub component
│   ├── usage-view.tsx         # Legacy usage component
│   ├── icons.tsx              # Icon components
│   └── use-scroll-to-bottom.ts # Auto-scroll hook
├── lib/
│   ├── cursor-agent.ts        # Low-level CLI integration
│   ├── agent-wrapper.ts       # High-level AI wrapper
│   └── component-renderer.tsx # Component routing logic
└── public/                    # Static assets

```

## Data Flow

### 1. User Interaction Flow

```
┌─────────────────────────────────────────────────────────┐
│  User types message in page.tsx                         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  handleSubmit() adds user message to state              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Calls sendMessage() server action                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Server Action (actions.tsx)                            │
│  - Calls queryAgent(message)                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Agent Wrapper (agent-wrapper.ts)                       │
│  - Adds system prompt                                   │
│  - Calls cursor.generate()                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Cursor Agent (cursor-agent.ts)                         │
│  - Builds CLI command                                   │
│  - Spawns cursor-agent process                          │
│  - Streams JSON events                                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Cursor Agent CLI executes                              │
│  - Analyzes query with AI model                         │
│  - Uses tools (web search, etc.)                        │
│  - Returns structured response                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Response flows back through cursor-agent.ts            │
│  - Parses stream-json events                            │
│  - Accumulates text                                     │
│  - Returns final result                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Agent Wrapper parses JSON response                     │
│  - Extracts componentType                               │
│  - Extracts data                                        │
│  - Extracts textResponse                                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Server Action calls renderComponent()                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Component Renderer (component-renderer.tsx)            │
│  - Switches on componentType                            │
│  - Renders appropriate component                        │
│  - Wraps in Message component                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  React component returned to client                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  page.tsx adds to messages state                        │
│  - Triggers re-render                                   │
│  - Displays with animations                             │
└─────────────────────────────────────────────────────────┘
```

## Key Components

### 1. cursor-agent.ts (Low-Level Integration)

**Purpose**: Direct interface with cursor-agent CLI

**Key Methods**:
- `generate(options)`: Main method, delegates to generateStream
- `generateStream(options)`: Spawns CLI process, handles streaming
- `buildCommand(options)`: Constructs CLI command with flags
- `logStreamEvent(event)`: Pretty-prints events for debugging

**Features**:
- Stream-json parsing for real-time events
- 5-minute timeout protection
- Process cleanup on completion
- Error handling with fallbacks

### 2. agent-wrapper.ts (High-Level Wrapper)

**Purpose**: Application-specific AI interaction logic

**Key Function**:
- `queryAgent(userMessage, model?)`: Main entry point

**Responsibilities**:
- Defines system prompt for generative UI
- Specifies component types and data structures
- Parses JSON responses
- Handles markdown code block extraction
- Provides fallbacks for parsing errors

**System Prompt Strategy**:
The system prompt instructs the AI to:
1. Analyze user queries
2. Use tools to fetch data
3. Return structured JSON with:
   - `componentType`: Which UI component to use
   - `data`: The actual data to display
   - `textResponse`: Friendly explanation

### 3. component-renderer.tsx (Routing Logic)

**Purpose**: Maps AI responses to React components

**Logic Flow**:
1. Receives `AgentResponse` with componentType and data
2. Validates data structure for component type
3. Renders appropriate component with data
4. Falls back to text rendering if invalid

**Supported Component Types**:
- `chart`: Array of {label, value} objects
- `table`: Array of objects with consistent keys
- `cards`: Array of {title, description, details}
- `code`: Object with {language, code}
- `images`: Array of {url, caption}
- `text`: Any text (default fallback)

## Component Design Patterns

### Animation Pattern

All components use framer-motion with consistent patterns:

```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>
  {/* content */}
</motion.div>
```

**Guidelines**:
- Use staggered delays for lists (index * 0.05 or 0.1)
- Fade in from opacity: 0 to 1
- Slide up from y: 10 to 0
- Keep transitions smooth (default duration ~0.3s)

### Color Scheme

Consistent zinc-based palette with dark mode support:

**Light Mode**:
- Background: `bg-zinc-100`
- Text: `text-zinc-800`
- Muted text: `text-zinc-500`
- Borders: `border-zinc-200`

**Dark Mode**:
- Background: `dark:bg-zinc-800`
- Text: `dark:text-zinc-300`
- Muted text: `dark:text-zinc-400`
- Borders: `dark:border-zinc-700`

**Accent Colors**:
- Blue: Primary actions, charts
- Green: Success, positive data
- Orange/Amber: Warnings, highlights
- Red: Errors, negative data

### Responsive Sizing

Standard responsive breakpoints:

```tsx
className="max-w-[calc(100dvw-80px)] md:max-w-[452px] w-full"
```

- Mobile: `calc(100dvw-80px)` (accounts for padding)
- Desktop: `md:max-w-[452px]` (matches chat width)

## Server vs Client Components

### Server Components (Default)
- `app/(preview)/layout.tsx`
- `app/(preview)/actions.tsx` (server actions)
- All `lib/` files (utilities)

### Client Components ("use client")
- `app/(preview)/page.tsx` (interactive UI)
- All `components/` (need hooks, animations)

## State Management

**Client State** (page.tsx):
- `messages`: Array of ReactNode (message history)
- `input`: String (current input value)
- `isLoading`: Boolean (loading state)

**Server State**:
- None (stateless server actions)
- Each request is independent

**Why No AI SDK State?**:
- Original used `createAI` for conversation state
- We removed it because:
  - Server actions are simpler
  - No persistence needed yet
  - Easier to understand flow
  - Can add later if needed

## Error Handling Strategy

### Layers of Error Handling

1. **CLI Level** (cursor-agent.ts):
   ```typescript
   if (!result.success) {
     return { success: false, error: "..." }
   }
   ```

2. **Parsing Level** (agent-wrapper.ts):
   ```typescript
   try {
     response = JSON.parse(cleanOutput);
   } catch {
     // Fallback to text component
   }
   ```

3. **Component Level** (component-renderer.tsx):
   ```typescript
   if (!data || data.length === 0) {
     // Fallback to text
   }
   ```

4. **Server Action Level** (actions.tsx):
   ```typescript
   try {
     await queryAgent(message);
   } catch {
     return <Message content="Error message" />
   }
   ```

### Error UX

- Never show raw errors to users
- Always provide friendly fallback messages
- Log errors to console for debugging
- Gracefully degrade to simpler components

## Performance Considerations

### Optimization Strategies

1. **Server-Side Rendering**:
   - Initial page load is fast
   - Components pre-rendered on server

2. **Dynamic Imports** (Future):
   - Could lazy-load components
   - Current implementation loads all upfront

3. **Caching** (Future):
   - Could cache common queries
   - Could cache component renders

4. **Streaming** (Current Limitation):
   - CLI responses are batched
   - Not true streaming to client
   - Future: Could implement SSE

### Current Bottlenecks

1. **CLI Startup**: First query slower (~2-3s)
2. **No Caching**: Repeat queries re-execute
3. **JSON Parsing**: Extra overhead vs streaming
4. **Process Spawning**: Creates new process per query

## Extending the System

### Adding a New Component Type

**Step 1**: Create component file

```tsx
// components/my-new-view.tsx
"use client";
import { motion } from "framer-motion";

export const MyNewView = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)]"
    >
      {/* Your component JSX */}
    </motion.div>
  );
};
```

**Step 2**: Update component renderer

```tsx
// lib/component-renderer.tsx
import { MyNewView } from "@/components/my-new-view";

case "mynew":
  return <MyNewView data={data} />;
```

**Step 3**: Update system prompt

```tsx
// lib/agent-wrapper.ts
const SYSTEM_PROMPT = `
...
- "mynew": For my new use case (data should be ...)
...
`;
```

### Adding Tools/Capabilities

The Cursor Agent CLI has built-in tools:
- Web search
- File operations
- Code generation
- And more...

To leverage these, update the system prompt to guide the AI:

```typescript
const SYSTEM_PROMPT = `
...
When the user asks about current events, use web search to find recent information.
When the user asks for code, generate complete, working examples.
...
`;
```

## Security Considerations

### Input Validation

Currently minimal - relies on AI to handle safely. Consider adding:

```typescript
// Validate message length
if (message.length > 5000) {
  throw new Error("Message too long");
}

// Sanitize input
const sanitized = DOMPurify.sanitize(message);
```

### Output Sanitization

- Markdown renderer handles XSS in text
- Image URLs should be validated
- Code blocks are safe (syntax highlighting)

### Environment Variables

- Never commit `.env.local`
- Don't expose CURSOR_API_KEY to client
- Use server-only code for sensitive operations

## Debugging Tips

### Enable Debug Logging

```typescript
// In agent-wrapper.ts
const result = await cursor.generate({
  prompt: userMessage,
  debug: true, // Add this
});
```

### Inspect Stream Events

The CLI logs events to console:
- 🔧 System initialization
- 👤 User messages
- 🤖 Assistant responses
- ⚙️ Tool calls
- 🎯 Final results

### Test CLI Directly

```bash
cursor-agent --print --output-format json "Test query"
```

### Check Component Rendering

Add console.logs in component-renderer.tsx:

```typescript
console.log("Rendering component:", componentType, "with data:", data);
```

## Future Architecture Considerations

### Potential Improvements

1. **Streaming UI Updates**:
   - Server-Sent Events (SSE)
   - Progressive component rendering
   - Real-time tool execution display

2. **Conversation History**:
   - Database integration (Vercel KV, Supabase)
   - Session management
   - Chat persistence

3. **Caching Layer**:
   - Redis for common queries
   - Component memoization
   - Response caching

4. **Advanced Routing**:
   - Multi-component responses
   - Nested/composite components
   - Layout variations

5. **Testing**:
   - Unit tests for components
   - Integration tests for AI flow
   - E2E tests with Playwright

## Conclusion

This architecture prioritizes:
- ✅ Simplicity (easy to understand)
- ✅ Extensibility (easy to add components)
- ✅ Maintainability (clear separation of concerns)
- ✅ User Experience (smooth animations, error handling)

The system is production-ready for demos and prototypes, with clear paths for scaling and additional features.

