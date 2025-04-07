"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatVND } from '@/lib/format-currency'
import { ApiResponse } from '@/types/types'
import { AlertTriangle, CirclePlusIcon, Pencil, X } from 'lucide-react'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import FormVariant from './create-form-variant'

export interface PackagingType {
    id: string
    name: string
    packagingType: string
    packagingMaterial: string
    description: string
}

interface VariantProps {
    formProduct: UseFormReturn<any>
}


const Variant = ({ formProduct }: Readonly<VariantProps>) => {
    const { data: packageTypes } = useFetch<ApiResponse<PackagingType[]>>("/PackagingSpecifications", ["packaging-types"])
    const [isOpen, setIsOpen] = React.useState(false)
    const [selectedVariant, setSelectedVariant] = React.useState<any>(null)

    const handleDelete = (indexDelete: number) => {
        const variants = formProduct.getValues("productVariants");
        const newVariants = variants.filter((_: any, index: number) => index !== indexDelete);
        formProduct.setValue("productVariants", newVariants);
    };
    return (
        <div>
            {formProduct.watch("productVariants") && formProduct.getValues("productVariants").map((variant: any, index: number) => (
                <Card key={index + 1} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6">
                    <div className="flex flex-col sm:flex-row">
                        <div className="relative h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                            <ImagePreview
                                images={[variant.image[0]?.preview]}
                                className="object-cover h-full"
                            />
                            {variant.stockQuantity <= variant.reOrderPoint && (
                                <div className="absolute top-3 right-3">
                                    <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1 font-medium">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                        Tồn kho thấp
                                    </Badge>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4 md:p-6 flex-1">
                            <div className="flex flex-col h-full">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                                    <h3 className="font-medium text-lg">
                                        {packageTypes?.value?.find(x => x.id === variant.packagingTypeId)?.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            className="border"
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedVariant({ id: index, ...variant })
                                                setIsOpen(true)
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button onClick={() => handleDelete(index)} className="border" type="button" size="sm" variant="ghost">
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mt-2">
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Kích thước</div>
                                        <div className="flex items-center">
                                            {variant.packagingLength} × {variant.packagingWidth} × {variant.packagingHeight} cm
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                        <div className="flex items-center space-x-2">
                                            <div>Tịnh: {variant.netWeight}g</div>
                                            <div className="text-muted-foreground">|</div>
                                            <div>Tổng: {variant.grossWeight}g</div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Tồn kho</div>
                                        <div>
                                            {variant.stockQuantity}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Điểm cảnh báo</div>
                                        <div>{variant.reOrderPoint}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Cách bảo quản</div>
                                        <div>{variant.preservationMethod}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Hạn sử dụng</div>
                                        <div>{variant.shelfLife}</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Giá</div>
                                        <div className="font-semibold text-xl text-primary">{formatVND(variant.price)}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            ))}
            <button
                type='button' onClick={() => setIsOpen(true)}
                className={`text-center border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
            >
                <div className="flex items-center sm:p-5 space-x-5 font-bold">
                    <CirclePlusIcon />
                    <span>Thêm mới</span>
                </div>
            </button>
            {formProduct.formState.errors.productVariants && (
                <div className="text-sm text-red-500 mt-1">{formProduct.formState.errors.productVariants.message as string}</div>
            )}
            <FormVariant
                formProduct={formProduct}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                    setSelectedVariant(null)
                }}
                selectedVariant={selectedVariant}
            />
        </div>
    )
}

export default Variant