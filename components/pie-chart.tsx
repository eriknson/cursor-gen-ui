"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Doughnut } from "react-chartjs-2";
import { ComponentConfig } from "@/lib/agent-wrapper";

ChartJS.register(ArcElement, Tooltip, Legend);

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

  const defaultColors = [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#ec4899", // pink
    "#f59e0b", // amber
    "#10b981", // emerald
    "#06b6d4", // cyan
    "#ef4444", // red
    "#84cc16", // lime
  ];

  const vibrantColors = [
    "#f43f5e", // rose
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green
    "#14b8a6", // teal
    "#3b82f6", // blue
    "#a855f7", // purple
    "#ec4899", // pink
  ];

  const colors = config.colors || (theme === "vibrant" ? vibrantColors : defaultColors);

  const total = data.reduce((sum, d) => sum + d.value, 0);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: colors.slice(0, data.length),
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 12,
          weight: "normal" as const,
        },
        bodyFont: {
          size: 14,
          weight: "bold" as const,
        },
        callbacks: showPercentages
          ? {
              label: (context: any) => {
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${percentage}%`;
              },
            }
          : undefined,
      },
    },
  };

  const ChartComponent = variant === "donut" ? Doughnut : Pie;

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="h-[240px] mb-4">
          <ChartComponent data={chartData} options={options} />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                  {item.label}
                </div>
                {showPercentages && (
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {((item.value / total) * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

