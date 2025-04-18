"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { formatVND } from "@/lib/format-currency"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useState } from "react"
import ViewDetail from "./view-detail"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { PAYMENT_KEY } from "@/app/key/admin-key"

interface Transaction {
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

const PaymentPage = () => {
    const {
        data: payments,
        isLoading,
    } = useFetch<ApiResponse<Transaction[]>>(`/Payments/history`, [PAYMENT_KEY.PAYEMNT])
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);

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

    const columns: ColumnDef<Transaction>[] = [
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
            <div className="text-2xl font-semibold leading-none tracking-tight mb-6">Danh sách giao dịch</div>
            <div className="mt-8 bg-white rounded-lg shadow border">
                {isLoading ? <DataTableSkeleton /> :
                    <DataTableCustom
                        data={payments?.value ?? []} columns={columns} searchFiled="transactionNo" placeholder="mã giao dịch"
                    />
                }
            </div>
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

