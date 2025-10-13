/**
 * Component Registry
 * Provides a sandboxed set of components that can be used in AI-generated JSX
 */

import React from "react";

// Shadcn UI Core Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Chart Components (Recharts via shadcn)
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  Area,
  Bar,
  Line,
  Pie,
  AreaChart as RechartsAreaChart,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Layout Components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";

// Feedback Components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

// Interactive Components
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Input Components (for display)
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";

// Navigation Components
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * The component registry defines all components available in the sandbox
 * Only these components can be used in AI-generated JSX
 */
export const componentRegistry = {
  // Shadcn UI Core
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Separator,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,

  // Charts (Recharts via shadcn)
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  AreaChart: RechartsAreaChart,
  BarChart: RechartsBarChart,
  LineChart: RechartsLineChart,
  PieChart: RechartsPieChart,
  Area,
  Bar,
  Line,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Cell,

  // Layout Components
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AspectRatio,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Calendar,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,

  // Feedback Components
  Alert,
  AlertDescription,
  AlertTitle,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Skeleton,

  // Interactive Components
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,

  // Input Components (for display purposes)
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Slider,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Textarea,

  // Navigation Components
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,

  // Utility Components
  Container: ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={`flex flex-col gap-4 ${className}`}>{children}</div>
  ),

  Grid: ({
    children,
    columns = 2,
    className = "",
  }: {
    children: React.ReactNode;
    columns?: number;
    className?: string;
  }) => (
    <div
      className={`grid gap-4 ${className}`}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  ),

  Flex: ({
    children,
    direction = "row",
    gap = 4,
    align = "start",
    justify = "start",
    className = "",
  }: {
    children: React.ReactNode;
    direction?: "row" | "column";
    gap?: number;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between" | "around";
    className?: string;
  }) => {
    const alignMap = {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    };
    const justifyMap = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    };

    return (
      <div
        className={`flex flex-${direction} ${alignMap[align]} ${justifyMap[justify]} gap-${gap} ${className}`}
      >
        {children}
      </div>
    );
  },

  Text: ({
    children,
    size = "base",
    weight = "normal",
    className = "",
  }: {
    children: React.ReactNode;
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
    weight?: "normal" | "medium" | "semibold" | "bold";
    className?: string;
  }) => {
    const sizeMap = {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    };
    const weightMap = {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    };

    return (
      <p className={`${sizeMap[size]} ${weightMap[weight]} ${className}`}>
        {children}
      </p>
    );
  },

  Heading: ({
    children,
    level = 2,
    className = "",
  }: {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
  }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
    const sizeMap = {
      1: "text-4xl font-bold",
      2: "text-3xl font-semibold",
      3: "text-2xl font-semibold",
      4: "text-xl font-semibold",
      5: "text-lg font-medium",
      6: "text-base font-medium",
    };

    return <Tag className={`${sizeMap[level]} ${className}`}>{children}</Tag>;
  },

  List: ({
    items,
    ordered = false,
    className = "",
  }: {
    items: string[] | { text: string; icon?: string }[];
    ordered?: boolean;
    className?: string;
  }) => {
    const Tag = ordered ? "ol" : "ul";
    const listClass = ordered ? "list-decimal" : "list-disc";

    return (
      <Tag className={`${listClass} list-inside space-y-2 ${className}`}>
        {items.map((item, i) => {
          const text = typeof item === "string" ? item : item.text;
          const icon =
            typeof item === "object" && item.icon ? item.icon + " " : "";

          return <li key={i}>{icon}{text}</li>;
        })}
      </Tag>
    );
  },

  Image: ({
    src,
    alt,
    caption,
    className = "",
  }: {
    src: string;
    alt?: string;
    caption?: string;
    className?: string;
  }) => (
    <figure className={className}>
      <img
        src={src}
        alt={alt || caption || "Image"}
        className="w-full h-auto rounded-lg"
      />
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  ),

  Stat: ({
    label,
    value,
    change,
    trend,
    icon,
  }: {
    label: string;
    value: string | number;
    change?: string;
    trend?: "up" | "down" | "neutral";
    icon?: string;
  }) => {
    const trendColors = {
      up: "text-green-600 dark:text-green-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-gray-600 dark:text-gray-400",
    };
    const trendIcons = {
      up: "↑",
      down: "↓",
      neutral: "→",
    };

    return (
      <div className="flex flex-col gap-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="flex items-baseline gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <span className="text-3xl font-bold">{value}</span>
          {change && trend && (
            <span className={`text-sm ${trendColors[trend]}`}>
              {trendIcons[trend]} {change}
            </span>
          )}
        </div>
      </div>
    );
  },
};

/**
 * Get the full component registry for use in ReactRenderer
 */
export function getComponentRegistry() {
  return componentRegistry;
}

/**
 * Get list of available component names for AI prompt
 */
export function getAvailableComponents(): string[] {
  return Object.keys(componentRegistry);
}
