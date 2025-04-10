import { FormValues } from '@/components/global-components/form/form-values'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import { ExportWareSafeTypes } from '@/zod-safe-types/inventory-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { Button } from 'react-day-picker'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ExportTab = () => {


    const form = useForm<z.infer<typeof ExportWareSafeTypes>>({
        resolver: zodResolver(ExportWareSafeTypes),
    })

    // const { data: productBatch } = useFetch<ApiResponse<ProductBatch>>(`/ProductBatches/${form.getValues("productBatchId")}`, [PRODUCT_BATCH_KEY.PRODUCT_BATCH_DETAIL, form.getValues("productBatchId")])

    // const productBatchOptions =
    //     productBatchs?.value
    //         ?.map((productBatch) => ({
    //             id: productBatch.id.toString(),
    //             name: `${productBatch.number}`,
    //         })) || []


    // const productBatchItemOptions =
    //     productBatch?.value?.productBatchItems?.map((productBatchItem: ProductBatchItem) => ({
    //         id: productBatchItem.id.toString(),
    //         name: `${productBatchItem.productName} - ${productBatchItem.packagingType} - ${productBatchItem.netWeight}g`,
    //         image: productBatchItem.productVariantImage
    //     })) || []
    const onSubmit = async (values: z.infer<typeof ExportWareSafeTypes>) => {
        try {

        } catch (error) {
            console.log({ error })
        }
    }
    return (
        <TabsContent value="export">
            <Card>
                <CardHeader>
                    <CardTitle>Xuất kho</CardTitle>
                    <CardDescription>Xuất sản phẩm ra khỏi kho hàng của bạn</CardDescription>
                </CardHeader>
                <FormValues form={form} onSubmit={onSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                            <div className="space-y-2">

                            </div>
                        </div>

                        <div className="space-y-2">

                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit">
                            Lưu và xuất kho
                        </Button>
                    </CardFooter>
                </FormValues>
            </Card>
        </TabsContent>
    )
}

export default ExportTab