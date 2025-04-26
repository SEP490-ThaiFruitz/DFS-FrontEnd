"use client"

import { API } from "@/actions/client/api-config"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { WALLET_KEY } from "@/app/key/admin-key"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatVND } from "@/lib/format-currency"
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import type { ApiResponse } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Check, Images, Pencil, Ban, CheckCircle, Clock, XCircle, ChevronDown, CalendarIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import DialogRequestWithDrawal from "./update-dialog"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import DialogRejectRequestWithDrawal from "./reject-dialog"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { vi } from "date-fns/locale/vi"
import CardSkeleton from "@/components/global-components/custom-skeleton/card-skeleton"

interface RequestWithDrawalResponse {
  totalResponseWithdrawalApproved: number
  totalResponseWithdrawalRefunded: number,
  totalResponseWithdrawalPending: number,
  totalResponseWithdrawalRejected: number,
  requestWithdrawals: RequestWithDrawal[]
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

export interface RequestWithDrawal {
  id: string
  amount: number
  bankName: string
  bankAccountNumber: string
  recipientName: string
  bankLogo: string
  createdOnUtc: string
  requestWithdrawalType: string
  note: string | null
  image: string | null
  reason: string | null
  processedAt: string | null
  user: User
}

type DateRange = {
  from: Date | null
  to: Date | null
}

type DateRangeOption = {
  label: string
  getValue: () => DateRange
}

const WithdrawalsPage = () => {

  const today = new Date()
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>("all")

  const [date, setDate] = useState<DateRange>({
    from: null,
    to: null,
  })


  const formattedUrl = useMemo(() => {
    if (!date?.from || !date?.to) return '/Wallets/request-withdrawal';
    const from = format(date.from, "yyyy-MM-dd");
    const to = format(date.to, "yyyy-MM-dd");
    return `/Wallets/request-withdrawal?fromDate=${from}&toDate=${to}`;
  }, [date]);

  const { data: requestWithDrawalData, isLoading, refetch } = useFetch<ApiResponse<RequestWithDrawalResponse>>(
    formattedUrl,
    [WALLET_KEY.REQUEST_WITHDRAWAL],
  )
  const [requestWithDrawalUpdate, setRequestWithDrawalUpdate] = useState<RequestWithDrawal | null>(null)
  const [requestWithDrawalReject, setRequestWithDrawalReject] = useState<RequestWithDrawal | null>(null)

  const withdrawalStatusColors: Record<string, { color: string; text: string }> = {
    Pending: { color: "bg-yellow-100 text-yellow-800", text: "Đang chờ" },
    Approved: { color: "bg-green-100 text-green-800", text: "Đã xác nhận" },
    Rejected: { color: "bg-orange-100 text-orange-800", text: "Đã từ chối" },
    Refunded: { color: "bg-blue-100 text-blue-800", text: "Đã hoàn tiền" },
    Cancelled: { color: "bg-red-100 text-red-800", text: "Đã hủy" },
    default: { color: "bg-gray-100 text-gray-800", text: "Không xác định" },
  }

  useEffect(() => {
    refetch()
  }, [date])

  const dateRangeOptions: Record<string, DateRangeOption> = {
    all: {
      label: "Tất cả",
      getValue: () => ({
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
    },
    "3days": {
      label: "3 ngày",
      getValue: () => ({
        from: subDays(today, 2),
        to: today,
      }),
    },
    thisWeek: {
      label: "Tuần này",
      getValue: () => ({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      }),

    },
    thisMonth: {
      label: "Tháng này",
      getValue: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
    },
    custom: {
      label: "Từ ngày đến ngày",
      getValue: () => date,
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
    }
  }, [selectedOption])

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

  const queryClient = useQueryClient();
  const handleApprove = async (requestWithDrawalId: string) => {
    try {
      const response = await API.patch(`/Wallets/request-withdrawal/${requestWithDrawalId}/aprrove`, {})
      if (response) {
        toast.success("Yêu cầu đã được duyệt")
        queryClient.invalidateQueries({ queryKey: [WALLET_KEY.REQUEST_WITHDRAWAL] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const columns: ColumnDef<RequestWithDrawal>[] = [
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
      accessorKey: "amount",
      header: "Số tiền",
      cell: ({ row }) => {
        const amount = row.original.amount
        return <span>{formatVND(amount)}</span>
      },
    },
    {
      accessorKey: "bankInfo",
      header: "Thông tin ngân hàng",
      cell: ({ row }) => {
        const { bankName, bankAccountNumber, recipientName } = row.original
        return (
          <div className="space-y-1">
            <Image
              src={row.original.bankLogo}
              alt={bankName}
              width={300}
              height={300}
            />
            <div className="text-sm font-medium">{bankName}</div>
            <div className="text-xs text-muted-foreground">STK: {bankAccountNumber}</div>
            <div className="text-xs text-muted-foreground">Người nhận: {recipientName}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) => {
        return (
          <div title={row.original.note ?? "Không có ghi chú"}>
            {row.original.note ?? "Không có ghi chú"}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Lý do từ chối",
      cell: ({ row }) => {
        return row.original.reason ? (
          <div title={row.original.reason}>
            {row.original.reason}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Không có</span>
        )
      },
    },
    {
      accessorKey: "requestWithdrawalType",
      header: "Trạng thái yêu cầu",
      cell: ({ row }) => {
        const status = row.original.requestWithdrawalType
        const statusInfo = withdrawalStatusColors[status] || withdrawalStatusColors.default

        return (
          <Badge variant="outline" className={`${statusInfo.color} border-none`}>
            {statusInfo.text}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createOnUtc",
      header: "Ngày yêu cầu",
      cell: ({ row }) => {
        return formatTimeVietNam(new Date(row.original.createdOnUtc), true)
      },
    },
    {
      accessorKey: "processedAt",
      header: "Ngày xử lý",
      cell: ({ row }) => {
        return row.original.processedAt ? formatTimeVietNam(new Date(row.original.processedAt), true) : ""
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const statusValue = row.original.requestWithdrawalType as 'Pending' | 'Approved' | 'Rejected' | 'Refunded' | 'Cancelled'
        return (
          <div className="space-x-3">
            {row.original.image && (
              <ImagePreview
                iconButton={<Images />}
                images={[row.original.image]}
                className="h-26 w-26 object-fill hover:cursor-pointer"
              />
            )}
            {statusValue === "Pending" && (
              <Button
                variant="outline"
                onClick={() => handleApprove(row.original.id)}
                className="h-6 w-6 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              >
                <Check />
              </Button>
            )}
            {(statusValue === "Approved" || statusValue === "Refunded") && (
              <Button
                variant="outline"
                className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                onClick={() => setRequestWithDrawalUpdate(row.original)}
              >
                <Pencil />
              </Button>
            )}
            {statusValue === "Pending" && (
              <Button
                onClick={() => setRequestWithDrawalReject(row.original)}
                variant="outline"
                className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                <Ban />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="m-10">
      <div className="text-2xl font-semibold leading-none tracking-tight mb-6">Danh sách yêu cầu rút tiền</div>

      {isLoading ? (
        <div className="w-full">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                <CardTitle className="text-sm font-medium">Đã hoàn tất</CardTitle>
                <div className="bg-green-50 rounded-full p-3 border">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requestWithDrawalData?.value?.totalResponseWithdrawalRefunded || 0}</div>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ xác nhận</CardTitle>
                <div className="bg-blue-50 rounded-full p-3 border">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requestWithDrawalData?.value?.totalResponseWithdrawalPending || 0}</div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã xác nhận</CardTitle>
                <div className="bg-purple-50 rounded-full p-3 border">
                  <Check className="h-4 w-4 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requestWithDrawalData?.value?.totalResponseWithdrawalApproved || 0}</div>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-md cardStyle">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Đã từ chối</CardTitle>
                <div className="bg-red-50 rounded-full p-3 border">
                  <XCircle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{requestWithDrawalData?.value?.totalResponseWithdrawalRejected || 0}</div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <div className="bg-white cardStyle shadow border">
              {isLoading ? <DataTableSkeleton /> :
                <DataTableCustom data={requestWithDrawalData?.value?.requestWithdrawals ?? []} columns={columns} placeholder="tên người dùng" searchFiled="user">
                  <SelectDate />
                </DataTableCustom>}
            </div>
          </div>
        </>
      )
      }

      {requestWithDrawalUpdate && (
        <DialogRequestWithDrawal
          isOpen={!!requestWithDrawalUpdate}
          onClose={() => setRequestWithDrawalUpdate(null)}
          requestWithdrawal={requestWithDrawalUpdate}
        />

      )}

      {requestWithDrawalReject && (
        <DialogRejectRequestWithDrawal
          isOpen={!!requestWithDrawalReject}
          onClose={() => setRequestWithDrawalReject(null)}
          requestWithdrawal={requestWithDrawalReject}
        />
      )}
    </div>
  )
}

export default WithdrawalsPage

