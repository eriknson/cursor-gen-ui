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
      className={`flex flex-row gap-2 px-4 w-full md:w-[500px] md:px-0`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-muted-foreground">
        {role === "assistant" ? <CubeIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-foreground flex flex-col gap-2">
          {content}
        </div>
      </div>
    </motion.div>
  );
};
