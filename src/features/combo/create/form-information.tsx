"use client"
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { ApiResponse } from '@/types/types'
import { EVENT_KEY } from '@/app/key/comm-key'


interface FormInformationProps {
    formCombo: UseFormReturn<any>
}

interface Event {
    id: string;
    name: string;
    image: string;
}

const FormInformation = ({ formCombo }: Readonly<FormInformationProps>) => {
    const { data: events } = useFetch<ApiResponse<Event[]>>("/Events", [EVENT_KEY.EVENT_MANAGE])
    const comboTypes = [
        { id: "Fixed", name: "Cố định" },
        { id: "Custom", name: "Tùy chỉnh" },
    ];
    return (
        <div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
                <div className="space-y-6">
                    <FormInputControl
                        form={formCombo}
                        name="name"
                        disabled={formCombo.formState.isSubmitting}
                        label="Tên gói quà"
                        require
                    />

                    <FormNumberInputControl
                        form={formCombo}
                        name="capacity"
                        disabled={formCombo.formState.isSubmitting}
                        label="Sức chứa"
                        require
                    />

                    <FormNumberInputControl
                        form={formCombo}
                        name="quantity"
                        disabled={formCombo.formState.isSubmitting}
                        label="Số lượng"
                        require
                    />

                    <FormSelectControl
                        form={formCombo}
                        name="type"
                        classNameInput='h-fit'
                        placeholder='Chọn một loại quà'
                        items={comboTypes}
                        disabled={formCombo.formState.isSubmitting}
                        label="Loại quà"
                        require
                    />
                    <FormSelectControl
                        form={formCombo}
                        name="eventId"
                        classNameInput='h-fit'
                        placeholder='Chọn một sự kiện'
                        items={events?.value?.map((event: Event) => ({
                            id: event.id,
                            name: event.name,
                            thumbnail: event.image
                        }))}
                        isImage
                        disabled={formCombo.formState.isSubmitting}
                        label="Sự kiện"
                    />
                </div>
                <div className="space-y-6">
                    <FormFileControl
                        form={formCombo}
                        name="image"
                        classNameInput="h-30 w-full"
                        mutiple={false}
                        type={"image/jpeg, image/jpg, image/png, image/webp"}
                        disabled={formCombo.formState.isSubmitting}
                        label="Ảnh"
                        require
                    />
                </div>
            </div>
            <div className='mt-3'>
                <FormTextareaControl
                    form={formCombo}
                    name="description"
                    label="Mô tả"
                    rows={8}
                    placeholder='Nhập mô tả gói quà...'
                    require
                />
            </div>

        </div>
    )
}

export default FormInformation
