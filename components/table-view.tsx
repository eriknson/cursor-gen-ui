"use client";

import { motion } from "framer-motion";

export const TableView = ({ data }: { data: Record<string, any>[] }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Get all unique keys from the data
  const keys = Array.from(
    new Set(data.flatMap((row) => Object.keys(row)))
  );

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6 overflow-x-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <table className="w-full border-collapse bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-zinc-200 dark:bg-zinc-700">
            {keys.map((key) => (
              <th
                key={key}
                className="text-left p-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border-b border-zinc-300 dark:border-zinc-600"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <motion.tr
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: rowIndex * 0.05 }}
              className="border-b border-zinc-200 dark:border-zinc-700 last:border-b-0"
            >
              {keys.map((key) => (
                <td
                  key={key}
                  className="p-2 text-sm text-zinc-800 dark:text-zinc-300"
                >
                  {row[key] !== undefined && row[key] !== null
                    ? String(row[key])
                    : "-"}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

