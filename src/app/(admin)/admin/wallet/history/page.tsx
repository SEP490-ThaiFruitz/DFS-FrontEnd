"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { WALLET_KEY } from '@/app/key/admin-key'
import { DataTableSkeleton } from '@/components/global-components/custom-skeleton/data-table-skeleton'
import { DataTableCustom } from '@/components/global-components/data-table/data-table-custom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatVND } from '@/lib/format-currency'
import { formatVietnamesePhoneNumber } from '@/lib/format-phone-number'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse } from '@/types/types'
import { ColumnDef } from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ArrowDownLeft, ArrowUpRight, Banknote, CalendarIcon, Check, ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { vi } from 'date-fns/locale/vi'
import { calculateGrowthRate } from '@/lib/calculate'
import TransactionChart from './transaction-chart'
import CardSkeleton from '@/components/global-components/custom-skeleton/card-skeleton'


interface TransactionResponse {
    statistic: Statistic,
    transactions: WallletTransaction[],
    chart: ChartItem[]
}

interface Statistic {
    buy: TransactionType,
    deposite: TransactionType,
    withdrawals: TransactionType,
    refund: TransactionType,
}

interface TransactionType {
    numberOfTransaction: number;
    amount: number;
}

interface ChartItem {
    date: string;
    buy: TransactionType;
    deposite: TransactionType;
    withdrawals: TransactionType;
    refund: TransactionType;
}

interface User {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
}

