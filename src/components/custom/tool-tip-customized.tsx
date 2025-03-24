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
}
export function ToolTipCustomized({
  trigger,
  content,
  delayDuration = 100,
  className,
}: ToolTipCustomizedProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild className="cursor-pointer">
          {trigger}
        </TooltipTrigger>
        <TooltipContent className={cn("", className)}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
