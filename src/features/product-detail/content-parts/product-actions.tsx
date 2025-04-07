"use client";

import { Clock, Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "../countdown-timer";
import { memo } from "react";
import { vietnameseDate } from "@/utils/date";
import { useCartStore } from "@/hooks/use-cart-store";
import { ProductVariantTypes } from "../product-detail.types";
import { formatVND } from "@/lib/format-currency";
import { useFromStore } from "@/hooks/use-from-store";

interface ProductActionsProps {
  selectedVariant: ProductVariantTypes;
  quantity: number;
  handleQuantityChange: (change: number) => void;
  handleAddToCart: () => void;
  handleDecreaseQuantity: () => void;
  handleToggleWishlist: () => void;
  isInWishlist: boolean;
  formatPrice: (price: number) => string;
  calculateDiscountedPrice: (price: number, percentage: number) => number;
}

export const ProductActions = memo(
  ({
    selectedVariant,
    quantity,
    handleQuantityChange,
    handleAddToCart,
    handleToggleWishlist,
    isInWishlist,
    handleDecreaseQuantity,
    formatPrice,
    calculateDiscountedPrice,
  }: ProductActionsProps) => {
    const cart = useFromStore(useCartStore, (state) => state.orders);

    const findCart = cart?.find(
      (item) =>
        item.variant.productVariantId === selectedVariant.productVariantId
    );

    // console.log({ findCart });

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-5 rounded-lg space-y-4 cardStyle">
          {selectedVariant?.promotion && (
            <div className="relative overflow-hidden rounded-md">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <span className="font-medium text-rose-700">
                      Khuyến mãi{" "}
                      <span className="font-bold text-sky-500">
                        {selectedVariant?.promotion?.percentage}%
                      </span>
                    </span>
                    <span className="text-rose-600 text-xs ml-1">
                      kết thúc vào ngày{" "}
                      <span className="text-sky-500 font-bold">
                        {vietnameseDate(selectedVariant?.promotion.endDate)}
                      </span>
                    </span>

                    <div className="pt-1">
                      <CountdownTimer
                        targetDate={
                          new Date(selectedVariant?.promotion.endDate)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Số lượng</h3>
            <div className="flex items-center border rounded-md bg-white shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                // onClick={() => handleQuantityChange(-1)}
                onClick={handleDecreaseQuantity}
                disabled={(findCart?.quantityOrder ?? 0) <= 1}
                className="h-9 w-9 rounded-none"
              >
                <span className="sr-only">Giảm</span>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">
                {findCart?.quantityOrder ?? 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                // onClick={() => handleQuantityChange(1)}
                onClick={handleAddToCart}
                disabled={
                  (findCart?.quantityOrder as number) >=
                  (selectedVariant?.stockQuantity ?? 0)
                }
                className="h-9 w-9 rounded-none"
              >
                <span className="sr-only">Tăng</span>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 font-semibold">Còn lại:</span>
            <div className="flex items-center gap-2">
              <span>{selectedVariant?.stockQuantity ?? 0} sản phẩm</span>
              <Progress
                value={
                  (selectedVariant?.stockQuantity ??
                    0 / (selectedVariant?.reOrderPoint * 2)) * 100
                }
                className="w-16 h-1.5 bg-green-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-700">Hạn sử dụng:</span>
            <span className="font-semibold">{selectedVariant?.shelfLife}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold text-sm">Tổng tiền:</span>
            <div className="text-right">
              {selectedVariant?.promotion?.price ? (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs line-through text-slate-700">
                    {formatVND(selectedVariant?.price * quantity)}
                  </span>
                  <span className="text-lg font-bold text-sky-500/70 px-1.5 py-0.5 rounded">
                    {formatVND(
                      (selectedVariant.promotion?.price ?? 0) * quantity
                    )}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-sky-500/70">
                  {formatVND(selectedVariant?.price * quantity)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button
            className="w-full h-12 text-lg gap-2 bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="size-8" />
            Thêm vào giỏ hàng
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-lg gap-2 border-sky-200 text-sky-600 hover:bg-sky-50"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`h-5 w-5 ${
                isInWishlist ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
            {isInWishlist ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
          </Button>
        </div>
      </div>
    );
  }
);

ProductActions.displayName = "ProductActions";
