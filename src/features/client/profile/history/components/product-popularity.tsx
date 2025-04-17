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
import { ChartLegend } from "@/components/ui/chart";
import { memo } from "react";
import { HistoryApiResponse } from "../types/history.type";

interface ProductPopularityProps {
  orderData: HistoryApiResponse;
}

export const ProductPopularity = memo(
  ({ orderData }: ProductPopularityProps) => {
    // Count items by type
    const itemTypeCount = orderData.value.orders.reduce((acc, order) => {
      order.orderItems.forEach((item) => {
        if (!acc[item.itemType]) {
          acc[item.itemType] = 0;
        }
        acc[item.itemType] += item.quantity;
      });
      return acc;
    }, {} as Record<string, number>);

    // Translate item types to Vietnamese
    const typeTranslations: Record<string, string> = {
      Single: "Sản phẩm đơn lẻ",
      Combo: "Combo",
      Custom: "Combo tùy chọn",
    };

    const data = Object.entries(itemTypeCount).map(([name, value]) => ({
      name: typeTranslations[name] || name,
      value,
    }));

    const COLORS = ["#8b5cf6", "#ec4899", "#10b981"];

    return (
      <Card className="overflow-hidden cardStyle">
        <CardHeader className="bg-gradient-to-br from-orange-50 via-zinc-100 to-sky-50  ">
          <CardTitle>Loại Sản Phẩm Bạn Đã Mua</CardTitle>
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
                      `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                    }
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value} sản phẩm`, "Số lượng"]}
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
                      <span
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          fontWeight: 600,
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-700">
                <p>Bạn chưa mua sản phẩm nào</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
ProductPopularity.displayName = "ProductPopularity";
