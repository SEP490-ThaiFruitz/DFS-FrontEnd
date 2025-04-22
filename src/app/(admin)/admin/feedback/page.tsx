"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Button } from "@/components/ui/button"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import type { ApiResponse, PageResult } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, Eye, EyeOff, EyeOffIcon, Gauge, Images, PieChart, Star, ThumbsUp } from "lucide-react"
import { useState } from "react"
import { hideShowFeedback } from "@/actions/feedback"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { FEEDBACK_KEY } from "@/app/key/admin-key"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { STATUS_HIDDEN_SELECT } from "@/features/admin/admin-lib/admin-lib"
import CardSkeleton from "@/components/global-components/custom-skeleton/card-skeleton"

interface FeedbackResponse {
    feedbackResponse: PageResult<Feedback>
    feedbackStatistic: FeedbackStatistic
    rating: Rating[]
}

interface FeedbackStatistic {
    totalFeedback: number
    average: number
    positive: number
    hide: number
}

interface Rating {
    stars: number
    count: number
    percentage: number
}
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
    const { data: feedbacks, isLoading } = useFetch<ApiResponse<FeedbackResponse>>("/Feedbacks", [FEEDBACK_KEY.FEEDBACK])

    const [feedback, setFeedback] = useState<Feedback>()
    const [isDeleteFeedback, setIsDeleteFeedback] = useState(false)
    const [seletedOption, setSeletedOption] = useState<string>("All")

    const filterFeedbacks = feedbacks?.value?.feedbackResponse.items.filter((feedback) => {
        if (seletedOption === "All") return true
        if (seletedOption === "Active") return feedback.isShow
        if (seletedOption === "IsDeleted") return !feedback.isShow
    })

    const columns: ColumnDef<Feedback>[] = [
        {
            accessorKey: "productFeedback.name",
            header: "Sản phẩm",
            size: 300,
            cell: ({ row }) =>
            (
                <div className="flex items-center gap-3">
                    {row.original.productFeedback.image !== null ? <Image
                        className="h-40 w-40"
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
            size: 90,
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
            size: 90,
            cell: ({ row }) =>
                row.original.isShow ? (
                    <div className="bg-green-50 text-green-600 font-semibold w-fit py-1 px-2 rounded-lg">Đang hiện</div>
                ) : (
                    <div className="bg-red-50 text-red-600 font-semibold w-fit py-1 px-2 rounded-lg">Đã ẩn</div>
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

            {isLoading ? (
                <div className="w-full mt-8">
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4">
                        {Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <CardSkeleton key={i + 1} />
                            ))}

                    </div>
                    <div className="mt-8">
                        <Card className="card bg-white shadow border cardStyle">
                            <CardHeader>
                                <CardTitle>
                                    <Skeleton className="h-4 w-24" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index + 1} className="flex items-center">
                                            <Skeleton className="w-12 h-4 text-sm font-medium" />
                                            <Skeleton className="w-full h-4" />
                                            <Skeleton className="w-12 h-4 text-right text-sm font-medium" />
                                            <Skeleton className="w-16 h-4 text-right text-sm text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8">
                        <DataTableSkeleton />
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid gap-8 md:gap-16 md:grid-cols-2 lg:grid-cols-4 mt-10">
                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Tổng đánh giá</CardTitle>
                                <div className="bg-green-50 rounded-full p-3 border">
                                    <PieChart className="h-4 w-4 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{feedbacks?.value?.feedbackStatistic.totalFeedback ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Trung bình đánh giá</CardTitle>
                                <div className="bg-blue-50 rounded-full p-3 border">
                                    <Gauge className="h-4 w-4 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{feedbacks?.value?.feedbackStatistic.average ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Đánh giá tích cực</CardTitle>
                                <div className="bg-purple-50 rounded-full p-3 border">
                                    <ThumbsUp className="h-4 w-4 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{feedbacks?.value?.feedbackStatistic.positive ?? 0}</div>
                            </CardContent>
                        </Card>

                        <Card className="transition-all hover:shadow-md cardStyle">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Đã ẩn</CardTitle>
                                <div className="bg-amber-50 rounded-full p-3 border">
                                    <EyeOff className="h-4 w-4 text-amber-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{feedbacks?.value?.feedbackStatistic.hide ?? 0}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8">
                        <Card className="card bg-white shadow border cardStyle">
                            <CardHeader>
                                <CardTitle>Tỉ lệ đánh giá</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {feedbacks?.value?.rating?.map((item) => (
                                        <div key={item.stars} className="flex items-center">
                                            <div className="w-12 text-sm font-medium">{item.stars} sao</div>
                                            <div className="w-full">
                                                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                                                    <div className="h-full bg-yellow-400" style={{ width: `${item.percentage}%` }} />
                                                </div>
                                            </div>
                                            <div className="w-12 text-right text-sm font-medium">{item.count}</div>
                                            <div className="w-16 text-right text-sm text-muted-foreground">{item.percentage}%</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="mt-8 bg-white cardStyle shadow border">
                        <DataTableCustom placeholder="nội dung" data={filterFeedbacks ?? []} columns={columns} searchFiled="content" >
                            <div className='flex items-center justify-end pr-4'>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="min-w-fit justify-between sm:w-auto">
                                            {STATUS_HIDDEN_SELECT[seletedOption]}
                                            <ChevronDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem onClick={() => setSeletedOption("All")}>Tất cả</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSeletedOption("Active")}>Đang hiện</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setSeletedOption("IsDeleted")}>Đã ẩn</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </DataTableCustom>
                    </div>
                </>
            )
            }


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
        </div >
    )
}

export default FeedbackPage