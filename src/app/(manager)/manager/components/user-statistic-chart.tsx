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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatVND } from "@/lib/format-currency";
import { CustomerType } from "../users-report/user -report-column";

const chartConfig = {
  totalSpend: {
    label: "Tổng chi tiêu khách hàng",
  },
  top1: {
    label: "Top 1",
    color: "hsl(var(--chart-1))",
  },
  top2: {
    label: "Top 2",
    color: "hsl(var(--chart-2))",
  },
  top3: {
    label: "Top 3",
    color: "hsl(var(--chart-3))",
  },
  top4: {
    label: "Top 4",
    color: "hsl(var(--chart-4))",
  },
  top5: {
    label: "Top 5",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export type UserStatisticChartProps = {
  userReportData: CustomerType[] | [];
  className?: string;
};

export function UserStatisticChart({
  userReportData,
}: UserStatisticChartProps) {
  const chartData = userReportData
    .sort((a, b) => {
      return b.totalSpend - a.totalSpend;
    })
    .slice(0, 5)
    .map((customer, index) => {
      return {
        name: customer.name,
        totalSpend: customer.totalSpend,
        fill: `var(--color-top${index + 1}`,
      };
    });

  const totalSpendSum = React.useMemo(() => {
    return userReportData.reduce((acc, curr) => acc + curr.totalSpend, 0);
  }, [userReportData]);
  return (
    <Card className="flex flex-col cardStyle">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top tổng chi tiêu khách hàng</CardTitle>
        <CardDescription>Từ Top 5 - 2025</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart width={700} height={300}>
            <ChartTooltip
              // cursor={false}
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="totalSpend"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              // className="size-[500px]"
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
                          className="fill-sky-500 text-base font-bold"
                        >
                          {formatVND(totalSpendSum)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-sky-500 font-bold"
                        >
                          VND
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
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
