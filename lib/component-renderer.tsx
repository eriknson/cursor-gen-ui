import { ReactNode } from "react";
import { Markdown } from "@/components/markdown";
import { AgentResponse } from "./agent-wrapper";
import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { validateAgentResponse, sanitizeComponentCode } from "./validators";

// Import all components
import { LineChart } from "@/components/line-chart";
import { BarChart } from "@/components/bar-chart";
import { PieChart } from "@/components/pie-chart";
import { AreaChart } from "@/components/area-chart";
import { GaugeChart } from "@/components/gauge-chart";
import { TimelineView } from "@/components/timeline-view";
import { ComparisonTable } from "@/components/comparison-table";
import { StatCard } from "@/components/stat-card";
import { ListWithIcons } from "@/components/list-with-icons";
import { MediaGrid } from "@/components/media-grid";
import { WeatherCard } from "@/components/weather-card";
import { StockTicker } from "@/components/stock-ticker";
import { RecipeCard } from "@/components/recipe-card";
import { ProfileCard } from "@/components/profile-card";
import { QuoteBlock } from "@/components/quote-block";
import { TableView } from "@/components/table-view";
import { CardGrid } from "@/components/card-grid";
import { CodeView } from "@/components/code-view";
import { ImageGallery } from "@/components/image-gallery";

