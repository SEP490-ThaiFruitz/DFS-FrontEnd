"use client"
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import Image from "next/image"
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { ApiResponse } from '@/types/types'
import { Card, CardContent } from '@/components/ui/card'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import { formatVND } from '@/lib/format-currency'

interface ConfirmInformationProps {
    formCombo: UseFormReturn<any>
}

interface Event {
    id: string;
    name: string;
}

const ConfirmInformation = ({ formCombo }: Readonly<ConfirmInformationProps>) => {
    const { data: events } = useQuery<ApiResponse<Event[]>>({ queryKey: ["events"] })
    const formValues = formCombo.watch()
    return (

        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-medium text-gray-500">Tên gói quà</div>
                            <div className="text-base font-medium">{formValues.name || "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Số lượng</div>
                            <div className="text-base font-medium">
                                {formValues.capacity}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Loại quà</div>
                            <div className="text-base font-medium">
                                {formValues.type === "Fixed" ? "Cố định" : "Tùy chỉnh"}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Sự kiện</div>
                            <div className="text-base font-medium">
                                {events?.value?.find((event: Event) => event.id === formValues.eventId)?.name ?? "—"}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-500">Mô tả</div>
                            <div className="text-base">{formValues.description || "—"}</div>
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Ảnh</div>
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
                    Sản phẩm ({formValues.selectedProducts?.length || 0})
                </h3>

                <div className="space-y-6">
                    {formValues.selectedProducts.length > 0 ? (
                        formValues.selectedProducts.map((variant: any, index: number) => (
                            <Card key={variant.variantId} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row">
                                    <div className="relative h-48 sm:h-auto sm:w-48 md:w-60 flex-shrink-0 bg-muted/10">
                                        <ImagePreview images={[variant.image]} className="object-cover w-full h-full" />
                                    </div>
                                    <CardContent className="flex-1 p-4 md:p-6">
                                        <div className="flex flex-col h-full">
                                            <div className="mb-3">
                                                <h3 className="font-medium text-base md:text-lg">
                                                    {variant.name} - {variant.packageType}
                                                </h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mt-auto">
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground text-sm font-medium">Trọng lượng</div>
                                                    <div className="font-semibold text-lg md:text-xl text-primary">{variant.netWeight}g</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-muted-foreground text-sm font-medium">Giá</div>
                                                    <div className="font-semibold text-lg md:text-xl text-primary">{formatVND(variant.price)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="text-sm text-muted-foreground py-4 text-center border rounded-md bg-muted/5">
                            Chưa có sản phẩm nào được chọn
                        </div>
                    )}
                </div>
            </div>
        </div>

    )
}

export default ConfirmInformation
