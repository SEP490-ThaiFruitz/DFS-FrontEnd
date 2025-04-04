"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ProductVariantTypes } from "../product-detail.types";
import { memo, SetStateAction } from "react";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

interface VariantSelectorProps {
  variants: ProductVariantTypes[];
  selectedVariant: ProductVariantTypes;
  setSelectedVariant: React.Dispatch<SetStateAction<ProductVariantTypes>>;
  formatPrice: (price: number) => string;
  calculateDiscountedPrice: (price: number, percentage: number) => number;
}

export const VariantSelector = memo(
  ({
    variants,
    selectedVariant,
    setSelectedVariant,
    formatPrice,
    calculateDiscountedPrice,
  }: VariantSelectorProps) => {
    const getStockStatus = (variant: ProductVariantTypes) => {
      const status = calculateStockStatus(
        variant?.stockQuantity ?? 0,
        variant?.reOrderPoint ?? 0
      );
      return status;
    };

    const calculateStockStatus = (quantity: number, reOrderPoint: number) => {
      if (quantity <= reOrderPoint * 0.5) return "low";
      if (quantity <= reOrderPoint) return "medium";
      return "high";
    };

    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center">
          Lựa chọn gói sản phẩm
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild className="cursor-pointer">
                <Info className="h-4 w-4 ml-2 text-slate-700" />
              </TooltipTrigger>
              <TooltipContent>
                <span className="w-60">
                  Chọn loại đóng gói phù hợp với nhu cầu sử dụng của bạn
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {variants.map((variant: ProductVariantTypes) => (
            <Card
              key={variant.productVariantId}
              className={`cursor-pointer transition-all cardStyle ${
                selectedVariant.productVariantId === variant.productVariantId
                  ? "ring-2 ring-sky-500 shadow-md"
                  : "hover:border-sky-200 hover:shadow-sm"
              }`}
              onClick={() => setSelectedVariant(variant)}
            >
              <CardContent className="p-4">
                <div className="aspect-square relative mb-3 bg-gray-50 rounded-md overflow-hidden">
                  <Image
                    src={variant?.image || "/images/second-background.png"}
                    alt={`${variant.productVariantId} - ${variant.packageType}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {variant?.promotion && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{variant.promotion.percentage}%
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <p
                    className="font-semibold text-xl italic truncate"
                    title={variant.packageType}
                  >
                    {variant.packageType}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-800 font-semibold">
                      {variant.netWeight}g
                    </span>
                    <AdvancedColorfulBadges
                      color={
                        getStockStatus(variant) === "low"
                          ? "rose"
                          : getStockStatus(variant) === "medium"
                          ? "amber"
                          : "green"
                      }
                      className="text-xs rounded-3xl px-2 py-1"
                    >
                      {getStockStatus(variant) === "low"
                        ? "Sắp hết hàng"
                        : getStockStatus(variant) === "medium"
                        ? "Còn ít"
                        : "Còn hàng"}
                    </AdvancedColorfulBadges>
                  </div>
                  <div className="flex items-baseline gap-2">
                    {variant?.promotion ? (
                      <>
                        <span className="text-lg font-bold text-sky-500/70">
                          {formatPrice(
                            calculateDiscountedPrice(
                              variant?.price,
                              variant.promotion.percentage
                            )
                          )}
                        </span>
                        <span className="text-sm line-through text-rose-500 font-bold">
                          {formatPrice(variant?.price ?? 0)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-sky-500/70">
                        {formatPrice(variant?.price ?? 0)}
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
);

VariantSelector.displayName = "VariantSelector";
