"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { DataTable } from "@/components/global-components/data-table/data-table"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatVND } from "@/lib/format-currency"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useState } from "react"
import ViewDetail from "./view-detail"

interface Transaction {
    transactionNo?: string | null
    orderId: string
    content: string
    amount: number
    type: string
    status: string
    createdOnUtc: Date,
    
}

const PaymentPage = () => {
    const {
        data: payments,
        isLoading,
    } = useFetch<ApiResponse<Transaction[]>>(`/Payments/history`, ["transactions"])
    const [transaction, setTransaction] = useState<Transaction | undefined>(undefined);
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "fail":
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "Paid":
                return "Đã thanh toán"
            case "Pending":
                return "Chờ thanh toán"
            default:
                return "Thất bại"
        }
    }

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "transactionNo",
            header: "Mã giao dịch",
        },
        {
            accessorKey: "orderId",
            header: "Mã đơn hàng",
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
            accessorKey: "type",
            header: "Loại",
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{
                getStatusText(row.original.status)
            }</Badge>,
        },
        {
            accessorKey: "createdOnUtc",
            header: "Ngày tạo",
            cell: ({ row }) => formatTimeVietNam(row.original.createdOnUtc, true),
        },
        {
            accessorKey: "action",
            header: "",
            cell: ({ row }) =>
                row.original.transactionNo !== "" && row.original.type !== "ShipCode" &&
                <Button
                    variant="outline"
                    onClick={() => setTransaction(row.original)}
                    className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                >
                    <Eye />
                </Button>,

        },
    ]

    if (isLoading) {
        return (
            <div className="m-10 space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-2">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                        ))}
                </div>
            </div>
        )
    }

    return (
        <div className="m-10">
            <div className="text-2xl font-semibold leading-none tracking-tight mb-6">Danh sách giao dịch</div>

            <DataTable data={payments?.value ?? []} columns={columns} searchFiled="transactionNo" />
            {transaction && (
                <ViewDetail
                    isOpen={transaction !== undefined}
                    onClose={() => setTransaction(undefined)}
                    orderId={transaction.orderId}
                    paymentMethod={transaction.type}
                />
            )}
        </div>
    )
}

export default PaymentPage

