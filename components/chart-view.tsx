"use client";

import { motion } from "framer-motion";
import { scaleLinear } from "d3-scale";

interface ChartDataPoint {
  label: string;
  value: number;
}

export const ChartView = ({ data }: { data: ChartDataPoint[] }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const valueToHeight = scaleLinear().domain([0, maxValue]).range([0, 150]);

  return (
    <div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 justify-between items-end h-[150px]">
          {data.map((point, index) => (
            <div
              key={point.label}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <motion.div
                className="w-full bg-blue-500 dark:bg-blue-400 rounded-t-md mt-auto"
                initial={{ height: 0 }}
                animate={{ height: valueToHeight(point.value) }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              />
              <div className="text-xs text-zinc-500 dark:text-zinc-400 text-center truncate w-full">
                {point.label}
              </div>
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {point.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

