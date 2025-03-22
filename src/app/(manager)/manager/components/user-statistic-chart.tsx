"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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
const chartData = [
  { month: "Tháng 2", visitors: 200, fill: "var(--color-safari)" },
  { month: "Tháng 1", visitors: 275, fill: "var(--color-chrome)" },
  { month: "Tháng 3", visitors: 287, fill: "var(--color-firefox)" },
  { month: "Tháng 4", visitors: 173, fill: "var(--color-edge)" },
  { month: "Tháng 5", visitors: 190, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Khách hàng",
  },
  chrome: {
    label: "Tháng 1",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Tháng 2",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Tháng 3",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Tháng 4",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function UserStatisticChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col cardStyle">
      <CardHeader className="items-center pb-0">
        <CardTitle>Lượng truy cập</CardTitle>
        <CardDescription>Từ tháng 3 - 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              // cursor={false}
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="month"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Giảm 5.2% trong tháng này <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Báo cáo số liệu tháng 3
        </div>
      </CardFooter>
    </Card>
  );
}
