import { ReactNode } from "react";
import { Markdown } from "@/components/markdown";
import { AgentResponse } from "./agent-wrapper";
import { ComponentErrorBoundary } from "@/components/component-error-boundary";
import { ReactRenderer } from "./react-renderer";
import { getComponentRegistry } from "./component-registry";

/**
 * Main component renderer
 * Renders JSX components or markdown text based on agent response
 */
export function renderComponent(response: AgentResponse): ReactNode {
  const { componentType, jsxCode, textResponse } = response;

  // Handle JSX component rendering
  if (componentType === "jsx" && jsxCode) {
      return (
        <div className="flex flex-col gap-3">
          {textResponse && (
            <div className="text-zinc-800 dark:text-zinc-300">
              <Markdown>{textResponse}</Markdown>
            </div>
          )}
        <ComponentErrorBoundary componentName="GeneratedComponent">
          <ReactRenderer
            code={jsxCode}
            components={getComponentRegistry()}
            onError={(error) => {
              console.error("Component rendering error:", error);
            }}
          />
        </ComponentErrorBoundary>
        </div>
      );
  }

  // Fallback to text rendering with markdown
  return (
    <div className="text-zinc-800 dark:text-zinc-300">
      <Markdown>{textResponse || "Generating response..."}</Markdown>
    </div>
  );
}
