"use client";

import { motion } from "framer-motion";
import { CubeIcon, UserIcon } from "./icons";
import { ReactNode } from "react";

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        {role === "assistant" ? <CubeIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {content}
        </div>
      </div>
    </motion.div>
  );
};
