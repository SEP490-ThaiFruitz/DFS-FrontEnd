import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FormDateControl } from '@/components/global-components/form/form-date-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { FormCertificateSafeTypes } from '@/zod-safe-types/product-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, CirclePlusIcon, Clock, Edit, Info, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

export interface Certificate {
    id: string,
    name: string
    agency: string
    issueDate: Date
    expiryDate: Date
    details: string
}

interface CertificationProps {
    formProduct: UseFormReturn<any>
}

const Certification = ({ formProduct }: Readonly<CertificationProps>) => {
    const [isCerticicateForm, setIsCerticicateForm] = useState<boolean>(false);

    const form = useForm<z.infer<typeof FormCertificateSafeTypes>>({
        resolver: zodResolver(FormCertificateSafeTypes),
        defaultValues: {
            expiryDate: undefined,
        }
    });

    const onSubmit = async (values: z.infer<typeof FormCertificateSafeTypes>) => {
        const certificates = formProduct.getValues("certificates");
        const certificateIndex = certificates.findIndex((certificate: Certificate) => certificate.id === values.id);
        const certificateNameIndex = certificates.findIndex((certificate: Certificate) => certificate.name === values.name);

        if (certificateIndex >= 0) {
            if (certificateNameIndex >= 0 && certificateIndex !== certificateNameIndex) {
                toast.error("Tên chứng chỉ đã tồn tại");
                return;
            }
            const updatedCertificates = [...certificates];
            updatedCertificates[certificateIndex] = { ...values };
            formProduct.setValue("certificates", updatedCertificates);
        } else {
            if (certificateNameIndex >= 0) {
                toast.error("Tên chứng chỉ đã tồn tại");
                return;
            }
            formProduct.setValue("certificates", [...certificates, { id: `${certificates.length + 1}`, ...values }])
        }
        handlerCloseForm();
    };


    const isCertificateValid = (expiryDate: Date | undefined) => {
        if (expiryDate === undefined)
            return true;

        const today = new Date()
        return today < expiryDate
    }

    const handlerSetUpdateForm = (cert: Certificate) => {
        setIsCerticicateForm(true)
        form.reset({
            id: cert.id,
            agency: cert.agency,
            name: cert.name,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            details: cert.details
        })
    }

    const handlerCloseForm = () => {
        form.reset({
            id: "",
            agency: "",
            name: "",
            issueDate: new Date(),
            expiryDate: undefined,
            details: ""
        });
        setIsCerticicateForm(false)
    }
    const buttonLable = form.getValues("id") ? "Cập nhật" : "Tạo mới"
    const buttonLoading = form.getValues("id") ? "Đang cập nhật..." : "Đang tạo mới..."

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {formProduct?.getValues("certificates")?.map((cert: Certificate) => (
                    <Card key={cert.id} className="border shadow-sm hover:shadow transition-shadow relative group hover:cursor-pointer">
                        <div className="absolute z-10 hidden group-hover:flex -top-3 -right-3 space-x-2 bg-white">
                            <button
                                className="p-1 w-fit rounded-md bg-blue-600 text-white cursor-pointer"
                                onClick={() => handlerSetUpdateForm(cert)}
                            >
                                <Edit className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => formProduct.setValue("certificates", formProduct.getValues("certificates").filter((c: Certificate) => c.id !== cert.id))}
                                className="p-1 w-fit rounded-md bg-red-600 text-white cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                        <div className={`h-2 w-full rounded-se-lg rounded-ss-lg ${isCertificateValid(cert.expiryDate) ? "bg-green-500" : "bg-red-500"}`} />
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-lg">{cert.name}</h3>
                                <Badge className="min-w-fit" variant={isCertificateValid(cert.expiryDate) ? "outline" : "destructive"}>
                                    {isCertificateValid(cert.expiryDate) ? "Còn hiệu lực" : "Hết hạn"}
                                </Badge>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <Info className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Cấp bởi:</span>
                                    <span className="ml-2 font-medium">{cert.agency}</span>
                                </div>

                                <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">Ngày cấp:</span>
                                    <span className="ml-2 font-medium">{formatTimeVietNam(new Date(cert.issueDate))}</span>
                                </div>
                                {cert.expiryDate && (
                                    <div className="flex items-center">
                                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Ngày hết hạn:</span>
                                        <span className="ml-2 font-medium">{formatTimeVietNam(new Date(cert.expiryDate))}</span>
                                    </div>
                                )}
                                <div className="mt-3 text-sm text-muted-foreground line-clamp-2 cursor-help">{cert.details}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <button
                    onClick={() => setIsCerticicateForm(true)}
                    type='button'
                    className={`text-center border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
                >
                    <div className="flex items-center sm:p-5 space-x-5 font-bold">
                        <CirclePlusIcon />
                        <span>Thêm mới</span>
                    </div>
                </button>
                {isCerticicateForm && (
                    <Dialog open={isCerticicateForm} onOpenChange={handlerCloseForm}>
                        <DialogContent className="w-full">
                            <DialogHeader>
                                <DialogTitle>{`${buttonLable} chứng chỉ`}</DialogTitle>
                            </DialogHeader>
                            <FormValues form={form} onSubmit={onSubmit} >
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
                                <ButtonCustomized
                                    type="submit"
                                    className="max-w-fit bg-green-700 hover:bg-green-800"
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
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            {formProduct.formState.errors.certificates && (
                <div className="text-sm text-red-500 mt-1">{formProduct.formState.errors.certificates.message as string}</div>
            )}
        </>
    )
}

export default Certification
