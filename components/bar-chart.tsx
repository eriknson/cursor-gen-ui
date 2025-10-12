"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ComponentConfig } from "@/lib/agent-wrapper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

interface BarChartProps {
  data: DataPoint[] | MultiDatasetFormat;
  config?: ComponentConfig;
}

export const BarChart = ({ data, config = {} }: BarChartProps) => {
  if (!data) {
    return null;
  }

  // Detect data format: multi-dataset or single dataset
  const isMultiDataset = !Array.isArray(data) && 'labels' in data && 'datasets' in data;

  let labels: string[];
  let datasets: any[];

  const defaultColors = [
    "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", 
    "#14b8a6", "#ec4899", "#06b6d4"
  ];

  const vibrantColors = [
    "#f43f5e", "#f97316", "#eab308", "#22c55e",
    "#14b8a6", "#3b82f6", "#a855f7", "#ec4899"
  ];

  const variant = config.variant || "vertical";
  const theme = config.theme || "default";
  const grouping = config.grouping || "grouped";

  if (isMultiDataset) {
    // Multi-dataset format
    const multiData = data as MultiDatasetFormat;
    if (!multiData.datasets || multiData.datasets.length === 0) {
      return null;
    }
    
    labels = multiData.labels;
    datasets = multiData.datasets.map((dataset, idx) => {
      const color = dataset.color || config.colors?.[idx] || defaultColors[idx % defaultColors.length];
      return {
        label: dataset.name,
        data: dataset.values,
        backgroundColor: color,
        borderRadius: 6,
        borderWidth: 0,
      };
    });
  } else {
    // Single dataset format (backward compatible)
    const singleData = data as DataPoint[];
    if (singleData.length === 0) {
      return null;
    }

    labels = singleData.map((d) => d.label);
    const values = singleData.map((d) => d.value);
    const primaryColor = config.colors?.[0] || defaultColors[0];

    datasets = [
      {
        data: values,
        backgroundColor:
          theme === "vibrant"
            ? config.colors || vibrantColors
            : primaryColor,
        borderRadius: 6,
        borderWidth: 0,
      },
    ];
  }

  const indexAxis = variant === "horizontal" ? ("y" as const) : ("x" as const);
  const showLegend = config.showLegend ?? (isMultiDataset && datasets.length > 1);
  
  const chartData = {
    labels,
    datasets,
  };
  
  const options = {
    indexAxis,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
          color: "#71717a",
        },
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
      },
    },
    scales: {
      x: {
        stacked: grouping === "stacked",
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#71717a",
        },
      },
      y: {
        stacked: grouping === "stacked",
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#71717a",
        },
      },
    },
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <div
          className={
            showLegend 
              ? variant === "horizontal" ? "h-[320px]" : "h-[240px]"
              : variant === "horizontal" ? "h-[280px]" : "h-[200px]"
          }
        >
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </motion.div>
  );
};

