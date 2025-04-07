import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Event } from './page'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { toast } from 'sonner'
import { API } from '@/actions/client/api-config'
import { CreateEventSafeTypes } from '@/zod-safe-types/event-safe-types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { FormValues } from '@/components/global-components/form/form-values'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { FormDateControl } from '@/components/global-components/form/form-date-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'

interface DialogEventProps {
    isOpen: boolean,
    onClose: () => void,
    event: Event | undefined
}

const DialogEvent = ({ onClose, isOpen, event }: Readonly<DialogEventProps>) => {

    const form = useForm<z.infer<typeof CreateEventSafeTypes>>({
        resolver: zodResolver(CreateEventSafeTypes),
        defaultValues: {
            id: event?.id ?? "",
            name: event?.name ?? "",
            description: event?.description ?? "",
            startDate: event?.startDate ? new Date(event?.startDate) : new Date(),
            endDate: event?.endDate ? new Date(event?.endDate) : new Date(),
            image: event?.image ?? "",
        }
    });

    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof CreateEventSafeTypes>) => {
        try {
            const formData = new FormData();
            if (values.id) {
                formData.append("id", values.id)
            }
            formData.append("name", values.name)
            formData.append("description", values.description)
            formData.append("startDate", values.startDate.toLocaleDateString())
            formData.append("endDate", values.endDate.toLocaleDateString())
            if (values.image) {
                formData.append("image", values.image[0])
            }


            const response = event !== undefined ? await API.update(`/Events/${event?.id}`, formData)
                : await API.post('/Events', formData)
            if (response) {
                toast.success(event !== undefined ? "Cập nhật sự kiện thành công" : "Thêm sự kiện thành công")
                onClose()
                form.reset()
                queryClient.invalidateQueries({ queryKey: ["events"] })
            } else {
                toast.error(event !== undefined ? "Cập nhật sự kiện thất bại" : "Thêm sự kiện thất bại")
            }
        } catch (error) {
            console.log({ error });
        }
    };
    const title = event !== undefined ? "Cập nhật sự kiện" : "Tạo mới sự kiện"
    const buttonText = event !== undefined ? "Cập nhật" : "Tạo mới"
    const loadingLabel = event !== undefined ? "Đang cập nhật..." : "Đang tạo mới..."
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[560px] md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 gap-10'>
                        <div className='space-y-5'>
                            <FormInputControl
                                form={form}
                                name="name"
                                disabled={form.formState.isSubmitting}
                                label="Tên sự kiện"
                                require
                            />
                            <FormDateControl
                                form={form}
                                name="startDate"
                                disabled={form.formState.isSubmitting}
                                label="Ngày bắt đầu"
                                require
                            />
                            <FormDateControl
                                form={form}
                                name="endDate"
                                disabled={form.formState.isSubmitting}
                                label="Ngày kết thúc"
                                require
                            />
                            <FormTextareaControl
                                form={form}
                                name="description"
                                disabled={form.formState.isSubmitting}
                                label="Mô tả"
                                require
                            />
                        </div>

                        <FormFileControl
                            form={form}
                            disabled={form.formState.isSubmitting}
                            name='image'
                            label='Ảnh'
                            type={"image/jpeg, image/jpg, image/png, image/webp"}
                            require={event === undefined}
                            mutiple={false}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
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
                                        label={loadingLabel}
                                        className="font-semibold "
                                        classNameLabel="font-semibold text-sm"
                                    />
                                ) : (
                                    buttonText
                                )
                            }
                        />
                    </DialogFooter>
                </FormValues>
            </DialogContent>
        </Dialog>
    )
}

export default DialogEvent