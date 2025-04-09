"use client"

import { Button } from "@/components/ui/button"
import { CirclePlus } from "lucide-react"
import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/global-components/data-table/data-table"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import Image from "next/image"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { ApiResponse } from "@/types/types"

interface ProductBatchItem {
    number: number
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    quantity: number
    netWeight: number
    preservationMethod: string
    productionDate: string
    expiredDate: string
}

const InventoryPage = () => {
    const {data: products} = useFetch<ApiResponse<ProductBatchItem[]>>("/ProductBatches/items")

    const columns: ColumnDef<ProductBatchItem>[] = [
        {
            accessorKey: "productVariantImage",
            header: "Hình ảnh",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <Image
                        height={600}
                        width={600}
                        src={row.getValue("productVariantImage")}
                        alt={row.getValue("productName")}
                        className="h-40 w-40 rounded-md object-cover"
                    />
                </div>
            ),
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
            accessorKey: "quantity",
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
                const date = new Date(row.getValue("productionDate"))
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "expiredDate",
            header: "Ngày hết hạn",
            cell: ({ row }) => {
                const date = new Date(row.getValue("expiredDate"))
                return <div>{formatTimeVietNam(date)}</div>
            },
        },
        {
            accessorKey: "time",
            header: "Thời gian",
            cell: ({ row }) => getRemainingTime(row.original.expiredDate),
        }
    ]
    const getRemainingTime = (endDate: string) => {
        const remainingMilliseconds =
            new Date(endDate).getTime() - new Date().getTime();
        const remainingDays = Math.ceil(
            remainingMilliseconds / (1000 * 60 * 60 * 24)
        );
        if (remainingMilliseconds <= 0)
            return (
                <div className="px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center">
                    Đã hết hạn
                </div>
            );

        return (
            <div
                className={`px-2 py-1  w-fit rounded-md font-bold text-center ${remainingDays > 3
                    ? "bg-green-50 text-green-700 "
                    : "bg-yellow-50 text-yellow-700 "
                    }`}
            >
                {remainingDays} ngày
            </div>
        );
    };

    return (
        <div className="m-10">
            <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách sản phẩm trong kho</div>
                <Button size={"sm"} className="text-white bg-green-500 hover:bg-green-600">
                    <CirclePlus className="mr-2 h-4 w-4" />
                    Thêm sản phẩm
                </Button>
            </div>

            <DataTable data={products?.value ?? []} columns={columns} searchFiled="productName" />
        </div>
    )
}

export default InventoryPage