// Loading skeleton component for streaming states
function ComponentSkeleton({ type }: { type: string }) {
  const baseClasses = "md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6";
  
  // Chart-like skeleton (for line, bar, area, pie, gauge, stock)
  if (['line-chart', 'bar-chart', 'area-chart', 'pie-chart', 'gauge-chart', 'stock-ticker'].includes(type)) {
    return (
      <div className={baseClasses}>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>Loading {type.replace('-', ' ')}...</span>
          </div>
          <div className="animate-pulse">
            {/* Match actual chart heights (200-320px range) */}
            <div className="h-[240px] bg-zinc-50 dark:bg-zinc-800/50 rounded" />
          </div>
        </div>
      </div>
    );
  }
  
  // Timeline skeleton - matches actual timeline structure with vertical line and cards
  if (type === 'timeline') {
    return (
      <div className={baseClasses}>
        <div className="relative">
          {/* Vertical line like actual timeline */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-700" />
          
          <div className="space-y-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="relative flex gap-4 animate-pulse">
                {/* Circle icon matching actual size (w-10 h-10) with ring */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-600 ring-4 ring-zinc-200 dark:ring-zinc-700 z-10 relative" />
                </div>
                
                {/* Card matching actual structure with border and shadow */}
                <div className="flex-1 pb-2">
                  <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 shadow-sm">
                    <div className="h-4 bg-zinc-100 dark:bg-zinc-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // List and table skeleton
  if (['list-with-icons', 'comparison-table', 'table'].includes(type)) {
    return (
      <div className={baseClasses}>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>Loading {type.replace('-', ' ')}...</span>
          </div>
          <div className="space-y-3 animate-pulse">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-6 h-6 rounded bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-2 bg-zinc-50 dark:bg-zinc-800/50 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Weather card skeleton - matches actual weather card structure
  if (type === 'weather-card') {
    return (
      <div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full">
        <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-5 bg-zinc-100 dark:bg-zinc-700 rounded w-1/2 mb-2" />
                <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-1/3" />
              </div>
              {/* Large icon placeholder matching text-5xl */}
              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-700" />
            </div>
            
            {/* Large temperature display matching text-6xl */}
            <div className="h-16 bg-zinc-100 dark:bg-zinc-700 rounded w-32 mb-4" />
            
            {/* Details section */}
            <div className="flex gap-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <div className="flex-1 h-12 bg-zinc-50 dark:bg-zinc-800/50 rounded" />
              <div className="flex-1 h-12 bg-zinc-50 dark:bg-zinc-800/50 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Recipe and profile card skeleton - with image area
  if (['recipe-card', 'profile-card'].includes(type)) {
    return (
      <div className={baseClasses}>
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="animate-pulse">
            {/* Image/header area */}
            <div className="h-32 bg-zinc-100 dark:bg-zinc-800" />
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                <span>Loading {type.replace('-', ' ')}...</span>
              </div>
              {/* Title */}
              <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" />
              {/* Content lines */}
              <div className="space-y-2">
                <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-full" />
                <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-5/6" />
                <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Quote and stat card skeleton
  if (['quote-block', 'stat-card'].includes(type)) {
    return (
      <div className={baseClasses}>
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-400 text-xs mb-3">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <span>Loading {type.replace('-', ' ')}...</span>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded w-2/3" />
            <div className="space-y-2">
              <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-full" />
              <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-5/6" />
              <div className="h-3 bg-zinc-50 dark:bg-zinc-800/50 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Generic fallback (improved sizing)
  return (
    <div className={baseClasses}>
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-400 text-xs mb-3">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span>Loading {type.replace('-', ' ')}...</span>
        </div>
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-3/4" />
          <div className="h-32 bg-zinc-50 dark:bg-zinc-800/50 rounded" />
        </div>
      </div>
    </div>
  );
}

// Helper function to check if data is valid for chart components
function isValidChartData(data: any): boolean {
  // Check for single dataset format (array)
  if (Array.isArray(data) && data.length > 0) {
    return true;
  }
  // Check for multi-dataset format (object with labels and datasets)
  if (data && typeof data === 'object' && 'labels' in data && 'datasets' in data) {
    const multiData = data as { labels: any[]; datasets: any[] };
    return Array.isArray(multiData.labels) && Array.isArray(multiData.datasets) && multiData.datasets.length > 0;
  }
  return false;
}

export function renderComponent(response: AgentResponse): ReactNode {
  // Validate the response first
  const validation = validateAgentResponse(response);
  if (!validation.valid) {
    console.error("Invalid agent response:", validation.error);
    return (
      <div className="text-zinc-800 dark:text-zinc-300">
        <Markdown>Sorry, the response format was invalid. Please try again.</Markdown>
      </div>
    );
  }

  const { componentType, data, textResponse, config = {}, customTSX, fallbackToGenerate } = response;

  // Handle dynamic TSX generation for edge cases
  if (fallbackToGenerate && customTSX) {
    try {
      return (
        <ComponentErrorBoundary componentName="DynamicComponent">
          {renderDynamicComponent(customTSX, data, textResponse)}
        </ComponentErrorBoundary>
      );
    } catch (error) {
      console.error("Failed to render dynamic component:", error);
      // Fall through to text rendering
    }
  }

  // Render appropriate component based on type
  switch (componentType) {
    // Data Visualization Components
    case "line-chart":
      return (
        <div className="flex flex-col gap-3">
          {textResponse && (
            <div className="text-zinc-800 dark:text-zinc-300">
              <Markdown>{textResponse}</Markdown>
            </div>
          )}
          {isValidChartData(data) ? (
            <LineChart data={data} config={config} />
          ) : (
            <div className="animate-pulse h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-zinc-400">Loading chart data...</span>
            </div>
          )}
        </div>
      );

    case "bar-chart":
      return (
        <div className="flex flex-col gap-3">
          {textResponse && (
            <div className="text-zinc-800 dark:text-zinc-300">
              <Markdown>{textResponse}</Markdown>
            </div>
          )}
          {isValidChartData(data) ? (
            <BarChart data={data} config={config} />
          ) : (
            <div className="animate-pulse h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-zinc-400">Loading chart data...</span>
            </div>
          )}
        </div>
      );

    case "pie-chart":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <PieChart data={data} config={config} />
          </div>
        );
      }
      break;

    case "area-chart":
      return (
        <div className="flex flex-col gap-3">
          {textResponse && (
            <div className="text-zinc-800 dark:text-zinc-300">
              <Markdown>{textResponse}</Markdown>
            </div>
          )}
          {isValidChartData(data) ? (
            <AreaChart data={data} config={config} />
          ) : (
            <div className="animate-pulse h-64 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-zinc-400">Loading chart data...</span>
            </div>
          )}
        </div>
      );

    case "gauge-chart":
      if (data && typeof data === "object" && "value" in data) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <GaugeChart data={data} config={config} />
          </div>
        );
      }
      break;

    // Content Display Components
    case "timeline":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <TimelineView data={data} config={config} />
          </div>
        );
      }
      break;

    case "comparison-table":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <ComparisonTable data={data} config={config} />
          </div>
        );
      }
      break;

    case "stat-card":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <StatCard data={data} config={config} />
          </div>
        );
      }
      break;

    case "list-with-icons":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <ListWithIcons data={data} config={config} />
          </div>
        );
      }
      break;

    case "media-grid":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <MediaGrid data={data} config={config} />
          </div>
        );
      }
      break;

    // Specialized Components
    case "weather-card":
      if (data && typeof data === "object") {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <WeatherCard data={data} config={config} />
          </div>
        );
      }
      break;

    case "stock-ticker":
      if (data && typeof data === "object") {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <StockTicker data={data} config={config} />
          </div>
        );
      }
      break;

    case "recipe-card":
      if (data && typeof data === "object") {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <RecipeCard data={data} config={config} />
          </div>
        );
      }
      break;

    case "profile-card":
      if (data && typeof data === "object") {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <ProfileCard data={data} config={config} />
          </div>
        );
      }
      break;

    case "quote-block":
      if (data && typeof data === "object") {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <QuoteBlock data={data} config={config} />
          </div>
        );
      }
      break;

    // Legacy/Existing Components (backward compatibility)
    case "table":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <TableView data={data} />
          </div>
        );
      }
      break;

    case "cards":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <CardGrid items={data} />
          </div>
        );
      }
      break;

    case "code":
      if (data && typeof data === "object" && "code" in data) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <CodeView language={data.language || "text"} code={data.code} />
          </div>
        );
      }
      break;

    case "images":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <ImageGallery images={data} />
          </div>
        );
      }
      break;

    // Legacy chart support (maps to bar-chart)
    case "chart":
      if (Array.isArray(data) && data.length > 0) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <BarChart data={data} config={config} />
          </div>
        );
      }
      break;

    case "text":
    default:
      // Check if we're in a loading/partial state (no data but has componentType)
      if (!data && !textResponse && componentType !== "text") {
        return <ComponentSkeleton type={componentType} />;
      }
      
      // Fallback to text with markdown rendering
      return (
        <div className="text-zinc-800 dark:text-zinc-300">
          <Markdown>{textResponse || "Generating response..."}</Markdown>
        </div>
      );
  }

  // If component type doesn't match or data is invalid, fallback to loading or text
  if (!data && !textResponse && componentType !== "text") {
    return <ComponentSkeleton type={componentType} />;
  }
  
  return (
    <div className="text-zinc-800 dark:text-zinc-300">
      <Markdown>{textResponse || "Generating response..."}</Markdown>
    </div>
  );
}

