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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { Combo } from "./page"
import { UpdateQuantitySafeTypes } from "@/zod-safe-types/combo-safe-types"
import Link from "next/link"
import DialogProduct from "./dialog-product"

interface VariantProps {
    combo: Combo | undefined,
}

export interface ComboItem {
    id: string,
    productVariantId: string,
    productId: string
    productName: string
    image: string
    packagingType: string
    netWeight: number
    price: number,
    quantity: number
}

const Variant = ({ combo }: Readonly<VariantProps>) => {
    const [comboItemRemove, setComboItemRemove] = useState<ComboItem | undefined>();
    const [comboItemEdit, setComboItemEdit] = useState<ComboItem | undefined>();
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const totalQuantity = combo?.comboItems.reduce((total: number, item: ComboItem) => total + item.quantity, 0) ?? 0

    const form = useForm<z.infer<typeof UpdateQuantitySafeTypes>>({
        resolver: zodResolver(UpdateQuantitySafeTypes)
    })

    if (combo === undefined)
        return <></>

    const removeComboItem = async (id: string) => {
        return await API.remove(`/Combos/comboItem/${id}`)
    }


    const onSubmit = async (values: z.infer<typeof UpdateQuantitySafeTypes>) => {
        try {
            const totalQuantity = combo?.comboItems
                ?.filter(x => x.id !== values.id)
                ?.reduce((sum, item) => sum + (item.quantity || 0), 0);

            if ((Number(values.quantity) + totalQuantity) > combo?.capacity) {
                toast.error(`Tổng số lượng không lớn hơn ${combo?.capacity}`)
                return;
            }
            const res = await API.update("/Combos/comboItem", values);
            if (res) {
                toast.success("Cập nhật số lượng thành công")
                form.reset();
                queryClient.invalidateQueries({ queryKey: [combo.id] })
                setComboItemEdit(undefined)
            } else {
                toast.error("Cập nhật số lượng thất bại")
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
                        <CardTitle>Sản phẩm ({totalQuantity})</CardTitle>
                        {totalQuantity < combo.capacity && !combo.isLocked && (<Button onClick={() => setIsCreate(true)} variant="outline">
                            <CirclePlus />
                            Thêm mới
                        </Button>)}
                    </CardHeader>
                    <CardContent className="py-5">
                        {combo?.comboItems?.length > 0 ? (
                            <Table className="border rounded-lg overflow-hidden">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hình ảnh</TableHead>
                                        <TableHead>Loại đóng gói</TableHead>
                                        <TableHead>Tên sản phẩm</TableHead>
                                        <TableHead>Giá gốc</TableHead>
                                        <TableHead>Số lượng</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {combo?.comboItems?.map((comboItem) => (
                                        <TableRow key={comboItem.id}>
                                            <TableCell>
                                                <div className="relative h-12 w-12 overflow-hidden rounded-md">
                                                    <ImagePreview
                                                        images={[comboItem.image]}
                                                        initialWidth={40}
                                                        initialHeight={40}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Link href={`/admin/product/${comboItem.productId}`}>
                                                    {comboItem.productName} - {comboItem.packagingType} - {comboItem.netWeight}g
                                                </Link>
                                            </TableCell>
                                            <TableCell>{comboItem.netWeight}g</TableCell>
                                            <TableCell>{formatVND(comboItem.price)}</TableCell>
                                            <TableCell>
                                                {comboItemEdit?.id === comboItem.id ?
                                                    <FormValues form={form} onSubmit={onSubmit}>
                                                        <FormNumberInputControl
                                                            form={form}
                                                            name="quantity"
                                                            classNameInput="max-w-20"
                                                        />
                                                    </FormValues>
                                                    : comboItem.quantity}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                {comboItemEdit?.id === comboItem.id ? <>
                                                    <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="border" type='submit' size="sm" variant="ghost">
                                                        {form.formState.isSubmitting ? <Spinner /> : <Check className="h-4 w-4" />}
                                                    </Button>
                                                    <Button onClick={() => setComboItemEdit(undefined)} className="border" type="button" size="sm" variant="ghost">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </> : <>
                                                    {!combo?.isLocked && (
                                                        <>
                                                            <Button
                                                                className="border"
                                                                type="button"
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setComboItemEdit(comboItem)
                                                                    form.setValue("quantity", comboItem.quantity.toString())
                                                                    form.setValue("id", comboItem?.id)
                                                                }}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>

                                                            <Button onClick={() => setComboItemRemove(comboItem)} className="border" type="button" size="sm" variant="ghost">
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </>}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center p-6 border rounded-lg">
                                <div className="text-muted-foreground">Không có sản phẩm nào.</div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Tabs>
            {isCreate && (<DialogProduct
                isOpen={isCreate}
                maxQuantity={combo.capacity}
                comboId={combo.id}
                oldProductVariant={combo.comboItems.map((comboItem: ComboItem) => comboItem.productVariantId)}
                onClose={() => setIsCreate(false)}
            />)}
            <DeleteDialog
                id={comboItemRemove?.id ?? ""}
                isOpen={comboItemRemove !== undefined}
                onClose={() => setComboItemRemove(undefined)}
                name={`${comboItemRemove?.productName} - ${comboItemRemove?.packagingType} - ${comboItemRemove?.netWeight}g`}
                deleteFunction={removeComboItem}
                refreshKey={[[combo.id]]}
            />
        </TabsContent>
    )
}

export default Variant

