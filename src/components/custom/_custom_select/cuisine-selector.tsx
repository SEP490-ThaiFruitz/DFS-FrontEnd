"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface CuisineSelectorProps {
  title?: string;
  options: string[];

  toggleCuisine: (cuisine: string) => void;
  activeOptions: string[];

  className?: string;
}

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

export const CuisineSelector = memo(
  ({
    title,
    options,
    activeOptions,
    className,
    toggleCuisine,
  }: CuisineSelectorProps) => {
    const [selected, setSelected] = useState<string[]>([]);

    // const toggleCuisine = (cuisine: string) => {
    //   setSelected((prev) =>
    //     prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    //   )
    // }

    return (
      <div className="w-full">
        {title && (
          <h1 className="text-slate-800 text-3xl font-semibold mb-2 text-center flex items-center justify-center w-full gap-1">
            <Tag className="text-gray-800 size-8" />
            {title}
          </h1>
        )}
        <div className="w-full">
          <motion.div
            className="flex flex-wrap gap-3 overflow-visible w-full"
            // layout
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
          >
            {options.map((cuisine: string) => {
              const isSelected = activeOptions?.includes(cuisine);
              return (
                <motion.button
                  key={cuisine}
                  type="button"
                  onClick={() => toggleCuisine(cuisine)}
                  layout
                  initial={false}
                  animate={{
                    backgroundColor: isSelected ? "#2a1711" : "#fff7ed",
                    // : "rgba(39, 39, 42, 0.5)",
                  }}
                  whileHover={{
                    backgroundColor: isSelected ? "#2a1711" : "#ffedd5",
                    // : "rgba(39, 39, 42, 0.8)",
                  }}
                  whileTap={{
                    backgroundColor: isSelected ? "#1f1209" : "#fdba74",
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 0.5,
                    backgroundColor: { duration: 0.1 },
                  }}
                  className={cn(
                    `
                  inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                  whitespace-nowrap overflow-hidden ring-1 ring-inset
                  ${
                    isSelected
                      ? "text-[#ff9066] ring-[hsla(0,0%,100%,0.12)]"
                      : "text-slate-800 ring-[hsla(0,0%,100%,0.06)]"
                  }
                `,
                    className
                  )}
                >
                  <motion.div
                    className="relative flex items-center"
                    animate={{
                      width: isSelected ? "auto" : "100%",
                      paddingRight: isSelected ? "1.5rem" : "0",
                    }}
                    transition={{
                      ease: [0.175, 0.885, 0.32, 1.275],
                      duration: 0.3,
                    }}
                  >
                    <span>{cuisine}</span>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            mass: 0.5,
                          }}
                          className="absolute right-0"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#ff9066] flex items-center justify-center">
                            <Check
                              className="w-3 h-3 text-[#2a1711]"
                              strokeWidth={1.5}
                            />
                          </div>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>
    );
  }
);

CuisineSelector.displayName = "CuisineSelector";
