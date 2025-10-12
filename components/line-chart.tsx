"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ComponentConfig } from "@/lib/agent-wrapper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

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

  let labels: string[];
  let datasets: any[];

  const defaultColors = [
    "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6", 
    "#14b8a6", "#ec4899", "#06b6d4"
  ];

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
        borderColor: color,
        backgroundColor:
          config.theme === "vibrant"
            ? `${color}33`
            : config.theme === "minimal"
              ? "transparent"
              : `${color}22`,
        borderWidth: config.theme === "minimal" ? 1.5 : 2,
        fill: config.theme !== "minimal",
        tension: config.variant === "smooth" ? 0.4 : config.variant === "stepped" ? 0 : 0.4,
        pointRadius: config.showPoints ?? true ? 3 : 0,
        pointHoverRadius: 5,
        pointBackgroundColor: color,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      };
    });
  } else {
    // Single dataset format (backward compatible)
    const singleData = data as DataPoint[];
    if (singleData.length === 0) {
      return null;
    }

    const normalizedData = singleData.map((d) => ({
      label: d.label || d.x || d.date || "",
      value: d.value ?? d.y ?? d.price ?? 0,
    }));

    labels = normalizedData.map((d) => d.label);
    const values = normalizedData.map((d) => d.value);
    const primaryColor = config.colors?.[0] || defaultColors[0];

    datasets = [
      {
        data: values,
        borderColor: primaryColor,
        backgroundColor:
          config.theme === "vibrant"
            ? `${primaryColor}33`
            : config.theme === "minimal"
              ? "transparent"
              : `${primaryColor}22`,
        borderWidth: config.theme === "minimal" ? 1.5 : 2,
        fill: config.theme !== "minimal",
        tension: config.variant === "smooth" ? 0.4 : config.variant === "stepped" ? 0 : 0.4,
        pointRadius: config.showPoints ?? true ? 3 : 0,
        pointHoverRadius: 5,
        pointBackgroundColor: primaryColor,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ];
  }

  const showGrid = config.showGrid ?? true;
  const showLegend = config.showLegend ?? (isMultiDataset && datasets.length > 1);

  const chartData = {
    labels,
    datasets,
  };

  const options = {
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
        mode: "index" as const,
        intersect: false,
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
        display: showGrid,
        grid: {
          display: showGrid,
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#71717a",
        },
      },
      y: {
        display: showGrid,
        grid: {
          display: showGrid,
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
    interaction: {
      mode: "nearest" as const,
      axis: "x" as const,
      intersect: false,
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
        <div className={showLegend ? "h-[240px]" : "h-[200px]"}>
          <Line data={chartData} options={options} />
        </div>
      </div>
    </motion.div>
  );
};

