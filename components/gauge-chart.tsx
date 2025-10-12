"use client";

import { motion } from "framer-motion";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { ComponentConfig } from "@/lib/agent-wrapper";

ChartJS.register(ArcElement, Tooltip);

interface GaugeData {
  value: number;
  max: number;
  label: string;
}

interface GaugeChartProps {
  data: GaugeData;
  config?: ComponentConfig;
}

export const GaugeChart = ({ data, config = {} }: GaugeChartProps) => {
  if (!data) {
    return null;
  }

  const color = config.color || "#6366f1";
  const variant = config.variant || "semi";
  const showValue = config.showValue ?? true;

  const percentage = (data.value / data.max) * 100;
  const remaining = data.max - data.value;

  // Color based on thresholds
  let gaugeColor = color;
  if (config.threshold) {
    if (percentage < config.threshold.low) {
      gaugeColor = "#ef4444"; // red
    } else if (percentage < config.threshold.mid) {
      gaugeColor = "#f59e0b"; // orange
    } else {
      gaugeColor = "#10b981"; // green
    }
  }

  const chartData = {
    datasets: [
      {
        data: variant === "semi" ? [data.value, remaining, data.max] : [data.value, remaining],
        backgroundColor:
          variant === "semi"
            ? [gaugeColor, "#e5e7eb", "transparent"]
            : [gaugeColor, "#e5e7eb"],
        borderWidth: 0,
        circumference: variant === "semi" ? 180 : 360,
        rotation: variant === "semi" ? -90 : 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div className="relative">
          <div
            className={variant === "semi" ? "h-[180px]" : "h-[240px]"}
          >
            <Doughnut data={chartData} options={options} />
          </div>

          {/* Center Value */}
          {showValue && (
            <div
              className={`absolute inset-0 flex flex-col items-center ${
                variant === "semi" ? "justify-end pb-8" : "justify-center"
              }`}
            >
              <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                {data.value}
              </div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                out of {data.max}
              </div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                {percentage.toFixed(1)}%
              </div>
            </div>
          )}
        </div>

        {/* Label */}
        <div className="text-center mt-4">
          <div className="text-base font-medium text-zinc-700 dark:text-zinc-300">
            {data.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

