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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ProductPerformance } from "./product-performance-chart";
import { formatVND } from "@/lib/format-currency";
import { format } from "date-fns";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { DataTable } from "@/components/global-components/data-table/data-table";
import { productTopRevenueColumn } from "@/features/manager/report-revenue/product-top-revenue-column";
import { REPORT_KEY } from "@/app/key/manager-key";
import { TotalCard } from "./components/total-card";

type TopProductRevenueStatistics = {
  type: "Single" | "Combo";
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  revenue: number;
  revenueDiscount: number;
};

type TopCustomerRevenueStatistics = {
  userName: string;
  email: string;
  phone: string;
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

  // Dummy data
  const stats = {
    totalRevenue: "$124,750.89",
    revenueChange: "+12.5%",
    totalOrders: "1,429",
    ordersChange: "+8.2%",
    averageOrder: "$87.30",
    averageChange: "+3.1%",
    conversionRate: "3.2%",
    conversionChange: "+0.8%",
  };

  const topProducts = [
    {
      id: 1,
      name: "Premium Wireless Headphones",
      price: "$199.99",
      sold: 245,
      revenue: "$48,997.55",
      growth: "+18%",
    },
    {
      id: 2,
      name: "Smart Fitness Tracker",
      price: "$129.99",
      sold: 187,
      revenue: "$24,308.13",
      growth: "+24%",
    },
    {
      id: 3,
      name: "Ultra HD Streaming Device",
      price: "$89.99",
      sold: 156,
      revenue: "$14,038.44",
      growth: "+5%",
    },
    {
      id: 4,
      name: "Ergonomic Desk Chair",
      price: "$249.99",
      sold: 52,
      revenue: "$12,999.48",
      growth: "+10%",
    },
    {
      id: 5,
      name: "Portable Power Bank 20000mAh",
      price: "$59.99",
      sold: 203,
      revenue: "$12,177.97",
      growth: "-2%",
    },
  ];

  const topCustomers = [
    {
      id: 1,
      name: "Hữu Phúc",
      email: "huuphuc@gmail.com",
      orders: 12,
      spent: "$2,458.32",
      lastPurchase: "2 ngày trước",
    },
    {
      id: 2,
      name: "Văn Minh",
      email: "vanminh@gmail.com",
      orders: 9,
      spent: "$1,879.",
      lastPurchase: "1 tuần trước",
    },
    {
      id: 3,
      name: "Thanh Toàn",
      email: "thanhtoan@gmail.com",
      orders: 8,
      spent: "$1,654.21",
      lastPurchase: "3 ngày trước",
    },
    {
      id: 4,
      name: "Mai Hà",
      email: "maiha@gmail.com",
      orders: 7,
      spent: "$1,432",
      lastPurchase: "5 ngày trước",
    },
    {
      id: 5,
      name: "Ái Khanh",
      email: "aikhanh@gmail.com",
      orders: 6,
      spent: "$1,298.56",
      lastPurchase: "2 tuần trước",
    },
  ];

  // Revenue chart data
  const revenueData = [
    { date: "Tháng 1", revenue: 12500 },
    { date: "Tháng 2", revenue: 18200 },
    { date: "Tháng 3", revenue: 15800 },
    { date: "Tháng 4", revenue: 14300 },
    { date: "Tháng 5", revenue: 19500 },
    { date: "Tháng 6", revenue: 22800 },
    { date: "Tháng 7", revenue: 21400 },
  ];

  // Product performance chart data
  const productPerformanceData = topProducts.map((product) => ({
    name:
      product.name.length > 15
        ? product.name.substring(0, 15) + "..."
        : product.name,
    revenue: Number.parseFloat(
      product.revenue.replace("$", "").replace(",", "")
    ),
    units: product.sold,
  }));

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

  const currentDate = format(new Date(), "yyyy-MM-dd");

  const reportRevenue = useFetch<ApiResponse<RevenueData>>(
    `/Statistics/manager/report-revenue?fromDate=2025-01-22&toDate=${currentDate}`,
    [REPORT_KEY.REPORT_REVENUE]
  );
  // console.log(currentDate);

  console.log(reportRevenue);

  const chartConfig = {
    revenue: {
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20">
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
                {/* <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      stats.revenueChange.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stats.revenueChange.startsWith("+") ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {stats.revenueChange}
                  </span>{" "}
                  Từ kỳ trước
                </p> */}
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
            {/* <Card className="cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tổng đơn hàng
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      stats.ordersChange.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stats.ordersChange.startsWith("+") ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {stats.ordersChange}
                  </span>{" "}
                  Từ kỳ trước
                </p>
              </CardContent>
            </Card> */}
            {/* <Card className="cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Trung bình mỗi đơn hàng
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageOrder}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={`inline-flex items-center ${
                      stats.averageChange.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stats.averageChange.startsWith("+") ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    {stats.averageChange}
                  </span>{" "}
                  từ kỳ trước
                </p>
              </CardContent>
            </Card> */}
            <Card className="cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tỷ lệ chuyển đổi
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.conversionRate}</div>
                <p className="text-xs text-muted-foreground">
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
                  </span>{" "}
                  from last period
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-1 md:col-span-2 cardStyle">
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>
                  Doanh thu trong thời gian đã chọn
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
                    data={revenueData}
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
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={formatVND} width={80} />
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
                    {/* <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản Phẩm</TableHead>
                          <TableHead className="text-right">Giá</TableHead>
                          <TableHead className="text-right">Đã bán</TableHead>
                          <TableHead className="text-right">
                            Doanh Thu
                          </TableHead>
                          <TableHead className="text-right">
                            Tăng trưởng
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.price}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.sold}
                            </TableCell>
                            <TableCell className="text-right">
                              {product.revenue}
                            </TableCell>
                            <TableCell
                              className={`text-right ${
                                product.growth.startsWith("+")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {product.growth}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table> */}

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
                    columns={productTopRevenueColumn}
                    data={
                      reportRevenue.data?.value?.topProductRevenueStatistics ||
                      []
                    }
                    searchFiled="name"
                    isLoading={reportRevenue.isLoading}
                  />

                  {/* <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Đơn hàng</TableHead>
                        <TableHead className="text-right">Đã chi</TableHead>
                        <TableHead>Lần mua cuối</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">
                            {customer.name}
                          </TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell className="text-right">
                            {customer.orders}
                          </TableCell>
                          <TableCell className="text-right">
                            {customer.spent}
                          </TableCell>
                          <TableCell>{customer.lastPurchase}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table> */}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
