import { cursor } from './cursor-agent';
import { validateStructure, validateSafety, validateStyle, validateRuntimeSafety, validateRelevance, validateComponentScope, validateRuntimePatterns } from './component-validators';
import { getLoadingState, LoadingPhase } from './loading-states';
import { PLANNER_PROMPT, DATA_PROMPT, DATA_GENERATION_PROMPT, getRendererPrompt, CRITIC_PROMPT } from './agent-prompts';
import { getExampleForIntent } from './component-registry';

// Legacy interface for backward compatibility
export interface ComponentConfig {
  colors?: string[];
  variant?: string;
  theme?: 'default' | 'vibrant' | 'minimal' | 'dark';
  showLabels?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  multiDataset?: boolean;
  grouping?: 'grouped' | 'stacked';
  showLegend?: boolean;
  [key: string]: any;
}

export interface AgentResponse {
  componentCode?: string;
  summary?: string;
  source?: string | null;
  textResponse?: string;
  error?: boolean;
  // Legacy fields for backward compatibility
  componentType?: string;
  config?: ComponentConfig;
  data?: any;
  customTSX?: string;
  fallbackToGenerate?: boolean;
  progressSteps?: string[];
}

export async function queryAgentStream(
  userMessage: string,
  onUpdate: (update: any) => void,
  model?: string
): Promise<void> {
  try {
    const modelToUse = model || process.env.CURSOR_MODEL || 'cheetah';
    
    // PHASE 1: Planning
    onUpdate({ type: 'progress', ...getLoadingState('planning') });
    
    const planResult = await cursor.generateStream({
      prompt: userMessage,
      systemPrompt: PLANNER_PROMPT,
      model: modelToUse,
      force: true
    });
    
    if (!planResult.success) {
      throw new Error('Planning failed: ' + (planResult.error || 'Unknown error'));
    }
    
    const plan = extractJSON(planResult.finalText);
    console.log('📋 Plan:', plan);
    
    // PHASE 2: Data Fetching (if needed)
    let dataResult: any = null;
    if (plan.needsWebSearch) {
      onUpdate({ type: 'progress', ...getLoadingState('searching') });
      
      const dataFetchResult = await cursor.generateStreamWithCallback({
        prompt: `Extract structured data for: ${userMessage}\nSearch query: ${plan.searchQuery}`,
        systemPrompt: DATA_PROMPT,
        model: modelToUse,
        force: true
      }, (event) => {
        if (event.type === 'tool_call' && event.subtype === 'started') {
          if (event.tool_call?.webSearchToolCall) {
            onUpdate({ type: 'progress', ...getLoadingState('extracting') });
          }
        }
      });
      
      if (!dataFetchResult.success) {
        console.warn('⚠️ Data fetching failed, continuing without data');
        dataResult = { data: {}, source: null, confidence: 'low' };
      } else {
        dataResult = extractJSON(dataFetchResult.finalText);
        console.log('📊 Data:', dataResult);
      }
    } else {
      // Generate mock data for non-web-search queries
      onUpdate({ type: 'progress', ...getLoadingState('preparing') });
      
      const mockDataResult = await cursor.generateStream({
        prompt: `Generate realistic example data for: "${userMessage}"
Content type: ${plan.intent}
Key entities: ${plan.keyEntities?.join(', ') || 'none'}`,
        systemPrompt: DATA_GENERATION_PROMPT,
        model: modelToUse,
        force: true
      });
      
      if (mockDataResult.success) {
        dataResult = extractJSON(mockDataResult.finalText);
        console.log('📊 Generated mock data:', dataResult);
      } else {
        console.warn('⚠️ Mock data generation failed, continuing without data');
        dataResult = { data: {}, source: null, confidence: 'low' };
      }
    }
    
    // PHASE 3: Rendering (with retry mechanism)
    onUpdate({ type: 'progress', ...getLoadingState('designing') });
    
    const example = getExampleForIntent(plan.intent);
    const renderPrompt = getRendererPrompt(plan.intent, example, userMessage);
    
    let code: string | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 1;
    let lastError: string | null = null;
    
    while (!code && retryCount <= MAX_RETRIES) {
      onUpdate({ type: 'progress', ...getLoadingState('generating') });
      
      // Build prompt with error feedback if retrying
      let fullPrompt = `USER REQUEST: "${userMessage}"

Intent: ${plan.intent}
Content Context: ${plan.contentContext || 'N/A'}
Key Entities: ${plan.keyEntities?.join(', ') || 'none'}
Components: ${plan.suggestedComponents.join(', ')}
Interactivity: ${plan.interactivityType}
Data: ${JSON.stringify(dataResult?.data || {})}

Generate a component that directly answers: "${userMessage}"`;

      if (retryCount > 0 && lastError) {
        fullPrompt = `⚠️ PREVIOUS ATTEMPT FAILED WITH ERROR ⚠️
${lastError}

Please fix the issue and try again.

${fullPrompt}`;
        console.log(`🔄 Retry attempt ${retryCount}/${MAX_RETRIES} with error feedback`);
      }
      
      const renderResult = await cursor.generateStream({
        prompt: fullPrompt,
        systemPrompt: renderPrompt,
        model: modelToUse,
        force: true
      });
      
      if (!renderResult.success) {
        lastError = 'Rendering failed: ' + (renderResult.error || 'Unknown error');
        retryCount++;
        continue;
      }
      
      // Log the raw response for debugging
      console.log('🔍 Raw renderer output (first 500 chars):', renderResult.finalText.slice(0, 500));
      
      const extractedCode = extractCode(renderResult.finalText);
      
      if (!extractedCode) {
        lastError = 'Failed to extract code from renderer output. Make sure to wrap code in [[CODE]]...[[/CODE]] markers.';
        console.error('❌', lastError);
        retryCount++;
        continue;
      }
      
      console.log('✅ Extracted code (first 200 chars):', extractedCode.slice(0, 200));
      
      // VALIDATION: Check for critical runtime errors BEFORE accepting code
      const runtimePatternsCheck = validateRuntimePatterns(extractedCode);
      if (!runtimePatternsCheck.valid) {
        lastError = `Runtime safety issues detected:\n${runtimePatternsCheck.criticalIssues.join('\n')}\n\nSuggestions:\n${runtimePatternsCheck.suggestions.join('\n')}`;
        console.warn('⚠️ Runtime pattern validation failed:', runtimePatternsCheck.criticalIssues);
        console.log('💡 Suggestions:', runtimePatternsCheck.suggestions);
        retryCount++;
        // Don't continue - let safety transformer handle it instead of retry
        // The transformer will fix these automatically
        code = extractedCode;
        break;
      }
      
      // Code passed all checks
      code = extractedCode;
      break;
    }
    
    // If we exhausted retries without getting code, throw error
    if (!code) {
      throw new Error(lastError || 'Failed to generate valid component code after retries');
    }
    
    // PHASE 4: Validation
    onUpdate({ type: 'progress', ...getLoadingState('validating') });
    
    const structureCheck = validateStructure(code);
    if (!structureCheck.valid) {
      throw new Error(structureCheck.error);
    }
    
    const safetyCheck = validateSafety(code);
    if (!safetyCheck.safe) {
      throw new Error(`Safety issues: ${safetyCheck.issues.join(', ')}`);
    }
    
    // Component scope validation (prevent "X is not defined" errors)
    const scopeCheck = validateComponentScope(code);
    if (!scopeCheck.valid) {
      console.error('❌ Component scope validation failed:', scopeCheck.issues);
      throw new Error(`Component scope issues: ${scopeCheck.issues.join('; ')}`);
    }
    console.log('✅ All components are available in runtime scope');
    
    const styleCheck = validateStyle(code);
    console.log(`✨ Style score: ${styleCheck.score}`);
    if (styleCheck.warnings.length > 0) {
      console.warn('⚠️ Style warnings:', styleCheck.warnings);
    }
    
    // Runtime safety validation (to catch potential null/undefined errors)
    const runtimeCheck = validateRuntimeSafety(code);
    if (!runtimeCheck.safe) {
      console.warn('⚠️ Runtime safety warnings:', runtimeCheck.warnings);
      // Don't block execution - the safety transformer will fix these automatically
    }
    
    // Relevance validation (ensure component matches user query)
    const relevanceCheck = validateRelevance(
      code,
      userMessage,
      plan.keyEntities || []
    );
    
    console.log(`🎯 Relevance score: ${relevanceCheck.score}`);
    
    if (!relevanceCheck.relevant) {
      console.error('❌ Generated UI is not relevant to query');
      console.error('Issues:', relevanceCheck.issues);
      throw new Error(
        `Generated UI is not relevant to the user query. ${relevanceCheck.issues.join(', ')}`
      );
    }
    
    if (relevanceCheck.issues.length > 0) {
      console.warn('⚠️ Relevance warnings:', relevanceCheck.issues);
    }
    
    // PHASE 5: Critic (optional, if style score is low)
    let finalCode = code;
    if (styleCheck.score < 70) {
      onUpdate({ type: 'progress', ...getLoadingState('reviewing') });
      
      try {
        const criticResult = await cursor.generateStream({
          prompt: `Review this component:\n\n${code}\n\nStyle score: ${styleCheck.score}\nWarnings: ${styleCheck.warnings.join(', ')}`,
          systemPrompt: CRITIC_PROMPT,
          model: modelToUse,
          force: true
        });
        
        if (criticResult.success) {
          const critique = extractJSON(criticResult.finalText);
          console.log('🔍 Critique:', critique);
          
          if (!critique.approved && critique.suggestions && critique.suggestions.length > 0) {
            console.warn('⚠️ Component needs improvement:', critique.suggestions);
            // Could implement auto-fix here in the future
          }
        }
      } catch (criticError) {
        console.warn('⚠️ Critic failed, proceeding with original:', criticError);
      }
    }
    
    // Success
    onUpdate({
      type: 'complete',
      response: {
        componentCode: finalCode,
        summary: `${plan.intent} component`,
        source: dataResult?.source || null,
        data: dataResult?.data || null // Pass data for fallback rendering
      }
    });
    
  } catch (error) {
    console.error('❌ Agent orchestration error:', error);
    onUpdate({
      type: 'complete',
      response: {
        textResponse: error instanceof Error ? error.message : 'Error generating component',
        error: true
      }
    });
  }
}

