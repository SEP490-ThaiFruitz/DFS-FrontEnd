"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingBag, TrendingUp } from "lucide-react";
import { orderData } from "./dummy-data";
import { HistoryApiResponse } from "../types/history.type";
import { memo } from "react";

interface OrderOverviewProps {
  orderData: HistoryApiResponse;
}
export const OrdersOverview = memo(({ orderData }: OrderOverviewProps) => {
  const totalOrders = orderData.value.orders.length;
  const totalItems = orderData.value.orders.reduce(
    (sum, order) => sum + order.orderQuantity,
    0
  );
  const totalSpent = orderData.value.moneySpend.toLocaleString("vi-VN");
  const averageOrderValue = Math.round(
    orderData.value.moneySpend / totalOrders
  ).toLocaleString("vi-VN");

  const stats = [
    {
      title: "Đơn Hàng",
      value: totalOrders,
      icon: ShoppingBag,
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Sản Phẩm",
      value: totalItems,
      icon: Package,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Đã Chi",
      value: `${totalSpent}₫`,
      icon: DollarSign,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "Trung bình trên mỗi đơn hàng",
      value: `${averageOrderValue}₫`,
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden cardStyle">
          <CardHeader className="pb-2 bg-gradient-to-br from-orange-50 via-zinc-100 to-sky-50">
            <CardTitle className="text-base font-semibold">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <p className="text-2xl font-bold text-sky-500">{stat.value}</p>
              <div
                className={`p-2 rounded-full bg-gradient-to-br ${stat.color}`}
              >
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
});
OrdersOverview.displayName = "OrdersOverview";
