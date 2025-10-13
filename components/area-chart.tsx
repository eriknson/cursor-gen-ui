"use client";

import { motion } from "framer-motion";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Monochrome color palette
const MONOCHROME_COLORS = [
  "hsl(var(--foreground))",        // Primary black/dark
  "hsl(var(--muted-foreground))",  // Secondary grey
  "hsl(var(--muted))",             // Light grey
  "hsl(var(--border))",            // Border grey
  "hsl(var(--secondary))",         // Secondary background
  "hsl(var(--accent))",            // Accent grey
  "hsl(var(--card-foreground))",    // Card text
  "hsl(var(--popover-foreground))", // Popover text
];

interface DataPoint {
  label: string;
  value: number;
}

interface Dataset {
  name: string;
  values: number[];
  color?: string;
}

interface MultiDatasetFormat {
  labels: string[];
  datasets: Dataset[];
}

interface AreaChartProps {
  data: DataPoint[] | MultiDatasetFormat;
  config?: ComponentConfig;
}

export const AreaChart = ({ data, config = {} }: AreaChartProps) => {
  if (!data) {
    return null;
  }

  // Detect data format: multi-dataset or single dataset
  const isMultiDataset = !Array.isArray(data) && 'labels' in data && 'datasets' in data;

  let chartData: any[];
  let chartConfig: ChartConfig;

  const variant = config.variant || "filled";
  const showGrid = config.showGrid ?? true;
  const theme = config.theme || "default";
  const grouping = config.grouping || "stacked";

  if (isMultiDataset) {
    // Multi-dataset format
    const multiData = data as MultiDatasetFormat;
    if (!multiData.datasets || multiData.datasets.length === 0) {
      return null;
    }
    
    // Transform to Recharts format
    chartData = multiData.labels.map((label, index) => {
      const dataPoint: any = { name: label };
      multiData.datasets.forEach((dataset) => {
        dataPoint[dataset.name] = dataset.values[index];
      });
      return dataPoint;
    });

    // Create chart config for shadcn
    chartConfig = multiData.datasets.reduce((acc, dataset, idx) => {
      const color = dataset.color || config.colors?.[idx] || MONOCHROME_COLORS[idx % MONOCHROME_COLORS.length];
      acc[dataset.name] = {
        label: dataset.name,
        color: color,
      };
      return acc;
    }, {} as ChartConfig);
  } else {
    // Single dataset format (backward compatible)
    const singleData = data as DataPoint[];
    if (singleData.length === 0) {
      return null;
    }

    chartData = singleData.map((d) => ({
      name: d.label,
      value: d.value,
    }));

    const primaryColor = config.colors?.[0] || MONOCHROME_COLORS[0];
    chartConfig = {
      value: {
        label: "Value",
        color: primaryColor,
      },
    };
  }

  const showLegend = config.showLegend ?? (isMultiDataset && Object.keys(chartConfig).length > 1);
  const title = config.title || (isMultiDataset && chartData.length > 0 ? chartConfig[Object.keys(chartConfig)[0]]?.label : null);

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent className={title ? "p-4" : "p-4 pt-6"}>
          <div className="w-full h-[280px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <RechartsAreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                {Object.keys(chartConfig).map((key, index) => {
                  const color = chartConfig[key]?.color || MONOCHROME_COLORS[index % MONOCHROME_COLORS.length];
                  return (
                    <Area
                      key={key}
                      dataKey={key}
                      type="monotone"
                      stackId={grouping === "stacked" ? "stack" : undefined}
                      stroke={color}
                      fill={color}
                      fillOpacity={theme === "minimal" ? 0.1 : grouping === "stacked" ? 0.6 : 0.4}
                    />
                  );
                })}
              </RechartsAreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

