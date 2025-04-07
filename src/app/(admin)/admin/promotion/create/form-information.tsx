"use client"

import { FormDateControl } from '@/components/global-components/form/form-date-control'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

interface FormInformationProps {
    form: UseFormReturn<any>
}
const FormInformation = ({ form }: Readonly<FormInformationProps>) => {
    return (
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
            <div className="space-y-6">
                <FormInputControl form={form} name="name" disabled={form.formState.isSubmitting} label="Tên" require />

                <FormNumberInputControl
                    form={form}
                    name="percentage"
                    disabled={form.formState.isSubmitting}
                    label="Phần trăm"
                    unit="%"
                    require
                />

                <FormTextareaControl
                    form={form}
                    name="description"
                    disabled={form.formState.isSubmitting}
                    label="Mô tả"
                    require
                />

                <div className="grid xl:grid-cols-2 gap-5">
                    <FormDateControl
                        form={form}
                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                        name="startDate"
                        mode="single"
                        disabled={form.formState.isSubmitting}
                        label="Ngày bắt đầu"
                        require
                    />
                    <FormDateControl
                        form={form}
                        name="endDate"
                        mode="single"
                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                        disabled={form.formState.isSubmitting}
                        label="Ngày kết thúc"
                        require
                    />
                </div>
            </div>
            <div className="space-y-6">
                <FormFileControl
                    form={form}
                    name="image"
                    classNameInput="h-30 w-full"
                    mutiple={false}
                    type={"image/jpeg, image/jpg, image/png, image/webp"}
                    disabled={form.formState.isSubmitting}
                    label="Ảnh"
                    require
                />
            </div>
        </div>
    )
}

export default FormInformation