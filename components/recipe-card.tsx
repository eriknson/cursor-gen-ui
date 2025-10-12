"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";

interface RecipeData {
  title: string;
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  difficulty?: string;
  ingredients: string[];
  steps: string[];
  image?: string;
}

interface RecipeCardProps {
  data: RecipeData;
  config?: ComponentConfig;
}

export const RecipeCard = ({ data, config = {} }: RecipeCardProps) => {
  if (!data) {
    return null;
  }

  const layout = config.layout || "modern";
  const showTimings = config.showTimings ?? true;
  const showDifficulty = config.showDifficulty ?? true;

  const getDifficultyColor = (difficulty?: string) => {
    const lower = difficulty?.toLowerCase() || "";
    if (lower.includes("easy")) return "text-green-600 dark:text-green-400";
    if (lower.includes("medium") || lower.includes("moderate"))
      return "text-yellow-600 dark:text-yellow-400";
    if (lower.includes("hard") || lower.includes("difficult"))
      return "text-red-600 dark:text-red-400";
    return "text-zinc-600 dark:text-zinc-400";
  };

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {/* Image */}
        {data.image && (
          <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-700">
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Header */}
        <div className="p-6 pb-4">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            {data.title}
          </h3>

          {/* Meta Info */}
          {(showTimings || showDifficulty) && (
            <div className="flex flex-wrap gap-3 text-sm">
              {showTimings && data.prepTime && (
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <span className="text-base">⏱️</span>
                  <span>Prep: {data.prepTime}</span>
                </div>
              )}
              {showTimings && data.cookTime && (
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <span className="text-base">🔥</span>
                  <span>Cook: {data.cookTime}</span>
                </div>
              )}
              {data.servings && (
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <span className="text-base">🍽️</span>
                  <span>{data.servings} servings</span>
                </div>
              )}
              {showDifficulty && data.difficulty && (
                <div
                  className={`flex items-center gap-1.5 font-medium ${getDifficultyColor(data.difficulty)}`}
                >
                  <span className="text-base">📊</span>
                  <span>{data.difficulty}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ingredients */}
        <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800/50">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3">
            Ingredients
          </h4>
          <div className="space-y-2">
            {data.ingredients.map((ingredient, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">
                  •
                </span>
                <span>{ingredient}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-4">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-3">
            Instructions
          </h4>
          <div className="space-y-3">
            {data.steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1 text-sm text-zinc-700 dark:text-zinc-300 pt-0.5">
                  {step}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

