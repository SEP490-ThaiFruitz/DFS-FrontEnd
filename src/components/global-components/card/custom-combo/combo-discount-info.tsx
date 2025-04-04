import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComboDiscountInfoProps {
  className?: string;
}

export function ComboDiscountInfo({ className }: ComboDiscountInfoProps) {
  return (
    <div className={`bg-green-50 rounded-3xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="bg-green-100 rounded-full p-2 mt-0.5">
          <Info className="h-4 w-4 text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-green-800 mb-1">
            Ưu đãi theo số lượng
          </h3>
          <p className="text-sm text-green-700 mb-3">
            Mua càng nhiều, giảm càng siêu! Chọn combo sản phẩm để tiết kiệm
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-700 font-bold">5-6 sản phẩm:</span>
              <span className="font-bold text-green-800">Giảm 6%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700 font-bold">7-9 sản phẩm:</span>
              <span className="font-bold text-green-800">Giảm 10%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700 font-bold">10+ sản phẩm:</span>
              <span className="font-bold text-green-800">Giảm 15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ComboDiscountBadge({ totalItems }: { totalItems: number }) {
  let discountPercentage = 0;
  if (totalItems >= 10) discountPercentage = 15;
  else if (totalItems >= 7) discountPercentage = 10;
  else if (totalItems >= 5) discountPercentage = 6;

  if (discountPercentage === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            -{discountPercentage}%
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-xs">
            Giảm {discountPercentage}% cho combo từ{" "}
            {totalItems >= 10 ? "10+" : totalItems >= 7 ? "7-9" : "5-6"} sản
            phẩm
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
