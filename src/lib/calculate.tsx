import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ReactNode } from "react";

// Calculate growth rates and return styled span
export const calculateGrowthRate = (
  current: number,
  previous: number
): ReactNode => {
  if (previous === 0)
    return (
      <span className="text-gray-500 flex items-center">
        <Minus className="h-3 w-3 mr-1" /> 0%
      </span>
    ); // Avoid division by zero

  const growthRate = ((current - previous) / previous) * 100;
  const formattedRate = growthRate.toFixed(1);

  if (growthRate > 0) {
    return (
      <span className="text-green-500 flex items-center">
        <ArrowUp className="h-3 w-3 mr-1" /> {formattedRate}%
      </span>
    );
  } else if (growthRate < 0) {
    return (
      <span className="text-rose-500 flex items-center">
        <ArrowDown className="h-3 w-3 mr-1" />{" "}
        {Math.abs(Number.parseFloat(formattedRate))}%
      </span>
    );
  } else {
    return (
      <span className="text-gray-500 flex items-center">
        <Minus className="h-3 w-3 mr-1" /> 0%
      </span>
    );
  }
};
