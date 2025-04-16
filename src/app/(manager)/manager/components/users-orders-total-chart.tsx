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
import { CustomerType } from "../users-report/user -report-column";
import {
  createDateRange,
  currentDate,
  fillMissingDatesDynamics,
  getPreviousDate,
  vietnameseDate,
} from "@/utils/date";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { map } from "lodash";
import { format } from "date-fns";
import { calculateGrowthRate } from "@/lib/calculate";
// const chartData = [
//   { date: "2024-04-01", orders: 222, customer: 150 },
//   { date: "2024-04-02", orders: 97, customer: 180 },
//   { date: "2024-04-03", orders: 167, customer: 120 },
//   { date: "2024-04-04", orders: 242, customer: 260 },
//   { date: "2024-04-05", orders: 373, customer: 290 },
//   { date: "2024-04-06", orders: 301, customer: 340 },
// ];

const chartConfig = {
  totalSpend: {
    label: "Đã chi",
    color: "hsl(var(--chart-1))",
  },
  name: {
    label: "Khách hàng",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface UsersOrdersTotalChartProps {
  userReportData: CustomerType[] | [];
  historyUserReportData: CustomerType[] | [];

  dateRange: {
    from: Date | undefined;
    to?: Date | undefined;
  };
}

interface ChartItem {
  date: string;
  totalSpend: number;
  name: string[];
}

export function UsersOrdersTotalChart({
  userReportData,
  historyUserReportData,
  dateRange,
}: UsersOrdersTotalChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d");

  // const filteredData = chartData.filter((item) => {
  //   const date = new Date(item.date);
  //   const referenceDate = new Date("2024-06-30");
  //   let daysToSubtract = 90;
  //   if (timeRange === "30d") {
  //     daysToSubtract = 30;
  //   } else if (timeRange === "7d") {
  //     daysToSubtract = 7;
  //   }
  //   const startDate = new Date(referenceDate);
  //   startDate.setDate(startDate.getDate() - daysToSubtract);
  //   return date >= startDate;
  // });

  const fromDate = "2025-01-01";

  const { previousFrom, previousTo } = getPreviousDate(dateRange);
  // const allDates = createDateRange(fromDate, currentDate);
  const allDates = createDateRange(
    dateRange.from as Date,
    dateRange.to as Date
  );

  const historyAllDates = createDateRange(previousFrom, previousTo);

  // console.log(allDates);

  const dataRangeDate = fillMissingDatesDynamics(
    map(userReportData, (item) => {
      return {
        ...item,
        createdAt: item.createdAt.split("T")[0],
      };
    }),
    allDates,
    "createdAt",
    ["totalSpend", "name"]
  );

  // current data
  const groupedByDate: any = {};

  userReportData?.forEach((user) => {
    const date = user.createdAt.split("T")[0];

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        date,
        totalSpend: 0,
        name: [],
      };
    }

    groupedByDate[date].totalSpend += user.totalSpend;
    groupedByDate[date].name.push(user.name);
  });

  const historyGroupedByDate: any = {};

  historyUserReportData?.forEach((user) => {
    const date = user.createdAt.split("T")[0];

    if (!historyGroupedByDate[date]) {
      historyGroupedByDate[date] = {
        date,
        totalSpend: 0,
        name: [],
      };
    }

    historyGroupedByDate[date].totalSpend += user.totalSpend;
    historyGroupedByDate[date].name.push(user.name);
  });

  const chartData: ChartItem[] = Object.values(groupedByDate);
  const historyChartData: ChartItem[] = Object.values(historyGroupedByDate);

  const currTotalSpend = chartData.reduce(
    (acc, curr) => acc + curr.totalSpend,
    0
  );

  const prevTotalSpend = historyChartData.reduce(
    (acc, curr) => acc + curr.totalSpend,
    0
  );

  const growthRateComponent = calculateGrowthRate(
    currTotalSpend,
    prevTotalSpend
  );

  return (
    <Card className="cardStyle">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Thống kê khách hàng và đơn hàng</CardTitle>
          <CardDescription>
            Biểu thị số lượng khách hàng và đơn hàng theo{" "}
            <span className="font-semibold text-sky-600">
              {vietnameseDate(dateRange?.from as Date)}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-sky-600">
              {vietnameseDate(dateRange?.to as Date)}
            </span>
          </CardDescription>

          {growthRateComponent}
        </div>
        {/* <Select value={timeRange} onValueChange={setTimeRange}>
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
        </Select> */}
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {/* <AreaChart data={dataRangeDate}> */}
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillName" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-name)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-name)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillTotalSpend" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalSpend)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-name)"
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
                return vietnameseDate(value);
              }}
              className="font-semibold text-sky-500"
              overflow={"hidden"}
              type="category"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return formatTimeVietNam(new Date(value));
                  }}
                  indicator="dot"
                  className="min-w-[400px] h-[100px]"
                />
              }
              // className=""

              labelClassName="font-semibold text-sky-500 ml-2"
            />
            <Area
              dataKey="name"
              type="natural"
              fill="url(#fillName)"
              stroke="var(--color-name)"
              stackId="a"
            />
            <Area
              dataKey="totalSpend"
              type="natural"
              fill="url(#fillTotalSpend)"
              stroke="var(--color-totalSpend)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
