"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl, SelectData } from '@/components/global-components/form/form-select-control'
import { Label } from '@/components/ui/label'
import { ApiResponse } from '@/types/types'
import React from 'react'
import { useForm } from 'react-hook-form'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { Product } from './page'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateProductSafeTypes } from '@/zod-safe-types/product-safe-types'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { CardCategory } from '@/components/global-components/card/card-category'
import { API } from '@/actions/client/api-config'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export interface CategorySelect extends SelectData {
    isChose: boolean;
}

interface FormInformationProps {
    product: Product | null,
    onClose: () => void,
}

const FormInformation = ({ product, onClose }: Readonly<FormInformationProps>) => {
    const { data: categories } = useFetch<ApiResponse<CategorySelect[]>>("/Categories/get-all-non-paging", ["categories"])
    const queryClient = useQueryClient();
    const dryingMethods = [
        { id: "SunDrying", name: "Sấy bằng ánh nắng mặt trời" },
        { id: "HotAirDrying", name: "Sấy bằng không khí nóng" },
        { id: "FreezeDrying", name: "Sấy đông khô" },
        { id: "MicrowaveDrying", name: "Sấy bằng sóng vi ba" },
        { id: "VacuumDrying", name: "Sấy theo phương pháp chân không" },
        { id: "InfraredDrying", name: "Sấy bằng bức xạ hồng ngoại" },
        { id: "DrumDrying", name: "Sấy trong máy trống" }
    ];

    const form = useForm<z.infer<typeof UpdateProductSafeTypes>>({
        resolver: zodResolver(UpdateProductSafeTypes),
        defaultValues: {
            id: product?.id,
            name: product?.name ?? "",
            dryingMethod: product?.dryingMethod ?? "",
            moistureContent: product?.moistureContent.toString() ?? "",
            origin: product?.origin ?? "",
            description: product?.description ?? "",
            categoryIds: product?.categories?.map((category) => category.id) ?? []
        }
    })

    const onSubmit = async (values: z.infer<typeof UpdateProductSafeTypes>) => {
        try {
            const formData = new FormData();

            Object.keys(values).forEach(key => {
                if (key === "image" && values.image?.[0]) {
                    formData.append("mainImageUrl", values.image[0]);
                } else if (key === "categoryIds") {
                    values.categoryIds.forEach((value) => {
                        formData.append("categoryIds", value);
                    })
                } else {
                    const value = values[key as keyof typeof values];
                    if (value !== undefined) {
                        formData.append(key, value.toString());
                    }
                }
            });

            const response = await API.update("/Products", formData)

            if (response) {
                toast.success("Cập nhật sản phẩm thành công")
                queryClient.invalidateQueries({ queryKey: ["detail-mange", product?.id] })
                onClose();
            } else {
                toast.error("Cập nhật sản phẩm thất bại")
            }
        } catch (error) {
            console.log({ error });
        }
    }


    return (
        <FormValues form={form} onSubmit={onSubmit}>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
                <div className="space-y-6">
                    <FormInputControl
                        form={form}
                        name="name"
                        disabled={form.formState.isSubmitting}
                        label="Tên sản phẩm"
                        require
                    />
                    <FormInputControl
                        form={form}
                        name="origin"
                        disabled={form.formState.isSubmitting}
                        label="Nguồn gốc"
                        require
                    />
                    <FormInputControl
                        form={form}
                        name="moistureContent"
                        disabled={form.formState.isSubmitting}
                        label="Độ ẩm"
                        require
                    />
                    <FormSelectControl
                        form={form}
                        name="dryingMethod"
                        classNameInput='h-fit'
                        placeholder='Chọn một phương pháp xấy'
                        items={dryingMethods}
                        disabled={form.formState.isSubmitting}
                        label="Phương pháp xấy"
                        require
                    />
                </div>
                <div className="space-y-6">
                    <FormFileControl
                        form={form}
                        name="image"
                        classNameInput="h-30 w-full"
                        mutiple={false}
                        type={"image/jpeg, image/jpg, image/png, image/webp"}
                        disabled={form.formState.isSubmitting}
                        label="Ảnh chính"
                    />
                </div>
            </div>
            <div className='mt-3'>
                <FormTextareaControl
                    form={form}
                    name="description"
                    label="Mô tả"
                    rows={8}
                    placeholder='Nhập mô tả sản phẩm...'
                    require
                />
            </div>
            <div className='mt-3'>
                <Label className={`after:content-['*'] after:text-red-500 after:ml-1`}>Chọn loại sản phẩm</Label>
                <div className='mt-2 grid grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-10'>
                    {categories?.value?.map((category: CategorySelect) => {
                        const isSelected = form.getValues("categoryIds")?.includes(category.id.toString()) ?? false

                        return (
                            <CardCategory
                                key={category.id}
                                category={category}
                                isChecked={isSelected}
                                onChange={(isChoseCategory: boolean) => {
                                    const categoryIds = form.getValues("categoryIds") || []
                                    const categoryId = category.id.toString()

                                    if (!isChoseCategory) {
                                        const updatedIds = categoryIds.filter((id: string) => id !== categoryId)
                                        form.setValue("categoryIds", updatedIds)
                                    } else {
                                        if (!categoryIds.includes(categoryId)) {
                                            form.setValue("categoryIds", [...categoryIds, categoryId])
                                        }
                                    }
                                }}
                            />
                        )
                    })}
                </div>
                <div className='text-sm font-medium text-destructive mt-2'>{form.getFieldState("categoryIds").error?.message}</div>
            </div>
            <div className="flex justify-start gap-2">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <ButtonCustomized
                    type="submit"
                    className="max-w-fit px-2 !h-10 !rounded-md bg-green-500 hover:bg-green-700"
                    variant="secondary"
                    disabled={form.formState.isSubmitting}
                    label={
                        form.formState.isSubmitting ? (
                            <WaitingSpinner
                                variant="pinwheel"
                                label="Đang cập nhật..."
                                className="font-semibold"
                                classNameLabel="font-semibold text-sm"
                            />
                        ) : (
                            "Cập nhật"
                        )
                    }
                />
            </div>
        </FormValues>
    )
}

export default FormInformation
