"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CubeIcon } from "./icons";
import { LoadingState } from "@/lib/loading-states";

interface LoadingIndicatorProps {
  loadingState: LoadingState;
}

export function LoadingIndicator({ loadingState }: LoadingIndicatorProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-muted-foreground">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <CubeIcon />
          </motion.div>
        </div>
        
        <div className="flex flex-col gap-1 w-full">
          {/* Main message with gradient shimmer text */}
          <div className="text-base animate-shimmer-text">
            {loadingState.message}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

