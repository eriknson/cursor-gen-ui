/**
 * Safe, reusable component templates for AI generation
 * These templates provide building blocks for dynamic components
 */

export interface TemplateContext {
  data: any;
  config?: any;
}

/**
 * Base wrapper template for all components
 */
export const wrapperTemplate = (content: string) => `
  <div className="flex flex-col gap-3">
    {content}
  </div>
`;

/**
 * Card container template
 */
export const cardTemplate = (content: string, title?: string) => `
  <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
    ${title ? `<h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">${title}</h3>` : ''}
    ${content}
  </div>
`;

/**
 * Grid layout template
 */
export const gridTemplate = (items: string[], columns: number = 2) => `
  <div className="grid grid-cols-1 md:grid-cols-${columns} gap-4">
    ${items.join('\n    ')}
  </div>
`;

/**
 * List item template
 */
export const listItemTemplate = (icon: string, text: string, subtext?: string) => `
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
    <div className="text-2xl">${icon}</div>
    <div className="flex-1">
      <div className="text-zinc-900 dark:text-zinc-100">${text}</div>
      ${subtext ? `<div className="text-sm text-zinc-500 dark:text-zinc-400">${subtext}</div>` : ''}
    </div>
  </div>
`;

/**
 * Stat display template
 */
export const statTemplate = (value: string, label: string, trend?: 'up' | 'down' | 'neutral') => `
  <div className="flex flex-col gap-1">
    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
      ${value}
      ${trend === 'up' ? '<span className="text-green-500 text-lg ml-2">↑</span>' : ''}
      ${trend === 'down' ? '<span className="text-red-500 text-lg ml-2">↓</span>' : ''}
    </div>
    <div className="text-sm text-zinc-500 dark:text-zinc-400">${label}</div>
  </div>
`;

/**
 * Badge template
 */
export const badgeTemplate = (text: string, variant: 'default' | 'success' | 'warning' | 'error' = 'default') => {
  const variantClasses = {
    default: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  };

  return `
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]}">
      ${text}
    </span>
  `;
};

/**
 * Progress bar template
 */
export const progressBarTemplate = (percentage: number, color: string = '#6366f1') => `
  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
    <div 
      className="h-2 rounded-full transition-all duration-300" 
      style={{ width: '${percentage}%', backgroundColor: '${color}' }}
    />
  </div>
`;

/**
 * Table row template
 */
export const tableRowTemplate = (cells: string[], isHeader: boolean = false) => {
  const cellType = isHeader ? 'th' : 'td';
  const cellClass = isHeader 
    ? 'px-4 py-2 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider'
    : 'px-4 py-2 text-sm text-zinc-900 dark:text-zinc-100';
  
  return `
    <tr className="${isHeader ? 'border-b border-zinc-200 dark:border-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800'}">
      ${cells.map(cell => `<${cellType} className="${cellClass}">${cell}</${cellType}>`).join('\n      ')}
    </tr>
  `;
};

/**
 * Simple table template
 */
export const tableTemplate = (headers: string[], rows: string[][]) => `
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
      <thead className="bg-zinc-50 dark:bg-zinc-900">
        ${tableRowTemplate(headers, true)}
      </thead>
      <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
        ${rows.map(row => tableRowTemplate(row, false)).join('\n        ')}
      </tbody>
    </table>
  </div>
`;

/**
 * Timeline item template
 */
export const timelineItemTemplate = (title: string, description: string, time?: string, icon?: string) => `
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
        ${icon || '📍'}
      </div>
      <div className="w-0.5 h-full bg-zinc-200 dark:bg-zinc-700 mt-2"></div>
    </div>
    <div className="flex-1 pb-8">
      ${time ? `<div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">${time}</div>` : ''}
      <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">${title}</h4>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">${description}</p>
    </div>
  </div>
`;

/**
 * Image with caption template
 */
export const imageTemplate = (url: string, caption?: string, alt?: string) => `
  <figure className="relative">
    <img 
      src="${url}" 
      alt="${alt || caption || 'Image'}"
      className="w-full h-auto rounded-lg"
    />
    ${caption ? `<figcaption className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center">${caption}</figcaption>` : ''}
  </figure>
`;

/**
 * Alert/notification template
 */
export const alertTemplate = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200',
    success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-200',
    error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200',
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  return `
    <div className="p-4 border rounded-lg ${typeClasses[type]} flex items-start gap-3">
      <span className="text-xl">${icons[type]}</span>
      <div className="flex-1">${message}</div>
    </div>
  `;
};

/**
 * Get template by name
 */
export function getTemplate(name: string): Function | null {
  const templates: { [key: string]: Function } = {
    wrapper: wrapperTemplate,
    card: cardTemplate,
    grid: gridTemplate,
    listItem: listItemTemplate,
    stat: statTemplate,
    badge: badgeTemplate,
    progressBar: progressBarTemplate,
    tableRow: tableRowTemplate,
    table: tableTemplate,
    timelineItem: timelineItemTemplate,
    image: imageTemplate,
    alert: alertTemplate,
  };

  return templates[name] || null;
}

/**
 * Styling utilities for dynamic components
 */
export const stylingUtils = {
  colors: {
    primary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
  },
};

