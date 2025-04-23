"use client"
import { useParams } from "next/navigation"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Banknote, CalendarIcon, ChevronDown, MessageSquareMore, Package, ShoppingBag } from "lucide-react"
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns"
import { ApiResponse } from "@/types/types"
import { formatVND } from "@/lib/format-currency"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import ProductChart from "./product-statisc/chart"
import ProductPie from "./product-statisc/pie"
import { useEffect, useMemo, useState } from "react"
import { PRODUCT_KEY } from "@/app/key/admin-key"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { vi } from "date-fns/locale/vi"
import { calculateGrowthRate } from "@/lib/calculate"
import ProductVariantTab from "./product-variant/product-variant"
import CardSkeleton from "@/components/global-components/custom-skeleton/card-skeleton"

interface ProductChartData {
  date: string
  quantitySold: number
  revenue: number
}

interface Feedback {
  avatar: string
  name: string
  content: string
  images: string[]
  star: number
  createdAt: string
}

interface ProductVariant {
  productVariantId: string
  productVariantImage: string
  packagingType: string
  netWeight: number
  quantitySold: number
  revenue: number
}

interface ProductDetail {
  name: string
  image: string
  totalRevenue: number
  quantitySold: number
  orderCount: number
  chart: ProductChartData[]
  feedBack: number
  feedbacks: Feedback[]
  productVariants: ProductVariant[]
}

type DateRange = {
  from: Date | null
  to: Date | null
}

type DateRangeOption = {
  label: string
  getValue: () => DateRange
  getValueOld: () => DateRange
}

