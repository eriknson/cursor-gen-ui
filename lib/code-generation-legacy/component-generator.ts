/**
 * Safe dynamic component generation
 * Provides a secure way to generate and render custom components
 */

import React, { ReactNode } from 'react';
import { sanitizeComponentCode, ValidationResult } from '../validators';
import * as templates from './component-templates';

export interface GeneratedComponentResult {
  success: boolean;
  component?: ReactNode;
  error?: string;
}

/**
 * Component generation cache
 * Cache generated components to avoid re-parsing
 */
const componentCache = new Map<string, React.ComponentType<any>>();

/**
 * Generate a cache key for a component
 */
function getCacheKey(code: string, data: any): string {
  return `${code.length}-${JSON.stringify(data).length}`;
}

/**
 * Parse and validate TSX/JSX code
 */
function parseComponentCode(code: string): ValidationResult {
  // Sanitize the code first
  const sanitized = sanitizeComponentCode(code);
  if (!sanitized.valid) {
    return sanitized;
  }

  // Check for basic React component structure
  const hasReturn = /return\s*[\(\{]/.test(code);
  const hasJSX = /<[A-Z][a-zA-Z0-9]*|<div|<span|<p|<h[1-6]|<ul|<ol|<li/.test(code);
  
  if (!hasReturn && !hasJSX) {
    return {
      valid: false,
      error: 'Component code must return JSX/TSX',
    };
  }

  return { valid: true };
}

/**
 * Create a safe React component from TSX string
 * Uses template literals and createElement instead of Function constructor
 */
export function createComponentFromTemplate(
  componentName: string,
  props: any,
  jsx: string
): GeneratedComponentResult {
  try {
    // Validate the JSX
    const validation = parseComponentCode(jsx);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // For now, we'll use a simplified approach that doesn't execute arbitrary code
    // Instead, we'll render a structured component based on templates
    return {
      success: false,
      error: 'Dynamic component generation is not yet fully implemented. Please use predefined components.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during component creation',
    };
  }
}

/**
 * Generate a component from a template name and data
 */
export function generateFromTemplate(
  templateName: string,
  data: any
): GeneratedComponentResult {
  try {
    const template = templates.getTemplate(templateName);
    
    if (!template) {
      return {
        success: false,
        error: `Template "${templateName}" not found`,
      };
    }

    // For template-based generation, we would render the template with data
    // This is safer than executing arbitrary code
    return {
      success: false,
      error: 'Template-based generation is not yet fully implemented.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during template generation',
    };
  }
}

/**
 * Clear the component cache
 */
export function clearComponentCache(): void {
  componentCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: componentCache.size,
    keys: Array.from(componentCache.keys()),
  };
}

/**
 * Suggested approach for custom components:
 * Instead of generating arbitrary code, we should:
 * 1. Define a set of safe, pre-built component templates
 * 2. Have the AI choose and configure these templates
 * 3. Pass structured data to these templates
 * 
 * This approach is:
 * - More secure (no arbitrary code execution)
 * - More performant (pre-compiled components)
 * - More maintainable (centralized component definitions)
 * - Still flexible (can create many variations through configuration)
 */

/**
 * Example: Build a custom component from structured description
 */
export interface ComponentDescription {
  type: 'card' | 'grid' | 'list' | 'table' | 'timeline';
  title?: string;
  items?: any[];
  columns?: number;
  config?: any;
}

export function buildComponentFromDescription(
  description: ComponentDescription
): GeneratedComponentResult {
  try {
    // This would build a component from a structured description
    // Much safer than executing arbitrary code
    
    switch (description.type) {
      case 'card':
        // Build card component
        break;
      case 'grid':
        // Build grid component
        break;
      case 'list':
        // Build list component
        break;
      case 'table':
        // Build table component
        break;
      case 'timeline':
        // Build timeline component
        break;
      default:
        return {
          success: false,
          error: `Unknown component type: ${description.type}`,
        };
    }

    return {
      success: false,
      error: 'Component building from description is not yet fully implemented.',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

