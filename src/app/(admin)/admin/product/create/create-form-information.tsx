"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl, SelectData } from '@/components/global-components/form/form-select-control'
import { Label } from '@/components/ui/label'
import { ApiResponse } from '@/types/types'
import React from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { CardCategory } from '@/components/global-components/card/card-category'
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FancyMultiSelect } from '@/components/custom/_custom_select/multi-select'

export interface CategorySelect extends SelectData {
    isChose: boolean;
}

interface FormInformationProps {
    formProduct: UseFormReturn<any>
}

const FormInformation = ({ formProduct }: Readonly<FormInformationProps>) => {
    const { data: categories } = useFetch<ApiResponse<CategorySelect[]>>("/Categories/get-all-non-paging", ["categories"])
    const dryingMethods = [
        { id: "SunDrying", name: "Sấy bằng ánh nắng mặt trời" },
        { id: "HotAirDrying", name: "Sấy bằng không khí nóng" },
        { id: "FreezeDrying", name: "Sấy đông khô" },
        { id: "MicrowaveDrying", name: "Sấy bằng sóng vi ba" },
        { id: "VacuumDrying", name: "Sấy theo phương pháp chân không" },
        { id: "InfraredDrying", name: "Sấy bằng bức xạ hồng ngoại" },
        { id: "DrumDrying", name: "Sấy trong máy trống" }
    ];
    const Options = [
        {
            value: "Sung sấy",
            label: "Sung sấy",
        },
        {
            value: "Chuối sấy",
            label: "Chuối sấy",
        },
        {
            value: "Táo sấy",
            label: "Táo sấy",
        },
        {
            value: "Dứa sấy",
            label: "Dứa sấy",
        },
        {
            value: "Dưa hấu sấy",
            label: "Dưa hấu sấy",
        },
        {
            value: "Dâu tây sấy",
            label: "Dâu tây sấy",
        },
        {
            value: "Cà chua sấy",
            label: "Cà chua sấy",
        },
        {
            value: "Cà rốt sấy",
            label: "Cà rốt sấy",
        },
    ]
    return (
        <div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
                <div className="space-y-6">
                    <FormInputControl
                        form={formProduct}
                        name="name"
                        disabled={formProduct.formState.isSubmitting}
                        label="Tên sản phẩm"
                        require
                    />
                    <FormInputControl
                        form={formProduct}
                        name="origin"
                        disabled={formProduct.formState.isSubmitting}
                        label="Nguồn gốc"
                        require
                    />
                    <FormNumberInputControl
                        form={formProduct}
                        name="moistureContent"
                        disabled={formProduct.formState.isSubmitting}
                        label="Độ ẩm"
                        unit='%'
                        require
                    />
                    <FormSelectControl
                        form={formProduct}
                        name="dryingMethod"
                        classNameInput='h-fit'
                        placeholder='Chọn một phương pháp xấy'
                        items={dryingMethods}
                        disabled={formProduct.formState.isSubmitting}
                        label="Phương pháp xấy"
                        require
                    />
                    <Controller
                        name="tagNames"
                        control={formProduct.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="pt-8">
                                <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                    Thẻ tag
                                </FormLabel>
                                <FancyMultiSelect
                                    placeholder='Chọn tag sản phẩm hoặc nhập mới'
                                    options={Options}
                                    onChangeValue={(selectedValues) => field.onChange(selectedValues)}
                                    defaultValues={field.value}
                                />
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="space-y-6">
                    <FormFileControl
                        form={formProduct}
                        name="image"
                        classNameInput="h-30 w-full"
                        mutiple={false}
                        type={"image/jpeg, image/jpg, image/png, image/webp"}
                        disabled={formProduct.formState.isSubmitting}
                        label="Ảnh chính"
                        require
                    />
                    <FormFileControl
                        form={formProduct}
                        name="other"
                        classNameInput="h-30 w-full"
                        mutiple={true}
                        type={"image/jpeg, image/jpg, image/png, image/webp"}
                        disabled={formProduct.formState.isSubmitting}
                        label="Ảnh phụ"
                        require
                    />
                </div>
            </div>
            <div className='mt-3'>
                <FormTextareaControl
                    form={formProduct}
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
                        const isSelected = formProduct.getValues("categoryIds").includes(category.id.toString())

                        return (
                            <CardCategory
                                key={category.id}
                                category={category}
                                isChecked={isSelected}
                                onChange={(isChoseCategory: boolean) => {
                                    const categoryIds = formProduct.getValues("categoryIds") || []
                                    const categoryId = category.id.toString()

                                    if (!isChoseCategory) {
                                        const updatedIds = categoryIds.filter((id: string) => id !== categoryId)
                                        formProduct.setValue("categoryIds", updatedIds)
                                    } else {
                                        if (!categoryIds.includes(categoryId)) {
                                            formProduct.setValue("categoryIds", [...categoryIds, categoryId])
                                        }
                                    }
                                }}
                            />
                        )
                    })}
                </div>
                <div className='text-sm font-medium text-destructive mt-2'>{formProduct.getFieldState("categoryIds").error?.message}</div>
            </div>
        </div >
    )
}

export default FormInformation
