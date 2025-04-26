import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import DialogProduct from './dialog-product'
import { Card, CardContent } from '@/components/ui/card'
import ImagePreview from '@/components/custom/_custom-image/image-preview'

import { Button } from '@/components/ui/button'
import { CirclePlusIcon, X } from 'lucide-react'
import { formatVND } from '@/lib/format-currency'


interface SellectProductVariantProps {
    formCombo: UseFormReturn<any>
}


const SellectProductVariant = ({ formCombo }: Readonly<SellectProductVariantProps>) => {
    const [isOpen, setIsOpen] = React.useState(false)

    const handleDelete = (indexDelete: number) => {
        const variants = formCombo.getValues("selectedProducts");
        const newVariants = variants.filter((_: any, index: number) => index !== indexDelete);
        formCombo.setValue("selectedProducts", newVariants);
    };
    return (
        <div>
            {formCombo.watch("selectedProducts") && formCombo.getValues("selectedProducts").map((variant: any, index: number) => (
                <Card key={variant.variantId} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6">
                    <div className="flex flex-col sm:flex-row">
                        <div className="h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                            <ImagePreview
                                images={[variant.image]}
                                className="object-cover h-40"
                            />
                        </div>
                        <CardContent className="p-4 md:p-6 flex-1">
                            <div className="flex flex-col h-full">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                                    <h3 className="font-medium text-lg">
                                        {variant.name} - {variant.packageType}
                                    </h3>
                                    <Button onClick={() => handleDelete(index)} className="border" type="button" size="sm" variant="ghost">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 text-sm mt-2">
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                        <div className="font-semibold text-xl text-primary">{variant.netWeight}g</div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="text-muted-foreground font-medium">Số lượng</div>
                                        <div className="font-semibold text-xl text-primary">{variant.quantity}</div>
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
                    <span>Thêm</span>
                </div>
            </button>
            {formCombo.formState.errors.selectedProducts && (
                <div className="text-sm text-red-500 mt-1">{formCombo.formState.errors.selectedProducts.message as string}</div>
            )}
            <DialogProduct
                form={formCombo}
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false)
                }}
            />
        </div>
    )
}

export default SellectProductVariant
