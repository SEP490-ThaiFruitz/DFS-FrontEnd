import { API } from '@/actions/client/api-config'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { PRODUCT_BATCH_KEY } from '@/app/key/comm-key'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FancySelect } from '@/components/custom/_custom_select/select'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { TabsContent } from '@/components/ui/tabs'
import { EXPORTTYPE_SELECT, QUANTITY_SELECT } from '@/features/admin/admin-lib/admin-lib'
import { ApiResponse } from '@/types/types'
import { ExportWareSafeTypes } from '@/zod-safe-types/inventory-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface ProductBatchItem {
    id: number,
    productId: string
    productName: string
    productVariantId: string
    productVariantImage: string
    packagingType: string
    netWeight: number
    quantity: number
    importQuantity: number
    exportQuantity: number
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

const ExportTab = () => {

    const { data: productBatchs } = useFetch<ApiResponse<ProductBatch[]>>("/ProductBatches", [PRODUCT_BATCH_KEY.PRODUCT_BATCHES_INVENTORY_MANAGE])

    const form = useForm<z.infer<typeof ExportWareSafeTypes>>({
        resolver: zodResolver(ExportWareSafeTypes),
    })

    const productBatchId = form.watch("productBatchId")

    const { data: productBatch, refetch } = useFetch<ApiResponse<ProductBatch>>(`/ProductBatches/${productBatchId}`, [PRODUCT_BATCH_KEY.PRODUCT_BATCH_DETAIL_MANAGE, productBatchId])


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

    const onSubmit = async (values: z.infer<typeof ExportWareSafeTypes>) => {
        try {
            const productBatchSelected = productBatch?.value?.productBatchItems?.find(
                (item: ProductBatchItem) => item.id.toString() === values.productBatchId
            );

            if (
                productBatchSelected &&
                (productBatchSelected.importQuantity - productBatchSelected.exportQuantity) < Number(values.quantity)
            ) {
                toast.error(`Số lượng xuất vượt quá số lượng còn lại trong lô hàng: còn lại ${productBatchSelected.importQuantity - productBatchSelected.exportQuantity}`);
                return;
            }

            const response = await API.post("/ProductBatches/pickingitems", {
                productBatchItemId: values.productBatchId,
                orderId: values.orderId?.trim() === "" ? null : values.orderId,
                quantity: values.quantity,
                type: values.exportType,
                note: values.note
            })

            if (response) {
                toast.success("Xuất thành công")
                form.reset()
            }
        } catch (error) {
            console.log({ error })
        }
    }

    return (
        <TabsContent value="export">
            <FormValues form={form} onSubmit={onSubmit}>
                <Card className='cardStyle'>
                    <CardHeader>
                        <CardTitle>Xuất kho</CardTitle>
                        <CardDescription>Xuất sản phẩm ra khỏi kho hàng của bạn</CardDescription>
                    </CardHeader>
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
                            </div>
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
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormInputControl
                                form={form}
                                name="orderId"
                                classNameInput="h-fit"
                                placeholder="Nhập mã đơn hàng"
                                disabled={form.formState.isSubmitting}
                                label="Nhập mã đơn hàng"
                            />

                            <FormSelectControl
                                form={form}
                                name="exportType"
                                classNameInput="h-fit"
                                placeholder="Chọn loại xuất"
                                items={EXPORTTYPE_SELECT.map((exportType) => ({
                                    id: exportType.Id.toString(),
                                    name: `${exportType.Name}`,
                                })) || []}
                                disabled={form.formState.isSubmitting}
                                label="Chọn loại xuất"
                                require
                            />
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
                </Card>
                <ButtonCustomized
                    type="submit"
                    className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
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
            </FormValues>
        </TabsContent >
    )
}

export default ExportTab