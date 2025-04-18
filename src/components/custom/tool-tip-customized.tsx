import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { JSX } from "react";

interface ToolTipCustomizedProps {
  trigger: JSX.Element | string | number;

  content: JSX.Element | string | number;

  delayDuration?: number;

  className?: string;

  sideOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
}
export function ToolTipCustomized({
  trigger,
  content,
  delayDuration = 100,
  className,

  sideOffset,
  side = "top",
}: ToolTipCustomizedProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {trigger}
        </TooltipTrigger>
        <TooltipContent
          className={cn("", className)}
          sideOffset={sideOffset}
          side={side}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
