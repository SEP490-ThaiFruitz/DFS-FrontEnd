"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { orderData } from "./dummy-data";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
// import { statusColors } from "@/features/manager/report-orders/order-status-badge";
import { OrderStatus, OrderStatusType } from "@/types/report-orders.types";
import { truncate } from "lodash";
import { ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { HistoryApiResponse } from "../types/history.type";
import { memo } from "react";

export const COLORS = [
  "#f59e0b", // amber-500
  "#0ea5e9", // sky-500
  "#0c4a6e", // sky-900
  "#6366f1", // indigo-500
  "#a21caf", // custom
  "#22c55e", // green-500
  "#065f46", // custom
];

interface OrderStatusDistributionProps {
  orderData: HistoryApiResponse;
}

export const OrderStatusDistribution = memo(
  ({ orderData }: OrderStatusDistributionProps) => {
    // Count orders by status
    const statusCount = orderData.value.orders.reduce((acc, order) => {
      if (!acc[order.orderStatus]) {
        acc[order.orderStatus] = 0;
      }
      acc[order.orderStatus]++;
      return acc;
    }, {} as Record<string, number>);

    // Translate status to Vietnamese
    // const statusTranslations: Record<string, string> = {
    //   Received: "Đã nhận hàng",
    //   Shipping: "Đang giao hàng",
    // };

    const data = Object.entries(statusCount).map(([name, value]) => {
      const lowerCaseName = name.toLowerCase();
      const translated =
        lowerCaseName in OrderStatus
          ? OrderStatus[lowerCaseName as OrderStatusType]
          : name;

      return {
        name: translated,
        value,
      };
    });

    // const COLORS = ["#10b981", "#f59e0b"];

    return (
      <Card className="overflow-hidden cardStyle transition-all duration-200 ">
        <CardHeader className="bg-gradient-to-br from-orange-50 via-zinc-100 to-sky-50">
          <CardTitle>Trạng Thái Đơn Hàng Của Bạn</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px] w-full flex items-center justify-center">
            {data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={120}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value, percent }) =>
                      `${truncate(name, { length: 15 })}: ${value} (${(
                        percent * 100
                      ).toFixed(0)}%)`
                    }
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  {/* <Tooltip */}
                  <ChartTooltip
                    formatter={(value) => [`${value} đơn hàng`, "Số lượng"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      border: "none",
                      padding: "8px 12px",
                    }}
                  />
                  {/* <Legend */}
                  <ChartLegend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => (
                      <span style={{ color: "#333", fontSize: "14px" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Bạn chưa có đơn hàng nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

OrderStatusDistribution.displayName = "OrderStatusDistribution";
