"use client"

import { useEffect } from "react"
import type { PackagingType } from "./variant"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductVariantSafeTypes } from "@/zod-safe-types/product-safe-types"
import { Controller, useForm, UseFormReturn } from "react-hook-form"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { FormValues } from "@/components/global-components/form/form-values"
import { FormFileControl } from "@/components/global-components/form/form-file-control"
import { FormNumberInputControl } from "@/components/global-components/form/form-number-control"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { FormSelectControl } from "@/components/global-components/form/form-select-control"
import { ApiResponse } from "@/types/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FancySelect } from "@/components/custom/_custom_select/select"
import { EXPIREDDATES_SELECT, PRESERVATION_SELECT, QUANTITY_SELECT } from "@/features/admin/admin-lib/admin-lib"

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
                shelfLife: selectedVariant.shelfLife,
                preservationMethod: selectedVariant.preservationMethod,
                price: selectedVariant.price.toString(),
                stockQuantity: selectedVariant.stockQuantity.toString(),
                reOrderPoint: selectedVariant.reOrderPoint.toString(),
                packagingTypeId: selectedVariant.packagingTypeId,
            })
        }
    }, [selectedVariant, form])

    const onSubmit = async (values: z.infer<typeof ProductVariantSafeTypes>) => {
        if (selectedVariant) {
            const newProductVariants = [...formProduct.getValues("productVariants")]
            newProductVariants[selectedVariant.id] = { ...values }
            formProduct.setValue("productVariants", newProductVariants)
        } else {
            formProduct.setValue("productVariants", [...formProduct.getValues("productVariants"), { ...values }])
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
                <ScrollArea className="w-full max-h-[600px] px-2 pr-2">
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
                                    <div>
                                        <Controller
                                            name="netWeight"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Khối lượng tịnh
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn khối lượng tịnh hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("netWeight"),
                                                            value: form.getValues("netWeight")
                                                        }}
                                                        unit="g"
                                                        isNumber
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="grossWeight"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Khối lượng tổng
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn khối lượng tổng hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("grossWeight"),
                                                            value: form.getValues("grossWeight")
                                                        }}
                                                        unit="g"
                                                        isNumber
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Controller
                                            name="packagingLength"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Chiều dài
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn chiều dài hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("packagingLength"),
                                                            value: form.getValues("packagingLength")
                                                        }}
                                                        unit="cm"
                                                        isNumber
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="packagingWidth"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Chiều rộng
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn chiều rộng hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("packagingWidth"),
                                                            value: form.getValues("packagingWidth")
                                                        }}
                                                        unit="cm"
                                                        isNumber
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Controller
                                            name="packagingHeight"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Chiều cao
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn chiều cao hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("packagingHeight"),
                                                            value: form.getValues("packagingHeight")
                                                        }}
                                                        unit="cm"
                                                        isNumber
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="shelfLife"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Hạn sử dụng
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn hạn sử dụng hoặc nhập mới'
                                                        options={EXPIREDDATES_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("shelfLife"),
                                                            value: form.getValues("shelfLife")
                                                        }}
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Controller
                                            name="stockQuantity"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Số lượng
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn số lượng hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("stockQuantity"),
                                                            value: form.getValues("stockQuantity")
                                                        }}
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Controller
                                            name="reOrderPoint"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <FormItem className="pt-1">
                                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                        Số lượng tối thiểu cảnh báo
                                                    </FormLabel>
                                                    <FancySelect
                                                        placeholder='Chọn số lượng hoặc nhập mới'
                                                        options={QUANTITY_SELECT}
                                                        onChangeValue={(selectedValues: any) => {
                                                            field.onChange(selectedValues.value)
                                                        }}
                                                        defaultValue={{
                                                            label: form.getValues("stockQuantity"),
                                                            value: form.getValues("stockQuantity")
                                                        }}
                                                        disabled={form.formState.isSubmitting}
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
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
                                <div>
                                    <Controller
                                        name="preservationMethod"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <FormItem className="pt-1">
                                                <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                    Cách bảo quản
                                                </FormLabel>
                                                <FancySelect
                                                    placeholder='Chọn cách bảo quản hoặc nhập mới'
                                                    options={PRESERVATION_SELECT}
                                                    onChangeValue={(selectedValues: any) => {
                                                        field.onChange(selectedValues.value)
                                                    }}
                                                    defaultValue={{
                                                        label: form.getValues("preservationMethod"),
                                                        value: form.getValues("preservationMethod")
                                                    }}
                                                    disabled={form.formState.isSubmitting}
                                                />
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handlerClose}>
                                Hủy
                            </Button>
                            <ButtonCustomized
                                type="submit"
                                className="min-w-32  mb-5 sm:mb-0 sm:max-w-fit px-2 !h-10 !rounded-md bg-sky-600 hover:bg-sky-700"
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

