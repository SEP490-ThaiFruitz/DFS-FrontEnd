"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { formatVND } from "@/lib/format-currency"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Banknote, CalendarIcon, ChevronDown, Eye, Package, Wallet2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import ViewDetail from "./view-detail"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { PAYMENT_KEY } from "@/app/key/admin-key"
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { vi } from "date-fns/locale/vi"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateGrowthRate } from "@/lib/calculate"
import PaymentChart from "./payment_statisc/chart"
import PaymentPie from "./payment_statisc/pie"
import { STATUS_SELECT } from "@/features/admin/admin-lib/admin-lib"
import CardSkeleton from "@/components/global-components/custom-skeleton/card-skeleton"

interface Payment {
    transactionNo: string
    orderId: string
    walletId: string
    content: string
    amount: number
    type: string
    paymentMethod: string
    status: string
    createdOnUtc: Date,
    updateOnUtc: Date | null
}

interface PaymentMethodChart {
    method: string;
    amount: number;
    numberOfTransaction: number;
}

interface PaymentChartItem {
    date: string;
    amount: number;
    paymentMethods: PaymentMethodChart[];
}

interface PaymentStatistic {
    amount: number;
    numberOfTransaction: number;
    deposite: number;
    numberOfOrder: number;
    chart: PaymentChartItem[];
    paymentStatus: PaymentStatus[];
}

interface PaymentStatus {
    status: string;
    amount: number;
    numberOfTransaction: number;
}

interface PaymentResponse {
    payments: Payment[];
    paymentStatistic: PaymentStatistic;
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

const PaymentPage = () => {
    const today = new Date()
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [selectedOption, setSelectedOption] = useState<string>("all")
    const [selectedStatusOption, setSelectedStatusOption] = useState<string>("All")


    const [date, setDate] = useState<DateRange>({
        from: null,
        to: null,
    })

    const [dateOld, setDateOld] = useState<DateRange>({
        from: null,
        to: null,
    })


    const formattedUrl = useMemo(() => {
        const from = date?.from ? format(date.from, "yyyy-MM-dd") : null;
        const to = date?.to ? format(date.to, "yyyy-MM-dd") : null;

        const queryParams = [
            selectedStatusOption !== "All" ? `status=${selectedStatusOption}` : null,
            from ? `fromDate=${from}` : null,
            to ? `toDate=${to}` : null
        ].filter(Boolean).join('&');

        return `/Payments/history?${queryParams}`;
    }, [date, selectedStatusOption]);

    const {
        data: payments,
        isLoading,
        refetch,
    } = useFetch<ApiResponse<PaymentResponse>>(formattedUrl, [PAYMENT_KEY.PAYEMNT])

    const formattedOldUrl = useMemo(() => {
        const from = dateOld?.from ? format(dateOld.from, "yyyy-MM-dd") : null;
        const to = dateOld?.to ? format(dateOld.to, "yyyy-MM-dd") : null;

        const queryParams = [
            selectedStatusOption !== "All" ? `status=${selectedStatusOption}` : null,
            from ? `fromDate=${from}` : null,
            to ? `toDate=${to}` : null
        ].filter(Boolean).join('&');

        return `/Payments/history?${queryParams}`;
    }, [dateOld, selectedStatusOption]);

    const {
        data: paymentsOld,
        refetch: refetchOld,
    } = useFetch<ApiResponse<PaymentResponse>>(formattedOldUrl, [PAYMENT_KEY.PAYEMNT_OLD])

    useEffect(() => {
        refetch()
        refetchOld()
    }, [date, selectedStatusOption])

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

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option)
        if (option === "custom") {
            setCalendarOpen(true)
        } else {
            setCalendarOpen(false)
        }
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

