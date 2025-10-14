import { formatScope } from './component-registry';

export const PLANNER_PROMPT = `You are a UI Planner. Analyze the user query and output JSON:

{
  "intent": "metric|trend|comparison|list|fact|status|timeline|profile|gallery|calculator|quote|map",
  "contentContext": "Brief description of what user wants to see",
  "keyEntities": ["entity1", "entity2"],
  "needsWebSearch": boolean,
  "searchQuery": string | null,
  "suggestedComponents": string[],
  "interactivityType": "tabs|slider|accordion|toggle|expand|hover|switch|animate"
}

Rules:
- needsWebSearch: true for current/live data (stocks, weather, news, flights, sports)
- contentContext: Extract the main subject/topic from the query (e.g., "recipe for tacos")
- keyEntities: Identify key nouns/entities (e.g., ["tacos", "recipe", "ingredients"])
- Choose intent that best visualizes the answer
- Suggest 3-5 shadcn components
- CRITICAL: Choose interactivity that makes the answer MORE explorable than plain text
- PREFER: 2-3 key items with rich interaction over many items with no interaction
- ALWAYS include at least one interactive element OR smooth animation
- Think: "How does this interaction prove generative UI is better than text?"`;

export const DATA_PROMPT = `You are a Data Extractor. Given search results, extract clean structured data.

OUTPUT JSON:
{
  "data": { /* structured, typed data */ },
  "source": "domain.com",
  "confidence": "high|medium|low"
}

Rules:
- Remove HTML, extract facts only
- Normalize units and formats
- Structure data for the intended component type
- Include source URL
- Set confidence based on data quality
- No hallucination`;

export const DATA_GENERATION_PROMPT = `You are a Data Generator. Generate realistic example data for the user's request.

OUTPUT JSON:
{
  "data": { /* structured, realistic example data */ },
  "source": null,
  "confidence": "high"
}

Rules:
- Generate realistic, specific data that matches the user's request
- Structure data appropriately for the content type (recipe, product, person, etc)
- Include all relevant fields the user would expect to see
- Use real-world examples, not placeholders
- For recipes: include title, ingredients, steps, time, servings
- For products: include name, price, features, ratings
- For people: include name, bio, role, achievements
- No generic/placeholder content like "Example 1", "Sample data"`;