// Legacy function for backward compatibility
export async function queryAgent(
  userMessage: string,
  model?: string
): Promise<AgentResponse> {
  return new Promise((resolve) => {
    queryAgentStream(userMessage, (update) => {
      if (update.type === 'complete') {
        resolve(update.response);
      }
    }, model);
  });
}

function extractJSON(text: string): any {
  try {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  } catch (error) {
    console.error('Failed to extract JSON:', error);
    return {};
  }
}

function extractCode(text: string): string {
  // Strategy 1: Try [[CODE]]...[[/CODE]] markers (preferred format)
  let match = text.match(/\[\[CODE\]\]([\s\S]*?)\[\[\/CODE\]\]/);
  if (match && match[1].trim()) {
    console.log('✅ Extracted code using [[CODE]] markers');
    return match[1].trim();
  }
  
  // Strategy 2: Try markdown code blocks (```typescript, ```tsx, ```jsx, or ```)
  const codeBlockPatterns = [
    /```(?:typescript|tsx|jsx|javascript|js|react)\n([\s\S]*?)```/,
    /```\n([\s\S]*?)```/,
    /```([\s\S]*?)```/
  ];
  
  for (const pattern of codeBlockPatterns) {
    match = text.match(pattern);
    if (match && match[1].trim()) {
      console.log('✅ Extracted code using markdown code block');
      return match[1].trim();
    }
  }
  
  // Strategy 3: Look for code that starts with "const GeneratedComponent"
  const componentMatch = text.match(/const GeneratedComponent[\s\S]*?^}/m);
  if (componentMatch) {
    console.log('✅ Extracted code by finding GeneratedComponent');
    return componentMatch[0].trim();
  }
  
  // Strategy 4: Look for any function component pattern
  const functionMatch = text.match(/const \w+\s*=\s*\(\s*\)\s*=>\s*\{[\s\S]*?^}/m);
  if (functionMatch) {
    console.log('⚠️ Extracted code by finding function component pattern (may need renaming)');
    return functionMatch[0].trim();
  }
  
  console.error('❌ All extraction strategies failed');
  return '';
}
