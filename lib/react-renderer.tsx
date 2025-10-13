import React from "react";
import type { JSX } from "react";
import { transform } from "@babel/standalone";
import { ErrorBoundary } from "react-error-boundary";

/**
 * Transform JSX code to executable JavaScript using Babel
 */
function transformCode(code: string): string {
  // Remove both default exports and named function exports
  const codeWithoutExports = code
    .replace(/export\s+default\s+/, "")
    .replace(/export\s+function\s+/, "function ");

  try {
    const transformed = transform(codeWithoutExports, {
      presets: ["react"],
      filename: "generated-component.tsx",
    }).code;

    if (!transformed) {
      throw new Error("Babel transformation returned empty code");
    }

    return transformed;
  } catch (error) {
    console.error("Babel transformation failed:", error);
    throw error;
  }
}

/**
 * Create a React component from JSX code string with sandboxed scope
 */
function createComponentFromCode(
  code: string,
  components: Record<string, any>,
): React.ComponentType<{}> {
  try {
    const transformedCode = transformCode(code);

    // Create sandboxed scope with only allowed components
    const scope = {
      React,
      ...components,
    };

    // Create function body that returns the component
    const functionBody = `
      try {
        ${transformedCode}
        return GeneratedComponent;
      } catch (error) {
        console.error("Error in component code:", error);
        throw error;
      }
    `;

    // Create the component function with sandboxed scope
    const createFunction = new Function(...Object.keys(scope), functionBody);
    const Component = createFunction(...Object.values(scope));

    if (typeof Component !== "function") {
      throw new Error("Generated code did not return a valid React component");
    }

    return Component;
  } catch (error) {
    console.error("Failed to create component:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );

    // Return error component
    return function ErrorComponent() {
      return (
        <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <p className="font-bold mb-2 text-red-900 dark:text-red-200">
            Failed to render component
          </p>
          <pre className="whitespace-pre-wrap text-sm text-red-800 dark:text-red-300">
            {error instanceof Error ? error.message : "Unknown error"}
          </pre>
        </div>
      );
    };
  }
}

interface ReactRendererProps {
  code: string;
  components: Record<string, any>;
  onError?: (error: Error) => void;
}

/**
 * ReactRenderer component that safely renders AI-generated JSX
 * Uses Babel to transform JSX and executes it in a sandboxed scope
 */
export function ReactRenderer({
  code,
  components,
  onError,
}: ReactRendererProps): JSX.Element {
  const [error, setError] = React.useState<Error | null>(null);

  const Component = React.useMemo(() => {
    try {
      return createComponentFromCode(code, components);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to create component");
      setError(error);
      onError?.(error);
      return null;
    }
  }, [code, components, onError]);

  function handleError(error: Error) {
    setError(error);
    onError?.(error);
  }

  if (error || !Component) {
    return (
      <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="font-bold mb-2 text-red-900 dark:text-red-200">
          Failed to render component
        </p>
        <pre className="whitespace-pre-wrap text-sm text-red-800 dark:text-red-300">
          {error?.message ?? "Unknown error"}
        </pre>
      </div>
    );
  }

  const ErrorFallback = ({ error }: { error: Error }): JSX.Element => {
    return (
      <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
        <p className="font-bold mb-2 text-red-900 dark:text-red-200">
          Component rendering error
        </p>
        <pre className="whitespace-pre-wrap text-sm text-red-800 dark:text-red-300">
          {error.message}
        </pre>
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleError}>
      <Component />
    </ErrorBoundary>
  );
}

