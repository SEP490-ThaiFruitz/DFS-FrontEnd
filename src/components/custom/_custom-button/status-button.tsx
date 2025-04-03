import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleDashed, ShoppingCart } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "sonner";

const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface StatusButtonProps {
  handleAddToCart: (e: React.MouseEvent) => void;
  className?: string;
  classNameIcon?: string;
  label?: string;
}

export default function StatusButton({
  handleAddToCart,
  className,
  classNameIcon,
  label,
}: StatusButtonProps) {
  const [status, setStatus] = useState<
    "loading" | "Add to cart" | "Added to cart"
  >();
  const isEnabled = !status || status === "Add to cart";

  const changeStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isEnabled) {
      return;
    }

    setStatus("loading");
    // console.log("loading 1");
    await wait(700);
    handleAddToCart?.(e);
    toast.success("Đã thêm vào giỏ hàng");
    setStatus("Added to cart");
    // console.log("Added to cart 2");

    await wait(500);
    setStatus("Add to cart");
    // console.log("Add to cart last 3");
  };

  const hoverAnimation =
    "group-hover:scale-110 duration-300 transition cursor-pointer";

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        changeStatus(e);
      }}
      disabled={!isEnabled}
      className={cn(
        `group relative overflow-hidden rounded-md text-sm bg-[#0284c7] hover:bg-[#0369a1] size-10
        font-semibold text-white transition-colors duration-300 flex items-center
        justify-center hoverAnimate`,
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          // Remount the component so that the animation can be restarted
          // key={status}
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.075 }}
          className={cn("flex items-center justify-center gap-1")}
        >
          {status === "Added to cart" && (
            <motion.span
              className="h-fit w-fit"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.075, type: "spring" }}
            >
              <CheckCircle2
                // strokeWidth={2}
                className={`size-8 fill-white stroke-green-500 group-hover:stroke-green-600  ${hoverAnimation}`}
              />
            </motion.span>
          )}
          {status == "loading" ? (
            <CircleDashed className="size-8 animate-spin" />
          ) : (
            (status === "Add to cart" || !status) && (
              <div className="flex items-center gap-x-1">
                <ShoppingCart
                  className={cn(
                    `size-10 cursor-pointer rounded-lg p-2 text-white duration-200
                      hover:scale-110 hover:bg-[#0369a1] hover:text-white hover:shadow-lg`,
                    classNameIcon
                  )}
                />
                <span className="text-white text-base hidden md:inline-block text-ellipsis">
                  {label}
                </span>
              </div>
            )
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