    const SelectDate = () => (
        <div className="flex items-center py-4 space-x-4 p-4 w-full justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between sm:w-auto">
                        {STATUS_SELECT[selectedStatusOption]}
                        <ChevronDown className="ml-2 h-6 w-6" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setSelectedStatusOption("All")}>Tất cả</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatusOption("Pending")}>Chờ thanh toán</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatusOption("Paid")}>Đã thanh toán</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSelectedStatusOption("Fail")}>Thất bại</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between sm:w-auto">
                        {dateRangeOptions[selectedOption].label}
                        <ChevronDown className="ml-2 h-6 w-6" />
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
                        <CalendarIcon className="mr-2 h-6 w-6" />
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
    const [transaction, setTransaction] = useState<Payment | undefined>(undefined);

    const typeColors: Record<string, { color: string; text: string }> = {
        Order: { color: "bg-blue-100 text-blue-800", text: "Mua hàng" },
        Wallet: { color: "bg-teal-100 text-teal-700", text: "Nạp tiền" },
    };

    const paymentMethodColors: Record<string, { color: string; text: string }> = {
        VnPay: { color: "bg-blue-100 text-blue-800", text: "VnPay" },
        PayOs: { color: "bg-teal-100 text-teal-700", text: "PayOs" },
        ShipCode: { color: "bg-yellow-100 text-yellow-800", text: "ShipCode" },
        Wallet: { color: "bg-indigo-100 text-indigo-800", text: "Ví" },
    };

    const paymentSatusColors: Record<string, { color: string; text: string }> = {
        Pending: { color: "bg-blue-100 text-blue-800", text: "Chờ thanh toán" },
        Paid: { color: "bg-teal-100 text-teal-700", text: "Đã thanh toán" },
        Fail: { color: "bg-red-100 text-red-800", text: "Thất bại" },
    };

    const columns: ColumnDef<Payment>[] = [
        {
            accessorKey: "transactionNo",
            header: "Mã giao dịch",
        },
        {
            accessorKey: "referenceId",
            header: "Mã tham chiếu",
            cell: ({ row }) => row.original.walletId ?? row.original.orderId,
        },
        {
            accessorKey: "content",
            header: "Nội dung",
        },
        {
            accessorKey: "amount",
            header: "Số tiền",
            cell: ({ row }) => formatVND(row.original.amount),
        },
        {
            accessorKey: "paymentMethod",
            header: "Phuơng thức thanh toán",
            cell: ({ row }) => {
                const type = row.original.paymentMethod
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentMethodColors[type]?.color || "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {paymentMethodColors[type]?.text || "Không xác định"}
                    </span>
                )
            },
        },
        {
            accessorKey: "type",
            header: "Loại",
            cell: ({ row }) => {
                const type = row.original.type
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${typeColors[type]?.color || "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {typeColors[type]?.text || "Không xác định"}
                    </span>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${paymentSatusColors[status]?.color || "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {paymentSatusColors[status]?.text || "Không xác định"}
                    </span>
                )
            }
        },
        {
            accessorKey: "createdOnUtc",
            header: "Ngày tạo",
            cell: ({ row }) => formatTimeVietNam(row.original.createdOnUtc, true),
        },
        {
            accessorKey: "updateOnUtc",
            header: "Ngày cập nhật",
            cell: ({ row }) => row.original.updateOnUtc && formatTimeVietNam(row.original.updateOnUtc, true),
        },
        {
            accessorKey: "action",
            header: "Hành động",
            cell: ({ row }) =>
                row.original.updateOnUtc && row.original.type !== "ShipCode" &&
                <Button
                    variant="outline"
                    onClick={() => setTransaction(row.original)}
                    className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                    <Eye />
                </Button>,

        },
    ]

    return (
        <div className="m-10">
            <div className="flex items-center justify-between">
                <div className="text-2xl font-semibold leading-none tracking-tight mb-6 min-w-fit">Danh sách giao dịch</div>
                <SelectDate />
            </div>
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
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng tiền</CardTitle>
                                <div className="bg-green-50 rounded-full p-3 border">
                                    <Banknote className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatVND(payments?.value?.paymentStatistic.amount ?? 0)}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(payments?.value?.paymentStatistic.amount ?? 0, paymentsOld?.value?.paymentStatistic.amount ?? 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Giao dịch</CardTitle>
                                <div className="bg-blue-50 rounded-full p-3 border">
                                    <ArrowUpDown className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{payments?.value?.paymentStatistic.numberOfTransaction ?? 0}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(payments?.value?.paymentStatistic.numberOfTransaction ?? 0, paymentsOld?.value?.paymentStatistic.numberOfTransaction ?? 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Nạp ví</CardTitle>
                                <div className="bg-purple-50 rounded-full p-3 border">
                                    <Wallet2 className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{payments?.value?.paymentStatistic.deposite ?? 0}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(payments?.value?.paymentStatistic.deposite ?? 0, paymentsOld?.value?.paymentStatistic.deposite ?? 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Mua hàng</CardTitle>
                                <div className="bg-amber-50 rounded-full p-3 border">
                                    <Package className="h-4 w-4 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{payments?.value?.paymentStatistic.numberOfOrder ?? 0}</div>
                                <div className="mt-1">
                                    {calculateGrowthRate(payments?.value?.paymentStatistic.numberOfOrder ?? 0, paymentsOld?.value?.paymentStatistic.numberOfOrder ?? 0)}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-7 mt-8">
                        <Card className="lg:col-span-5 cardStyle">
                            <CardHeader>
                                <CardTitle>Dòng tiền theo thời gian</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <PaymentChart paymentCharts={payments?.value?.paymentStatistic.chart ?? []} />
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2 cardStyle w-full">
                            <CardHeader>
                                <CardTitle>Trạng thái</CardTitle>
                                <CardDescription>Trạng thái thanh toán</CardDescription>
                            </CardHeader>
                            <CardContent className="w-full min-h-[350px]">
                                <PaymentPie paymentStatus={payments?.value?.paymentStatistic.paymentStatus ?? []} />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8">
                        <div className="bg-white rounded-lg shadow border">
                            {isLoading ? <DataTableSkeleton /> :
                                <DataTableCustom data={payments?.value?.payments ?? []} columns={columns} searchFiled="transactionNo" placeholder="mã giao dịch" />}
                        </div>
                    </div>
                </>
            )
            }
            {transaction && (
                <ViewDetail
                    isOpen={transaction !== undefined}
                    onClose={() => setTransaction(undefined)}
                    transactionNo={transaction.transactionNo}
                    paymentMethod={transaction.paymentMethod}
                />
            )}
        </div>
    )
}

export default PaymentPage

