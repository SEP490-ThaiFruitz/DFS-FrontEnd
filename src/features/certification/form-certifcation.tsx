"use client"

import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormDateControl } from '@/components/global-components/form/form-date-control';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FormCertificateSafeTypes } from '@/zod-safe-types/product-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { FormValues } from '@/components/global-components/form/form-values';
import { toast } from 'sonner';
import { API } from '@/actions/client/api-config';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CERTIFICATION_KEY } from '@/app/key/comm-key';
import { format } from 'date-fns';
import { Certification } from './list-certification';

interface FormCertificationProps {
    isOpen: boolean
    certification?: Certification,
    onClose: () => void
}

const FormCertification = ({ certification, onClose, isOpen }: Readonly<FormCertificationProps>) => {
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof FormCertificateSafeTypes>>({
        resolver: zodResolver(FormCertificateSafeTypes),
        defaultValues: {
            expiryDate: undefined,
        }
    });
    useEffect(() => {
        if (certification) {
            form.reset({
                id: certification.id.toString(),
                agency: certification.agency,
                name: certification.name,
                image: certification.image,
                issueDate: new Date(certification.issueDate),
                expiryDate: certification.expiryDate ? new Date(certification.expiryDate) : undefined,
                details: certification.details ?? ""
            })
        }
    }, [certification])

    const onSubmit = async (values: z.infer<typeof FormCertificateSafeTypes>) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name)
            formData.append("agency", values.agency)
            if (values.image) {
                formData.append("image", values.image[0])
            }
            formData.append("issueDate", format(values.issueDate, "yyyy-MM-dd"));
            if (values.expiryDate) {
                formData.append("expiryDate", format(values.expiryDate, "yyyy-MM-dd"))
            }
            if (values.details) {
                formData.append("details", values.details)
            }

            const response = values.id ? await API.update(`/Certifications/${values.id}`, formData) :
                await API.post("/Certifications", formData)

            if (response) {
                onClose()
                toast.success(values.id ? "Cập nhật chứng chỉ thành công" : "Tạo chứng chỉ thành công")
                queryClient.invalidateQueries({ queryKey: [CERTIFICATION_KEY.CERTIFICATION_MANAGE] })
            }
        } catch (error) {
            toast.error("Lỗi hệ thống")
        }
    };

    const buttonLable = form.getValues("id") ? "Cập nhật" : "Tạo mới"
    const buttonLoading = form.getValues("id") ? "Đang cập nhật..." : "Đang tạo mới..."

    const handlerCloseForm = () => {
        form.reset({
            id: "",
            agency: "",
            image: null,
            name: "",
            issueDate: new Date(),
            expiryDate: undefined,
            details: ""
        });
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handlerCloseForm}>
            <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{`${buttonLable} chứng chỉ`}</DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full max-h-[600px] py-3 px-5">
                    <FormValues form={form} onSubmit={onSubmit} classNameForm='grid sm:grid-cols-2 sm:gap-10 px-1'>
                        <div className='space-y-3'>
                            <FormInputControl
                                form={form}
                                disabled={form.formState.isSubmitting}
                                name='name'
                                label='Tên'
                                require
                            />
                            <FormInputControl
                                form={form}
                                disabled={form.formState.isSubmitting}
                                name='agency'
                                label='Cấp bởi'
                                require
                            />
                            <FormDateControl
                                form={form}
                                disabled={form.formState.isSubmitting}
                                name='issueDate'
                                label='Ngày cấp'
                                require
                            />
                            <FormDateControl
                                form={form}
                                disabled={form.formState.isSubmitting}
                                name='expiryDate'
                                label='Ngày hết hạn'
                            />
                            <FormTextareaControl
                                form={form}
                                disabled={form.formState.isSubmitting}
                                name='details'
                                label='Nội dung'
                            />
                        </div>
                        <FormFileControl
                            form={form}
                            name="image"
                            classNameInput="h-30 w-full"
                            mutiple={false}
                            type={"image/jpeg, image/jpg, image/png, image/webp"}
                            disabled={form.formState.isSubmitting}
                            label="Ảnh chứng chỉ"
                            require={certification?.id == undefined}
                        />
                        <ButtonCustomized
                            type="submit"
                            className="px-2 min-w-32 max-w-fit bg-sky-600 hover:bg-sky-700"
                            variant="secondary"
                            disabled={form.formState.isSubmitting}
                            label={
                                form.formState.isSubmitting ? (
                                    <WaitingSpinner
                                        variant="pinwheel"
                                        label={buttonLoading}
                                        className="font-semibold"
                                        classNameLabel="font-semibold text-sm"
                                    />
                                ) : (
                                    buttonLable
                                )
                            }
                        />
                    </FormValues>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}


export default FormCertification