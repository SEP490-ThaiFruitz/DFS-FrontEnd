"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ProductPerformance } from "./product-performance-chart";
import { formatVND } from "@/lib/format-currency";
import { format } from "date-fns";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { DataTable } from "@/components/global-components/data-table/data-table";
import { productTopRevenueColumn } from "@/features/manager/report-revenue/product-top-revenue-column";
import { REPORT_KEY } from "@/app/key/manager-key";
import { TotalCard } from "./components/total-card";
import {
  createDateRange,
  fillMissingDatesDynamics,
  vietnameseDate,
} from "@/utils/date";
import { customerRevenueColumns } from "@/features/manager/report-revenue/user-top-revenue-column";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";

type TopProductRevenueStatistics = {
  type: "Single" | "Combo";
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  revenue: number;
  revenueDiscount: number;
  lastBuyDate: string;
};

type TopCustomerRevenueStatistics = {
  userName: string;
  email: string;
  phone: string;
  image: string | null;
  address: string;
  moneySpend: number;
  lastBuyDate: string;
  quantityOfOrder: number;
};

type RevenueData = {
  totalRevenue: number;
  totalOrder: number;
  numberOfProductSold: number;
  topProductRevenueStatistics: TopProductRevenueStatistics[];
  topCustomerRevenueStatistics: TopCustomerRevenueStatistics[];
};

export default function RevenueDashboard() {
  const [timeRange, setTimeRange] = useState("month");

  const HeaderTitle = () => {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-xl font-semibold">Báo Cáo Doanh Thu</h1>
        <div className="ml-auto flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hôm nay</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button>Xuất báo cáo</Button>
        </div>
      </header>
    );
  };

  const fromDate = "2025-01-22";

  const currentDate = format(new Date(), "yyyy-MM-dd");

  const reportRevenue = useFetch<ApiResponse<RevenueData>>(
    `/Statistics/manager/report-revenue?fromDate=${fromDate}&toDate=${currentDate}`,
    [REPORT_KEY.REPORT_REVENUE]
  );
  // console.log(currentDate);

  console.log(reportRevenue.data);

  const chartConfig = {
    revenue: {
      label: "Doanh thu",
      color: "hsl(var(--chart-5))",
    },

    name: {
      label: "Doanh thu",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const sumOrder = reportRevenue.data?.value
    ? reportRevenue.data.value.totalRevenue /
      reportRevenue.data?.value.totalOrder
    : 0;

  // product performance chart data

  const productPerformance = useMemo(() => {
    if (reportRevenue?.data?.value?.topProductRevenueStatistics) {
      return reportRevenue.data.value.topProductRevenueStatistics.map(
        (product) => {
          return {
            productName: product.name,
            revenue: product.revenue,
            sold: product.quantity,
          };
        }
      );
    } else {
      return [
        {
          productName: "No data",
          revenue: 0,
          sold: 0,
        },
      ];
    }
  }, [reportRevenue.data?.value?.topProductRevenueStatistics]);

  const allDates = createDateRange(fromDate, currentDate);

  const enrichRevenue = reportRevenue.data?.value?.topProductRevenueStatistics
    ? reportRevenue.data.value.topProductRevenueStatistics.reduce(
        (acc, report) => {
          const date = report.lastBuyDate.split("T")[0];

          const revenue = report.revenueDiscount ?? report.revenue;
          if (acc[date]) {
            acc[date] += revenue;
          } else {
            acc[date] = revenue;
          }

          return acc;
        },
        {} as Record<string, number>
      )
    : {};

  const enrichRevenueArray = Object.entries(enrichRevenue).map(
    ([date, revenue]) => ({
      lastBuyDate: date,
      revenue,
    })
  );

  const filledRevenueData = fillMissingDatesDynamics(
    enrichRevenueArray,
    allDates,
    "lastBuyDate",
    ["revenue"]
  );

  return (
    <div className="flex min-h-screen w-full flex-col ">
      <div className="flex flex-col">
        <HeaderTitle />
        <main className="flex-1 space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng doanh thu
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatVND(reportRevenue.data?.value?.totalRevenue ?? 0)}
                </div>
              </CardContent>
            </Card>
            <TotalCard
              title="Tổng đơn hàng"
              value={reportRevenue?.data?.value?.totalOrder ?? 0}
              icon={ShoppingCart}
            />

            <TotalCard
              title="Số lượng sản phẩm đã bán"
              value={reportRevenue?.data?.value?.numberOfProductSold ?? 0}
              icon={ShoppingCart}
            />

            <TotalCard
              title="Trung bình mỗi đơn hàng"
              value={formatVND(sumOrder)}
              icon={ShoppingCart}
            />

            <Card className="cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tỷ lệ đơn hàng trung bình
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {reportRevenue?.data?.value
                    ? (
                        reportRevenue?.data?.value?.numberOfProductSold /
                        reportRevenue?.data?.value?.totalOrder
                      ).toFixed(2)
                    : 0}
                  %
                </div>
                {/* <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      stats.conversionChange.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stats.conversionChange.startsWith("+") ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {stats.conversionChange}
                  </span>
                  from last period
                </p> */}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2 cardStyle">
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>
                  Doanh thu trong thời gian{" "}
                  <span className="font-semibold text-sky-600">
                    {vietnameseDate(fromDate)}
                  </span>
                  -
                  <span className="font-semibold text-sky-600">
                    {vietnameseDate(currentDate)}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <div className="h-[300px]"> */}
                <ChartContainer
                  config={chartConfig}
                  className="h-[300px] w-full"
                >
                  <AreaChart
                    accessibilityLayer
                    data={filledRevenueData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,

                      // left: 12,
                      // right: 12,
                    }}
                    // className="h-[300px]"
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    {/* <CartesianGrid strokeDasharray="3 3" vertical={false} /> */}
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="lastBuyDate" />
                    <YAxis
                      tickFormatter={formatVND}
                      width={80}
                      allowDataOverflow
                    />
                    {/* <Tooltip
                        formatter={(value) => [
                          formatCurrency(value),
                          "Doanh thu",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          // backgroundColor: "hsl(var(--primary))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      /> */}

                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Area
                      type="natural"
                      dataKey="revenue"
                      stroke="var(--color-revenue)"
                      fillOpacity={0.4}
                      fill="var(--color-revenue)"
                    />
                  </AreaChart>
                </ChartContainer>
                {/* </div> */}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="products">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="products">Top Sản Phẩm</TabsTrigger>
                <TabsTrigger value="customers">Top Khách hàng</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="products" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1 md:col-span-1 cardStyle">
                  <CardHeader>
                    <CardTitle>Top 5 sản phẩm doanh thu</CardTitle>
                    <CardDescription>
                      Sản phẩm bán chạy nhất trong thời gian đã chọn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={productTopRevenueColumn}
                      data={
                        reportRevenue.data?.value
                          ?.topProductRevenueStatistics || []
                      }
                      searchFiled="name"
                      isLoading={reportRevenue.isLoading}
                    />
                  </CardContent>
                </Card>

                <ProductPerformance productPerformance={productPerformance} />
              </div>
            </TabsContent>
            <TabsContent value="customers" className="space-y-4">
              <Card className="cardStyle">
                <CardHeader>
                  <CardTitle>Top 5 Khách hàng</CardTitle>
                  <CardDescription>
                    Khách hàng mua sắm nhiều nhất trong thời gian đã chọn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={customerRevenueColumns}
                    data={
                      reportRevenue.data?.value?.topCustomerRevenueStatistics ||
                      []
                    }
                    searchFiled="userName"
                    isLoading={reportRevenue.isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
