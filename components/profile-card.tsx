"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";

interface ProfileData {
  name: string;
  title?: string;
  description: string;
  avatar?: string;
  stats?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; url: string }>;
}

interface ProfileCardProps {
  data: ProfileData;
  config?: ComponentConfig;
}

export const ProfileCard = ({ data, config = {} }: ProfileCardProps) => {
  if (!data) {
    return null;
  }

  const variant = config.variant || "default";
  const showStats = config.showStats ?? true;
  const theme = config.theme || "default";

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
        ${
          theme === "minimal"
            ? "bg-transparent border border-zinc-200 dark:border-zinc-700"
            : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
        }
        rounded-xl overflow-hidden
      `}
      >
        {/* Header */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {data.avatar ? (
                <img
                  src={data.avatar}
                  alt={data.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {data.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name and Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">
                {data.name}
              </h3>
              {data.title && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  {data.title}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-4 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Stats */}
        {showStats && data.stats && data.stats.length > 0 && (
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-200 dark:border-zinc-700">
            <div className="grid grid-cols-3 gap-4">
              {data.stats.slice(0, 3).map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {stat.value}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {data.links && data.links.length > 0 && variant !== "compact" && (
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex flex-wrap gap-2">
              {data.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  <span>🔗</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

