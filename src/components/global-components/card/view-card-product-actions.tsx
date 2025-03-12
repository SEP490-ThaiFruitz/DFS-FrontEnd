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
import { CartProductTypes } from "@/types/cart.types";
import { cartActions } from "@/actions/cart/use-cart";
import { useQueryClient } from "@tanstack/react-query";
import { CART_KEY } from "@/app/key/comm-key";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/hooks/use-cart-store";
import { toast } from "sonner";

interface ViewCardProductActionsProps {
  product: Product;
  decreaseQuantity: () => void;
  increaseQuantity: () => void;
  onRemove?: (id: string) => void;
  removeFromCart: () => void;
  className?: string;
}

interface ViewCardProductActionsSkeletonProps {
  className?: string;
}

export const ViewCardProductActions = ({
  product,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  className,
}: ViewCardProductActionsProps) => {
  // const [quantity, setQuantity] = useState(
  //   product.productVariant.stockQuantity
  // );

  const queryClient = useQueryClient();

  // useEffect(() => {
  //   if (product.productVariant.stockQuantity !== quantity) {
  //     setQuantity(product.productVariant.stockQuantity);
  //   }
  // }, [product.productVariant.stockQuantity, quantity]);

  // const handleQuantityChange = (newQuantity: number) => {
  //   if (
  //     newQuantity >= 1 &&
  //     newQuantity <=
  //       (product.productVariant.stockQuantity || Number.POSITIVE_INFINITY)
  //   ) {
  //     setQuantity(newQuantity);
  //     onQuantityChange?.(product.productId, newQuantity);
  //   }
  // };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.variant.promotion?.percentage
    ? Math.round(
        (((product?.variant.price as any) ?? 0 - product.variant.price) /
          product?.variant.price) *
          100
      )
    : 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col sm:flex-row products-start sm:products-center gap-4 p-4 bg-card rounded-lg border shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg border bg-background flex-shrink-0">
        <img
          src={product.mainImageUrl || "/placeholder.svg"}
          alt={product.name}
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
            {product.name}
          </h3>
          {product.variant && (
            <div className="flex gap-2 text-sm text-muted-foreground">
              {product.variant.netWeight && (
                <span>Màu: {product.variant.netWeight}</span>
              )}
              {product.variant.netWeight && (
                <>
                  {product.variant.netWeight && <span>•</span>}
                  <span>Size: {product.variant.netWeight}</span>
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
                    // onClick={() => {
                    //   cartActions.decreaseQuantity({
                    //     cartItemId: product.cartItemId,
                    //   });

                    //   queryClient.invalidateQueries({
                    //     queryKey: [CART_KEY.CARTS],
                    //   });
                    // }}
                    onClick={() => {
                      decreaseQuantity();
                      toast.success(
                        "Giảm số lượng sản phẩm sản phầm thành công"
                      );
                    }}
                    disabled={product?.quantityOrder! <= 1}
                  >
                    <Minus className="h-4 w-4" />
                    <span className="sr-only">Giảm số lượng</span>
                  </Button>
                  {/* <input
                    type="number"
                    value={product.quantityOrder}
                    // onChange={(e) =>
                    //   handleQuantityChange(Number.parseInt(e.target.value) || 1)
                    // }
                    className="w-12 h-9 text-center border-0 bg-transparent text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  /> */}

                  <span>{product.quantityOrder}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-r-md"
                    // onClick={() => {
                    //   cartActions.increaseQuantity({
                    //     cartItemId: product.cartItemId,
                    //   });
                    //   queryClient.invalidateQueries({
                    //     queryKey: [CART_KEY.CARTS],
                    //   });
                    // }}
                    onClick={() => {
                      increaseQuantity();
                      toast.success(
                        "Thêm số lượng sản phẩm sản phầm thành công"
                      );
                    }}
                    disabled={
                      product.variant.stockQuantity
                        ? product.quantity! >= product.variant.stockQuantity
                        : false
                    }
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Tăng số lượng</span>
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {product.variant.stockQuantity
                  ? `Còn ${product.variant.stockQuantity} sản phẩm`
                  : "Còn hàng"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Mobile Price */}
          <div className="flex flex-col items-end sm:hidden gap-0.5">
            <span className="font-medium text-primary">
              {formatPrice(product.variant.price * product.quantityOrder!)}
              123
            </span>
            {product.variant.price && (
              <del className="text-xs text-muted-foreground">
                {formatPrice(
                  product.variant.discountPrice! * product.quantityOrder!
                )}
              </del>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden sm:flex flex-col items-end gap-0.5 ml-auto">
        <span className="font-medium text-primary">
          {formatPrice(product.variant.price * product.quantityOrder!)}
        </span>
        {product.variant.price && (
          <del className="text-xs text-muted-foreground">
            {formatPrice(product.variant.price * product?.quantityOrder!)}
          </del>
        )}
      </div>

      {/* Remove Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        // onClick={() => {
        //   cartActions.removeProductOutOfCart(product.cartItemId);
        //   queryClient.invalidateQueries({ queryKey: [CART_KEY.CARTS] });
        // }}

        onClick={removeFromCart}
      >
        <Trash2 className="h-4 w-4 text-muted-foreground" />
        <span className="sr-only">Xóa sản phẩm</span>
      </Button>
    </div>
  );
};

export const ViewCardProductActionsSkeleton = ({
  className,
}: ViewCardProductActionsSkeletonProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-card rounded-lg border shadow-sm animate-pulse",
        className
      )}
    >
      {/* Product Image Skeleton with Badge Position */}
      <div className="relative overflow-hidden rounded-lg border bg-background flex-shrink-0">
        <Skeleton className="w-24 h-24" />
        {/* Badge position skeleton */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className="flex-1 min-w-0 space-y-3">
        <div className="space-y-2">
          {/* Product Name Skeleton - Two lines with different widths */}
          <Skeleton className="h-5 w-full max-w-[250px]" />
          <Skeleton className="h-5 w-3/4 max-w-[200px]" />

          {/* Product Variant Skeleton */}
          <div className="flex items-center gap-2 mt-1">
            <Skeleton className="h-4 w-16" />
            <div className="h-4 w-1 rounded-full bg-muted/50" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-4 mt-2">
          {/* Quantity Controls Skeleton with more detail */}
          <div className="flex h-9 items-center rounded-md border">
            <Skeleton className="h-9 w-9 rounded-l-md" /> {/* Minus button */}
            <Skeleton className="h-7 w-12" /> {/* Input */}
            <Skeleton className="h-9 w-9 rounded-r-md" /> {/* Plus button */}
          </div>

          {/* Mobile Price Skeleton */}
          <div className="flex flex-col items-end sm:hidden gap-1">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Desktop Price Skeleton */}
      <div className="hidden sm:flex flex-col items-end gap-1 ml-auto">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>

      {/* Remove Button Skeleton */}
      <div className="absolute -top-2 -right-2">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
};
