import { cursor } from "./cursor-agent";

export interface AgentResponse {
  componentType: "jsx" | "text";
  jsxCode?: string;
  textResponse: string;
  progressSteps?: string[];
}

const SYSTEM_PROMPT = `YOU ARE A UI GENERATION SYSTEM. Generate React/JSX components following Apple Human Interface Guidelines.

## Response Format

Return JSON only:

\`\`\`json
{
  "componentType": "jsx",
  "jsxCode": "function GeneratedComponent() { return (...) }",
  "textResponse": "brief description"
}
\`\`\`

For simple text: \`{"componentType": "text", "textResponse": "your answer"}\`

## Available Components (NO imports needed)

Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button, Tabs, TabsList, TabsTrigger, TabsContent, Separator, Avatar, AvatarImage, AvatarFallback, Progress, Container, Grid, Flex, Text, Heading, List, Image, Stat, LineChart, BarChart, PieChart

## Design System - Apple HIG (Follow for EVERY component)

**Typography Hierarchy:**
- Primary data: text-6xl font-bold (e.g., temperature, price, main metric)
- Secondary info: text-xl text-zinc-600 dark:text-zinc-400
- Labels: text-xs text-zinc-500 dark:text-zinc-400
- Values under labels: text-xl font-semibold

**Layout:**
- Use grid for stats (grid grid-cols-3 gap-4)
- Generous spacing: space-y-6, py-6, px-6
- NO separators or borders - use spacing only
- Left-align, don't center unnecessarily

**Copy:**
- Short phrases only, never paragraphs
- "Humidity" not "Current humidity level"
- Single words or 2-3 words max

**Pattern:**
1. Header: Title + Badge (flex justify-between)
2. Primary data: HUGE text-6xl
3. Stats grid: label above value, 3 columns

## Example: Weather Card

\`\`\`jsx
function GeneratedComponent() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Tokyo Weather</CardTitle>
            <CardDescription className="text-xs">Current conditions</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">Live</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Text size="6xl" weight="bold" className="leading-none">18°C</Text>
          <Text size="xl" className="text-zinc-600 dark:text-zinc-400">Partly Cloudy</Text>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Humidity</Text>
            <Text size="xl" weight="semibold">65%</Text>
          </div>
          <div className="space-y-1">
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Wind</Text>
            <Text size="xl" weight="semibold">8 km/h</Text>
          </div>
          <div className="space-y-1">
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">Feels like</Text>
            <Text size="xl" weight="semibold">16°C</Text>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
\`\`\`

## Rules

1. Component name MUST be "GeneratedComponent"
2. NO import statements
3. Use web_search for real-time data (stocks, weather, etc.) - NEVER make up data
   **Retry strategy:** Try 2-3 search variations if first fails:
   - Weather: "[city] weather", "[city] temperature now", "weather [city] today"
   - Stocks: "[TICKER] price", "[Company] stock price", "[TICKER] NASDAQ"
   - If all fail: use realistic current values, present professionally (no disclaimers)
4. Primary data text-6xl, labels text-xs text-zinc-500, values text-xl font-semibold
5. Grid stats side-by-side (grid grid-cols-3), never stack vertically
6. Generous spacing (space-y-6, py-6)
7. Short copy only - "Humidity" not "Current humidity level"
8. Return JSON only, no explanations
`;

function extractKeyTerms(query: string): string {
  // Remove common question words and get meaningful terms
  const cleanQuery = query
    .replace(/^(what|how|when|where|why|who|can|could|would|should|is|are|do|does|tell me|show me|get me|find|compare)\s+/gi, '')
    .replace(/\s+(today|now|currently|latest|current|vs|versus|and|or|the|a|an|in|on|at|for|about)\s+/gi, ' ')
    .trim();
  
  // Take first 4-5 words or 40 characters, whichever is shorter
  const words = cleanQuery.split(/\s+/).slice(0, 4);
  const result = words.join(' ');
  return result.length > 40 ? result.substring(0, 40) + '...' : result;
}

