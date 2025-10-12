"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";

interface ComparisonRow {
  feature: string;
  option1: string;
  option2: string;
  winner?: 1 | 2 | null;
}

interface ComparisonTableProps {
  data: ComparisonRow[];
  config?: ComponentConfig;
}

export const ComparisonTable = ({ data, config = {} }: ComparisonTableProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const highlightDifferences = config.highlightDifferences ?? true;
  const showWinner = config.showWinner ?? true;
  const variant = config.variant || "default";
  const color1 = config.colors?.[0] || "#0ea5e9";
  const color2 = config.colors?.[1] || "#22c55e";

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Feature
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: color1 }}
                >
                  Option 1
                </th>
                <th
                  className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                  style={{ color: color2 }}
                >
                  Option 2
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => {
                const isDifferent =
                  highlightDifferences && row.option1 !== row.option2;

                return (
                  <motion.tr
                    key={index}
                    className="border-t border-zinc-200 dark:border-zinc-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {row.feature}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-center ${
                        isDifferent && row.winner === 1
                          ? "font-semibold"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          showWinner && row.winner === 1
                            ? `${color1}15`
                            : "transparent",
                        color:
                          isDifferent && row.winner === 1
                            ? color1
                            : undefined,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {showWinner && row.winner === 1 && (
                          <span className="text-base">✓</span>
                        )}
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {row.option1}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-center ${
                        isDifferent && row.winner === 2
                          ? "font-semibold"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          showWinner && row.winner === 2
                            ? `${color2}15`
                            : "transparent",
                        color:
                          isDifferent && row.winner === 2
                            ? color2
                            : undefined,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {showWinner && row.winner === 2 && (
                          <span className="text-base">✓</span>
                        )}
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {row.option2}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

