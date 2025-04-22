"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { Button } from "@/components/ui/button"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, CirclePlus, Trash2, RotateCw } from "lucide-react"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import Link from "next/link"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { useState } from "react"
import { API } from "@/actions/client/api-config"
import { PROMOTION_KEY } from "@/app/key/admin-key"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"

interface Promotion {
    id: string
    name: string
    image: string
    description: string
    percentage: number
    totalQuantity: number
    totalQuantitySold: number
    totalProduct: number
    startDate: string
    endDate: string
    createdOnUtc: string
    modifiedOnUtc: string | null
    isDeleted: boolean
}

const PromotionPage = () => {
    const { data: promotions, isLoading } = useFetch<ApiResponse<Promotion[]>>("/Promotions/manage", [PROMOTION_KEY.LIST_PROMOTION])
    const [promotion, setPromotion] = useState<Promotion | undefined>(undefined)

    const columns: ColumnDef<Promotion>[] = [
        {
            accessorKey: "name",
            header: "Tên khuyến mãi",
            cell: ({ row }) => (
                <span className="font-medium">{row.original.name}</span>
            ),
        },
        {
            accessorKey: "percentage",
            header: "Phần trăm",
            cell: ({ row }) => (
                <div >
                    {row.original.percentage}%
                </div>
            ),
        },
        {
            accessorKey: "totalQuantitySold",
            header: "Đã bán/Tổng",
            cell: ({ row }) => (
                <div>
                    {row.original.totalQuantitySold}/{row.original.totalQuantity}
                </div>
            ),
        },
        {
            accessorKey: "totalProduct",
            header: "Số sản phẩm",
            cell: ({ row }) => row.original.totalProduct,
        },
        {
            accessorKey: "startDate",
            header: "Ngày bắt đầu",
            cell: ({ row }) => formatTimeVietNam(new Date(row.original.startDate), true),
        },
        {
            accessorKey: "endDate",
            header: "Ngày kết thúc",
            cell: ({ row }) => formatTimeVietNam(new Date(row.original.endDate), true),
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const isActive = !row.original.isDeleted
                return isActive ? (
                    <div className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg">Hoạt động</div>
                ) : (
                    <div className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">Đã ẩn</div>
                )
            },
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Link href={`/admin/promotion/${row.original.id}`}>
                            <Button
                                variant="outline"
                                className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                            >
                                <Eye />
                            </Button></Link>
                        {
                            !row.original.isDeleted ? <Button
                                variant="outline"
                                className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => setPromotion(row.original)}
                            >
                                <Trash2 />
                            </Button> :
                                <Button
                                    variant="outline"
                                    className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                    onClick={() => setPromotion(row.original)}
                                >
                                    <RotateCw />
                                </Button>
                        }
                    </div >
                )
            },
        },
    ]
    const removePromotion = async (id: string) => {
        return await API.remove(`/Promotions/${id}`)
    }

    return (
        <div className="m-10">
            <div className='flex justify-between items-center'>
                <div className='text-2xl font-semibold leading-none tracking-tight'>Chương trình khuyến mãi</div>
                <Link href="/admin/promotion/create">
                    <Button size={"sm"} className='text-white bg-sky-600 hover:bg-sky-700'>
                        <CirclePlus />
                        Tạo mới
                    </Button>
                </Link>
            </div>
            <div className="mt-8">
                {isLoading ? <DataTableSkeleton /> :
                    <div className="bg-white cardStyle shadow border">
                        <DataTableCustom
                            data={promotions?.value ?? []}
                            columns={columns}
                            placeholder="tên chương trình"
                            searchFiled="name"
                        />
                    </div>
                }
            </div>

            <DeleteDialog
                id={promotion?.id ?? ""}
                isOpen={promotion !== undefined}
                onClose={() => setPromotion(undefined)}
                name={promotion?.name}
                message={promotion?.isDeleted === false ? "Ẩn" : "Hiện"}
                deleteFunction={removePromotion}
                refreshKey={[[PROMOTION_KEY.LIST_PROMOTION]]}
            />
        </div>
    )
}

export default PromotionPage

