/**
 * CSS Validator and Sanitizer
 * 
 * Detects and fixes dangerous CSS patterns in AI-generated component code
 * to prevent layout breaks, overflow issues, and z-index conflicts.
 */

export interface ValidationResult {
  safe: string;
  violations: string[];
}

/**
 * Validates and sanitizes component code for CSS safety
 */
export function validateAndSanitizeCSS(code: string): ValidationResult {
  const violations: string[] = [];
  let safeCode = code;

  // 1. Detect and remove position: absolute and position: fixed
  // These cause elements to stack on top of each other
  const absolutePositionRegex = /className\s*=\s*["']([^"']*\b(?:absolute|fixed)\b[^"']*)["']/g;
  let match;
  while ((match = absolutePositionRegex.exec(code)) !== null) {
    const fullMatch = match[0];
    const classes = match[1];
    
    // Remove absolute/fixed classes entirely (don't replace with relative)
    const safeClasses = classes
      .replace(/\babsolute\b/g, '')
      .replace(/\bfixed\b/g, '')
      // Also remove common positioning classes that depend on absolute
      .replace(/\b(?:top|bottom|left|right|inset)-\S+\b/g, '')
      .replace(/\s+/g, ' ') // Clean up multiple spaces
      .trim();
    
    const safeClassAttr = `className="${safeClasses}"`;
    safeCode = safeCode.replace(fullMatch, safeClassAttr);
    
    violations.push(`Removed position: absolute/fixed and positioning classes`);
  }

  // 2. Detect and clamp high z-index values
  const zIndexRegex = /\bz-(\d+)\b/g;
  safeCode = safeCode.replace(zIndexRegex, (match, value) => {
    const zValue = parseInt(value, 10);
    if (zValue > 10) {
      violations.push(`Clamped z-index from z-${value} to z-10`);
      return 'z-10';
    }
    return match;
  });

  // 3. Ensure overflow-hidden on Card components (but not CardHeader, CardTitle, etc.)
  // Use word boundary to match only <Card, not <CardHeader, <CardTitle, etc.
  const cardRegex = /<Card(?![A-Z])\s+className\s*=\s*["']([^"']*)["']/g;
  safeCode = safeCode.replace(cardRegex, (match, classes) => {
    if (!classes.includes('overflow-hidden')) {
      violations.push(`Added overflow-hidden to Card component`);
      return `<Card className="${classes} overflow-hidden"`;
    }
    return match;
  });

  // Also handle Card with no className (but not CardHeader, CardTitle, etc.)
  const cardNoClassRegex = /<Card(?![A-Z])(?!\s+className)/g;
  safeCode = safeCode.replace(cardNoClassRegex, (match) => {
    violations.push(`Added overflow-hidden className to Card`);
    return '<Card className="overflow-hidden"';
  });

  // 4. Detect dangerous negative margins that could break layout
  const negativeMarginRegex = /-m(?:t|b|l|r|x|y)-(\d+)/g;
  safeCode = safeCode.replace(negativeMarginRegex, (match, value) => {
    const marginValue = parseInt(value, 10);
    if (marginValue > 4) {
      violations.push(`Removed dangerous negative margin: ${match}`);
      return ''; // Remove the class
    }
    return match;
  });

  // 5. Check for overflow: visible in style props (less common but possible)
  const overflowVisibleRegex = /overflow:\s*['"]?visible['"]?/gi;
  if (overflowVisibleRegex.test(safeCode)) {
    safeCode = safeCode.replace(overflowVisibleRegex, 'overflow: hidden');
    violations.push(`Changed overflow: visible to overflow: hidden`);
  }

  // 6. Validate outer wrapper has correct constraints
  const motionDivRegex = /<motion\.div[^>]*className\s*=\s*["']([^"']*)["'][^>]*>/;
  const motionMatch = safeCode.match(motionDivRegex);
  
  if (motionMatch) {
    const classes = motionMatch[1];
    const hasMaxWidth = classes.includes('md:max-w-[452px]') || classes.includes('md:max-w-[500px]');
    const hasMobileWidth = classes.includes('max-w-[calc(100dvw-80px)]');
    const hasFullWidth = classes.includes('w-full');
    
    if (!hasMaxWidth || !hasMobileWidth || !hasFullWidth) {
      violations.push(`Outer motion.div missing required responsive width classes`);
      
      // Try to fix it
      let newClasses = classes;
      if (!hasMaxWidth) newClasses += ' md:max-w-[452px]';
      if (!hasMobileWidth) newClasses += ' max-w-[calc(100dvw-80px)]';
      if (!hasFullWidth) newClasses += ' w-full';
      
      safeCode = safeCode.replace(
        motionMatch[0],
        motionMatch[0].replace(classes, newClasses.trim())
      );
    }
  }

  // 7. Remove inline style with position: absolute/fixed
  const inlineStylePositionRegex = /style\s*=\s*\{\{[^}]*position:\s*['"](?:absolute|fixed)['"]/g;
  if (inlineStylePositionRegex.test(safeCode)) {
    // This is complex to fix safely, so we'll just warn
    violations.push(`Warning: Inline style with position: absolute/fixed detected (manual review needed)`);
  }

  // 8. Ensure CardContent has proper spacing (space-y for vertical stacking)
  const cardContentRegex = /<CardContent(?:\s+className\s*=\s*["']([^"']*)["'])?/g;
  safeCode = safeCode.replace(cardContentRegex, (match, classes) => {
    if (!classes) {
      violations.push(`Added space-y-4 to CardContent for proper spacing`);
      return '<CardContent className="space-y-4"';
    }
    
    // Check if it already has space-y or gap
    if (!classes.includes('space-y-') && !classes.includes('gap-')) {
      violations.push(`Added space-y-4 to CardContent for proper spacing`);
      return `<CardContent className="${classes} space-y-4"`;
    }
    return match;
  });

  // 9. Ensure div containers with multiple children have proper spacing
  // Look for divs that contain multiple elements and ensure they have space-y or gap
  const divWithChildrenRegex = /<div\s+className\s*=\s*["']([^"']*)["'][^>]*>(?:[^<]*<[^/][^>]*>){2,}/g;
  safeCode = safeCode.replace(divWithChildrenRegex, (match) => {
    const classMatch = match.match(/className\s*=\s*["']([^"']*)["']/);
    if (classMatch) {
      const classes = classMatch[1];
      // Only add spacing if it's a flex or block container without spacing
      if ((classes.includes('flex-col') || classes.includes('block') || !classes.includes('flex')) 
          && !classes.includes('space-y-') 
          && !classes.includes('gap-')
          && !classes.includes('grid')) {
        const newClasses = classes + ' space-y-3';
        const newMatch = match.replace(classes, newClasses);
        violations.push(`Added space-y-3 to container div for proper element spacing`);
        return newMatch;
      }
    }
    return match;
  });

  return {
    safe: safeCode,
    violations
  };
}

/**
 * Quick validation check without modification
 */
export function hasCSSSafetyIssues(code: string): boolean {
  // Check for forbidden patterns
  const patterns = [
    /\babsolute\b/,
    /\bfixed\b/,
    /\bz-(?:2[0-9]|[3-9][0-9]|[1-9]\d{2,})\b/, // z-index > 19
    /-m(?:t|b|l|r|x|y)-(?:[5-9]|\d{2,})/, // negative margins > 4
  ];

  return patterns.some(pattern => pattern.test(code));
}

