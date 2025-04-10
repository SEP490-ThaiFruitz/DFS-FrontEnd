"use client"
import { PRODUCT_BATCH_KEY } from "@/app/key/comm-key"
import { ApiResponse } from "@/types/types"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { ImportWareSafeTypes } from '@/zod-safe-types/inventory-safe-types'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FormValues } from "@/components/global-components/form/form-values"
import { FormSelectControl } from "@/components/global-components/form/form-select-control"
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FancySelect } from "@/components/custom/_custom_select/select"
import { QUANTITY_SELECT } from "@/features/admin/admin-lib/admin-lib"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { API } from "@/actions/client/api-config"
import { toast } from "sonner"
import { FormInputControl } from "@/components/global-components/form/form-input-control"

interface ProductBatchItem {
    id: number,
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    netWeight: number
    quantity: number
    remaining: number
    preservationMethod: string
    productionDate: string
    expirationDate: string
}

interface ProductBatch {
    id: number
    number: string
    requestName: string
    productBatchItems: ProductBatchItem[]
}


const ImportTab = () => {

    const { data: productBatchs } = useFetch<ApiResponse<ProductBatch[]>>("/ProductBatches", [PRODUCT_BATCH_KEY.PRODUCT_BATCHES])

    const form = useForm<z.infer<typeof ImportWareSafeTypes>>({
        resolver: zodResolver(ImportWareSafeTypes),
    })

    const productBatchId = form.watch("productBatchId")

    const { data: productBatch, refetch } = useFetch<ApiResponse<ProductBatch>>(`/ProductBatches/${productBatchId}`, [PRODUCT_BATCH_KEY.PRODUCT_BATCH_DETAIL, productBatchId])


    useEffect(() => {
        if (productBatchId) {
            refetch()
        }
    }, [productBatchId])

    const productBatchOptions =
        productBatchs?.value
            ?.map((productBatch) => ({
                id: productBatch.id.toString(),
                name: `${productBatch.number}`,
            })) || []


    const productBatchItemOptions =
        productBatch?.value?.productBatchItems?.map((productBatchItem: ProductBatchItem) => ({
            id: productBatchItem.id.toString(),
            name: `${productBatchItem.productName} - ${productBatchItem.packagingType} - ${productBatchItem.netWeight}g`,
            thumbnail: productBatchItem.productVariantImage
        })) || []
    const onSubmit = async (values: z.infer<typeof ImportWareSafeTypes>) => {
        try {
            const response = await API.post("/ProductBatches/pickingitems", {
                productBatchItemId: values.productBatchId,
                orderId: values.orderId?.trim() === "" ? null : values.orderId,
                quantity: values.quantity,
                type: "IMPORT",
                note: values.note
            })

            if (response) {
                toast.success("Nhập thành công")
                form.reset()
            }
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <TabsContent value="import">
            <Card>
                <CardHeader>
                    <CardTitle>Nhập kho</CardTitle>
                    <CardDescription>Thêm sản phẩm mới vào kho hàng của bạn</CardDescription>
                </CardHeader>
                <FormValues form={form} onSubmit={onSubmit} >
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <FormSelectControl
                                    form={form}
                                    name="productBatchId"
                                    classNameInput="h-fit"
                                    placeholder="Chọn lô hàng"
                                    items={productBatchOptions}
                                    disabled={form.formState.isSubmitting}
                                    label="Chọn lô hàng"
                                    require
                                />
                                <Controller
                                    name={"quantity"}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className="font-medium after:content-['*'] after:text-red-500 after:ml-1">
                                                Số lượng
                                            </FormLabel>
                                            <FancySelect
                                                placeholder='Chọn hoặc nhập số lượng mới'
                                                classNameSelect='!max-h-32'
                                                options={QUANTITY_SELECT}
                                                onChangeValue={(selectedValues: any) => {
                                                    field.onChange(selectedValues?.value)
                                                }}
                                                isNumber
                                            />
                                            <FormMessage>{fieldState.error?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormInputControl
                                    form={form}
                                    name="orderId"
                                    classNameInput="h-fit"
                                    placeholder="Nhập mã đơn hàng"
                                    disabled={form.formState.isSubmitting}
                                    label="Nhập mã đơn hàng"
                                />
                            </div>
                            <div className="space-y-2">
                                <FormSelectControl
                                    form={form}
                                    name="productBatchItemId"
                                    classNameInput="h-fit"
                                    placeholder="Chọn sản phẩm"
                                    items={productBatchItemOptions}
                                    disabled={form.formState.isSubmitting}
                                    label="Chọn sản phẩm"
                                    isImage
                                    require
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FormTextareaControl
                                name='note'
                                form={form}
                                disabled={form.formState.isSubmitting}
                                label='Ghi chú'
                                require
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <ButtonCustomized
                            type="submit"
                            className="max-w-32 bg-green-500 hover:bg-green-700"
                            variant="secondary"
                            disabled={
                                form.formState.isSubmitting
                            }
                            label={
                                form.formState.isSubmitting ? (
                                    <WaitingSpinner
                                        variant="pinwheel"
                                        label="Đang tạo..."
                                        className="font-semibold"
                                        classNameLabel="font-semibold text-sm"
                                    />
                                ) : (
                                    "Tạo mới"
                                )
                            }
                        />
                    </CardFooter>
                </FormValues>
            </Card>
        </TabsContent>
    )
}

export default ImportTab