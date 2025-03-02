// import { cn } from "@/lib/utils";

// interface ViewCardProductActionsProps {}

// interface ViewCardProductActionsProps {
//   productName: string;
//   productPrice: number;
//   productQuantity: number;
//   productImage: string;

//   className?: string;
// }
// export const ViewCardProductActions = ({
//   productName,
//   productImage,
//   productPrice,
//   productQuantity,
//   className,
// }: ViewCardProductActionsProps) => {
//   return (
//     <div className={cn("flex  gap-4 my-2", className)}>
//       <img
//         src={productImage}
//         alt={productName}
//         className="size-28 rounded-lg object-cover"
//       />
//       <div className="flex-1">
//         <h3 className="font-medium">{productName}</h3>
//         <p className="text-sm text-muted-foreground">
//           Số lượng: {productQuantity}
//         </p>
//       </div>
//       <div className="flex flex-col items-center gap-x-1">
//         <span>110.000đ</span>

//         <del>99.000đ</del>
//       </div>
//     </div>
//   );
// };

"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  variant?: {
    color?: string;
    size?: string;
  };
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface ViewCardProductActionsProps {
  item: CartItem;
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export const ViewCardProductActions = ({
  item,
  onQuantityChange,
  onRemove,
  className,
}: ViewCardProductActionsProps) => {
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    if (item.quantity !== quantity) {
      setQuantity(item.quantity);
    }
  }, [item.quantity, quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    if (
      newQuantity >= 1 &&
      newQuantity <= (item.stock || Number.POSITIVE_INFINITY)
    ) {
      setQuantity(newQuantity);
      onQuantityChange?.(item.id, newQuantity);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card rounded-lg border shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg border bg-background flex-shrink-0">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-24 h-24 object-cover transition-transform group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="space-y-1">
          <h3 className="font-medium text-base leading-tight line-clamp-2">
            {item.name}
          </h3>
          {item.variant && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              {item.variant.color && <span>Màu: {item.variant.color}</span>}
              {item.variant.size && (
                <>
                  {item.variant.color && <span>•</span>}
                  <span>Size: {item.variant.size}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4">
          {/* Quantity Controls */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-9 items-center rounded-md border bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-l-md"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Giảm số lượng</span>
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(Number.parseInt(e.target.value) || 1)
                    }
                    className="w-12 h-9 text-center border-0 bg-transparent text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-r-md"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={item.stock ? quantity >= item.stock : false}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Tăng số lượng</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {item.stock ? `Còn ${item.stock} sản phẩm` : "Còn hàng"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mobile Price */}
          <div className="flex flex-col items-end sm:hidden gap-0.5">
            <span className="font-medium text-primary">
              {formatPrice(item.price * quantity)}
            </span>
            {item.originalPrice && (
              <del className="text-xs text-muted-foreground">
                {formatPrice(item.originalPrice * quantity)}
              </del>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden sm:flex flex-col items-end gap-0.5 ml-auto">
        <span className="font-medium text-primary">
          {formatPrice(item.price * quantity)}
        </span>
        {item.originalPrice && (
          <del className="text-xs text-muted-foreground">
            {formatPrice(item.originalPrice * quantity)}
          </del>
        )}
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onRemove?.(item.id)}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Xóa sản phẩm</span>
      </Button>
    </div>
  );
};
