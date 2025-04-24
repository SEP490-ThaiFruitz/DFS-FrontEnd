"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type { ColumnDef } from "@tanstack/react-table"
import { CirclePlus, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { Discount } from "./variant"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { API } from "@/actions/client/api-config"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Controller, useForm } from "react-hook-form"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FancySelect } from "@/components/custom/_custom_select/select"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { FormValues } from "@/components/global-components/form/form-values"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { FormDateControl } from "@/components/global-components/form/form-date-control"
import { QUANTITY_SELECT } from "@/features/admin/admin-lib/admin-lib"
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control"
import { FormDiscountSafeTypes } from "@/zod-safe-types/product-safe-types"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { toast } from "sonner"
import { format } from "date-fns"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { PRODUCT_KEY } from "@/app/key/comm-key"


interface DiscountProps {
    productVariantId: string,
    discounts: Discount[],
    productId: string,
}

const InformationDiscount = ({ productVariantId, discounts, productId }: Readonly<DiscountProps>) => {

    const [discountRemove, setDiscountRemove] = useState<Discount | undefined>(undefined)
    const [discountEdit, setDiscountEdit] = useState<Discount | undefined>(undefined)
    const [isFormDiscount, setIsFormDiscount] = useState<boolean>(false)

    const getCouponStatus = (quantity: number, startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (quantity === 0)
            return { status: 'Đã hết', color: 'bg-gray-50 text-gray-600' };

        if (now < start) {
            return { status: 'Chuẩn bị diễn ra', color: 'bg-yellow-50 text-yellow-600' };
        } else if (now >= start && now <= end) {
            return { status: 'Đang diễn ra', color: 'bg-green-50 text-green-600' };
        } else if (now > end) {
            return { status: 'Đã hết hạn', color: 'bg-red-50 text-red-600' };
        }
    };

    const columns: ColumnDef<Discount>[] = [
        {
            accessorKey: "description",
            header: "Mô tả",
        },
        {
            accessorKey: "percentage",
            header: "Phần trăm giảm",
            cell: ({ row }) => {
                const percentage = Number.parseFloat(row.getValue("percentage"))
                return <div>{percentage}%</div>
            },
        },
        {
            accessorKey: "startDate",
            header: "Ngày bắt đầu",
            cell: ({ row }) => {
                const date = new Date(row.getValue("startDate"))
                return <div>{formatTimeVietNam(date, true)}</div>
            },
        },
        {
            accessorKey: "endDate",
            header: "Ngày kết thúc",
            cell: ({ row }) => {
                const date = new Date(row.getValue("endDate"))
                return <div>{formatTimeVietNam(date, true)}</div>
            },
        },
        {
            accessorKey: "quantity",
            header: "Số lượng",
        },
        {
            accessorKey: "quantitySold",
            header: "Đã bán",
        },
        {
            header: 'Trạng thái',
            cell: ({ row }) => {
                const colorStatus: { status: string, color: string } | undefined = getCouponStatus(row.original.quantity - row.original.quantitySold, row.original.startDate, row.original.endDate);
                return <div className={`w-fit py-1 px-2 rounded-lg ${colorStatus?.color}`}>
                    {colorStatus?.status}
                </div>
            }
        },
        {
            accessorKey: "createdOnUtc",
            header: "Ngày tạo",
            cell: ({ row }) => {
                const date = new Date(row.getValue("createdOnUtc"))
                return <div>{formatTimeVietNam(date, true)}</div>
            },
        },
        {
            accessorKey: "modifiedOnUtc",
            header: "Ngày cập nhật",
            cell: ({ row }) => {
                const date = new Date(row.getValue("modifiedOnUtc"))
                return date && <div>{formatTimeVietNam(date, true)}</div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const discount = row.original
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => handleEdit(discount)}
                            variant="outline"
                            className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        >
                            <Pencil />
                        </Button>
                        <Button
                            onClick={() => setDiscountRemove(discount)}
                            variant="outline"
                            className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 />
                        </Button>
                    </div>
                )
            },
        },
    ]

    const form = useForm<z.infer<typeof FormDiscountSafeTypes>>({
        resolver: zodResolver(FormDiscountSafeTypes),
    })

    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof FormDiscountSafeTypes>) => {
        try {
            const value = {
                id: discountEdit?.id,
                productVariantId: productVariantId,
                startDate: format(values.startDate, 'yyyy-MM-dd'),
                endDate: format(values.endDate, 'yyyy-MM-dd'),
                description: values.description,
                quantity: values.quantity,
                percentage: values.percentage
            }

            const response = discountEdit
                ? await API.update(`/Discounts/${value.id}`, value)
                : await API.post("/Discounts", value);
            if (response) {
                toast.success(discountEdit ? "Cập nhật thành công" : "Tạo thành công")
                queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY.PRODUCT_DETAIL_MANAGE, productId] })
                handlerCloseForm();
            }
        } catch (error) {
            console.log({ error });
        }
    };

    const handleDelete = async (id: string) => {
        return await API.remove(`/Discounts/${id}`)
    }
    const handleEdit = (discount: Discount) => {
        setIsFormDiscount(true)
        setDiscountEdit(discount)
        form.reset({
            percentage: discount?.percentage.toString() ?? "",
            quantity: discount?.quantity.toString() ?? "",
            startDate: discount ? new Date(discount.startDate) : undefined,
            endDate: discount ? new Date(discount.endDate) : undefined,
            description: discount?.description ?? "",
        });
    }

    const handlerCloseForm = () => {
        form.reset({
            percentage: "",
            quantity: "",
            startDate: undefined,
            endDate: undefined,
            description: "",
        });
        setIsFormDiscount(false)
        setDiscountEdit(undefined)
    }

    return (
        <Accordion className="px-10" type="single" collapsible>
            <AccordionItem value="item-1">
                <AccordionTrigger className="font-bold text-2xl">Danh sách giảm giá</AccordionTrigger>
                <AccordionContent>
                    <div className="mb-4 flex justify-end">
                        <Button onClick={() => setIsFormDiscount(true)} size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                            <CirclePlus className="mr-1 h-4 w-4" />
                            Tạo giảm giá
                        </Button>
                    </div>

                    <div className="bg-white cardStyle shadow border">
                        <DataTableCustom data={discounts} columns={columns} placeholder="mô tả" searchFiled="description" />
                    </div>

                    {discountRemove && <DeleteDialog
                        id={discountRemove.id}
                        name=""
                        deleteFunction={handleDelete}
                        isOpen={discountRemove !== undefined}
                        onClose={() => setDiscountRemove(undefined)}
                        refreshKey={[[PRODUCT_KEY.PRODUCT_DETAIL_MANAGE, productId]]}
                    />}
                    {isFormDiscount && (
                        <Dialog open={isFormDiscount} onOpenChange={handlerCloseForm}>
                            <DialogContent className="min-w-[460px] md:min-w-[800px]">
                                <DialogHeader>
                                    <DialogTitle>Chọn chứng chỉ</DialogTitle>
                                </DialogHeader>
                                <FormValues form={form} onSubmit={onSubmit}>
                                    <div className="grid sm:grid-cols-2 gap-10">
                                        <div>
                                            <div>
                                                <Controller
                                                    name="percentage"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                                Số phần trăm giảm
                                                            </FormLabel>
                                                            <FancySelect
                                                                placeholder='Số phần trăm giảm hoặc nhập mới'
                                                                options={QUANTITY_SELECT}
                                                                onChangeValue={(selectedValues: any) => {
                                                                    field.onChange(selectedValues.value)
                                                                }}
                                                                disabled={form.formState.isSubmitting}
                                                                defaultValue={{
                                                                    label: form.getValues("percentage") ?? '0',
                                                                    value: form.getValues("percentage") ?? '0'
                                                                }}
                                                                isNumber
                                                                unit='%'
                                                            />
                                                            <FormMessage>{fieldState.error?.message}</FormMessage>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div>
                                                <Controller
                                                    name="quantity"
                                                    control={form.control}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                                Số lượng
                                                            </FormLabel>
                                                            <FancySelect
                                                                placeholder='Số lượng'
                                                                options={QUANTITY_SELECT}
                                                                onChangeValue={(selectedValues: any) => {
                                                                    field.onChange(selectedValues.value)
                                                                }}
                                                                disabled={form.formState.isSubmitting}
                                                                defaultValue={{
                                                                    label: form.getValues("quantity") ?? '0',
                                                                    value: form.getValues("quantity") ?? '0'
                                                                }}
                                                                isNumber
                                                            />
                                                            <FormMessage>{fieldState.error?.message}</FormMessage>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <FormDateControl
                                                    minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                                    form={form}
                                                    name="startDate"
                                                    disabled={form.formState.isSubmitting}
                                                    label="Ngày bắt đầu"
                                                    require
                                                />
                                            </div>
                                            <FormDateControl
                                                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                                form={form}
                                                name="endDate"
                                                disabled={form.formState.isSubmitting}
                                                label="Ngày kết thúc"
                                                require
                                            />
                                        </div>
                                        <div>
                                            <FormTextareaControl
                                                form={form}
                                                name="description"
                                                disabled={form.formState.isSubmitting}
                                                label="Mô tả"
                                                require
                                            />
                                        </div>
                                    </div>
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
                                                    label={`Đang ${discountEdit ? "cập nhật" : "thêm mới"}...`}
                                                    className="font-semibold"
                                                    classNameLabel="font-semibold text-sm"
                                                />
                                            ) : (
                                                discountEdit ? "Cập nhật" : "Thêm mới"
                                            )
                                        }
                                    />
                                </FormValues>
                            </DialogContent>
                        </Dialog>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

export default InformationDiscount

