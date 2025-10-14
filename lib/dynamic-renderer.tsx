import React from 'react';
import { transform } from '@babel/standalone';
import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { ResponsiveContainer, LineChart, BarChart, AreaChart, PieChart, Line, Bar, Area, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';

interface DynamicRendererProps {
  code: string;
  data?: any; // Optional data for fallback rendering
}

/**
 * Safe helper utilities injected into component scope
 */
const safeHelpers = {
  safeKeys: (obj: any) => Object.keys(obj || {}),
  safeEntries: (obj: any) => Object.entries(obj || {}),
  safeValues: (obj: any) => Object.values(obj || {}),
  safeMap: (arr: any, fn: Function) => (arr || []).map(fn),
  safeFilter: (arr: any, fn: Function) => (arr || []).filter(fn),
  safeReduce: (arr: any, fn: Function, initial: any) => (arr || []).reduce(fn, initial),
  safeGet: (obj: any, path: string, defaultValue: any = null) => {
    try {
      return path.split('.').reduce((acc, part) => acc?.[part], obj) ?? defaultValue;
    } catch {
      return defaultValue;
    }
  }
};

/**
 * Transform code to add safety checks automatically
 * Wraps common unsafe patterns with null checks
 */
function transformCodeForSafety(code: string): string {
  let safeCode = code;
  
  // Transform Object.keys(x) -> Object.keys(x || {})
  safeCode = safeCode.replace(
    /Object\.keys\s*\(\s*([a-zA-Z_$][\w.$]*(?:\?\.[\w$]+)*)\s*\)/g,
    (match, varName) => {
      // Skip if already has safety
      if (varName.includes('||') || varName.includes('??')) {
        return match;
      }
      return `Object.keys(${varName} || {})`;
    }
  );
  
  // Transform Object.entries(x) -> Object.entries(x || {})
  safeCode = safeCode.replace(
    /Object\.entries\s*\(\s*([a-zA-Z_$][\w.$]*(?:\?\.[\w$]+)*)\s*\)/g,
    (match, varName) => {
      if (varName.includes('||') || varName.includes('??')) {
        return match;
      }
      return `Object.entries(${varName} || {})`;
    }
  );
  
  // Transform Object.values(x) -> Object.values(x || {})
  safeCode = safeCode.replace(
    /Object\.values\s*\(\s*([a-zA-Z_$][\w.$]*(?:\?\.[\w$]+)*)\s*\)/g,
    (match, varName) => {
      if (varName.includes('||') || varName.includes('??')) {
        return match;
      }
      return `Object.values(${varName} || {})`;
    }
  );
  
  // Transform arr.map( -> (arr || []).map(
  // This is trickier - need to handle various patterns
  safeCode = safeCode.replace(
    /([a-zA-Z_$][\w.$]*(?:\?\.[\w$]+)*)\.map\s*\(/g,
    (match, varName) => {
      // Skip if already wrapped or using optional chaining
      if (varName.includes('||') || varName.includes('??') || match.startsWith('(')) {
        return match;
      }
      // Check if there's already a paren before (like in (arr || []).map)
      return `(${varName} || []).map(`;
    }
  );
  
  // Transform arr.filter( -> (arr || []).filter(
  safeCode = safeCode.replace(
    /([a-zA-Z_$][\w.$]*(?:\?\.[\w$]+)*)\.filter\s*\(/g,
    (match, varName) => {
      if (varName.includes('||') || varName.includes('??') || match.startsWith('(')) {
        return match;
      }
      return `(${varName} || []).filter(`;
    }
  );
  
  // Transform arr.reduce( -> (arr || []).reduce(
  safeCode = safeCode.replace(
    /([a-zA-Z_$][\w.$]*(?:\?\.[\w$]+)*)\.reduce\s*\(/g,
    (match, varName) => {
      if (varName.includes('||') || varName.includes('??') || match.startsWith('(')) {
        return match;
      }
      return `(${varName} || []).reduce(`;
    }
  );
  
  // Transform spread {...obj} -> {...(obj || {})} for object spreads
  // This is complex - only do it for simple variable spreads
  safeCode = safeCode.replace(
    /\{\s*\.\.\.([a-zA-Z_$][\w]*)\s*\}/g,
    (match, varName) => {
      if (varName.includes('||') || varName.includes('??')) {
        return match;
      }
      return `{...(${varName} || {})}`;
    }
  );
  
  return safeCode;
}

/**
 * Fallback component that displays data in a simple, readable format
 * when the generated component fails to render
 */
function DataFallbackCard({ data, error }: { data?: any; error: Error }) {
  const renderValue = (value: any, depth = 0): React.ReactNode => {
    if (value === null) return <span className="text-muted-foreground">null</span>;
    if (value === undefined) return <span className="text-muted-foreground">undefined</span>;
    
    if (typeof value === 'boolean') {
      return <Badge variant={value ? "default" : "secondary"}>{String(value)}</Badge>;
    }
    
    if (typeof value === 'number') {
      return <span className="font-mono text-blue-600 dark:text-blue-400">{value}</span>;
    }
    
    if (typeof value === 'string') {
      if (value.startsWith('http://') || value.startsWith('https://')) {
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline text-xs">
            {value}
          </a>
        );
      }
      return <span className="text-foreground">{value}</span>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-muted-foreground">[]</span>;
      if (depth > 2) return <span className="text-muted-foreground">[{value.length} items]</span>;
      
      return (
        <div className="space-y-1 pl-4 border-l-2 border-muted">
          {value.slice(0, 10).map((item, i) => (
            <div key={i} className="text-sm">
              <span className="text-muted-foreground mr-2">{i}:</span>
              {renderValue(item, depth + 1)}
            </div>
          ))}
          {value.length > 10 && (
            <div className="text-xs text-muted-foreground">... and {value.length - 10} more</div>
          )}
        </div>
      );
    }
    
    if (typeof value === 'object') {
      if (depth > 2) return <span className="text-muted-foreground">{'{...}'}</span>;
      const entries = Object.entries(value).slice(0, 20);
      
      return (
        <div className="space-y-1 pl-4 border-l-2 border-muted">
          {entries.map(([key, val]) => (
            <div key={key} className="text-sm">
              <span className="font-medium text-foreground mr-2">{key}:</span>
              {renderValue(val, depth + 1)}
            </div>
          ))}
          {Object.keys(value).length > 20 && (
            <div className="text-xs text-muted-foreground">
              ... and {Object.keys(value).length - 20} more fields
            </div>
          )}
        </div>
      );
    }
    
    return <span className="text-muted-foreground">{String(value)}</span>;
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/50 dark:to-orange-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Icons.AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            Component Error - Showing Raw Data
          </CardTitle>
          <CardDescription className="text-xs">
            The component failed to render, but here's your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded border border-red-200 dark:border-red-800">
              <p className="text-xs font-medium text-red-800 dark:text-red-200 mb-1">Error:</p>
              <p className="text-xs text-red-700 dark:text-red-300 font-mono">{error.message}</p>
            </div>
          )}
          
          {data ? (
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2">
                {renderValue(data)}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DynamicRenderer({ code, data }: DynamicRendererProps) {
  const Component = React.useMemo(() => {
    try {
      // Remove export statements
      const codeWithoutExports = code
        .replace(/export\s+default\s+/g, '')
        .replace(/export\s+/g, '');
      
      // Apply safety transformations
      const safeCode = transformCodeForSafety(codeWithoutExports);
      
      // Log original code for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Original component code (first 500 chars):', codeWithoutExports.slice(0, 500));
        console.log('🛡️ Safe code (first 500 chars):', safeCode.slice(0, 500));
      }
      
      // Transform with Babel
      const transformed = transform(safeCode, {
        presets: ['react'],
        filename: 'component.tsx'
      }).code;
      
      if (!transformed) {
        throw new Error('Babel transformation produced no output');
      }
      
      // Log transformed code for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Transformed code (first 500 chars):', transformed.slice(0, 500));
      }
      
      // Create scope with all available components AND DATA
      const scope = {
        React,
        useState: React.useState,
        useMemo: React.useMemo,
        useCallback: React.useCallback,
        useRef: React.useRef,
        // Shadcn components
        Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
        Badge, Button, Input, Label, Slider, Switch,
        Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
        Tabs, TabsList, TabsTrigger, TabsContent,
        Accordion, AccordionItem, AccordionTrigger, AccordionContent,
        Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
        Avatar, AvatarImage, AvatarFallback,
        Progress, ScrollArea, Separator,
        ChartContainer,
        // Chart components
        ResponsiveContainer, LineChart, BarChart, AreaChart, PieChart,
        Line, Bar, Area, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
        // Utilities
        Icons, motion, cn, NumberFlow,
        // DATA INJECTION - Make data available to component
        data: data || {},
        // Safe helper utilities
        ...safeHelpers
      };
      
      // Create function with scope
      const functionBody = `
        ${transformed}
        return GeneratedComponent;
      `;
      
      const createFunction = new Function(...Object.keys(scope), functionBody);
      return createFunction(...Object.values(scope));
    } catch (error) {
      console.error('❌ Component creation error:', error);
      console.error('Stack trace:', (error as Error).stack);
      console.error('Failed code:', code);
      throw error;
    }
  }, [code, data]);
  
  const ErrorFallback = ({ error }: { error: Error }) => {
    // Log the runtime error with full details
    console.error('🔴 Component runtime error:', error);
    console.error('Stack trace:', error.stack);
    
    // Use DataFallbackCard to show the data even when component fails
    return <DataFallbackCard data={data} error={error} />;
  };
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component />
    </ErrorBoundary>
  );
}
