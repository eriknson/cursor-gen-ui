"use client";

import { motion } from "framer-motion";
import {
  LineChart as RechartsLineChart,
  Line,
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

// Monochrome color palette - using actual color values that work in both light and dark modes
const MONOCHROME_COLORS = [
  "#1E1E1E",  // Primary dark
  "#6B6B6B",  // Secondary grey
  "#A8A8A8",  // Light grey
  "#8B8B8B",  // Medium grey
  "#707070",  // Another grey
  "#959595",  // Light medium grey
  "#5A5A5A",  // Dark grey
  "#ABABAB",  // Very light grey
];

interface DataPoint {
  label?: string;
  value?: number;
  x?: string;
  y?: number;
  date?: string;
  price?: number;
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

interface LineChartProps {
  data: DataPoint[] | MultiDatasetFormat;
  config?: ComponentConfig;
}

export const LineChart = ({ data, config = {} }: LineChartProps) => {
  if (!data) {
    return null;
  }

  // Detect data format: multi-dataset or single dataset
  const isMultiDataset = !Array.isArray(data) && 'labels' in data && 'datasets' in data;

  let chartData: any[];
  let chartConfig: ChartConfig;

  if (isMultiDataset) {
    // Multi-dataset format
    const multiData = data as MultiDatasetFormat;
    if (!multiData.datasets || multiData.datasets.length === 0) {
      return null;
    }
    
    // Transform to Recharts format
    chartData = multiData.labels.map((label, index) => {
      const dataPoint: any = { name: label };
      multiData.datasets.forEach((dataset, datasetIndex) => {
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

    const normalizedData = singleData.map((d) => ({
      name: d.label || d.x || d.date || "",
      value: d.value ?? d.y ?? d.price ?? 0,
    }));

    chartData = normalizedData;
    const primaryColor = config.colors?.[0] || MONOCHROME_COLORS[0];

    chartConfig = {
      value: {
        label: "Value",
        color: primaryColor,
      },
    };
  }

  const showGrid = config.showGrid ?? true;
  const showLegend = config.showLegend ?? (isMultiDataset && Object.keys(chartConfig).length > 1);
  const title = config.title || (isMultiDataset && chartData.length > 0 ? chartConfig[Object.keys(chartConfig)[0]]?.label : null);

  return (
    <motion.div
      className="md:max-w-[452px] max-w-full w-full pb-6"
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
            <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
              <RechartsLineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" />}
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
                    <Line
                      key={key}
                      dataKey={key}
                      type={config.variant === "stepped" ? "step" : "monotone"}
                      stroke={color}
                      strokeWidth={config.theme === "minimal" ? 1.5 : 2}
                      dot={config.showPoints ?? true ? { r: 3 } : false}
                      activeDot={{ r: 5 }}
                    />
                  );
                })}
              </RechartsLineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

