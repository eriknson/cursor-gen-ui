"use client";

import { motion } from "framer-motion";

interface CardItem {
  title: string;
  description?: string;
  details?: string[];
  icon?: string;
  [key: string]: any;
}

export const CardGrid = ({ items }: { items: CardItem[] }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-lg flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {item.icon && (
              <div className="text-2xl mb-1">{item.icon}</div>
            )}
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </div>
            {item.description && (
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {item.description}
              </div>
            )}
            {item.details && item.details.length > 0 && (
              <div className="flex flex-col gap-1 mt-1">
                {item.details.map((detail, i) => (
                  <div
                    key={i}
                    className="text-xs text-zinc-500 dark:text-zinc-500"
                  >
                    {detail}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

