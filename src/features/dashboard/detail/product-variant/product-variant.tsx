"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import CardSkeleton from '@/components/global-components/custom-skeleton/card-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { calculateGrowthRate } from '@/lib/calculate'
import { formatVND } from '@/lib/format-currency'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse } from '@/types/types'
import { Banknote, MessageSquareMore, Package, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Inventory from './inventory'
import ChartProductBatch from './chart'
import ProductChart from '../product-statistic/chart'
import { PRODUCT_KEY } from '@/app/key/comm-key'

interface ProductVariant {
    productVariantId: string
    productVariantImage: string
    packagingType: string
    netWeight: number
    quantitySold: number
    revenue: number
}

interface ProductBatch {
    productBatchId: number;
    batchNumber: string;
    quantityImported: number;
    quantityRemaining: number;
    quantitySold: number;
    preservationMethod: string;
    productionDate: string;
    expirationDate: string;
}

interface ChartData {
    date: string;
    quantitySold: number;
    revenue: number;
}

interface ProductDetail {
    totalRevenue: number;
    totalQuantity: number;
    orderCount: number;
    chart: ChartData[];
    feedback: number;
    feedbacks: Feedback[];
    productBatches: ProductBatch[];
    productBatchStatistics: ProductBatchStatistic[];
}

interface Feedback {
    avatar: string
    name: string
    content: string
    images: string[]
    star: number
    createdAt: string
}

interface ProductBatchStatistic {
    number: string;
    quantitySale: number;
    quantityDamge: number;
    quantityImport: number;
    quantityReturnToSupplier: number;
    quantityExpired: number;
    quantityOther: number;
}

interface ProductVariantProps {
    productVariants: ProductVariant[]
}

function ProductVariantTab({ productVariants }: Readonly<ProductVariantProps>) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(productVariants[0]?.productVariantId || null)

    const { data: productVariantData, isLoading, refetch } = useFetch<ApiResponse<ProductDetail>>(`/Products/product-variants/${selectedVariantId}/batches/sales`, [PRODUCT_KEY.PRODUCT_VARIANT_DETAIL_STATISTIC_MANAGE], {}, { enabled: false })
    useEffect(() => {
        if (selectedVariantId === null) {
            setSelectedVariantId(productVariants[0]?.productVariantId || null)
        }
        refetch();
    }, [productVariants, selectedVariantId])

    const handleSelectVariant = (variantId: string) => {
        setSelectedVariantId(variantId)
    }

    return (
        <TabsContent value="productVariants" className="space-y-8">
            <Card className="cardStyle mt-8">
                <CardHeader>
                    <CardTitle>Biến thể sản phẩm</CardTitle>
                    <CardDescription>Chi tiết về các biến thể và số lượng bán</CardDescription>
                </CardHeader>
                <CardContent>
                    <Select value={selectedVariantId ?? ""} onValueChange={handleSelectVariant}>
                        <SelectTrigger className="w-full min-h-fit">
                            <SelectValue placeholder="Chọn phân loại" />
                        </SelectTrigger>
                        <SelectContent>
                            {productVariants.map((variant) => (
                                <SelectItem key={variant.productVariantId} value={variant.productVariantId}>
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-md border overflow-hidden h-20 w-20 flex-shrink-0">
                                            <Image
                                                src={variant.productVariantImage || "/placeholder.svg"}
                                                alt={variant.packagingType}
                                                width={1000}
                                                height={1000}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-lg font-medium">{variant.packagingType}</p>
                                            <p className="text-lg text-muted-foreground">Trọng lượng: {variant.netWeight} kg</p>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <Tabs defaultValue="overview" className="space-y-6">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="overview" className="space-y-8">
                    {isLoading ? (
                        <div className="w-full">
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                                {Array(4)
                                    .fill(0)
                                    .map((_, i) => (
                                        <CardSkeleton key={i + 1} />
                                    ))}

                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <Card className="transition-all hover:shadow-md cardStyle">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                                    <div className="bg-green-50 rounded-full p-3 border">
                                        <Banknote className="h-4 w-4 text-green-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatVND(productVariantData?.value?.totalRevenue ?? 0)}</div>
                                    <div className="mt-1">
                                        {calculateGrowthRate(productVariantData?.value?.totalRevenue ?? 0, productVariantData?.value?.totalRevenue ?? 0)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="transition-all hover:shadow-md cardStyle">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Số lượng</CardTitle>
                                    <div className="bg-blue-50 rounded-full p-3 border">
                                        <Package className="h-4 w-4 text-blue-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{productVariantData?.value?.totalQuantity ?? 0}</div>
                                    <div className="mt-1">
                                        {calculateGrowthRate(productVariantData?.value?.totalQuantity ?? 0, productVariantData?.value?.totalQuantity ?? 0)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="transition-all hover:shadow-md cardStyle">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                                    <div className="bg-purple-50 rounded-full p-3 border">
                                        <ShoppingBag className="h-4 w-4 text-purple-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{productVariantData?.value?.orderCount ?? 0}</div>
                                    <div className="mt-1">
                                        {calculateGrowthRate(productVariantData?.value?.orderCount ?? 0, productVariantData?.value?.orderCount ?? 0)}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="transition-all hover:shadow-md cardStyle">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Đánh giá</CardTitle>
                                    <div className="bg-amber-50 rounded-full p-3 border">
                                        <MessageSquareMore className="h-4 w-4 text-amber-600" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{productVariantData?.value?.feedback ?? 0}</div>
                                    <div className="mt-1">
                                        {calculateGrowthRate(productVariantData?.value?.feedback ?? 0, productVariantData?.value?.feedback ?? 0)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>)}


                    <Card className="lg:col-span-5 cardStyle">
                        <CardHeader>
                            <CardTitle>Doanh số theo thời gian</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ProductChart productCharts={productVariantData?.value?.chart ?? []} />
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-5 cardStyle">
                        <CardHeader>
                            <CardTitle>Thông tin lô</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ChartProductBatch productBatchStatistics={productVariantData?.value?.productBatchStatistics ?? []} />
                        </CardContent>
                    </Card>


                    <Card className="lg:col-span-2 cardStyle">
                        <CardHeader>
                            <CardTitle>Đánh giá gần đây</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoading ?
                                    Array(4)
                                        .fill(0)
                                        .map((_, i) => (
                                            <div key={i + 1} className="flex items-start gap-4 border-b pb-4 last:border-0">
                                                <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <Skeleton className="h-8 w-32" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <Skeleton className="h-8 w-32" />
                                                        <Skeleton className="h-8 w-32" />
                                                    </div>
                                                    <Skeleton className="h-8 w-60" />
                                                    <Skeleton className="h-8 w-32" />
                                                    <div className="flex items-center gap-8">
                                                        <Skeleton className="h-24 w-32" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    : productVariantData?.value?.feedbacks && productVariantData?.value?.feedbacks.length > 0 ? productVariantData?.value?.feedbacks.map((feedback, i) => (
                                        <div key={i + 1} className="flex items-start gap-4 border-b pb-4 last:border-0">
                                            <div className="rounded-full bg-muted h-10 w-10 flex items-center justify-center">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={feedback.avatar} alt={feedback.name} />
                                                    <AvatarFallback>{feedback.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium">{feedback.name}</p>
                                                    <div className="flex items-center">
                                                        {[...Array(5)].map((_, j) => (
                                                            <svg
                                                                key={j}
                                                                className={`h-4 w-4 ${j < feedback.star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{feedback.content}</p>
                                                <p className="text-xs text-muted-foreground">{formatTimeVietNam(new Date(feedback.createdAt), true)}</p>
                                                <div className="flex items-center gap-8">
                                                    {feedback.images.map((image, j) => (
                                                        <ImagePreview
                                                            key={j}
                                                            images={[image]}
                                                            initialHeight={200}
                                                            initialWidth={200}
                                                            className="cardStyle hover:cursor-pointer h-fit"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                                            Không có đánh giá nào
                                        </div>)}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="inventory" className="space-y-4">
                    <Inventory productBatchItems={productVariantData?.value?.productBatches ?? []} />
                </TabsContent>
            </Tabs>
        </TabsContent>
    )
}

export default ProductVariantTab