interface WallletTransaction {
    id: string
    transactionType: string
    content: string
    amount: number
    balance: number
    createdOnUtc: string
    user: User
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

const WalletHistoryPage = () => {

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
        if (!date?.from || !date?.to) return '/Wallets/history';
        const from = format(date.from, "yyyy-MM-dd");
        const to = format(date.to, "yyyy-MM-dd");
        return `/Wallets/history?&fromDate=${from}&toDate=${to}`;
    }, [date]);

    const {
        data: wallletTransactions,
        isLoading,
        refetch,
    } = useFetch<ApiResponse<TransactionResponse>>(formattedUrl, [WALLET_KEY.WALLET_TRANSACTION])


    const formattedOldUrl = useMemo(() => {
        if (!dateOld?.from || !dateOld?.to) return '/Wallets/history';
        const from = format(dateOld.from, "yyyy-MM-dd");
        const to = format(dateOld.to, "yyyy-MM-dd");
        return `/Wallets/history?fromDate=${from}&toDate=${to}`;
    }, [date]);

    const {
        data: wallletTransactionsOld,
        refetch: refetchOld,
    } = useFetch<ApiResponse<TransactionResponse>>(formattedOldUrl, [WALLET_KEY.WALLET_OLD_TRANSACTION])



    useEffect(() => {
        refetch()
        refetchOld()
    }, [date])

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


    const transactionTypeColors: Record<string, { color: string; text: string }> = {
        Buy: { color: "bg-purple-100 text-purple-800", text: "Mua hàng" },
        Deposite: { color: "bg-green-100 text-green-700", text: "Nạp tiền" },
        Withdrawals: { color: "bg-orange-100 text-green-800", text: "Rút tiền" },
        Refund: { color: "bg-red-100 text-red-800", text: "Hoàn trả" },
    };

    const columns: ColumnDef<WallletTransaction>[] = [
        {
            accessorKey: "user",
            header: "Người dùng",
            cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                            {user.phone && (
                                <div className="text-xs text-muted-foreground">{formatVietnamesePhoneNumber(user.phone)}</div>
                            )}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "transactionType",
            header: "Loại giao dịch",
            cell: ({ row }) => {
                const type = row.original.transactionType
                return (
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${transactionTypeColors[type]?.color || "bg-gray-100 text-gray-800"
                            }`}
                    >
                        {transactionTypeColors[type]?.text || "Không xác định"}
                    </span>
                )
            },
        },
        {
            accessorKey: "amount",
            header: "Số tiền",
            cell: ({ row }) => {
                const type = row.original.transactionType
                const amount = row.original?.amount
                return (
                    <span className={`font-medium ${(type === "Buy" || type === "Withdrawals") ? "text-red-500" : "text-green-500"}`}>
                        {(type === "Buy" || type === "Withdrawals") ? "-" : "+"}   {formatVND(amount)}
                    </span>
                )
            },
        },
        {
            accessorKey: "balance",
            header: "Số dư",
            cell: ({ row }) => {
                const balance = row.original.balance
                return <span>{formatVND(balance)}</span>
            },
        },
        {
            accessorKey: "content",
            header: "Nội dung",
            cell: ({ row }) => {
                return (
                    <div className="max-w-[200px] truncate" title={row.original.content}>
                        {row.original.content}
                    </div>
                )
            },
        },
        {
            accessorKey: "createdOnUtc",
            header: "Ngày giao dịch",
            cell: ({ row }) => {
                return formatTimeVietNam(new Date(row.original.createdOnUtc), true)
            },
        },
    ]

    return (
        <div className="m-10">
            <div className="text-2xl font-semibold leading-none tracking-tight mb-6">Danh sách giao dịch ví</div>


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
                                <CardTitle className="text-sm font-medium">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div>Tổng tiền đã mua</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatVND(wallletTransactions?.value?.statistic?.buy?.amount ?? 0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div>Số giao dịch</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {wallletTransactions?.value?.statistic?.buy?.numberOfTransaction ?? 0}
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            {calculateGrowthRate(wallletTransactions?.value?.statistic?.buy?.amount ?? 0, wallletTransactionsOld?.value?.statistic?.buy?.amount ?? 0)}
                                        </div>
                                    </div>
                                </CardTitle>
                                <div className="bg-green-50 rounded-full p-3 border">
                                    <Banknote className="h-6 w-6 text-green-600" />
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div>Tổng tiền đã nạp</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatVND(wallletTransactions?.value?.statistic?.deposite?.amount ?? 0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div>Số giao dịch nạp</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {wallletTransactions?.value?.statistic?.deposite?.numberOfTransaction ?? 0}
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            {calculateGrowthRate(wallletTransactions?.value?.statistic?.deposite?.amount ?? 0, wallletTransactionsOld?.value?.statistic?.deposite?.amount ?? 0)}
                                        </div>
                                    </div>
                                </CardTitle>
                                <div className="bg-blue-50 rounded-full p-3 border">
                                    <ArrowDownLeft className="h-6 w-6 text-blue-600" />
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div>Tổng tiền đã rút</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatVND(wallletTransactions?.value?.statistic?.withdrawals?.amount ?? 0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div>Số giao dịch rút</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {wallletTransactions?.value?.statistic?.withdrawals?.numberOfTransaction ?? 0}
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            {calculateGrowthRate(wallletTransactions?.value?.statistic?.withdrawals?.amount ?? 0, wallletTransactionsOld?.value?.statistic?.withdrawals?.amount ?? 0)}
                                        </div>
                                    </div>
                                </CardTitle>
                                <div className="bg-purple-50 rounded-full p-3 border">
                                    <ArrowUpRight className="h-6 w-6 text-purple-600" />
                                </div>
                            </CardHeader>
                        </Card>
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    <div className='flex flex-col gap-2'>
                                        <div>
                                            <div>Tổng tiền hoàn</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {formatVND(wallletTransactions?.value?.statistic?.refund?.amount ?? 0)}
                                            </div>
                                        </div>
                                        <div>
                                            <div>Số giao dịch hoàn</div>
                                            <div className="text-2xl font-bold text-primary">
                                                {wallletTransactions?.value?.statistic?.refund?.numberOfTransaction ?? 0}
                                            </div>
                                        </div>
                                        <div className="mt-1">
                                            {calculateGrowthRate(wallletTransactions?.value?.statistic?.refund?.amount ?? 0, wallletTransactionsOld?.value?.statistic?.refund?.amount ?? 0)}
                                        </div>
                                    </div>
                                </CardTitle>
                                <div className="bg-red-50 rounded-full p-3 border">
                                    <Check className="h-6 w-6 text-red-600" />
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                    <Card className="cardStyle mt-8">
                        <CardHeader>
                            <CardTitle className='flex items-center justify-between'>
                                <div className='min-w-fit'>Dòng tiền theo thời gian</div>
                                <SelectDate />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TransactionChart chartData={wallletTransactions?.value?.chart ?? []} />
                        </CardContent>
                    </Card>

                    <div className="mt-8">
                        <div className="bg-white cardStyle shadow border">
                            {isLoading ? <DataTableSkeleton /> :
                                <DataTableCustom data={wallletTransactions?.value?.transactions ?? []} columns={columns} placeholder="nội dung" searchFiled="content" />}
                        </div>
                    </div>
                </>
            )
            }
        </div>
    )
}

export default WalletHistoryPage