const StatisticProductPage = () => {
  const { id } = useParams()
  const today = new Date()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>("all")

  const [date, setDate] = useState<DateRange>({
    from: null,
    to: null,
  })

  const [dateOld, setDateOld] = useState<DateRange>({
    from: null,
    to: null,
  })

  const formattedUrl = useMemo(() => {
    if (!date?.from || !date?.to) return `/Statistics/report/product/${id}`;
    const from = format(date.from, "yyyy-MM-dd");
    const to = format(date.to, "yyyy-MM-dd").replace("?enabled=true", "");
    return `/Statistics/report/product/${id}?fromDate=${from}&toDate=${to}`;
  }, [date]);

  const { data: product, refetch, isLoading } = useFetch<ApiResponse<ProductDetail>>(
    formattedUrl,
    [PRODUCT_KEY.PRODUCT_STATISTIC]
  );

  const formattedOldUrl = useMemo(() => {
    if (!dateOld?.from || !dateOld?.to) return `/Statistics/report/product/${id}`;
    const from = format(dateOld.from, "yyyy-MM-dd");
    const to = format(dateOld.to, "yyyy-MM-dd").replace("?enabled=true", "");
    return `/Statistics/report/product/${id}?fromDate=${from}&toDate=${to}`;
  }, [dateOld]);

  const { data: productOld, refetch: refreshOld } = useFetch<ApiResponse<ProductDetail>>(
    formattedOldUrl,
    [PRODUCT_KEY.PRODUCT_OLD_STATISTIC]
  );

  const dateRangeOptions: Record<string, DateRangeOption> = {
    all: {
      label: "Tất cả",
      getValue: () => ({
        from: null,
        to: null,
      }),
      getValueOld: () => ({
        from: null,
        to: null,
      }),
    },
    today: {
      label: "Hôm nay",
      getValue: () => ({
        from: today,
        to: today,
      }),
      getValueOld: () => ({
        from: subDays(today, 1),
        to: subDays(today, 1),
      }),
    },
    "3days": {
      label: "3 ngày",
      getValue: () => ({
        from: subDays(today, 2),
        to: today,
      }),
      getValueOld: () => ({
        from: subDays(today, 5),
        to: subDays(today, 3),
      }),
    },
    thisWeek: {
      label: "Tuần này",
      getValue: () => ({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      }),
      getValueOld: () => ({
        from: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      }),

    },
    thisMonth: {
      label: "Tháng này",
      getValue: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
      getValueOld: () => ({
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      }),
    },
    custom: {
      label: "Từ ngày đến ngày",
      getValue: () => date,
      getValueOld: () => ({
        from: subYears(startOfMonth(subMonths(today, 1)), 1),
        to: subYears(endOfMonth(subMonths(today, 1)), 1),
      }),
    },
  }

  const formatDateRange = () => {
    if (!date.from) return "Chọn ngày"
    if (!date.to) return format(date.from, "dd/MM/yyyy")
    return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
  }

  useEffect(() => {
    if (selectedOption !== "custom") {
      setDate(dateRangeOptions[selectedOption].getValue())
      setDateOld(dateRangeOptions[selectedOption].getValueOld())
    }
  }, [selectedOption])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    if (option === "custom") {
      setCalendarOpen(true)
    } else {
      setCalendarOpen(false)
    }
  }

  const SelectDate = () => (
    <div className="flex items-center py-4 space-x-4 p-4 w-full justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between sm:w-auto">
            {dateRangeOptions[selectedOption].label}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleOptionSelect("all")}>Tất cả</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOptionSelect("today")}>Hôm nay</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOptionSelect("3days")}>3 ngày</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOptionSelect("thisWeek")}>Tuần này</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOptionSelect("thisMonth")}>Tháng này</DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleOptionSelect("custom")}>Từ ngày đến ngày</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("w-full justify-start text-left sm:w-auto", !date.from && "text-muted-foreground")}
            onClick={() => {
              setSelectedOption("custom")
              setCalendarOpen(true)
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            locale={vi}
            defaultMonth={date.from ?? undefined}
            selected={date?.from ? { from: date.from, to: date.to ?? undefined } : undefined}
            onSelect={(newDate) => {
              setDate(newDate as DateRange)
              if (newDate?.to) {
                setCalendarOpen(false)
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
  useEffect(() => {
    refreshOld()
    refetch()
  }, [date])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 cardStyle border overflow-hidden flex-shrink-0">
                <ImagePreview
                  images={[product?.value?.image ?? '/images/dried-fruit.webp']}
                  initialHeight={1000}
                  initialWidth={1000}
                  className="object-center h-full w-full hover:cursor-pointer"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{product?.value?.name}</h1>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="productVariants">Biến thể</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <SelectDate />
              </TabsContent>
            </div>
            <TabsContent value="overview" className="space-y-8">
              {isLoading ? (
                <div className="w-full">
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <CardSkeleton key={i + 1} />
                      ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  <Card className="transition-all hover:shadow-md cardStyle">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                      <div className="bg-green-50 rounded-full p-3 border">
                        <Banknote className="h-4 w-4 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatVND(product?.value?.totalRevenue ?? 0)}</div>
                      <div className="mt-1">
                        {calculateGrowthRate(product?.value?.totalRevenue ?? 0, productOld?.value?.totalRevenue ?? 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all hover:shadow-md cardStyle">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Số lượng</CardTitle>
                      <div className="bg-blue-50 rounded-full p-3 border">
                        <Package className="h-4 w-4 text-blue-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{product?.value?.quantitySold ?? 0}</div>
                      <div className="mt-1">
                        {calculateGrowthRate(product?.value?.quantitySold ?? 0, productOld?.value?.quantitySold ?? 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all hover:shadow-md cardStyle">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                      <div className="bg-purple-50 rounded-full p-3 border">
                        <ShoppingBag className="h-4 w-4 text-purple-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{product?.value?.orderCount ?? 0}</div>
                      <div className="mt-1">
                        {calculateGrowthRate(product?.value?.orderCount ?? 0, productOld?.value?.orderCount ?? 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="transition-all hover:shadow-md cardStyle">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
                      <div className="bg-amber-50 rounded-full p-3 border">
                        <MessageSquareMore className="h-4 w-4 text-amber-600" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{product?.value?.feedBack ?? 0}</div>
                      <div className="mt-1">
                        {calculateGrowthRate(product?.value?.feedBack ?? 0, productOld?.value?.feedBack ?? 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>)}

              <div className="grid gap-8 lg:grid-cols-7">
                <Card className="lg:col-span-5 cardStyle">
                  <CardHeader>
                    <CardTitle>Doanh số theo thời gian</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ProductChart productCharts={product?.value?.chart ?? []} />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2 cardStyle w-full">
                  <CardHeader>
                    <CardTitle>Biến thể</CardTitle>
                    <CardDescription>Số lượng bán theo biến thể sản phẩm</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full min-h-[350px]">
                    <ProductPie productVariants={product?.value?.productVariants ?? []} />
                  </CardContent>
                </Card>
              </div>

              <Card className="lg:col-span-2 cardStyle">
                <CardHeader>
                  <CardTitle>Đánh giá gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ?
                      Array(4)
                        .fill(0)
                        .map((_, i) => (
                          <CardSkeleton key={i + 1} />
                        ))
                      : product?.value?.feedbacks && product?.value?.feedbacks.length > 0 ? product?.value?.feedbacks.map((feedback, i) => (
                        <div key={i + 1} className="flex items-start gap-4 border-b pb-4 last:border-0">
                          <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={feedback.avatar} alt={feedback.name} />
                              <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{feedback.name}</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, j) => (
                                  <svg
                                    key={j}
                                    className={`h-4 w-4 ${j < feedback.star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{feedback.content}</p>
                            <p className="text-xs text-muted-foreground">{formatTimeVietNam(new Date(feedback.createdAt), true)}</p>
                            <div className="flex items-center gap-8">
                              {feedback.images.map((image, j) => (
                                <ImagePreview
                                  key={j}
                                  images={[image]}
                                  initialHeight={200}
                                  initialWidth={200}
                                  className="cardStyle hover:cursor-pointer h-fit"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                          Không có đánh giá nào
                        </div>)}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <ProductVariantTab productVariants={product?.value?.productVariants ?? []} />
          </Tabs>
        </div>
      </main >
    </div >
  )
}

export default StatisticProductPage