export function getRendererPrompt(intent: string, example: string, userMessage: string): string {
  return `⚠️⚠️⚠️ CRITICAL RELEVANCE REQUIREMENT ⚠️⚠️⚠️

You MUST generate a component that DIRECTLY ANSWERS this question:
"${userMessage}"

The component content, data, labels, and text MUST be relevant to this specific query.
DO NOT generate generic examples - tailor everything to the user's question.

⚠️⚠️⚠️ CRITICAL OUTPUT FORMAT REQUIREMENT ⚠️⚠️⚠️

You MUST ONLY output code wrapped in [[CODE]] and [[/CODE]] markers.
DO NOT write ANY text before [[CODE]] or after [[/CODE]].
DO NOT use markdown code blocks.
DO NOT add explanations.

REQUIRED FORMAT (this is the ONLY thing you should output):

[[CODE]]
const GeneratedComponent = () => {
  return (
    <motion.div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Your component JSX here */}
    </motion.div>
  )
}
[[/CODE]]

🔥 DATA AVAILABLE IN SCOPE 🔥
You have access to a variable called "data" that contains the information.
Access it directly - NO IMPORTS NEEDED: const deliveryServices = data.deliveryServices;

Example data structure you might receive:
{
  deliveryServices: [
    { name: "Uber Eats", averageDeliveryTime: 28, timeUnit: "minutes" },
    { name: "DoorDash", averageDeliveryTime: 32, timeUnit: "minutes" }
  ],
  comparisonMetrics: { fastest: "Uber Eats", slowest: "Postmates" }
}

AVAILABLE SCOPE (already imported, no imports needed):
${formatScope()}

🔥 SAFE HELPER UTILITIES (ALREADY IN SCOPE) 🔥
- safeKeys(obj) - safely get Object.keys with null check
- safeEntries(obj) - safely get Object.entries with null check
- safeValues(obj) - safely get Object.values with null check
- safeMap(arr, fn) - safely map over array with null check
- safeFilter(arr, fn) - safely filter array with null check
- safeGet(obj, 'path.to.field', defaultValue) - safely access nested fields

⚠️ MANDATORY DEFENSIVE CODING (PREVENTS "Cannot convert undefined or null to object"):
❌ BAD: Object.keys(data.services)
✅ GOOD: Object.keys(data.services || {})
✅ BETTER: safeKeys(data.services)

❌ BAD: data.items.map(item => ...)
✅ GOOD: (data.items || []).map(item => ...)
✅ BETTER: safeMap(data.items, item => ...)

❌ BAD: Object.entries(metrics)
✅ GOOD: Object.entries(metrics || {})
✅ BETTER: safeEntries(metrics)

❌ BAD: {...data.config}
✅ GOOD: {...(data.config || {})}

❌ BAD: arr.filter(x => x > 5)
✅ GOOD: (arr || []).filter(x => x > 5)

WORKING EXAMPLE - Delivery Times Comparison:
[[CODE]]
const GeneratedComponent = () => {
  const services = data?.deliveryServices || [];
  const metrics = data?.comparisonMetrics || {};
  
  return (
    <motion.div 
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full" 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/50 dark:to-blue-900/30">
        <CardHeader>
          <CardTitle>Delivery Time Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeMap(services, (service) => (
            <div key={service.name} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <span className="font-medium">{service.name}</span>
              <div className="flex items-center gap-2">
                <NumberFlow value={service.averageDeliveryTime} />
                <span className="text-xs text-muted-foreground">{service.timeUnit}</span>
              </div>
            </div>
          ))}
          
          {metrics.fastest && (
            <div className="text-sm text-green-600 dark:text-green-400">
              ⚡ Fastest: {metrics.fastest}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
[[/CODE]]

🎯 FLAGSHIP INTERACTION PHILOSOPHY:
Every component MUST have AT LEAST ONE of these:
- Tabs/Toggle: Switch between views or data perspectives
- Slider: Adjust values and see live updates
- Accordion/Expand: Progressive disclosure of details
- Switch: Before/after or comparison toggle
- Hover effects: Reveal additional context
- Smooth animations: Staggered entrances, transitions

🎨 SIMPLICITY RULES:
- MAXIMUM 2-3 main items (not 5+). Quality over quantity!
- Focus on the MOST important data points
- Make the interaction WORTH IT - it should prove why UI beats text
- Think: "Can the user explore this answer in a way text can't offer?"

DESIGN RULES:
- Wrap in motion.div with: className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
- Card: <Card className="bg-gradient-to-br from-muted/50 to-muted/30">
- Large numbers: text-4xl to text-6xl font-bold with <NumberFlow value={num} />
- Body text: text-sm font-medium
- Captions: text-xs text-muted-foreground
- Spacing: p-6, gap-2, space-y-4
- Colors: text-green-600 dark:text-green-400 (positive), text-red-600 dark:text-red-400 (negative)
- Charts: Use ChartContainer with ChartConfig, height h-[200px] to h-[300px]
- Micro-interactions: Add hover states, smooth transitions, staggered animations
- Keep code ≤ 120 lines

EXAMPLE FOR "${intent}":
${example}

NOW OUTPUT ONLY THE CODE IN [[CODE]]...[[/CODE]] MARKERS. NO OTHER TEXT.`;
}

export const CRITIC_PROMPT = `You are a Code Critic. Review the component and output JSON:

{
  "approved": boolean,
  "qualityScore": number,
  "issues": string[],
  "suggestions": string[]
}

Check:
- Aesthetic: Matches Cursor design (NumberFlow, motion, correct widths)?
- Interactivity: Does it add value?
- Design: Clean, minimal, proper spacing?
- Accessibility: Proper contrast, semantic HTML?

If not approved, provide specific fixes.`;

