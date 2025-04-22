import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ComboDiscountInfoProps {
  className?: string;

  value: string;
}

export type ComboDiscount = {
  id: number;
  quantity: string;
  percentage: string;
};

export type DiscountRulesTypes = {
  name: string;
  value: string;
};

// export type ComboDiscountInfoProps ={
//   className?: string;
//   value: string; // JSON string
// }

export function ComboDiscountInfo({
  className,
  value,
}: ComboDiscountInfoProps) {
  // const discounts: ComboDiscount[] = JSON.parse(value);

  let discounts: ComboDiscount[] = [];
  try {
    discounts = value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error parsing JSON", error);
  }

  if (discounts.length === 0) {
    return <p>Không có ưu đãi cho combo này.</p>;
  }

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
            {discounts.map((item, index) => {
              const lowerBound = parseInt(item.quantity);

              const upperBound = parseInt(item.quantity) + 1;
              // const upperBound =
              //   index < discounts.length - 1
              //     ? parseInt(discounts[index + 1].quantity) - 1
              //     : null;

              const rangeLabel = upperBound
                ? `${lowerBound}-${upperBound} sản phẩm`
                : `${lowerBound}+ sản phẩm`;

              return (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-green-700 font-bold">
                    {rangeLabel}:
                  </span>
                  <span className="font-bold text-green-800">
                    Giảm {item.percentage}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* <div className="space-y-2">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

export function ComboDiscountBadge({
  totalItems,
  value,
}: {
  totalItems: number;
  value: string;
}) {
  // let discountPercentage = 0;
  // if (totalItems >= 10) discountPercentage = 15;
  // else if (totalItems >= 7) discountPercentage = 10;
  // else if (totalItems >= 5) discountPercentage = 6;

  // if (discountPercentage === 0) return null;

  // const value =
  //   '[{"id":2,"quantity":"5","percentage":"6"},{"id":3,"quantity":"9","percentage":"10"},{"id":4,"quantity":"10","percentage":"15"}]';

  // const discounts: ComboDiscount[] = JSON.parse(value);

  console.log("values discount rules", value);

  let discounts: ComboDiscount[] = [];
  try {
    discounts = value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error parsing JSON", error);
  }

  let matched = null;
  for (let i = discounts.length - 1; i >= 0; i--) {
    const threshold = parseInt(discounts[i].quantity);
    if (totalItems >= threshold) {
      matched = discounts[i];
      break;
    }
  }

  // if (!matched) return null;
  if (!matched) {
    return <p>Không có mức giảm cho số lượng sản phẩm này.</p>;
  }

  const label = (() => {
    const currentIndex = discounts.findIndex((d) => d.id === matched?.id);
    const lower = parseInt(matched.quantity);
    const upper =
      currentIndex < discounts.length - 1
        ? parseInt(discounts[currentIndex + 1].quantity) - 1
        : null;

    return upper ? `${lower}-${upper}` : `${lower}+`;
  })();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
            {/* -{discountPercentage}% */}-{matched.percentage}%
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          {/* <p className="text-xs">
            Giảm {discountPercentage}% cho combo từ{" "}
            {totalItems >= 10 ? "10+" : totalItems >= 7 ? "7-9" : "5-6"} sản
            phẩm
          </p> */}
          <p className="text-xs">
            Giảm {matched.percentage}% cho combo từ {label} sản phẩm
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
