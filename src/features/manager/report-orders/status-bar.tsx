// components/order/StatusBar.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus } from "@/types/report-orders.types";
import { omit } from "lodash";
import React from "react";

const statusColors = [
  "bg-amber-500", // pending
  "bg-sky-500", // packaging
  "bg-sky-900", // shipping
  "bg-indigo-500", // delivering
  "bg-[#a21caf]", // delivered
  "bg-green-500", // received
  "bg-[#14532d]", // completed
  // "bg-red-500", // cancelled
  // "bg-gray-500", // returned
];

const omittedStatuses = omit(
  OrderStatus,
  "cancelled",
  "returned",
  "exchanged",
  "requesting"
);
export const statusTexts = Object.values(omittedStatuses);
export const StatusBar = ({ statusStep }: { statusStep: number }) => {
  // console.log({ statusStep });

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center gap-1 w-full max-w-[200px]">
        {statusColors.map((color, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild className="cursor-pointer">
              <div
                className={`h-3 w-14 cursor-pointer ${
                  index === 0 ? "rounded-l-full" : ""
                } ${index === statusColors.length - 1 ? "rounded-r-full" : ""}
                  ${
                    statusStep >= index ? color : "bg-gray-200 dark:bg-gray-700"
                  }`}
              />
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span className="text-sm font-semibold ">
                {statusTexts[index]}
              </span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