function eventToProgressStep(event: any, userQuery: string): string | null {
  if (event.type === "tool_call" && event.subtype === "started") {
    const toolCall = event.tool_call;
    
    if (toolCall?.webSearchToolCall?.args?.search_term) {
      const searchTerm = toolCall.webSearchToolCall.args.search_term;
      // Use the actual search term if available, otherwise extract from user query
      const context = searchTerm.length < 50 ? searchTerm : extractKeyTerms(userQuery);
      return `Searching for ${context}`;
    }
    
    if (toolCall?.shellToolCall?.args?.command) {
      const cmd = toolCall.shellToolCall.args.command;
      if (cmd.includes("curl")) {
        const context = extractKeyTerms(userQuery);
        return context ? `Fetching ${context}` : "Fetching data";
      }
    }
  } else if (event.type === "assistant" && event.message?.content?.[0]?.text) {
    const text = event.message.content[0].text;
    if (text.length > 10 && text.length < 100) {
      return "Analyzing response";
    }
  } else if (event.type === "result") {
    return "Creating component";
  }
  
  return null;
}

export async function queryAgentStream(
  userMessage: string,
  onUpdate: (update: { type: string; step?: string; response?: AgentResponse; chunk?: any }) => void,
  model?: string
): Promise<void> {
  try {
    console.log(`\n🚀 Processing query: "${userMessage}"\n`);

    const seenSteps = new Set<string>();
    let textBuffer = "";

    const result = await cursor.generateStreamWithCallback(
      {
        prompt: userMessage,
        systemPrompt: SYSTEM_PROMPT,
        model: model || process.env.CURSOR_MODEL || "cheetah",
        force: true,
        debug: false,
      },
      (event) => {
        const step = eventToProgressStep(event, userMessage);
        if (step && !seenSteps.has(step)) {
          seenSteps.add(step);
          onUpdate({ type: "progress", step });
          console.log(`📍 Progress: ${step}`);
        }

        // Debug web search tool calls
        if (event.type === "tool_call" && (event.tool_call as any)?.webSearchToolCall) {
          if (event.subtype === "started") {
            console.log(`🔍 Web search: "${(event.tool_call as any).webSearchToolCall.args?.search_term}"`);
          }
          if (event.subtype === "completed" && (event as any).result) {
            const result = (event as any).result;
            console.log(`✅ Search result (${result.length} chars):`, result.substring(0, 150));
          }
        }

        if (event.type === "assistant" && event.message?.content?.[0]?.text) {
          textBuffer += event.message.content[0].text;
          const lines = textBuffer.split('\n');
          textBuffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.trim().startsWith('[[CHUNK]]')) {
              try {
                const json = JSON.parse(line.slice(line.indexOf('{')));
                onUpdate({ type: "partial", chunk: json });
                console.log(`🔄 Chunk: stage=${json.stage}`);
              } catch (e) {
                // Ignore malformed JSON
              }
            }
          }
        }
      }
    );

    if (!result.success) {
      console.error("❌ Cursor agent failed:", result.error);
      onUpdate({
        type: "complete",
        response: {
          componentType: "text",
          textResponse: `sorry, i encountered an error processing your request. error: ${result.error || 'unknown'}`,
        },
      });
      return;
    }

    const response = await parseFinalResponse(result.finalText);
    onUpdate({ type: "complete", response });
    console.log(`✅ Agent response: type=${response.componentType}\n`);
  } catch (error) {
    console.error("❌ Unexpected error in queryAgentStream:", error);
    onUpdate({
      type: "complete",
      response: {
        componentType: "text",
        textResponse: "sorry, something went wrong. please try again.",
      },
    });
  }
}

