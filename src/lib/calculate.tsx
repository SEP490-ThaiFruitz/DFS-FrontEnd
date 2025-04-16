import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ReactNode } from "react";

// Calculate growth rates and return styled span
export const calculateGrowthRate = (
  current: number,
  previous: number
): ReactNode => {
  if (previous === 0)
    return (
      <span className="text-gray-500 font-semibold flex items-center">
        Biến động: <Minus className="size-5 mr-1" /> 0%
      </span>
    ); // Avoid division by zero

  const growthRate = ((current - previous) / previous) * 100;
  const formattedRate = growthRate.toFixed(1);

  if (growthRate > 0) {
    return (
      <span className="text-green-500 flex font-semibold items-center">
        Biến động: <ArrowUp className="size-5 mr-1" /> {formattedRate}%
      </span>
    );
  } else if (growthRate < 0) {
    return (
      <span className="text-rose-500 flex font-semibold items-center">
        Giảm: <ArrowDown className="size-5 mr-1" />{" "}
        {Math.abs(Number.parseFloat(formattedRate))}%
      </span>
    );
  } else {
    return (
      <span className="text-gray-500 flex font-semibold items-center">
        Biến động: <Minus className="size-5 mr-1" /> 0%
      </span>
    );
  }
};
