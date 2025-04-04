"use client";

import { memo, useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Package,
  Gift,
  ShoppingBag,
  Tag,
  Weight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatVND } from "@/lib/format-currency";
import { AdvancedColorfulBadges } from "../../badge/advanced-badge";
import { Separator } from "@/components/ui/separator";

interface CustomComboItem {
  id: string;
  productVariantId: string;
  productId: string;
  productName: string;
  image: string;
  packagingType: string;
  netWeight: number;
  price: number;
  quantity: number;
}

export interface CustomComboProduct {
  id: string;
  name: string;
  image: string | null;
  description: string;
  capacity: number;
  event: string | null;
  price: number;
  save: number;
  comboItems: CustomComboItem[];
}

interface ComboCartItemProps {
  combo: CustomComboProduct;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
  className?: string;
}

// interface ComboCartItemProps {
//   combo: CustomComboProduct;
//   onRemove?: () => void;
//   onQuantityChange?: (newQuantity: number) => void;
//   quantity?: number;
// }

export const CustomComboProductCard = memo(
  ({
    combo,
    onRemove,
    onQuantityChange,
    quantity = 1,
    className,
  }: ComboCartItemProps) => {
    const itemImages = combo.comboItems
      .filter((item) => item.image)
      .map((item) => item.image)
      .slice(0, 3);

    const hasImages = itemImages.length > 0;

    const netWeight = combo.comboItems.reduce(
      (total, item) => total + item.netWeight * item.quantity,
      0
    );

    return (
      <div
        className={cn(
          "group relative flex flex-col sm:flex-row products-start sm:products-center gap-4 p-4 bg-card  border shadow-sm transition-all hover:shadow-md cardStyle ",
          className
        )}
      >
        {/* <div className="flex gap-3 w-full"> */}
        <div className="relative h-28 w-28 flex-shrink-0 rounded-md overflow-hidden bg-gradient-to-br from-muted/10 to-muted/30 border border-muted/20">
          {hasImages ? (
            <div className="relative w-full h-full">
              {/* Main image */}
              <div className="absolute inset-0 z-10">
                {/* <Image
                    src={itemImages[0] || "/placeholder.svg"}
                    alt="Product"
                    fill
                    className="object-cover"
                    sizes="64px"
                  /> */}
                <Image
                  src={itemImages[0] || "/placeholder.svg"}
                  alt={combo.name}
                  width={96}
                  height={0}
                  sizes="(max-width: 640px) 96px, 128px"
                  className="w-24 h-full object-cover transition-transform group-hover:scale-105"
                  priority={true}
                  loading="eager"
                  quality={85}
                />
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Thumbnail stack */}
              {itemImages.length > 1 && (
                <div className="absolute right-1 bottom-1 z-20 flex flex-col-reverse gap-1">
                  {itemImages.slice(1, 3).map((image, index) => (
                    <div
                      key={index}
                      className="h-7 w-7 rounded-sm overflow-hidden border border-white/70 shadow-sm"
                      style={{
                        transform: `translateX(${index * -3}px)`,
                        zIndex: 30 - index,
                      }}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`product item  ${index + 1}`}
                          // fill
                          // className="object-cover"
                          // sizes="28px"
                          width={96}
                          height={0}
                          sizes="(max-width: 640px) 96px, 128px"
                          className="w-24 h-full object-cover transition-transform group-hover:scale-105"
                          priority={true}
                          loading="eager"
                          quality={85}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Item count indicator (if more than 3 items) */}
              {combo.comboItems.length > 3 && (
                <div className="absolute left-1 bottom-1 z-20">
                  <div className="bg-white/90 backdrop-blur-sm text-[10px] font-medium rounded-sm px-1 shadow-sm">
                    +{combo.comboItems.length - 3}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Package className="h-8 w-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-700/50" />
          )}
        </div>

        {/* Content */}
        <div className="w-full">
          <div className="flex justify-between items-center w-full ">
            {/* <div className="flex  items-center gap-1.5 "> */}

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-base leading-tight line-clamp-1 text-slate-800 italic">
                {combo.name}
              </h3>

              <div className="flex gap-2">
                <span className="font-normal text-slate-700">
                  Khối lượng:{" "}
                  <span className="text-[#f59e0b] font-semibold">
                    {netWeight}g
                  </span>
                </span>

                <Separator className="h-7 w-[1px] text-slate-700" />
                <span className="font-semibold text-slate-700">
                  Combo tự chọn
                </span>
              </div>
            </div>
            {/* </div> */}

            <div className="flex flex-col gap-1">
              <span className="text-sky-500 font-bold">
                {formatVND(combo.price)}
              </span>

              <span className="text-rose-500 text-sm font-semibold line-through">
                {formatVND(combo.price + combo.save)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-1">
            <AdvancedColorfulBadges
              color="violet"
              className="font-semibold text-sm"
            >
              {combo.comboItems.length} sản phẩm
            </AdvancedColorfulBadges>

            {combo.save > 0 && (
              <AdvancedColorfulBadges
                color="green"
                className="font-semibold text-sm"
              >
                <Tag className="h-2.5 w-2.5 mr-0.5" />
                Tiết kiệm {formatVND(combo.save)}
              </AdvancedColorfulBadges>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild className="mt-2 cursor-pointer">
              <div className="rounded-full p-0.5 text-slate-700 flex items-center gap-1 hover:underline  hover:text-slate-800  ">
                <Info className="size-6" />
                <span className="font-semibold text-sm">Xem chi tiết</span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="min-w-96 cardStyle" align="start">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">
                  Chi tiết Combo tự chọn của bạn
                </h4>
                <h5 className="text-xs text-slate-700">{combo.description}</h5>

                <div className="pt-2">
                  <h5 className="text-xs font-semibold mb-1.5">
                    Các sản phẩm trong Combo tự chọn:
                  </h5>
                  <div className="overflow-y-auto pr-1 space-y-2">
                    {combo.comboItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-xs"
                      >
                        <div className="relative size-14 rounded-sm overflow-hidden flex-shrink-0 border">
                          {item.image ? (
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="bg-muted h-full w-full" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 w-full">
                          <span className="font-semibold text-base italic truncate">
                            {item.productName}
                          </span>
                          <span className="text-slate-700 text-sm">
                            {item.packagingType}
                          </span>
                        </div>
                        <div className="text-right">
                          <h1 className="text-sky-700 font-bold ">
                            {formatVND(item.price)}
                          </h1>
                          <h2 className="text-slate-700">x{item.quantity}</h2>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        {/* </div> */}
      </div>
    );
  }
);

CustomComboProductCard.displayName = "CustomComboProductCard";
