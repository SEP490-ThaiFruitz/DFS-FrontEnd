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
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { FEEDBACK_KEY } from "@/app/key/admin-key"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

interface Feedback {
    id: string
    user: {
        userId: string
        name: string
        avatar: string
    }
    orderId: string
    content: string | null
    stars: number
    isShow: boolean
    type: string
    productFeedback: {
        id: string
        name: string
        image: string | null
        customImages: string[] | null
        packageType: string
        netWeight: number
    }
    images: string[]
    createdOnUtc: string
}

function FeedbackPage() {
    const { data: feedbacks, isLoading } = useFetch<ApiResponse<PageResult<Feedback>>>("/Feedbacks", [FEEDBACK_KEY.FEEDBACK])

    const [feedback, setFeedback] = useState<Feedback>()
    const [isDeleteFeedback, setIsDeleteFeedback] = useState(false)

    const columns: ColumnDef<Feedback>[] = [
        {
            accessorKey: "productFeedback.name",
            header: "Sản phẩm",
            size: 130,
            cell: ({ row }) =>
            (
                <div>
                    {row.original.productFeedback.image !== null ? <Image
                        className="h-40 w-full"
                        src={row.original.productFeedback.image}
                        alt={row.original.productFeedback.name}
                        height={500}
                        width={500}
                    /> : row.original.productFeedback.customImages !== null && <div className="size-20 relative rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shadow-sm group mr-4">
                        {/* Main image */}
                        <div className="absolute inset-0 z-10">
                            <Image
                                src={row.original.productFeedback.customImages[0] || "/placeholder.svg"}
                                alt={`main-thumbnail-image`}
                                width={80}
                                height={80}
                                sizes="(max-width: 640px) 80px, 128px"
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                priority={true}
                                loading="eager"
                                quality={85}
                            />
                            {/* Subtle overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Thumbnail stack */}
                        {row.original.productFeedback.customImages.length > 1 && (
                            <div className="absolute right-1 bottom-1 z-20 flex flex-col-reverse gap-1">
                                {row.original.productFeedback.customImages.slice(1, 3).map((image, index) => (
                                    <div
                                        key={index}
                                        className="h-7 w-7 rounded-sm overflow-hidden border border-white/70 shadow-sm"
                                        style={{
                                            transform: `translateX(${index * -3}px)`,
                                            zIndex: 30 - index,
                                        }}
                                    >
                                        <div className="relative h-full w-full">
                                            <Image
                                                src={image || "/placeholder.svg"}
                                                alt={`product item  ${index + 1}`}
                                                // fill
                                                // className="object-cover"
                                                // sizes="28px"
                                                width={96}
                                                height={0}
                                                sizes="(max-width: 640px) 96px, 128px"
                                                className="w-24 h-full object-cover transition-transform group-hover:scale-105"
                                                priority={true}
                                                loading="eager"
                                                quality={85}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Item count indicator (if more than 3 items) */}
                        {row.original.productFeedback.customImages.length > 3 && (
                            <div className="absolute left-1 bottom-1 z-20">
                                <div className="bg-white/90 backdrop-blur-sm text-[10px] font-medium rounded-sm px-1 shadow-sm">
                                    +{row.original.productFeedback.customImages.length - 3}
                                </div>
                            </div>
                        )}
                    </div>}
                    <div className="mt-3">
                        <div className="font-medium">{row.original.productFeedback.name}</div>
                        {row.original.type !== "Combo" && (
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-muted-foreground">{row.original.productFeedback.packageType}</div>
                                <span>•</span>
                                <div className="text-sm text-muted-foreground">{row.original.productFeedback.netWeight} g</div>
                            </div>
                        )}
                    </div>
                </div>
            ),
            enableSorting: true,
            enableColumnFilter: true,
        },
        {
            accessorKey: "user.name",
            header: "Khách hàng",
            cell: ({ row }) =>
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={row.original.user.avatar} alt={row.original.user.name} />
                        <AvatarFallback>{row.original.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{row.original.user.name}</p>
                    </div>
                </div>,
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
                <div
                    className="max-w-[250px] whitespace-pre-wrap break-words"
                    title={row.original.content ?? ""}
                >
                    {row.original.content ?? "Không có nội dung"}
                </div>
            ),
            enableSorting: false,
            enableColumnFilter: true,
        },
        {
            accessorKey: "isShow",
            header: "Trạng thái",
            cell: ({ row }) =>
                row.original.isShow ? (
                    <div className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg">Đang hiện</div>
                ) : (
                    <div className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">Đã ẩn</div>
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
            header: "Hành động",
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
            <h1 className="text-2xl font-bold">Quản lý đánh giá</h1>

            <div className="mt-8 bg-white rounded-lg shadow border">
                {isLoading ? <DataTableSkeleton /> : <DataTableCustom placeholder="nội dung" data={feedbacks?.value?.items ?? []} columns={columns} searchFiled="content" />}
            </div>

            <DeleteDialog
                id={feedback?.id ?? ""}
                isOpen={isDeleteFeedback}
                onClose={() => setIsDeleteFeedback(false)}
                name=""
                message={feedback?.isShow ? "Ẩn" : "Hiện"}
                content={`Bạn có chắc chắn muốn ${feedback?.isShow ? "ẩn" : "hiện"} đánh giá này không?`}
                deleteFunction={hideShowFeedback}
                refreshKey={[[FEEDBACK_KEY.FEEDBACK]]}
            />
        </div>
    )
}

export default FeedbackPage