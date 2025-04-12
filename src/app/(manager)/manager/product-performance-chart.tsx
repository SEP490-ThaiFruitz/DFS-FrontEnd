"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

type ChartData = {
  productName: string;
  sold: number;
  revenue: number;
};
interface ProductPerformanceProps {
  productPerformance: ChartData[];
}

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
  return (
    <Card className="col-span-1 md:col-span-1 cardStyle">
      <CardHeader>
        <CardTitle>Hiệu suất của sản phẩm</CardTitle>
        <CardDescription>
          Thống kê hiệu suất của sản phẩm với thời gian
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-full overflow-hidden">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={productPerformance}
            height={300}
            width={500}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="productName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
            <Bar dataKey="sold" fill="var(--color-sold)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
