"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TabsContent } from '@/components/ui/tabs'
import Image from 'next/image'
import React, { useState } from 'react'

interface ProductVariant {
    productVariantId: string
    productVariantImage: string
    packagingType: string
    netWeight: number
    quantitySold: number
    revenue: number
}

interface ProductVariantProps {
    productVariants: ProductVariant[]
}

function ProductVariantTab({ productVariants }: Readonly<ProductVariantProps>) {
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(productVariants[0]?.productVariantId || null) 

    const handleSelectVariant = (variantId: string) => {
        setSelectedVariantId(variantId)
        console.log("Selected variant ID:", variantId)
    }

    return (
        <TabsContent value="productVariants" className="space-y-4">
            <Card className="cardStyle">
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
        </TabsContent>
    )
}

export default ProductVariantTab