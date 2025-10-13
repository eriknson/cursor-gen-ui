"use client";

const ALL_MODELS = [
  { value: 'auto', label: 'auto', cost: 'free' },
  { value: 'cheetah', label: 'cheetah', cost: 'low' },
  { value: 'gpt-5', label: 'gpt-5', cost: 'high' },
  { value: 'sonnet-4.5', label: 'sonnet-4.5', cost: 'high' },
  { value: 'grok', label: 'grok', cost: 'medium' },
];

// Get allowed models from environment variable (defaults to auto and cheetah only)
const getAllowedModels = () => {
  const allowedModelsEnv = process.env.NEXT_PUBLIC_ALLOWED_MODELS;
  if (allowedModelsEnv) {
    const allowedValues = allowedModelsEnv.split(',').map(m => m.trim());
    return ALL_MODELS.filter(m => allowedValues.includes(m.value));
  }
  // Default: only allow auto and cheetah (cost-effective models)
  return ALL_MODELS.filter(m => ['auto', 'cheetah'].includes(m.value));
};

const MODELS = getAllowedModels();

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export function ModelSelector({ selectedModel, onModelChange, disabled }: ModelSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    onModelChange(newModel);
    
    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('model', newModel);
    window.history.pushState({}, '', url);
  };
  
  return (
    <div className="relative">
      <select
        value={selectedModel}
        onChange={handleChange}
        disabled={disabled}
        className="appearance-none bg-muted/40 hover:bg-muted/60 transition-colors rounded-full pl-2.5 sm:pl-3 pr-7 sm:pr-8 py-1 sm:py-1.5 text-xs sm:text-sm text-foreground border-0 outline-none disabled:opacity-50 cursor-pointer max-w-[140px] sm:max-w-none"
      >
        {MODELS.map((model) => (
          <option key={model.value} value={model.value}>
            {model.label}
          </option>
        ))}
      </select>
      <svg 
        width="12" 
        height="12" 
        viewBox="0 0 12 12" 
        className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
      >
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
