"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { formatVND } from "@/lib/format-currency";

const defaultData = [
  {
    userName: "Chưa có dữ liệu",
    totalPrice: "0",
    shipFee: "0",
    priceAfterShip: "0",
  },
];

const chartConfig = {
  totalPrice: {
    label: "Tổng doanh thu",
    color: "hsl(var(--chart-1))",
  },
  shipFee: {
    label: "Giá ship đơn hàng",
    color: "hsl(var(--chart-2))",
  },
  priceAfterShip: {
    label: "Doanh thu sau khi trừ ship",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function OrderAreaChart({
  chartData,
}: {
  chartData: {
    userName: string;
    totalPrice: string;
    shipFee: string;
    priceAfterShip: string;
  }[];
}) {
  // console.log(chartData);

  function convertData(
    chartData: {
      userName: string;
      totalPrice: string;
      shipFee: string;
      priceAfterShip: string;
    }[]
  ) {
    return chartData.map((item) => ({
      ...item,
      totalPrice: parseFloat(item.totalPrice.replace(/[^\d.-]/g, "")),
      shipFee: parseFloat(item.shipFee.replace(/[^\d.-]/g, "")),
      priceAfterShip: parseFloat(item.priceAfterShip.replace(/[^\d.-]/g, "")),
    }));
  }

  const convertedChartData = convertData(chartData);

  return (
    <Card className="cardStyle">
      <CardHeader>
        <CardTitle>Tổng doanh thu đơn hàng</CardTitle>
        <CardDescription>
          Biểu đồ này biểu thị tổng doanh thu từ các đơn hàng theo từng khách
          hàng
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[600px] w-full p-4">
          <AreaChart
            accessibilityLayer
            data={convertedChartData}
            margin={{
              left: 12,
              right: 12,
              top: 12,
            }}
            stackOffset="positive"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="userName"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => truncate(value, { length: 30 })}
            />

            <YAxis
              dataKey="totalPrice"
              tickLine={false}
              allowDataOverflow
              axisLine={false}
              tickMargin={8}
              padding={{
                top: 8,
                bottom: 8,
              }}
              className="p-4"
              tickFormatter={(value) => formatVND(value)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="totalPrice"
              type="natural"
              fill="var(--color-totalPrice)"
              fillOpacity={0.2}
              stroke="var(--color-totalPrice)"
              stackId="a"
            />
            <Area
              dataKey="shipFee"
              type="natural"
              fill="var(--color-shipFee)"
              fillOpacity={0.7}
              stroke="var(--color-shipFee)"
              stackId="a"
            />
            <Area
              dataKey="priceAfterShip"
              type="natural"
              fill="var(--color-priceAfterShip)"
              fillOpacity={0.5}
              stroke="var(--color-priceAfterShip)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter> */}
    </Card>
  );
}
