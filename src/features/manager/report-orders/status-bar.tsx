// components/order/StatusBar.tsx
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus } from "@/types/report-orders.types";
import { getOrderStatusStep } from "@/utils/content-line";
import React from "react";

const statusColors = [
  "bg-amber-500", // pending
  "bg-sky-500", // packaging
  "bg-sky-900", // shipping
  "bg-indigo-500", // delivering
  "bg-[#a21caf]", // delivered
  "bg-green-500", // received
  "bg-red-500", // cancelled
  "bg-gray-500", // returned
];

export const statusTexts = Object.values(OrderStatus);
export const StatusBar = ({ statusStep }: { statusStep: number }) => {
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center gap-1 w-full max-w-[180px]">
        {statusColors.map((color, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild className="cursor-pointer">
              <div
                className={`h-1.5 w-1/4 cursor-pointer ${
                  index === 0 ? "rounded-l-full" : ""
                } ${index === statusColors.length - 1 ? "rounded-r-full" : ""}
                  ${
                    statusStep >= index ? color : "bg-gray-200 dark:bg-gray-700"
                  }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-xs">{statusTexts[index]}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
