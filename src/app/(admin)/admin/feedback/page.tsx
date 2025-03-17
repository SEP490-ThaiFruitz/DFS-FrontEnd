"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { DataTable } from "@/components/global-components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import type { ApiResponse, PageResult } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Eye, EyeOffIcon, Images, Star } from "lucide-react"
import { useState } from "react"
import { hideShowFeedback } from "@/actions/feedback"

interface Feedback {
    id: string
    user: {
        userId: string
        name: string
    }
    orderId: string
    content: string | null
    stars: number
    isShow: boolean
    type: string
    productFeedback: {
        id: string
        name: string
        packageType: string
        netWeight: number
    }
    images: string[]
    createdOnUtc: string
}

function FeedbackPage() {
    const { data: feedbacks } = useFetch<ApiResponse<PageResult<Feedback>>>("/Feedbacks?pageIndex=1&pageSize=100", ["feedbacks", "manage"])

    const [feedback, setFeedback] = useState<Feedback>()
    const [isDeleteFeedback, setIsDeleteFeedback] = useState(false)

    const columns: ColumnDef<Feedback>[] = [
        {
            accessorKey: "user.name",
            header: "Khách hàng",
            cell: ({ row }) => <div>{row.original.user.name}</div>,
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: "productFeedback.name",
            header: "Sản phẩm",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate" title={row.original.productFeedback.name}>
                    {row.original.type === "Combo" ? row.original.productFeedback.name : `${row.original.productFeedback.name} ${row.original.productFeedback.packageType} ${row.original.productFeedback.netWeight}`}
                </div>
            ),
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: "stars",
            header: "Đánh giá",
            cell: ({ row }) => (
                <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            className={`w-4 h-4 ${index < row.original.stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                    ))}
                </div>
            ),
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: "content",
            header: "Nội dung",
            cell: ({ row }) => (
                <div className="max-w-[250px] truncate" title={row.original.content ?? ""}>
                    {row.original.content ?? "Không có nội dung"}
                </div>
            ),
            enableSorting: false,
            enableColumnFilter: true,
        },
        {
            accessorKey: "isShow",
            header: "Trạng thái",
            cell: ({ row }) => (
                <Badge variant={row.original.isShow ? "default" : "secondary"}>{row.original.isShow ? "Hiển thị" : "Ẩn"}</Badge>
            ),
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: "createdOnUtc",
            header: "Ngày tạo",
            cell: ({ row }) => <div>{formatTimeVietNam(new Date(row.original.createdOnUtc), true)}</div>,
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.images && row.original.images.length > 0 && (
                        <ImagePreview
                            iconButton={<Images />}
                            images={row.original.images}
                            className="h-26 w-26 object-fill hover:cursor-pointer"
                        />

                    )}
                    {row.original.isShow ? <Button
                        onClick={() => {
                            setIsDeleteFeedback(!isDeleteFeedback);
                            setFeedback(row.original)
                        }}
                        variant="outline"
                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <EyeOffIcon />
                    </Button> : <Button
                        onClick={() => {
                            setIsDeleteFeedback(!isDeleteFeedback);
                            setFeedback(row.original)
                        }}
                        variant="outline"
                        className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    >
                        <Eye />
                    </Button>}
                </div>
            ),
        },
    ]

    return (
        <div className="m-10">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>
            </div>

            <DataTable data={feedbacks?.value?.items ?? []} columns={columns} searchFiled="content" />

            <DeleteDialog
                id={feedback?.id ?? ""}
                isOpen={isDeleteFeedback}
                onClose={() => setIsDeleteFeedback(false)}
                name=""
                message={feedback?.isShow ? "Ẩn" : "Hiện"}
                content={`Bạn có chắc chắn muốn ${feedback?.isShow ? "ẩn" : "hiện"} đánh giá này không?`}
                deleteFunction={hideShowFeedback}
                refreshKey={[["feedbacks", "manage"]]}
            />
        </div>
    )
}

export default FeedbackPage