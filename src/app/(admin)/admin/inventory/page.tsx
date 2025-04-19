"use client"

import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import Image from "next/image"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import type { ApiResponse } from "@/types/types"
import Link from "next/link"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"

interface ProductBatchItem {
    number: number
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    quantity: number
    netWeight: number
    importQuantity: number,
    exportQuantity: number,
    remainingQuantity: number,
    preservationMethod: string
    productionDate: string
    expirationDate: string
}

const InventoryPage = () => {
    const { data: products, isLoading } = useFetch<ApiResponse<ProductBatchItem[]>>("/ProductBatches/items")

    const columns: ColumnDef<ProductBatchItem>[] = [
        {
            accessorKey: "productVariantImage",
            header: "Hình ảnh",
            cell: ({ row }) => {
                const productBatchItem = row.original
                return (
                    <Link href={`/admin/product/${productBatchItem.productId}`} className="flex justify-center">
                        <Image
                            height={600}
                            width={600}
                            src={row.getValue("productVariantImage") || "/placeholder.svg"}
                            alt={row.getValue("productName")}
                            className="h-40 w-40 rounded-md object-cover"
                        />
                    </Link>
                )
            },
        },
        {
            accessorKey: "productName",
            header: "Tên sản phẩm",
            cell: ({ row }) => (
                <div>
                    {row.original.productName} - {row.original.packagingType} - {row.original.netWeight}g
                </div>
            ),
        },
        {
            accessorKey: "number",
            header: "Lô hàng",
            cell: ({ row }) => <div className="text-center">{row.getValue("number")}</div>,
        },
        {
            accessorKey: "remainingQuantity",
            header: "Số lượng",
        },
        {
            accessorKey: "preservationMethod",
            header: "Phương pháp bảo quản",
        },
        {
            accessorKey: "productionDate",
            header: "Ngày sản xuất",
            cell: ({ row }) => {
                const date = new Date(row.original.productionDate)
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "expirationDate",
            header: "Ngày hết hạn",
            cell: ({ row }) => {
                const date = new Date(row.original.expirationDate)
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "time",
            header: "Thời gian",
            cell: ({ row }) => getRemainingTime(row.original.expirationDate),
        },
    ]
    const getRemainingTime = (endDate: string) => {
        const remainingMilliseconds = new Date(endDate).getTime() - new Date().getTime()
        const remainingDays = Math.ceil(remainingMilliseconds / (1000 * 60 * 60 * 24))
        if (remainingMilliseconds <= 0)
            return <div className="px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center">Đã hết hạn</div>

        return (
            <div
                className={`px-2 py-1 w-fit rounded-md font-bold text-center ${remainingDays > 30
                    ? "bg-green-50 text-green-700"
                    : remainingDays > 15
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
            >
                {remainingDays} ngày
            </div>
        )
    }

    return (
        <div className="m-10">
            <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách sản phẩm trong kho</div>
                <div className="grid sm:grid-cols-2 gap-5">
                    <Link href={"/admin/promotion/create"}>
                        <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                            <CirclePlus className="mr-2 h-4 w-4" />
                            Tạo chương trình khuyến mãi
                        </Button>
                    </Link>
                    <Link href={"/admin/inventory/create"}>
                        <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
                            <CirclePlus className="mr-2 h-4 w-4" />
                            Tạo xuất nhập kho
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="mt-8">
                <div className="bg-white rounded-lg shadow border">
                    {isLoading ? <DataTableSkeleton /> :
                        <DataTableCustom data={products?.value ?? []} columns={columns} placeholder="tên sản phẩm" searchFiled="productName" />}
                </div>
            </div>
        </div>
    )
}

export default InventoryPage
