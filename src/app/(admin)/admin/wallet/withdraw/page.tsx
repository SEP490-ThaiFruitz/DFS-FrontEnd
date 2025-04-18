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
import type { ApiResponse, PageResult } from "@/types/types"
import { useQueryClient } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Check, Images, Pencil, Ban } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import DialogRequestWithDrawal from "./update-dialog"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import DialogRejectRequestWithDrawal from "./reject-dialog"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"

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

const WithdrawalsPage = () => {
  const { data: requestWithDrawalData, isLoading } = useFetch<ApiResponse<PageResult<RequestWithDrawal>>>(
    `/Wallets/request-withdrawal?pageIndex=1&pageSize=10000`,
    [WALLET_KEY.REQUEST_WITHDRAWAL],
  )
  const [requestWithDrawalUpdate, setRequestWithDrawalUpdate] = useState<RequestWithDrawal | null>(null)
  const [requestWithDrawalReject, setRequestWithDrawalReject] = useState<RequestWithDrawal | null>(null)

  const withdrawalStatusColors: Record<string, { color: string; text: string }> = {
    Pending: { color: "bg-yellow-100 text-yellow-800", text: "Đang chờ" },
    Approved: { color: "bg-green-100 text-green-800", text: "Đã duyệt" },
    Rejected: { color: "bg-orange-100 text-orange-800", text: "Đã từ chối" },
    Refunded: { color: "bg-blue-100 text-blue-800", text: "Đã hoàn tiền" },
    Cancelled: { color: "bg-red-100 text-red-800", text: "Đã hủy" },
    default: { color: "bg-gray-100 text-gray-800", text: "Không xác định" },
  }

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
        return <span className="font-medium text-red-500">{formatVND(amount)}</span>
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
          <div className="max-w-[200px] truncate" title={row.original.note ?? "Không có ghi chú"}>
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
          <div className="max-w-[200px] truncate text-red-500" title={row.original.reason}>
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
            {statusValue === "Approved" || statusValue === "Refunded" && (
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

      <div className="mt-8">
        <div className="bg-white rounded-lg shadow border">
          {isLoading ? <DataTableSkeleton /> :
            <DataTableCustom data={requestWithDrawalData?.value?.items ?? []} columns={columns} placeholder="nội dung" searchFiled="note" />}
        </div>
      </div>

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

