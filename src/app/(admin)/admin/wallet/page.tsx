"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { WALLET_KEY } from '@/app/key/admin-key'
import { DataTableSkeleton } from '@/components/global-components/custom-skeleton/data-table-skeleton'
import { DataTableCustom } from '@/components/global-components/data-table/data-table-custom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatVND } from '@/lib/format-currency'
import { formatVietnamesePhoneNumber } from '@/lib/format-phone-number'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse, PageResult } from '@/types/types'
import { ColumnDef } from '@tanstack/react-table'
import React from 'react'


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
const WalletPage = () => {
    const {
        data: wallletTransactions,
        isLoading
    } = useFetch<ApiResponse<PageResult<WallletTransaction>>>(`/Wallets?pageIndex=1&pageSize=10000`, [WALLET_KEY.WALLET_TRANSACTION])

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
                const amount = row.original.amount
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
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow border">
                    {isLoading ? <DataTableSkeleton /> :
                        <DataTableCustom data={wallletTransactions?.value?.items ?? []} columns={columns} placeholder="nội dung" searchFiled="content" />}
                </div>
            </div>
        </div>
    )
}

export default WalletPage
