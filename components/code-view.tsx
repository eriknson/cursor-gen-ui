"use client";

import { motion } from "framer-motion";
import { Markdown } from "./markdown";

export const CodeView = ({
  language,
  code,
}: {
  language: string;
  code: string;
}) => {
  if (!code) {
    return null;
  }

  // Format as markdown code block
  const markdownCode = `\`\`\`${language}\n${code}\n\`\`\``;

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
        <div className="px-3 py-2 bg-zinc-200 dark:bg-zinc-700 border-b border-zinc-300 dark:border-zinc-600">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {language}
          </span>
        </div>
        <div className="p-3 overflow-x-auto">
          <Markdown>{markdownCode}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

