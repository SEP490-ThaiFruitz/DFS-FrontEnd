"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const chartData = [
  { date: "2024-04-01", orders: 222, customer: 150 },
  { date: "2024-04-02", orders: 97, customer: 180 },
  { date: "2024-04-03", orders: 167, customer: 120 },
  { date: "2024-04-04", orders: 242, customer: 260 },
  { date: "2024-04-05", orders: 373, customer: 290 },
  { date: "2024-04-06", orders: 301, customer: 340 },
  { date: "2024-04-07", orders: 245, customer: 180 },
  { date: "2024-04-08", orders: 409, customer: 320 },
  { date: "2024-04-09", orders: 59, customer: 110 },
  { date: "2024-04-10", orders: 261, customer: 190 },
  { date: "2024-04-11", orders: 327, customer: 350 },
  { date: "2024-04-12", orders: 292, customer: 210 },
  { date: "2024-04-13", orders: 342, customer: 380 },
  { date: "2024-04-14", orders: 137, customer: 220 },
  { date: "2024-04-15", orders: 120, customer: 170 },
  { date: "2024-04-16", orders: 138, customer: 190 },
  { date: "2024-04-17", orders: 446, customer: 360 },
  { date: "2024-04-18", orders: 364, customer: 410 },
  { date: "2024-04-19", orders: 243, customer: 180 },
  { date: "2024-04-20", orders: 89, customer: 150 },
  { date: "2024-04-21", orders: 137, customer: 200 },
  { date: "2024-04-22", orders: 224, customer: 170 },
  { date: "2024-04-23", orders: 138, customer: 230 },
  { date: "2024-04-24", orders: 387, customer: 290 },
  { date: "2024-04-25", orders: 215, customer: 250 },
  { date: "2024-04-26", orders: 75, customer: 130 },
  { date: "2024-04-27", orders: 383, customer: 420 },
  { date: "2024-04-28", orders: 122, customer: 180 },
  { date: "2024-04-29", orders: 315, customer: 240 },
  { date: "2024-04-30", orders: 454, customer: 380 },
  { date: "2024-05-01", orders: 165, customer: 220 },
  { date: "2024-05-02", orders: 293, customer: 310 },
  { date: "2024-05-03", orders: 247, customer: 190 },
  { date: "2024-05-04", orders: 385, customer: 420 },
  { date: "2024-05-05", orders: 481, customer: 390 },
  { date: "2024-05-06", orders: 498, customer: 520 },
  { date: "2024-05-07", orders: 388, customer: 300 },
  { date: "2024-05-08", orders: 149, customer: 210 },
  { date: "2024-05-09", orders: 227, customer: 180 },
  { date: "2024-05-10", orders: 293, customer: 330 },
  { date: "2024-05-11", orders: 335, customer: 270 },
  { date: "2024-05-12", orders: 197, customer: 240 },
  { date: "2024-05-13", orders: 197, customer: 160 },
  { date: "2024-05-14", orders: 448, customer: 490 },
  { date: "2024-05-15", orders: 473, customer: 380 },
  { date: "2024-05-16", orders: 338, customer: 400 },
  { date: "2024-05-17", orders: 499, customer: 420 },
  { date: "2024-05-18", orders: 315, customer: 350 },
  { date: "2024-05-19", orders: 235, customer: 180 },
  { date: "2024-05-20", orders: 177, customer: 230 },
  { date: "2024-05-21", orders: 82, customer: 140 },
  { date: "2024-05-22", orders: 81, customer: 120 },
  { date: "2024-05-23", orders: 252, customer: 290 },
  { date: "2024-05-24", orders: 294, customer: 220 },
  { date: "2024-05-25", orders: 201, customer: 250 },
  { date: "2024-05-26", orders: 213, customer: 170 },
  { date: "2024-05-27", orders: 420, customer: 460 },
  { date: "2024-05-28", orders: 233, customer: 190 },
  { date: "2024-05-29", orders: 78, customer: 130 },
  { date: "2024-05-30", orders: 340, customer: 280 },
  { date: "2024-05-31", orders: 178, customer: 230 },
  { date: "2024-06-01", orders: 178, customer: 200 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function UsersOrdersTotalChart() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Thống kê khách hàng và đơn hàng</CardTitle>
          <CardDescription>
            Biểu thị số lượng khách hàng và đơn hàng theo thời gian
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="customer"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="orders"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
