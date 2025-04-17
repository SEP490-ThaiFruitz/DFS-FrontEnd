"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orderData } from "./dummy-data";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { OrderItem as OrderItemTypes } from "@/features/client/payment/successful/payment-successful.types";
import { memo } from "react";

export const TopProducts = memo(() => {
  // const orderItems = orderData.value.orders
  //   .map((order) => order.orderItems)
  //   .flat();

  // // Convert to array and sort by count
  // const sortedProducts = orderItems
  //   .sort((a, b) => b.quantity - a.quantity)
  //   .slice(0, 5); // Get top 5

  const orderItems = orderData.value.orders
    .map((order) => order.orderItems)
    .flat();

  const productCount = orderItems.reduce((acc, item) => {
    const key = item.referenceId;

    if (!acc[key]) {
      acc[key] = {
        ...item,
        id: item.referenceId,
        customImages: item.customImages ?? null,
        itemType: item.itemType as "Custom" | "Combo" | "Single",
      };
    } else {
      acc[key].quantity += item.quantity;
    }

    return acc;
  }, {} as Record<string, OrderItemTypes>);

  const sortedProducts = Object.values(productCount)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Translate product types to Vietnamese
  // const typeTranslations: Record<string, string> = {
  //   Single: "Đơn lẻ",
  //   Combo: "Combo",
  //   Custom: "Tùy chọn",
  // };

  return (
    <Card className="overflow-hidden  transition-all duration-200 cardStyle ">
      <CardHeader className="bg-gradient-to-br from-orange-50 via-zinc-100 to-sky-50 flex flex-row items-center justify-between">
        <CardTitle>Sản Phẩm Yêu Thích Của Bạn</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          Mua Lại <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        {sortedProducts.length > 0 ? (
          <div className="divide-y">
            {sortedProducts.map((product, index) => {
              return <OrderItem key={product.referenceId} item={product} />;
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            <p>Bạn chưa mua sản phẩm nào</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TopProducts.displayName = "TopProducts";

function Badge({
  type,
  translations,
}: {
  type: string;
  translations: Record<string, string>;
}) {
  const getColor = () => {
    switch (type) {
      case "Single":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Combo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "Custom":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${getColor()}`}>
      {translations[type] || type}
    </span>
  );
}
