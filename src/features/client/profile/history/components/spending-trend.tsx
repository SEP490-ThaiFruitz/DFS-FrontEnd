"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// import { orderData } from "./dummy-data";
import {
  groupOrdersByMonth,
  translateMonthsToVietnamese,
} from "../history-lib/handle-date";
import { HistoryApiResponse } from "../types/history.type";
import { memo } from "react";

type SpendingTrendsProps = {
  orderData: HistoryApiResponse;
};
export const SpendingTrends = memo(({ orderData }: SpendingTrendsProps) => {
  // const monthlyData = groupOrdersByMonth(orderData.value.orders);

  // // Translate month names to Vietnamese
  // const translatedData = monthlyData.map((item) => ({
  //   ...item,
  //   month: item.month
  //     .replace(/Jan/g, "Tháng 1")
  //     .replace(/Feb/g, "Tháng 2")
  //     .replace(/Mar/g, "Tháng 3")
  //     .replace(/Apr/g, "Tháng 4")
  //     .replace(/May/g, "Tháng 5")
  //     .replace(/Jun/g, "Tháng 6")
  //     .replace(/Jul/g, "Tháng 7")
  //     .replace(/Aug/g, "Tháng 8")
  //     .replace(/Sep/g, "Tháng 9")b
  //     .replace(/Oct/g, "Tháng 10")
  //     .replace(/Nov/g, "Tháng 11")
  //     .replace(/Dec/g, "Tháng 12"),
  // }));

  const monthlyData = groupOrdersByMonth(
    orderData?.value?.orders ?? [],
    "buyDate"
  );
  const translatedData = translateMonthsToVietnamese(monthlyData);

  return (
    <Card className="overflow-hidden  transition-all duration-200 cardStyle">
      <CardHeader className="bg-gradient-to-br from-orange-50 via-zinc-100 to-sky-50">
        <CardTitle>Chi Tiêu Của Bạn Theo Thời Gian</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          {translatedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={translatedData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString("vi-VN")}₫`,
                    "Chi tiêu",
                  ]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "none",
                    padding: "8px 12px",
                  }}
                  labelFormatter={(label) => `${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Chưa có dữ liệu chi tiêu</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

SpendingTrends.displayName = "SpendingTrends";
