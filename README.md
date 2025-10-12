# Cursor Gen UI

A generative UI application powered by [Cursor Agent CLI](https://cursor.com/cli) and Next.js. Ask any question and get dynamic, custom UI components to display the results.

> **📖 See [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) for detailed documentation on all 15+ components, configurations, and examples.**

## Features

- **Dynamic Component Selection**: AI automatically chooses the most appropriate component based on query context
- **15+ Specialized Components**: 
  - **Data Visualization**: Line charts, bar charts, pie charts, area charts, gauge charts
  - **Content Display**: Timelines, comparison tables, stat cards, lists with icons, media grids
  - **Specialized**: Weather cards, stock tickers, recipe cards, profile cards, quote blocks
  - **Legacy Support**: Tables, cards, code blocks, image galleries, text
- **Rich Configuration**: Each component supports customization (colors, themes, variants, layouts)
- **Powered by Cursor Agent**: Uses cutting-edge AI models (GPT-5, Claude Sonnet 4, etc.)
- **Beautiful Design**: Modern, polished UI with smooth animations
- **Dark Mode Support**: Automatic dark/light theme switching
- **Fast Response Times**: 90% of queries return in 1-2 seconds

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Cursor Agent CLI** - Install with:
   ```bash
   curl https://cursor.com/install -fsS | bash
   ```
3. **Cursor Account** - Make sure you're logged in:
   ```bash
   cursor-agent login
   ```

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:eriknson/cursor-gen-ui.git
   cd cursor-gen-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure environment variables:
   ```bash
   # If you need to specify a specific API key
   export CURSOR_API_KEY=your_api_key
   
   # Or create a .env.local file
   echo "CURSOR_API_KEY=your_api_key" > .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

Simply type any question or request into the chat interface. The AI will automatically select the most appropriate component and configuration.

### Example Queries

**Financial & Data:**
- "What's the stock price of TESLA last week?" → Stock ticker with line chart
- "Show me the top 5 programming languages by popularity" → Bar chart
- "Market share of electric vehicles" → Pie chart
- "Show website traffic growth" → Area chart

**Information & Content:**
- "What's the weather in Tokyo?" → Weather card with forecast
- "Tell me about Marie Curie" → Profile card with stats
- "Give me a quote by Maya Angelou" → Stylized quote block
- "How do I make chocolate chip cookies?" → Recipe card with ingredients and steps

**Comparisons & Analysis:**
- "Compare iPhone 15 vs Samsung S24" → Comparison table with highlighted differences
- "React vs Vue features" → Comparison table
- "Compare cloud providers" → Detailed comparison

**Directions & Processes:**
- "How do I get from Times Square to Central Park?" → Timeline with step-by-step directions
- "Steps to deploy a Next.js app" → Timeline with numbered steps
- "History of artificial intelligence" → Timeline with events

**Lists & Features:**
- "What are the benefits of exercise?" → List with icons
- "Top 10 TypeScript features" → Checklist or numbered list
- "Advantages of serverless architecture" → Feature list

The AI will automatically:
1. Analyze your query context
2. Select the most appropriate component type
3. Configure colors, themes, and layout options
4. Fetch or generate necessary data
5. Return a beautiful, animated UI component

## Architecture

### Component Library (15+ Components)

**Data Visualization (5):**
- LineChart, BarChart, PieChart, AreaChart, GaugeChart

**Content Display (5):**
- Timeline, ComparisonTable, StatCard, ListWithIcons, MediaGrid

**Specialized (5):**
- WeatherCard, StockTicker, RecipeCard, ProfileCard, QuoteBlock

**Legacy Support:**
- TableView, CardGrid, CodeView, ImageGallery, Text/Markdown

### Backend Integration

- **lib/cursor-agent.ts**: Low-level Cursor Agent CLI integration with streaming support
- **lib/agent-wrapper.ts**: High-level wrapper with comprehensive system prompts and response parsing
- **lib/component-renderer.tsx**: Intelligent routing to appropriate components with config support
- **app/(preview)/actions.tsx**: Server actions that handle AI queries

### Flow

1. User submits a query
2. `sendMessage` server action calls `queryAgent`
3. `queryAgent` invokes Cursor Agent CLI with a specialized system prompt defining all 15+ components
4. AI analyzes query context and selects the most appropriate component type
5. AI generates configuration (colors, themes, variants) and data
6. Response returned as JSON with `componentType`, `config`, `data`, and `textResponse`
7. `renderComponent` routes to the appropriate React component with configuration
8. Component renders with custom styling, animations, and data

### Response Structure

```typescript
{
  componentType: string,      // e.g., "stock-ticker", "timeline", "pie-chart"
  config: {                   // Component-specific configuration
    colors: string[],
    variant: string,
    theme: string,
    // ... component-specific options
  },
  data: any,                  // Component data
  textResponse: string,       // Friendly explanation
  fallbackToGenerate?: boolean, // For edge cases
  customTSX?: string         // Dynamic component generation
}
```

## Customization

### Adding New Component Types

1. Create a new component in `components/`:
   ```tsx
   // components/my-view.tsx
   export const MyView = ({ data }) => {
     return <div>...</div>
   }
   ```

2. Update `lib/component-renderer.tsx` to handle the new type:
   ```tsx
   case "mytype":
     return <MyView data={data} />
   ```

3. Update the system prompt in `lib/agent-wrapper.ts` to include the new component type

### Changing AI Models

By default, the app uses Claude Sonnet 4. To change models:

```typescript
// In lib/agent-wrapper.ts
const result = await cursor.generate({
  prompt: userMessage,
  systemPrompt: SYSTEM_PROMPT,
  model: "gpt-5", // or "opus-4.1", "sonnet-4-thinking", etc.
  force: true,
});
```

### Styling

The app uses Tailwind CSS with the same design system as the original Vercel demo:
- Zinc color palette
- Framer Motion animations
- Dark mode support
- Responsive layouts

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Troubleshooting

**"cursor-agent: command not found"**
- Make sure you've installed the Cursor CLI: `curl https://cursor.com/install -fsS | bash`
- Restart your terminal after installation

**"Authentication required"**
- Run `cursor-agent login` to authenticate

**Slow responses**
- The first query may take longer as the agent initializes
- Complex queries requiring web searches or data processing will take more time
- Check your internet connection

**Component not rendering correctly**
- Check the console for parsing errors
- The agent should return valid JSON with the correct structure
- Falls back to text rendering if the response is malformed

## Credits

- Original UI design from [Vercel AI SDK GenUI Demo](https://github.com/vercel-labs/ai-sdk-preview-rsc-genui)
- Powered by [Cursor Agent CLI](https://cursor.com/cli)
- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/)

## License

MIT