/**
 * Render dynamic TSX component (for edge cases)
 * NOTE: Dynamic component generation is intentionally limited for security.
 * We validate and sanitize code before attempting to render.
 * 
 * RECOMMENDATION: Instead of generating arbitrary components, the AI should:
 * 1. Use the extended multi-dataset chart components
 * 2. Combine existing components creatively
 * 3. Use complex configurations of predefined components
 */
function renderDynamicComponent(tsx: string, data: any, textResponse: string): ReactNode {
  try {
    // Validate and sanitize the code
    const sanitized = sanitizeComponentCode(tsx);
    if (!sanitized.valid) {
      console.error("Dynamic component code failed sanitization:", sanitized.error);
      return (
        <div className="flex flex-col gap-3">
          {textResponse && (
            <div className="text-zinc-800 dark:text-zinc-300">
              <Markdown>{textResponse}</Markdown>
            </div>
          )}
          <div className="text-zinc-600 dark:text-zinc-400 text-sm p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <p className="font-medium mb-2">⚠️ Dynamic Component Unavailable</p>
            <p>
              For security reasons, this custom visualization cannot be rendered. 
              The system uses predefined components for safe, reliable rendering.
            </p>
          </div>
        </div>
      );
    }

    // For now, we intentionally do NOT execute arbitrary code
    // Instead, return a message indicating limitations
    console.warn("Dynamic component generation attempted but not fully implemented");
    
    return (
      <div className="flex flex-col gap-3">
        {textResponse && (
          <div className="text-zinc-800 dark:text-zinc-300">
            <Markdown>{textResponse}</Markdown>
          </div>
        )}
        <div className="text-zinc-600 dark:text-zinc-400 text-sm p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="font-medium mb-2">ℹ️ Custom Visualization</p>
          <p>
            This query requires a custom visualization. Please try rephrasing your question 
            to use one of the available chart types (line, bar, area, pie, etc.) or other 
            predefined components.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in dynamic component rendering:", error);
    throw error;
  }
}
