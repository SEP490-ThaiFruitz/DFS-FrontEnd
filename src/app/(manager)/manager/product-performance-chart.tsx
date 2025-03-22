"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { truncate } from "lodash";

interface ProductPerformanceProps {
  productPerformance: typeof chartData;
}

const chartData = [
  { productName: "Sấy Khô Mít", sold: 450, revenue: 300 },
  { productName: "Sấy Khô Chuối", sold: 380, revenue: 420 },
  { productName: "Sấy Khô Dứa", sold: 520, revenue: 120 },
  { productName: "Sấy Khô Mango", sold: 140, revenue: 550 },
  { productName: "Sấy Khô Nhãn", sold: 600, revenue: 350 },
  { productName: "Sấy Khô Ổi", sold: 480, revenue: 400 },
];

const chartConfig = {
  sold: {
    label: "Đã bán",
    color: "hsl(var(--chart-5))",
  },
  revenue: {
    label: "Tổng doanh thu thực",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ProductPerformance({
  productPerformance,
}: ProductPerformanceProps) {
  console.log(productPerformance);

  return (
    <Card className="col-span-1 md:col-span-1 cardStyle">
      <CardHeader>
        <CardTitle>Hiệu suất của sản phẩm</CardTitle>
        <CardDescription>
          Thống kê hiệu suất của sản phẩm với thời gian
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={productPerformance}>
            <XAxis
              dataKey="productName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return truncate(value, { length: 20 });
              }}
            />

            <YAxis dataKey="sold" tickLine={false} tickMargin={10} />

            <CartesianGrid strokeDasharray="2 2" vertical={false} />

            <Bar
              dataKey="revenue"
              stackId="revenue"
              fill="var(--color-revenue)"
              radius={[0, 0, 8, 8]}
            />

            <Bar
              dataKey="sold"
              stackId="revenue"
              fill="var(--color-sold)"
              radius={[16, 16, 0, 0]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  // labelFormatter={(value) => {
                  //   return new Date(value).toLocaleDateString("en-US", {
                  //     weekday: "short",
                  //   });
                  // }}

                  indicator="line"
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
