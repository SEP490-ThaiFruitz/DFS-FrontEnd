"use client";

import Image from "next/image";
import { Users, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ProductDetailTypes,
  ProductVariantTypes,
} from "../product-detail.types";
import { SetStateAction } from "react";
import { formatVND } from "@/lib/format-currency";

interface FrequentlyBoughtTogetherProps {
  product: ProductDetailTypes;
  selectedVariant: ProductVariantTypes;
  quantity: number;
  selectedFrequentlyBought: boolean[];
  setSelectedFrequentlyBought: React.Dispatch<SetStateAction<boolean[]>>;
  calculateFrequentlyBoughtTotal: () => string;
  calculateDiscountedPrice: (price: number, percentage: number) => number;
  frequentlyBoughtTogether: any[];
}

export default function FrequentlyBoughtTogether({
  product,
  selectedVariant,
  quantity,
  selectedFrequentlyBought,
  setSelectedFrequentlyBought,
  calculateFrequentlyBoughtTotal,
  calculateDiscountedPrice,
  frequentlyBoughtTogether,
}: // frequentlyBoughtTogether,
FrequentlyBoughtTogetherProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6 lg:p-8">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-indigo-500" />
        Thường được mua cùng nhau
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-3">
            <Image
              src={selectedVariant.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="font-medium text-center">{product.name}</h3>
          <span className="text-sky-600 font-bold">
            {selectedVariant?.promotion
              ? formatVND(
                  calculateDiscountedPrice(
                    selectedVariant?.price,
                    selectedVariant.promotion.percentage
                  ) * quantity
                )
              : formatVND(selectedVariant?.price * quantity)}
          </span>
          <Badge className="mt-2 bg-violet-100 text-violet-700 hover:bg-violet-200 border-0">
            Đã chọn
          </Badge>
        </div>

        {frequentlyBoughtTogether?.map((item, index) => (
          <div key={item.id} className="flex flex-col items-center">
            <div className="relative w-40 h-40 mb-3">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-contain"
              />
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-300">
                +
              </div>
            </div>
            <h3 className="font-medium text-center">{item.name}</h3>
            <p className="text-sky-600 font-bold">
              {formatVND(item?.price ?? 0)}
            </p>
            <div className="mt-2">
              <Button
                variant={
                  selectedFrequentlyBought[index] ? "default" : "outline"
                }
                size="sm"
                className={
                  selectedFrequentlyBought[index]
                    ? "bg-sky-100 text-sky-700 hover:bg-sky-200 border-0"
                    : ""
                }
                onClick={() => {
                  const newSelected = [...selectedFrequentlyBought];
                  newSelected[index] = !newSelected[index];
                  setSelectedFrequentlyBought(newSelected);
                }}
              >
                {selectedFrequentlyBought[index] ? "Đã chọn" : "Thêm"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-gray-600 mb-1">
            Tổng tiền cho {1 + selectedFrequentlyBought.filter(Boolean).length}{" "}
            sản phẩm:
          </span>
          <span className="text-xl font-bold text-sky-600">
            {calculateFrequentlyBoughtTotal()}
          </span>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 shadow-md">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Thêm tất cả vào giỏ hàng
        </Button>
      </div>
    </div>
  );
}
