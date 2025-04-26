"use client"
import { Check, CirclePlus, Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatVND } from "@/lib/format-currency"
import React, { useState } from "react"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { API } from "@/actions/client/api-config"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Spinner } from "@/components/global-components/spinner"
import { FormValues } from "@/components/global-components/form/form-values"
import { FormNumberInputControl } from "@/components/global-components/form/form-number-control"
import { z } from "zod"
import { UpdateQuantitySafeTypes } from "@/zod-safe-types/promotion-safe-types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import CreateVariant from "./create-variant"
import { Promotion } from "./detail-promotion"
import { PROMOTION_KEY } from "@/app/key/comm-key"

interface VariantProps {
    promotion: Promotion | undefined,
}

export interface ProductVariant {
    id: string,
    productId: string
    productVariantId: string
    productName: string
    image: string
    packagingType: string
    netWeight: number
    price: number
    discountPrice: number
    quantity: number
    quantitySold: number
}

const Variant = ({ promotion }: Readonly<VariantProps>) => {
    const [productVariantRemove, setProductVariantRemove] = useState<ProductVariant | undefined>();
    const [productVariantEdit, setProductVariantEdit] = useState<ProductVariant | undefined>();
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof UpdateQuantitySafeTypes>>({
        resolver: zodResolver(UpdateQuantitySafeTypes)
    })

    if (promotion === undefined)
        return <></>

    const groupedVariants = Array.from(
        promotion.productVariants.reduce((groups, variant) => {
            const group = groups.get(variant.productName) || []
            group.push(variant)
            return groups.set(variant.productName, group)
        }, new Map<string, ProductVariant[]>()),
    )

    const removeProductVariant = async (id: string) => {
        return await API.remove(`/Promotions/product-variant/${id}`)
    }


    const onSubmit = async (values: z.infer<typeof UpdateQuantitySafeTypes>) => {
        try {
            const res = await API.update("/Promotions/product-variant", values);
            if (res) {
                toast.success("Cập nhật số lượng thành công")
                form.reset();
                queryClient.invalidateQueries({ queryKey: [PROMOTION_KEY.PROMOTION_DETAIL_MANAGE, promotion.promotionId] })
                setProductVariantEdit(undefined)
            }
        } catch (error: unknown) {
            console.log(error instanceof Error ? error?.message : "Lỗi hệ thống")
            toast.error("Lỗi hệ thống")
        }
    }

    return (
        <TabsContent value="variant">
            <Tabs>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between border-b-2">
                        <CardTitle>Sản phẩm khuyến mãi</CardTitle>
                        <Button onClick={() => setIsCreate(true)} variant="outline">
                            <CirclePlus />
                            Thêm mới
                        </Button>
                    </CardHeader>
                    <CardContent className="py-5">
                        {isCreate ? <CreateVariant
                            onClose={() => setIsCreate(false)}
                            startDate={new Date(promotion.startDate)}
                            endDate={new Date(promotion.endDate)}
                            promotionId={promotion.promotionId}
                            percentage={promotion.percentage}
                            productVariants={promotion.productVariants.map((variant) => variant.productVariantId)}
                        /> :
                            <>
                                {promotion.productVariants.length > 0 ? (
                                    <Table className="border rounded-lg overflow-hidden">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Hình ảnh</TableHead>
                                                <TableHead>Loại đóng gói</TableHead>
                                                <TableHead>Khối lượng</TableHead>
                                                <TableHead>Giá gốc</TableHead>
                                                <TableHead>Giá khuyến mãi</TableHead>
                                                <TableHead>Số lượng</TableHead>
                                                <TableHead>Đã bán</TableHead>
                                                <TableHead className="text-right">Thao tác</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {groupedVariants.map(([productName, groupVariants]) => (
                                                <React.Fragment key={productName}>
                                                    <TableRow key={`header-${productName}`} className="bg-muted">
                                                        <TableCell colSpan={8} className="font-medium py-3">
                                                            <div className="flex justify-between items-center">
                                                                <h3>{productName}</h3>
                                                                <span className="text-sm text-muted-foreground">{groupVariants.length} biến thể</span>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                    {groupVariants.map((variant) => (
                                                        <TableRow key={variant.productVariantId}>
                                                            <TableCell>
                                                                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                                                                    <ImagePreview
                                                                        images={[variant.image]}
                                                                        initialWidth={40}
                                                                        initialHeight={40}
                                                                    />
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{variant.packagingType}</TableCell>
                                                            <TableCell>{variant.netWeight}g</TableCell>
                                                            <TableCell>{formatVND(variant.price)}</TableCell>
                                                            <TableCell>{formatVND(variant.discountPrice)}</TableCell>
                                                            <TableCell>
                                                                {productVariantEdit?.id === variant.id ?
                                                                    <FormValues form={form} onSubmit={onSubmit}>
                                                                        <FormNumberInputControl
                                                                            form={form}
                                                                            name="quantity"
                                                                            classNameInput="max-w-20"
                                                                        />
                                                                    </FormValues>
                                                                    : variant.quantity}
                                                            </TableCell>
                                                            <TableCell>{variant.quantitySold}</TableCell>
                                                            <TableCell className="text-right space-x-2">
                                                                {productVariantEdit?.id === variant.id ? <>
                                                                    <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="border" type='submit' size="sm" variant="ghost">
                                                                        {form.formState.isSubmitting ? <Spinner /> : <Check className="h-4 w-4" />}
                                                                    </Button>
                                                                    <Button onClick={() => setProductVariantEdit(undefined)} className="border" type="button" size="sm" variant="ghost">
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </> : <>
                                                                    <Button
                                                                        className="border"
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={() => {
                                                                            setProductVariantEdit(variant)
                                                                            form.setValue("quantity", variant.quantity.toString())
                                                                            form.setValue("id", variant.id)
                                                                        }}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button onClick={() => setProductVariantRemove(variant)} className="border" type="button" size="sm" variant="ghost">
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </>}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center p-6 border rounded-lg">
                                        <div className="text-muted-foreground">Không có sản phẩm khuyến mãi nào.</div>
                                    </div>
                                )}
                            </>}
                    </CardContent>
                </Card>
            </Tabs>
            <DeleteDialog
                id={productVariantRemove?.id ?? ""}
                isOpen={productVariantRemove !== undefined}
                onClose={() => setProductVariantRemove(undefined)}
                name={`${productVariantRemove?.productName} - ${productVariantRemove?.packagingType} - ${productVariantRemove?.netWeight}g`}
                deleteFunction={removeProductVariant}
                refreshKey={[[promotion.promotionId]]}
            />
        </TabsContent>
    )
}

export default Variant

