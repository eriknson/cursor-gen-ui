"use client";

import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ComponentConfig } from "@/lib/agent-wrapper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  history?: Array<{ date: string; price: number }>;
  volume?: number;
}

interface StockTickerProps {
  data: StockData;
  config?: ComponentConfig;
}

export const StockTicker = ({ data, config = {} }: StockTickerProps) => {
  if (!data) {
    return null;
  }

  const variant = config.variant || "detailed";
  const showSparkline = config.showSparkline ?? true;
  const positiveColor = config.colors?.[0] || "#10b981";
  const negativeColor = config.colors?.[1] || "#ef4444";

  const isPositive = data.change >= 0;
  const changeColor = isPositive ? positiveColor : negativeColor;

  // Prepare sparkline data
  const sparklineData = data.history
    ? {
        labels: data.history.map((h) => h.date),
        datasets: [
          {
            data: data.history.map((h) => h.price),
            borderColor: changeColor,
            backgroundColor: `${changeColor}22`,
            borderWidth: 1.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 0,
          },
        ],
      }
    : null;

  const sparklineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              {data.symbol}
            </div>
            <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              ${data.price.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-lg font-semibold ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {isPositive ? "+" : ""}
              {data.change.toFixed(2)}
            </div>
            <div
              className={`text-sm font-medium ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {isPositive ? "+" : ""}
              {data.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Sparkline */}
        {showSparkline && sparklineData && variant === "detailed" && (
          <div className="mt-4">
            <div className="h-[80px] -mx-2">
              <Line data={sparklineData} options={sparklineOptions} />
            </div>
          </div>
        )}

        {/* Additional Info */}
        {variant === "detailed" && data.volume && (
          <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Volume</span>
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {(data.volume / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

