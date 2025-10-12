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
      if (isValidChartData(data)) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <LineChart data={data} config={config} />
          </div>
        );
      } else {
        console.warn("line-chart: Invalid data format. Expected array or {labels, datasets}. Received:", data);
      }
      break;

    case "bar-chart":
      if (isValidChartData(data)) {
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
      } else {
        console.warn("bar-chart: Invalid data format. Expected array or {labels, datasets}. Received:", data);
      }
      break;

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
      if (isValidChartData(data)) {
        return (
          <div className="flex flex-col gap-3">
            {textResponse && (
              <div className="text-zinc-800 dark:text-zinc-300">
                <Markdown>{textResponse}</Markdown>
              </div>
            )}
            <AreaChart data={data} config={config} />
          </div>
        );
      } else {
        console.warn("area-chart: Invalid data format. Expected array or {labels, datasets}. Received:", data);
      }
      break;

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
      // Fallback to text with markdown rendering
      return (
        <div className="text-zinc-800 dark:text-zinc-300">
          <Markdown>{textResponse || "No response available."}</Markdown>
        </div>
      );
  }

  // If component type doesn't match or data is invalid, fallback to text
  return (
    <div className="text-zinc-800 dark:text-zinc-300">
      <Markdown>{textResponse || "No response available."}</Markdown>
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
