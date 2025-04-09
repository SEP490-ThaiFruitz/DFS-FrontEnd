"use client";

import { formatVND } from "@/lib/format-currency";
import { ChevronRight } from "lucide-react";

export interface OrderItemCardProps {
  item: any;
  onClick: () => void;
}

export default function OrderItemCard({ item, onClick }: OrderItemCardProps) {
  return (
    <div
      className="flex items-center space-x-4 p-4 rounded-lg border hover:border-amber-200 hover:bg-amber-50/30 cursor-pointer transition-all duration-200 shadow-sm hover:shadow"
      onClick={onClick}
    >
      <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
        {item.itemType === "Combo" && item.customImages ? (
          <div className="grid grid-cols-2 gap-0.5 h-full">
            {item.customImages.slice(0, 4).map((img: string, idx: number) => (
              <div key={idx} className="relative">
                <img
                  src={img || "/placeholder.svg"}
                  alt={`${item.name} hình ${idx + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        ) : (
          <img
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{item.name}</h4>
        <div className="flex items-center mt-1">
          <span className="text-sm text-muted-foreground">
            {formatVND(item.unitPrice)} × {item.quantity}
          </span>
          {item.percentage > 0 && (
            <span className="ml-2 text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">
              -{item.percentage}%
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-medium text-amber-700">
          {formatVND(item.discountPrice * item.quantity)}
        </span>
        <span className="text-xs px-2 py-0.5 bg-amber-50 rounded-full mt-1">
          {item.itemType}
        </span>
      </div>

      <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 border border-amber-100">
        <ChevronRight className="h-4 w-4 text-amber-600" />
      </div>
    </div>
  );
}
