"use client"

import { useEffect } from "react"
import type { PackagingType, ProductVariantDetail } from "./variant"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProductVariantSafeTypes } from "@/zod-safe-types/product-safe-types"
import { Controller, useForm } from "react-hook-form"
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
import { API } from "@/actions/client/api-config"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FancySelect } from "@/components/custom/_custom_select/select"
import { EXPIREDDATES_SELECT, PRESERVATION_SELECT, QUANTITY_SELECT } from "@/features/admin/admin-lib/admin-lib"
import { PACKAGE_TYPE_KEY, PRODUCT_KEY } from "@/app/key/comm-key"

interface FormVariantProps {
    isOpen: boolean
    onClose: () => void
    productId: string
    productVariantDetail: ProductVariantDetail | undefined
}

function FormVariant({ isOpen, onClose, productId, productVariantDetail }: Readonly<FormVariantProps>) {
    const { data: packageTypes } = useFetch<ApiResponse<PackagingType[]>>("/PackagingSpecifications", [PACKAGE_TYPE_KEY.PACKAGE_TYPE_SELECT_MANAGE])

    const titleText = productVariantDetail ? "Cập nhật biến thể" : "Thêm biến thể mới"
    const buttonText = productVariantDetail ? "Cập nhật" : "Thêm mới"
    const queryClient = useQueryClient();

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
            packagingTypeId: ""
        },
    })

    useEffect(() => {
        if (productVariantDetail) {
            form.reset({
                image: productVariantDetail.image,
                netWeight: productVariantDetail.netWeight.toString(),
                grossWeight: productVariantDetail.grossWeight.toString(),
                packagingLength: productVariantDetail.packagingLength.toString(),
                packagingWidth: productVariantDetail.packagingWidth.toString(),
                packagingHeight: productVariantDetail.packagingHeight.toString(),
                shelfLife: productVariantDetail.shelfLife,
                preservationMethod: productVariantDetail.preservationMethod,
                price: productVariantDetail.price.toString(),
                stockQuantity: productVariantDetail.stockQuantity.toString(),
                reOrderPoint: productVariantDetail.reOrderPoint.toString(),
                packagingTypeId: productVariantDetail.packagingType.id
            })
        }
    }, [productVariantDetail, form])

    const onSubmit = async (values: z.infer<typeof ProductVariantSafeTypes>) => {
        try {
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                if (key === "image") {
                    formData.append("image", value[0])
                }
                else if (key !== "image") {
                    formData.append(key, String(value))
                }
            })


            const url = '/Products/product-variants'

            if (productVariantDetail) {
                formData.append("productVariantId", productVariantDetail.id)
                const res = await API.update(url, formData)
                if (res) {
                    toast.success("Cập nhật thành công")
                    queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY.PRODUCT_DETAIL_MANAGE, productId] })
                    handlerClose()
                }
            }
            else {
                formData.append("productId", productId)
                const res = await API.post(url, formData)
                if (res) {
                    toast.success("Tạo thành công")
                    queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY.PRODUCT_DETAIL_MANAGE, productId] })
                    handlerClose()
                }
            }

        } catch (error) {
            console.error("Error submitting form:", error)
        }
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
                <ScrollArea className="w-full max-h-[600px] pr-2">
                    <FormValues form={form} onSubmit={onSubmit} classNameForm="min-w-fit p-1">
                        <div className="grid lg:grid-cols-3 gap-4 py-4">
                            <FormFileControl
                                form={form}
                                name="image"
                                label="Hình ảnh"
                                require={!productVariantDetail}
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

                                <div className="grid grid-cols-3 gap-4">
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

                                <div className="grid grid-cols-2 gap-4">
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
                                                            label: form.getValues("reOrderPoint"),
                                                            value: form.getValues("reOrderPoint")
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

                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={handlerClose}>
                                Hủy
                            </Button>
                            <ButtonCustomized
                                type="submit"
                                className="min-w-32 mb-5 sm:mb-0 sm:max-w-fit px-2 !h-10 !rounded-md bg-sky-600 hover:bg-sky-700"
                                variant="secondary"
                                onClick={form.handleSubmit(onSubmit)}
                                disabled={form.formState.isSubmitting}
                                label={
                                    form.formState.isSubmitting ? (
                                        <WaitingSpinner
                                            variant="pinwheel"
                                            label={`Đang ${productVariantDetail ? "cập nhật" : "thêm mới"}...`}
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

