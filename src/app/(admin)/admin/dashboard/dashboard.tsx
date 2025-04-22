"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatVND } from "@/lib/format-currency"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Banknote, BarChart, CalendarIcon, ChevronDown, Eye, Package, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useMemo, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns"
import { cn } from "@/lib/utils"
import { PRODUCT_KEY } from "@/app/key/admin-key"
import { vi } from 'date-fns/locale/vi'
import Link from "next/link"
import { calculateGrowthRate } from "@/lib/calculate"
import CardSkeleton from "@/components/global-components/custom-skeleton/card-skeleton"

interface ProductVariant {
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    netWeight: number
    quantitySold: number
    revenue: number
    totalOrders: number
    lastBuyDate: string
}

interface RevenueReport {
    revenue: number
    quantity: number
    totalOrders: number
    averageRevenuePerOrder: number
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


const Dashboard = () => {
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
        if (!date?.from || !date?.to) return '/Statistics/report/product-variants';
        const from = format(date.from, "yyyy-MM-dd");
        const to = format(date.to, "yyyy-MM-dd");
        return `/Statistics/report/product-variants?fromDate=${from}&toDate=${to}`;
    }, [date]);

    const { data: reportData, refetch, isLoading } = useFetch<ApiResponse<RevenueReport>>(
        formattedUrl,
        [PRODUCT_KEY.PRODUCT_VARIANT_STATISTIC]
    );

    const formattedOldUrl = useMemo(() => {
        if (!dateOld?.from || !dateOld?.to) return '/Statistics/report/product-variants';
        const from = format(dateOld.from, "yyyy-MM-dd");
        const to = format(dateOld.to, "yyyy-MM-dd");
        return `/Statistics/report/product-variants?fromDate=${from}&toDate=${to}`;
    }, [dateOld]);

    const { data: reportDataOld, refetch: refreshOld } = useFetch<ApiResponse<RevenueReport>>(
        formattedOldUrl,
        [PRODUCT_KEY.PRODUCT_VARIANT_OLD_STATISTIC]
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

    const columns: ColumnDef<ProductVariant>[] = [
        {
            accessorKey: "productVariantImage",
            header: "Hình ảnh",
            cell: ({ row }) => {
                const image = row.original.productVariantImage
                return (
                    <div className="relative h-24 w-2h-24 overflow-hidden rounded-md">
                        <Image
                            src={image}
                            alt={row.original.productName}
                            fill
                            className="object-cover"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "productName",
            header: "Tên sản phẩm",
            cell: ({ row }) => <div className="font-medium">{row.getValue("productName")}</div>,
        },
        {
            accessorKey: "packagingType",
            header: "Loại đóng gói",
        },
        {
            accessorKey: "netWeight",
            header: "Khối lượng",
            cell: ({ row }) => {
                const weight = row.original.netWeight
                return <div className="text-right">{weight.toLocaleString()} g</div>
            },
        },
        {
            accessorKey: "quantitySold",
            header: "Đã bán",
            cell: ({ row }) => {
                const quantity = row.original.quantitySold
                return <div className="text-right font-medium">{quantity.toLocaleString()}</div>
            },
        },
        {
            accessorKey: "revenue",
            header: "Doanh thu",
            cell: ({ row }) => {
                const revenue = row.original.revenue
                return <div className="text-right font-medium">{formatVND(revenue)}</div>
            },
        },
        {
            accessorKey: "totalOrders",
            header: "Đơn hàng",
            cell: ({ row }) => {
                const orders = row.original.totalOrders
                return <div className="text-right">{orders.toLocaleString()}</div>
            },
        },
        {
            accessorKey: "growthRate",
            header: "Tỉ lệ tăng trưởng",
            cell: ({ row }) => {
                const currentQuantity = row.original.quantitySold ?? 0;
                const oldVariant = reportDataOld?.value?.productVariants.find(
                    (p: ProductVariant) => p.productVariantId === row.original.productVariantId
                );
                const oldQuantity = oldVariant?.quantitySold ?? 0;

                return calculateGrowthRate(currentQuantity, oldQuantity);
            },
        },
        {
            accessorKey: "lastBuyDate",
            header: "Lần mua cuối",
            cell: ({ row }) => {
                const date = row.original.lastBuyDate
                return date ?
                    formatTimeVietNam(new Date(date), true)
                    : (
                        <span className="text-muted-foreground">Chưa có</span>
                    )
            },
        },
        {
            accessorKey: "action",
            header: "Hành động",
            cell: ({ row }) =>
                <Link href={`/admin/dashboard/${row.original.productId}`}>
                    <Button
                        variant="outline"
                        className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                        <Eye />
                    </Button>
                </Link>
        },
    ]

    useEffect(() => {
        refreshOld()
        refetch()
    }, [date])

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

    return (
        <div className="mx-4 sm:m-10">
            <h1 className="text-2xl font-bold mb-6">Tổng quan doanh thu</h1>

            {isLoading ? (
                <div className="w-full">
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <CardSkeleton key={i + 1} />
                            ))}

                    </div>
                    <div className="mt-8">
                        <DataTableSkeleton />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                                <div className="bg-green-50 rounded-full p-3 border">
                                    <Banknote className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatVND(reportData?.value?.revenue || 0)}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(reportData?.value?.revenue ?? 0, reportDataOld?.value?.revenue ?? 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                                <div className="bg-blue-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{reportData?.value?.quantity?.toLocaleString() || 0}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(reportData?.value?.quantity ?? 0, reportDataOld?.value?.quantity ?? 0)}
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
                                <div className="text-2xl font-bold">{reportData?.value?.totalOrders?.toLocaleString() || 0}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(reportData?.value?.totalOrders ?? 0, reportDataOld?.value?.totalOrders ?? 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Trung bình</CardTitle>
                                <div className="bg-amber-50 rounded-full p-3 border">
                                    <BarChart className="h-4 w-4 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatVND(reportData?.value?.averageRevenuePerOrder || 0)}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(reportData?.value?.averageRevenuePerOrder ?? 0, reportDataOld?.value?.averageRevenuePerOrder ?? 0)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Chi tiết sản phẩm</h2>
                        <div className="bg-white rounded-lg shadow border">
                            {isLoading ? <DataTableSkeleton /> :
                                <DataTableCustom data={reportData?.value?.productVariants || []} columns={columns} placeholder="tên sản phẩm" searchFiled="productName">
                                    <SelectDate />
                                </DataTableCustom>}
                        </div>
                    </div>
                </>
            )
            }
        </div >
    )
}

export default Dashboard
