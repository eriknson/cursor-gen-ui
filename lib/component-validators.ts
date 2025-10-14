import { z } from 'zod';
import { COMPONENT_SCOPE } from './component-registry';

// Flatten all available components from COMPONENT_SCOPE
const getAllAvailableComponents = (): string[] => {
  return [
    ...COMPONENT_SCOPE.react,
    ...COMPONENT_SCOPE.shadcn,
    ...COMPONENT_SCOPE.charts,
    ...COMPONENT_SCOPE.other
  ];
};

/**
 * Validates that all components used in the code are available in the runtime scope.
 * This prevents "X is not defined" runtime errors.
 */
export function validateComponentScope(code: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const availableComponents = getAllAvailableComponents();
  
  // CRITICAL: Check for helper component definitions (FORBIDDEN)
  // Patterns like: const MyComponent = () => ..., function MyComponent() { ... }
  // But NOT React state setters like setSomething, or regular functions like handleClick
  const helperComponentPattern = /(?:const|let|var|function)\s+([A-Z][a-zA-Z0-9]+)\s*=\s*(?:\([^)]*\)\s*=>)/g;
  let match;
  
  while ((match = helperComponentPattern.exec(code)) !== null) {
    const componentName = match[1];
    // Allow only GeneratedComponent (the main one)
    // Also ignore if it's a type/interface pattern or common non-component patterns
    if (componentName !== 'GeneratedComponent' && 
        !componentName.startsWith('set') &&  // Ignore setState functions that might be extracted
        componentName.length > 2) {  // Ignore single/double letter variables
      issues.push(`FORBIDDEN: Helper component/function "${componentName}" detected. All JSX must be inline in GeneratedComponent. Do not create helper components or functions that look like components.`);
    }
  }
  
  // Check for React hooks usage
  const availableHooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef'];
  const hookPattern = /\b(use[A-Z][a-zA-Z]*)\s*\(/g;
  const usedHooks = new Set<string>();
  
  while ((match = hookPattern.exec(code)) !== null) {
    usedHooks.add(match[1]);
  }
  
  // Validate hooks are available
  for (const hook of usedHooks) {
    if (!availableHooks.includes(hook)) {
      issues.push(`Hook "${hook}" is not available in runtime scope. Available hooks: ${availableHooks.join(', ')}`);
    }
  }
  
  // Extract JSX component usage (e.g., <Card>, <Button>, etc.)
  const jsxComponentPattern = /<([A-Z][a-zA-Z0-9]*)/g;
  const usedComponents = new Set<string>();
  
  while ((match = jsxComponentPattern.exec(code)) !== null) {
    usedComponents.add(match[1]);
  }
  
  // Check each used component
  for (const component of usedComponents) {
    if (!availableComponents.includes(component)) {
      issues.push(`Component "${component}" is not available in runtime scope. Add it to COMPONENT_SCOPE in component-registry.ts and import it in dynamic-renderer.tsx`);
    }
  }
  
  // Also check for direct function calls to components (less common but possible)
  // But be smarter about it - only flag actual component-like patterns
  const componentCallPattern = /(?:^|[^.\w])([A-Z][a-zA-Z0-9]*)\s*\(/g;
  while ((match = componentCallPattern.exec(code)) !== null) {
    const component = match[1];
    
    // Skip common built-in constructors and objects
    const builtIns = [
      'Object', 'Array', 'String', 'Number', 'Boolean', 'Date', 'Math', 'JSON', 'Promise',
      'Map', 'Set', 'WeakMap', 'WeakSet', 'Error', 'TypeError', 'RangeError', 'Symbol',
      'Reflect', 'Proxy', 'Intl', 'RegExp'
    ];
    if (builtIns.includes(component)) {
      continue;
    }
    
    // Skip if it's preceded by a dot (property access) or word character (like setState functions)
    const beforeContext = code.substring(Math.max(0, match.index - 10), match.index);
    if (beforeContext.trim().endsWith('.') || 
        /(?:set|get|handle|on|use|is|has|can|should)[A-Z]/.test(beforeContext)) {
      continue;
    }
    
    // Skip common JavaScript method names that start with capital letters
    const jsMethodNames = [
      'LocaleDateString', 'LocaleString', 'LocaleTimeString', 'UTC', 
      'ISOString', 'GMTString', 'FullYear', 'Month', 'Date', 
      'Hours', 'Minutes', 'Seconds', 'Milliseconds', 'Day', 'Time',
      'TimezoneOffset', 'CharCode', 'CodePoint'
    ];
    if (jsMethodNames.includes(component)) {
      continue;
    }
    
    // Skip common variable patterns (Max, Min, High, Low, etc. are often data variables)
    const commonDataVars = ['Max', 'Min', 'High', 'Low', 'Open', 'Close', 'Volume', 'Count', 'Total'];
    if (commonDataVars.includes(component)) {
      continue;
    }
    
    // Only flag if it looks like a React component (used in JSX context) or already seen in JSX
    if (!availableComponents.includes(component) && !usedComponents.has(component)) {
      // Only report if it's likely a component (starts with capital letter and looks component-like)
      // But skip if it appears to be a data transformation function
      if (component.length > 15 || component.toLowerCase().includes('component')) {
        issues.push(`Function/Component "${component}" is not available in runtime scope`);
      }
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

export function validateStructure(code: string): { valid: boolean; error?: string } {
  if (!code.includes('const GeneratedComponent')) {
    return { valid: false, error: 'Missing: const GeneratedComponent = () => {...}' };
  }
  if (!code.includes('return')) {
    return { valid: false, error: 'Component must return JSX' };
  }
  if (code.includes('import ')) {
    return { valid: false, error: 'No imports allowed' };
  }
  if (code.includes('export ')) {
    return { valid: false, error: 'No exports allowed' };
  }
  return { valid: true };
}

export function validateSafety(code: string): { safe: boolean; issues: string[] } {
  const issues: string[] = [];
  
  if (code.includes('dangerouslySetInnerHTML')) issues.push('XSS risk');
  if (code.includes('eval(') || code.includes('Function(')) issues.push('Code injection');
  if (code.includes('fetch(') || code.includes('axios')) issues.push('No fetch allowed');
  if (code.includes('localStorage') || code.includes('sessionStorage')) issues.push('No storage access');
  if (code.includes('window.') || code.includes('document.')) issues.push('No DOM access');
  
  return { safe: issues.length === 0, issues };
}

export function validateStyle(code: string): { score: number; warnings: string[] } {
  const warnings: string[] = [];
  let score = 100;
  
  if (!code.includes('<Card')) {
    warnings.push('Should wrap in Card component');
    score -= 20;
  }
  if (!code.includes('md:max-w-[452px]')) {
    warnings.push('Use correct responsive width: md:max-w-[452px] max-w-[calc(100dvw-80px)]');
    score -= 10;
  }
  if (code.split('\n').length > 120) {
    warnings.push('Code too long (keep under 120 lines)');
    score -= 15;
  }
  if (!code.includes('motion.div')) {
    warnings.push('Add framer-motion entrance animation');
    score -= 5;
  }
  
  return { score, warnings };
}

export function validateRuntimeSafety(code: string): { safe: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Check for Object methods without null checks
  const objectKeysPattern = /Object\.keys\s*\(\s*([^)|]+)\s*\)/g;
  let match;
  while ((match = objectKeysPattern.exec(code)) !== null) {
    const arg = match[1].trim();
    // Check if argument has null safety (|| or ??)
    if (!arg.includes('||') && !arg.includes('??') && !arg.includes('?.')) {
      warnings.push(`Object.keys(${arg}) - should be Object.keys(${arg} || {})`);
    }
  }
  
  const objectEntriesPattern = /Object\.entries\s*\(\s*([^)|]+)\s*\)/g;
  while ((match = objectEntriesPattern.exec(code)) !== null) {
    const arg = match[1].trim();
    if (!arg.includes('||') && !arg.includes('??') && !arg.includes('?.')) {
      warnings.push(`Object.entries(${arg}) - should be Object.entries(${arg} || {})`);
    }
  }
  
  const objectValuesPattern = /Object\.values\s*\(\s*([^)|]+)\s*\)/g;
  while ((match = objectValuesPattern.exec(code)) !== null) {
    const arg = match[1].trim();
    if (!arg.includes('||') && !arg.includes('??') && !arg.includes('?.')) {
      warnings.push(`Object.values(${arg}) - should be Object.values(${arg} || {})`);
    }
  }
  
  // Check for .map() without safety checks
  const mapPattern = /(\w+)\.map\s*\(/g;
  while ((match = mapPattern.exec(code)) !== null) {
    const variable = match[1];
    // Look backwards in the code to see if this variable has safety checks
    const precedingCode = code.substring(0, match.index);
    const lastMention = precedingCode.lastIndexOf(variable);
    const contextCode = precedingCode.substring(Math.max(0, lastMention - 50), lastMention + variable.length + 20);
    
    // Check if the variable is declared with safety or wrapped in parens with safety
    if (!contextCode.includes('||') && !contextCode.includes('??') && !contextCode.includes('?.')) {
      // Check if it's in a safe pattern like (arr || []).map
      const safeMapPattern = new RegExp(`\\(\\s*${variable}\\s*\\|\\|\\s*\\[\\]\\s*\\)\\.map`);
      if (!safeMapPattern.test(code)) {
        warnings.push(`${variable}.map() - should be (${variable} || []).map() or ${variable}?.map()`);
      }
    }
  }
  
  // Check for spread operators without safety
  const spreadPattern = /\.\.\.\s*(\w+(?:\.\w+)*)/g;
  while ((match = spreadPattern.exec(code)) !== null) {
    const variable = match[1];
    // Check if there's safety around the spread
    const fullMatch = match[0];
    const contextStart = Math.max(0, match.index - 20);
    const contextEnd = Math.min(code.length, match.index + fullMatch.length + 20);
    const context = code.substring(contextStart, contextEnd);
    
    if (!context.includes('||') && !context.includes('??') && !variable.includes('?.')) {
      warnings.push(`...${variable} - should be {...(${variable} || {})} or {...(${variable} || [])}`);
    }
  }
  
  // Check for array access without safety
  const arrayAccessPattern = /(\w+)\[(\d+|\w+)\]/g;
  while ((match = arrayAccessPattern.exec(code)) !== null) {
    const variable = match[1];
    const index = match[2];
    
    // Skip if it's already using optional chaining before
    const precedingChar = match.index > 0 ? code[match.index - 1] : '';
    if (precedingChar === '?') continue;
    
    // Skip common safe patterns (useState, React hooks, etc)
    if (variable === 'data' || variable === 'items' || variable === 'arr') {
      warnings.push(`${variable}[${index}] - should use ${variable}?.[${index}] for safety`);
    }
  }
  
  return {
    safe: warnings.length === 0,
    warnings
  };
}

export function validateRelevance(
  code: string, 
  userMessage: string,
  keyEntities: string[]
): { relevant: boolean; issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 100;
  
  // Check if key entities appear in the code
  const codeContent = code.toLowerCase();
  const missingEntities = keyEntities.filter(
    entity => !codeContent.includes(entity.toLowerCase())
  );
  
  if (missingEntities.length > 0 && keyEntities.length > 0) {
    issues.push(`Missing key entities: ${missingEntities.join(', ')}`);
    score -= 40;
  }
  
  // Check for generic placeholders that suggest irrelevant content
  const genericTerms = [
    'example', 'sample', 'demo', 'placeholder',
    'test project', 'project portfolio', 'todo list'
  ];
  
  const foundGeneric = genericTerms.filter(
    term => codeContent.includes(term.toLowerCase())
  );
  
  if (foundGeneric.length > 0) {
    issues.push(`Contains generic terms: ${foundGeneric.join(', ')}`);
    score -= 30;
  }
  
  return {
    relevant: score >= 60,
    issues,
    score
  };
}

/**
 * Validates React Hook usage patterns to prevent common bugs
 * Focuses on issues unique to hooks: memory leaks, infinite loops, stale closures
 */
export function validateHookUsage(code: string): {
  valid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // Check 1: setInterval in useEffect without cleanup
  const intervalPattern = /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*setInterval\(/g;
  let match;
  const foundIntervals: number[] = [];
  
  while ((match = intervalPattern.exec(code)) !== null) {
    const effectStart = match.index;
    // Look for return () => clearInterval in the same useEffect
    const effectBlock = code.substring(effectStart, effectStart + 500);
    if (!effectBlock.includes('clearInterval')) {
      foundIntervals.push(effectStart);
    }
  }
  
  if (foundIntervals.length > 0) {
    issues.push(`Found ${foundIntervals.length} setInterval() in useEffect without cleanup - will cause memory leak`);
    suggestions.push('Add cleanup: useEffect(() => { const timer = setInterval(...); return () => clearInterval(timer); }, [...])');
  }
  
  // Check 2: setTimeout in useEffect without cleanup
  const timeoutPattern = /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]*setTimeout\(/g;
  const foundTimeouts: number[] = [];
  
  while ((match = timeoutPattern.exec(code)) !== null) {
    const effectStart = match.index;
    const effectBlock = code.substring(effectStart, effectStart + 500);
    if (!effectBlock.includes('clearTimeout')) {
      foundTimeouts.push(effectStart);
    }
  }
  
  if (foundTimeouts.length > 0) {
    issues.push(`Found ${foundTimeouts.length} setTimeout() in useEffect without cleanup - may cause bugs on unmount`);
    suggestions.push('Add cleanup: useEffect(() => { const timer = setTimeout(...); return () => clearTimeout(timer); }, [...])');
  }
  
  // Check 3: useEffect without dependency array (infinite loop risk)
  const effectNoDepsPattern = /useEffect\s*\(\s*\(\s*\)\s*=>\s*\{[^}]+\}\s*\)/g;
  const foundNoDeps: number[] = [];
  
  while ((match = effectNoDepsPattern.exec(code)) !== null) {
    // Check if there's a comma and array after the closing brace
    const afterEffect = code.substring(match.index + match[0].length, match.index + match[0].length + 20);
    if (!afterEffect.trim().startsWith(',')) {
      foundNoDeps.push(match.index);
    }
  }
  
  if (foundNoDeps.length > 0) {
    issues.push(`Found ${foundNoDeps.length} useEffect() without dependency array - will run on every render (infinite loop risk)`);
    suggestions.push('Add dependency array: useEffect(() => {...}, []) for mount-only or useEffect(() => {...}, [dep1, dep2]) for conditional');
  }
  
  // Check 4: setState with direct value inside setInterval/setTimeout (stale closure)
  const stateInTimerPattern = /(?:setInterval|setTimeout)\s*\([^)]*set(\w+)\s*\(\s*(?!prev|p\s|function)/g;
  const foundStaleClosures: string[] = [];
  
  while ((match = stateInTimerPattern.exec(code)) !== null) {
    foundStaleClosures.push(`set${match[1]}`);
  }
  
  if (foundStaleClosures.length > 0) {
    issues.push(`Found state updates in timers without functional form: ${foundStaleClosures.join(', ')} - will use stale values`);
    suggestions.push('Use functional updates in timers: setState(prev => prev + 1) instead of setState(value + 1)');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Enhanced validation specifically for runtime error patterns
 * Returns specific, actionable error messages for the AI to fix
 */
export function validateRuntimePatterns(code: string): { 
  valid: boolean; 
  criticalIssues: string[]; 
  suggestions: string[];
} {
  const criticalIssues: string[] = [];
  const suggestions: string[] = [];
  
  // Critical: Object methods without null safety
  const unsafeObjectKeys = /Object\.keys\s*\(\s*([a-zA-Z_$][\w.]*)\s*\)(?![^{]*\|\|[^{]*\})/g;
  let match;
  const foundUnsafeKeys: string[] = [];
  
  while ((match = unsafeObjectKeys.exec(code)) !== null) {
    const varName = match[1].trim();
    // Skip if already has safety operators nearby
    const context = code.substring(Math.max(0, match.index - 20), Math.min(code.length, match.index + match[0].length + 20));
    if (!context.includes('||') && !context.includes('??')) {
      foundUnsafeKeys.push(varName);
    }
  }
  
  if (foundUnsafeKeys.length > 0) {
    criticalIssues.push(`Object.keys() called without null check on: ${foundUnsafeKeys.join(', ')}`);
    suggestions.push(`Wrap with null check: Object.keys(${foundUnsafeKeys[0]} || {})`);
  }
  
  // Critical: Object.entries without null safety
  const unsafeObjectEntries = /Object\.entries\s*\(\s*([a-zA-Z_$][\w.]*)\s*\)/g;
  const foundUnsafeEntries: string[] = [];
  
  while ((match = unsafeObjectEntries.exec(code)) !== null) {
    const varName = match[1].trim();
    const context = code.substring(Math.max(0, match.index - 20), Math.min(code.length, match.index + match[0].length + 20));
    if (!context.includes('||') && !context.includes('??')) {
      foundUnsafeEntries.push(varName);
    }
  }
  
  if (foundUnsafeEntries.length > 0) {
    criticalIssues.push(`Object.entries() called without null check on: ${foundUnsafeEntries.join(', ')}`);
    suggestions.push(`Wrap with null check: Object.entries(${foundUnsafeEntries[0]} || {})`);
  }
  
  // Critical: Object.values without null safety
  const unsafeObjectValues = /Object\.values\s*\(\s*([a-zA-Z_$][\w.]*)\s*\)/g;
  const foundUnsafeValues: string[] = [];
  
  while ((match = unsafeObjectValues.exec(code)) !== null) {
    const varName = match[1].trim();
    const context = code.substring(Math.max(0, match.index - 20), Math.min(code.length, match.index + match[0].length + 20));
    if (!context.includes('||') && !context.includes('??')) {
      foundUnsafeValues.push(varName);
    }
  }
  
  if (foundUnsafeValues.length > 0) {
    criticalIssues.push(`Object.values() called without null check on: ${foundUnsafeValues.join(', ')}`);
    suggestions.push(`Wrap with null check: Object.values(${foundUnsafeValues[0]} || {})`);
  }
  
  // Critical: .map() without safety
  const unsafeMapPattern = /(?<![(\s]|\|\|)([a-zA-Z_$][\w.]*(?<!\|\|))\.map\s*\(/g;
  const foundUnsafeMaps: string[] = [];
  
  while ((match = unsafeMapPattern.exec(code)) !== null) {
    const varName = match[1].trim();
    // Check if there's a safety wrapper before this
    const beforeContext = code.substring(Math.max(0, match.index - 30), match.index);
    if (!beforeContext.includes(`(${varName} ||`) && !beforeContext.includes(`${varName}?`)) {
      foundUnsafeMaps.push(varName);
    }
  }
  
  if (foundUnsafeMaps.length > 0) {
    criticalIssues.push(`.map() called without null check on: ${foundUnsafeMaps.join(', ')}`);
    suggestions.push(`Wrap array: (${foundUnsafeMaps[0]} || []).map(...) or use safeMap(${foundUnsafeMaps[0]}, ...)`);
  }
  
  // Warning: Destructuring without defaults
  const unsafeDestructuring = /const\s*\{([^}]+)\}\s*=\s*([a-zA-Z_$][\w.]*);/g;
  const foundUnsafeDestructuring: string[] = [];
  
  while ((match = unsafeDestructuring.exec(code)) !== null) {
    const varName = match[2].trim();
    const fields = match[1];
    // Check if there's a default value or null check
    if (!fields.includes('=') && !code.includes(`${varName} ||`) && !code.includes(`${varName} ??`)) {
      foundUnsafeDestructuring.push(varName);
    }
  }
  
  if (foundUnsafeDestructuring.length > 0) {
    suggestions.push(`Add default for destructuring: const {...} = ${foundUnsafeDestructuring[0]} || {}`);
  }
  
  return {
    valid: criticalIssues.length === 0,
    criticalIssues,
    suggestions
  };
}

