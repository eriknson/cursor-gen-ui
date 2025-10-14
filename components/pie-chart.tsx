"use client";

import { motion } from "framer-motion";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import { ComponentConfig } from "@/lib/agent-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
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
  label: string;
  value: number;
}

interface PieChartProps {
  data: DataPoint[];
  config?: ComponentConfig;
}

export const PieChart = ({ data, config = {} }: PieChartProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const variant = config.variant || "pie";
  const showPercentages = config.showPercentages ?? true;
  const theme = config.theme || "default";

  const colors = config.colors || MONOCHROME_COLORS;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = data.map((d, index) => ({
    name: d.label,
    value: d.value,
    color: colors[index % colors.length],
  }));

  // Create chart config for shadcn
  const chartConfig: ChartConfig = data.reduce((acc, item, index) => {
    acc[item.label] = {
      label: item.label,
      color: colors[index % colors.length],
    };
    return acc;
  }, {} as ChartConfig);

  const title = config.title;

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
              <RechartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={variant === "donut" ? 60 : 0}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </RechartsPieChart>
            </ChartContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground truncate">
                    {item.label}
                  </div>
                  {showPercentages && (
                    <div className="text-xs font-semibold text-foreground">
                      {((item.value / total) * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

