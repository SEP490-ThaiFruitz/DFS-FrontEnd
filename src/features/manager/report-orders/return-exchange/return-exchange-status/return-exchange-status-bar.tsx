// components/order/StatusBar.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { OrderStatus } from "@/types/report-orders.types";
import { getOrderStatusStep } from "@/utils/content-line";
import React from "react";
import {
  getStatusReturnExchangeStep,
  ReturnExchangeRequestStatus,
  returnStatusLabels,
} from "./status";

export const statusColorsHappyCase = [
  "bg-amber-500", // Pending
  "bg-sky-500", // Approved
  "bg-sky-900", // AwaitingCustomerReturn
  "bg-indigo-500", // ProductReceived
  "bg-[#a21caf]", // Processing
  "bg-green-500", // Completed
];

const omittedStatuses = [
  ReturnExchangeRequestStatus.Rejected,
  ReturnExchangeRequestStatus.Cancelled,
];

export const returnStatusLabelsHappyCase = Object.fromEntries(
  Object.entries(returnStatusLabels).filter(
    ([key]) => !omittedStatuses.includes(Number(key))
  )
) as Record<
  Exclude<
    ReturnExchangeRequestStatus,
    ReturnExchangeRequestStatus.Rejected | ReturnExchangeRequestStatus.Cancelled
  >,
  string
>;

export const statusTexts = Object.values(returnStatusLabelsHappyCase);

export const ReturnExchangeStatusBar = ({ status }: { status: string }) => {
  const statusStep = getStatusReturnExchangeStep(status);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-center gap-1 w-full max-w-[200px]">
        {statusColorsHappyCase.map((color, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild className="cursor-pointer">
              <div
                className={`h-3 w-12 cursor-pointer ${
                  index === 0 ? "rounded-l-full" : ""
                } ${
                  index === statusColorsHappyCase.length - 1
                    ? "rounded-r-full"
                    : ""
                }
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
