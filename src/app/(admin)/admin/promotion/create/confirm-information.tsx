"use client"
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import Image from "next/image"
import { format } from "date-fns"
import { Separator } from '@/components/ui/separator'

interface ConfirmInformationProps {
    form: UseFormReturn<any>
}

const ConfirmInformation = ({ form }: Readonly<ConfirmInformationProps>) => {
    const formValues = form.watch()
    return (

        <div className="space-y-8">
            {/* Promotion Information */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Tên khuyến mãi</div>
                            <div className="text-base font-medium">{formValues.name || "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Phần trăm giảm giá</div>
                            <div className="text-base font-medium">
                                {formValues.percentage ? `${formValues.percentage}%` : "—"}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Mô tả</div>
                            <div className="text-base">{formValues.description || "—"}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm font-medium text-gray-500">Ngày bắt đầu</div>
                                <div className="text-base font-medium">
                                    {formValues.startDate ? format(formValues.startDate, "dd/MM/yyyy") : "—"}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-500">Ngày kết thúc</div>
                                <div className="text-base font-medium">
                                    {formValues.endDate ? format(formValues.endDate, "dd/MM/yyyy") : "—"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Ảnh khuyến mãi</div>
                        {formValues.image ? (
                            <div className="border rounded-md overflow-hidden w-full max-w-xs h-48 relative">
                                <Image
                                    src={formValues.image[0].preview || "/images/dried-fruit.webp"}
                                    alt="Promotion image"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="border rounded-md w-full max-w-xs h-48 flex items-center justify-center bg-gray-50">
                                <div className="text-gray-400">Không có ảnh</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Selected Products */}
            <div>
                <h3 className="text-lg font-semibold mb-4">
                    Sản phẩm được áp dụng ({formValues.selectedProducts?.length || 0})
                </h3>

                {formValues.selectedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {formValues.selectedProducts.map((product: any) => (
                            <div key={product.productId} className="bg-background p-3 rounded-md border">
                                <div className="flex items-center gap-2 mb-2">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.name}
                                        width={30}
                                        height={30}
                                        className="rounded-md object-cover"
                                    />
                                    <span className="font-medium text-sm truncate">{product.name}</span>
                                </div>

                                <div className="pl-2 space-y-1">
                                    {product.variants.map((variant: any) => (
                                        <div key={variant.variantId} className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                {variant.packageType} - {variant.netWeight}g
                                            </span>
                                            <span>SL: {variant.quantity || 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">Chưa có sản phẩm nào được chọn</div>
                )}
            </div>
        </div>

    )
}

export default ConfirmInformation