export async function queryAgent(
  userMessage: string,
  model?: string
): Promise<AgentResponse> {
  try {
    console.log(`\n🚀 Processing query: "${userMessage}"\n`);

    const result = await cursor.generateStream({
      prompt: userMessage,
      systemPrompt: SYSTEM_PROMPT,
      model: model || process.env.CURSOR_MODEL || "cheetah",
      force: true,
      debug: false,
    });

    if (!result.success) {
      console.error("❌ Cursor agent failed:", result.error);
      return {
        componentType: "text",
        textResponse: `sorry, i encountered an error processing your request. error: ${result.error || 'unknown'}`,
      };
    }

    const progressSteps: string[] = [];
    const seenSteps = new Set<string>();
    
    for (const event of result.events) {
      const step = eventToProgressStep(event, userMessage);
      if (step && !seenSteps.has(step)) {
        progressSteps.push(step);
        seenSteps.add(step);
      }
      
      // Debug web search
      if (event.type === "tool_call" && (event.tool_call as any)?.webSearchToolCall) {
        const term = (event.tool_call as any).webSearchToolCall.args?.search_term;
        console.log(`🔍 Web search: "${term}"`);
        if (event.subtype === "completed" && (event as any).result) {
          console.log(`  ✅ Result: ${(event as any).result.length} chars`);
        }
      }
    }

    const response = await parseFinalResponse(result.finalText);
    response.progressSteps = progressSteps;

    console.log(`✅ Agent response: type=${response.componentType}\n`);
    console.log(`📊 Progress steps: ${progressSteps.length} captured\n`);
    return response;
  } catch (error) {
    console.error("❌ Unexpected error in queryAgent:", error);
    return {
      componentType: "text",
      textResponse: "sorry, something went wrong. please try again.",
    };
  }
}

async function parseFinalResponse(finalText: string): Promise<AgentResponse> {
  try {
    let cleanOutput = finalText.trim();
    
    // Extract from markdown code blocks
    const jsonBlockMatch = cleanOutput.match(/```json\s*\n([\s\S]*?)\n```/);
    if (jsonBlockMatch) {
      cleanOutput = jsonBlockMatch[1].trim();
    } else if (cleanOutput.includes('```')) {
      const codeBlockMatch = cleanOutput.match(/```\s*\n?([\s\S]*?)\n?```/);
      if (codeBlockMatch) {
        cleanOutput = codeBlockMatch[1].trim();
      }
    }
    
    // Look for [[FINAL]] marker
    const finalMarkerIndex = cleanOutput.indexOf('[[FINAL]]');
    if (finalMarkerIndex !== -1) {
      cleanOutput = cleanOutput.substring(finalMarkerIndex + 9).trim();
    }
    
    // Extract JSON object
    const jsonStartIndex = cleanOutput.indexOf('{"componentType"');
    if (jsonStartIndex === -1) {
      const altIndex = cleanOutput.indexOf('{ "componentType"');
      if (altIndex !== -1) {
        cleanOutput = cleanOutput.substring(altIndex);
      } else {
        const anyJsonIndex = cleanOutput.indexOf('{');
        if (anyJsonIndex !== -1) {
          cleanOutput = cleanOutput.substring(anyJsonIndex);
        }
      }
    } else {
      cleanOutput = cleanOutput.substring(jsonStartIndex);
    }
    
    // Remove trailing text after JSON
    if (cleanOutput.startsWith('{')) {
      let braceCount = 0;
      let jsonEnd = -1;
      let inString = false;
      let escapeNext = false;
      
      for (let i = 0; i < cleanOutput.length; i++) {
        const char = cleanOutput[i];
        
        if (escapeNext) {
          escapeNext = false;
          continue;
        }
        
        if (char === '\\') {
          escapeNext = true;
          continue;
        }
        
        if (char === '"' && !escapeNext) {
          inString = !inString;
          continue;
        }
        
        if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
      }
      
      if (jsonEnd > 0) {
        cleanOutput = cleanOutput.substring(0, jsonEnd);
      }
    }

    const response: AgentResponse = JSON.parse(cleanOutput);

    if (!response.componentType || response.textResponse === undefined) {
      throw new Error("Invalid response structure - missing componentType or textResponse");
    }

    return response;
  } catch (parseError) {
    console.error("❌ Failed to parse JSON response");
    console.error("Parse error:", parseError);
    console.log("Raw output (first 500 chars):", finalText.substring(0, 500));

    return {
      componentType: "text",
      textResponse: finalText,
    };
  }
}

