"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";

interface QuoteData {
  quote: string;
  author: string;
  title?: string;
  context?: string;
}

interface QuoteBlockProps {
  data: QuoteData;
  config?: ComponentConfig;
}

export const QuoteBlock = ({ data, config = {} }: QuoteBlockProps) => {
  if (!data) {
    return null;
  }

  const variant = config.variant || "default";
  const size = config.size || "md";
  const theme = config.theme || "default";

  const quoteSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
        relative
        ${
          theme === "dark"
            ? "bg-gradient-to-br from-zinc-800 to-zinc-900 text-white"
            : "bg-white dark:bg-zinc-900"
        }
        ${
          variant === "emphasized"
            ? "border-l-4 border-blue-500 pl-6 pr-6 py-6"
            : variant === "minimal"
              ? "px-6 py-6"
              : "border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm"
        }
      `}
      >
        {/* Opening Quote Mark */}
        {variant !== "minimal" && (
          <div
            className={`text-6xl leading-none mb-2 ${
              theme === "dark"
                ? "text-white/20"
                : "text-zinc-200 dark:text-zinc-700"
            }`}
          >
            "
          </div>
        )}

        {/* Quote Text */}
        <blockquote
          className={`
          ${quoteSize[size]}
          ${
            theme === "dark"
              ? "text-white"
              : "text-zinc-700 dark:text-zinc-300"
          }
          ${variant === "emphasized" ? "font-semibold" : "font-normal"}
          leading-relaxed
          ${variant === "minimal" ? "italic" : ""}
        `}
        >
          {data.quote}
        </blockquote>

        {/* Author Info */}
        <div
          className={`mt-4 ${
            variant === "minimal" ? "text-right" : ""
          }`}
        >
          <div
            className={`font-semibold ${
              theme === "dark"
                ? "text-white"
                : "text-zinc-900 dark:text-zinc-100"
            }`}
          >
            {variant === "minimal" && "— "}
            {data.author}
          </div>
          {data.title && (
            <div
              className={`text-sm mt-1 ${
                theme === "dark"
                  ? "text-white/70"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {data.title}
            </div>
          )}
          {data.context && variant === "default" && (
            <div
              className={`text-xs mt-2 ${
                theme === "dark"
                  ? "text-white/60"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              {data.context}
            </div>
          )}
        </div>

        {/* Closing Quote Mark */}
        {variant === "emphasized" && (
          <div
            className={`absolute bottom-4 right-6 text-6xl leading-none ${
              theme === "dark"
                ? "text-white/20"
                : "text-zinc-200 dark:text-zinc-700"
            }`}
          >
            "
          </div>
        )}
      </div>
    </motion.div>
  );
};

