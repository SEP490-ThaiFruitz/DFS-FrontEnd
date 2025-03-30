"use client"

import { useEffect } from "react"
import type { PackagingType } from "./variant"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductVariantSafeTypes } from "@/zod-safe-types/product-safe-types"
import { useForm, UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { FormValues } from "@/components/global-components/form/form-values"
import { FormFileControl } from "@/components/global-components/form/form-file-control"
import { FormNumberInputControl } from "@/components/global-components/form/form-number-control"
import { FormInputControl } from "@/components/global-components/form/form-input-control"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { FormSelectControl, SelectData } from "@/components/global-components/form/form-select-control"
import { ApiResponse } from "@/types/types"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FormVariantProps {
    isOpen: boolean
    onClose: () => void
    selectedVariant: any | undefined
    formProduct: UseFormReturn<any>
}

function FormVariant({ isOpen, onClose, selectedVariant, formProduct }: Readonly<FormVariantProps>) {
    const { data: packageTypes } = useFetch<ApiResponse<PackagingType[]>>("/PackagingSpecifications", ["packaging-types"])

    const titleText = selectedVariant ? "Cập nhật biến thể" : "Thêm biến thể mới"
    const buttonText = selectedVariant ? "Cập nhật" : "Thêm mới"

    const selectExpiredDates: SelectData[] = [
        { id: 1, name: "3 ngày" },
        { id: 2, name: "7 ngày" },
        { id: 3, name: "10 ngày" },
        { id: 4, name: "15 ngày" },
        { id: 5, name: "1 tháng" },
        { id: 6, name: "20 ngày" },
        { id: 7, name: "2 tháng" },
        { id: 8, name: "3 tháng" },
        { id: 9, name: "1 năm" },
        { id: 10, name: "2 năm" },
    ];

    const form = useForm<z.infer<typeof ProductVariantSafeTypes>>({
        resolver: zodResolver(ProductVariantSafeTypes),
        defaultValues: {
            image: undefined,
            netWeight: "",
            grossWeight: "",
            packagingLength: "",
            packagingWidth: "",
            packagingHeight: "",
            shelfLife: "",
            preservationMethod: "",
            price: "",
            stockQuantity: "",
            reOrderPoint: "",
            packagingTypeId: "",
        },
    })

    useEffect(() => {
        if (selectedVariant) {
            form.reset({
                image: selectedVariant.image,
                netWeight: selectedVariant.netWeight.toString(),
                grossWeight: selectedVariant.grossWeight.toString(),
                packagingLength: selectedVariant.packagingLength.toString(),
                packagingWidth: selectedVariant.packagingWidth.toString(),
                packagingHeight: selectedVariant.packagingHeight.toString(),
                shelfLife: selectedVariant.shelfLife.toString(),
                preservationMethod: selectedVariant.preservationMethod,
                price: selectedVariant.price.toString(),
                stockQuantity: selectedVariant.stockQuantity.toString(),
                reOrderPoint: selectedVariant.reOrderPoint.toString(),
                packagingTypeId: selectedVariant.packagingTypeId,
            })
        }
    }, [selectedVariant, form])

    const onSubmit = async (values: z.infer<typeof ProductVariantSafeTypes>) => {
        const shelfLife = selectExpiredDates.find((expiryDate) => expiryDate.id.toString() === values.shelfLife)?.name
        if (selectedVariant) {
            const newProductVariants = [...formProduct.getValues("productVariants")]
            newProductVariants[selectedVariant.id] = { ...values, shelfLife }
            formProduct.setValue("productVariants", newProductVariants)
        } else {
            formProduct.setValue("productVariants", [...formProduct.getValues("productVariants"), { ...values, shelfLife }])
        }
        form.reset()
        onClose()
    }

    const handlerClose = () => {
        onClose()
        form.reset()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handlerClose}>
            <DialogContent className="min-w-fit">
                <DialogHeader>
                    <DialogTitle>{titleText}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full max-h-[600px]">
                    <FormValues form={form} onSubmit={onSubmit} classNameForm="min-w-fit p-1">
                        <div className="grid lg:grid-cols-3 gap-4 py-4">
                            <FormFileControl
                                form={form}
                                name="image"
                                label="Hình ảnh"
                                require={!selectedVariant}
                                disabled={form.formState.isSubmitting}
                                type={"image/jpeg, image/jpg, image/png, image/webp"}
                                mutiple={false}
                            />
                            <div className="lg:col-span-2 grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormNumberInputControl
                                        form={form}
                                        name="netWeight"
                                        label="Khối lượng tịnh"
                                        unit="g"
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                    <FormNumberInputControl
                                        form={form}
                                        name="grossWeight"
                                        label="Khối lượng tổng"
                                        unit="g"
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormNumberInputControl
                                        form={form}
                                        name="packagingLength"
                                        label="Chiều dài"
                                        unit="cm"
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                    <FormNumberInputControl
                                        form={form}
                                        name="packagingWidth"
                                        label="Chiều rộng"
                                        unit="cm"
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormNumberInputControl
                                        form={form}
                                        name="packagingHeight"
                                        label="Chiều cao"
                                        unit="cm"
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                    <FormSelectControl
                                        form={form}
                                        name="shelfLife"
                                        label="Hạn sử dụng"
                                        require
                                        disabled={form.formState.isSubmitting}
                                        items={selectExpiredDates}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormNumberInputControl
                                        form={form}
                                        name="stockQuantity"
                                        label="Số lượng"
                                        require
                                        disabled={form.formState.isSubmitting}

                                    />
                                    <FormNumberInputControl
                                        form={form}
                                        name="reOrderPoint"
                                        label="Số lượng tối thiểu cảnh báo"
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormSelectControl
                                        form={form}
                                        name="packagingTypeId"
                                        label="Loại bao bì"
                                        require
                                        disabled={form.formState.isSubmitting}
                                        items={packageTypes?.value?.map((packageType: PackagingType) => ({
                                            id: packageType.id,
                                            name: packageType.name
                                        })) || []}
                                    />
                                    <FormNumberInputControl
                                        form={form}
                                        name="price"
                                        label="Giá bán"
                                        isMoney
                                        require
                                        disabled={form.formState.isSubmitting}
                                    />
                                </div>
                                <FormInputControl
                                    form={form}
                                    name="preservationMethod"
                                    label="Cách bảo quản"
                                    require
                                    disabled={form.formState.isSubmitting}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handlerClose}>
                                Hủy
                            </Button>
                            <ButtonCustomized
                                type="submit"
                                className="mb-5 sm:mb-0 sm:max-w-fit px-2 !h-10 !rounded-md bg-green-500 hover:bg-green-700"
                                variant="secondary"
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={form.formState.isSubmitting}
                                label={
                                    form.formState.isSubmitting ? (
                                        <WaitingSpinner
                                            variant="pinwheel"
                                            label={`Đang ${selectedVariant ? "cập nhật" : "thêm mới"}...`}
                                            className="font-semibold"
                                            classNameLabel="font-semibold text-sm"
                                        />
                                    ) : (
                                        buttonText
                                    )
                                }
                            />
                        </DialogFooter>
                    </FormValues>
                </ScrollArea>
            </DialogContent>
        </Dialog >
    )
}

export default FormVariant

