export type LoadingPhase = 
  | 'analyzing'
  | 'planning'
  | 'searching'
  | 'extracting'
  | 'preparing'
  | 'designing'
  | 'generating'
  | 'validating'
  | 'reviewing'
  | 'complete';

export interface LoadingState {
  phase: LoadingPhase;
  message: string;
  progress: number;
  subtext?: string;
}

export function getLoadingState(phase: LoadingPhase): LoadingState {
  const states: Record<LoadingPhase, LoadingState> = {
    analyzing: { phase: 'analyzing', message: 'Understanding your question', progress: 5, subtext: 'Analyzing intent and requirements' },
    planning: { phase: 'planning', message: 'Planning the UI', progress: 15, subtext: 'Choosing components and layout' },
    searching: { phase: 'searching', message: 'Searching the web', progress: 35, subtext: 'Finding live data sources' },
    extracting: { phase: 'extracting', message: 'Processing results', progress: 50, subtext: 'Extracting structured data' },
    preparing: { phase: 'preparing', message: 'Preparing data', progress: 55, subtext: 'Generating example data' },
    designing: { phase: 'designing', message: 'Designing the interface', progress: 65, subtext: 'Creating interactive layout' },
    generating: { phase: 'generating', message: 'Generating component', progress: 80, subtext: 'Building React code' },
    validating: { phase: 'validating', message: 'Validating', progress: 90, subtext: 'Running safety checks' },
    reviewing: { phase: 'reviewing', message: 'Reviewing quality', progress: 95, subtext: 'Final polish' },
    complete: { phase: 'complete', message: 'Complete', progress: 100 }
  };
  
  return states[phase];
}

