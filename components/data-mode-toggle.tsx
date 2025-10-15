"use client";

import { SearchIcon, SparklesIcon } from './icons';

export type DataMode = 'web-search' | 'example-data';

interface DataModeToggleProps {
  dataMode: DataMode;
  onDataModeChange: (mode: DataMode) => void;
  disabled?: boolean;
}

export function DataModeToggle({ dataMode, onDataModeChange, disabled }: DataModeToggleProps) {
  const handleClick = () => {
    const newMode: DataMode = dataMode === 'web-search' ? 'example-data' : 'web-search';
    onDataModeChange(newMode);
    
    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('dataMode', newMode);
    window.history.pushState({}, '', url);
  };

  const isWebSearch = dataMode === 'web-search';
  const label = isWebSearch ? 'web' : 'mock';
  const Icon = isWebSearch ? SearchIcon : SparklesIcon;

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type="button"
      className="appearance-none bg-muted/40 hover:bg-muted/60 transition-colors rounded-full pl-2.5 sm:pl-3 pr-2.5 sm:pr-3 py-1 text-xs sm:text-sm text-muted-foreground border-0 outline-none disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

