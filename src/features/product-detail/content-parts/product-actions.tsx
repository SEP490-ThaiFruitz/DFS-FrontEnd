"use client";

import { Clock, Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "../countdown-timer";
import { memo } from "react";

interface ProductActionsProps {
  selectedVariant: any;
  quantity: number;
  handleQuantityChange: (change: number) => void;
  handleAddToCart: () => void;
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
    formatPrice,
    calculateDiscountedPrice,
  }: ProductActionsProps) => {
    const formatDate = (dateString: Date | string) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    console.log(selectedVariant);

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
                      Khuyến mãi {selectedVariant?.promotion?.percentage}%
                    </span>
                    <span className="text-rose-600 text-xs">
                      Kết thúc vào ngày{" "}
                      {formatDate(selectedVariant?.promotion.endDate)}
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
            <h3 className="font-medium">Số lượng</h3>
            <div className="flex items-center border rounded-md bg-white shadow-sm">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-9 w-9 rounded-none"
              >
                <span className="sr-only">Giảm</span>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= (selectedVariant?.stockQuantity ?? 0)}
                className="h-9 w-9 rounded-none"
              >
                <span className="sr-only">Tăng</span>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Còn lại:</span>
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
            <span className="text-gray-600">Hạn sử dụng:</span>
            <span>{selectedVariant?.shelfLife} tháng</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">Tổng tiền:</span>
            <div className="text-right">
              {selectedVariant?.promotion && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs line-through text-muted-foreground">
                    {formatPrice(selectedVariant.price * quantity)}
                  </span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">
                    -{selectedVariant.promotion.percentage}%
                  </span>
                </div>
              )}
              <span className="text-lg font-bold text-primary">
                {selectedVariant?.promotion
                  ? formatPrice(
                      calculateDiscountedPrice(
                        selectedVariant.price,
                        selectedVariant?.promotion.percentage
                      ) * quantity
                    )
                  : formatPrice(selectedVariant.price * quantity)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Button
            className="w-full h-12 text-lg gap-2 bg-sky-600 hover:bg-sky-700 shadow-md hover:shadow-lg transition-all"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
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
