"use client"

import { Calendar, CirclePlusIcon, Clock, Edit, Info, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TabsContent } from "@/components/ui/tabs"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { useEffect, useState } from "react"
import { createCertificate, deleteProductCertification, updateCertificate } from "@/actions/product"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormValues } from "@/components/global-components/form/form-values"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormCertificateSafeTypes } from "@/zod-safe-types/product-safe-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { FormInputControl } from "@/components/global-components/form/form-input-control"
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { toast } from "sonner"
import { FormDateControl } from "@/components/global-components/form/form-date-control"

export interface Certificate {
    id: string
    name: string
    agency: string
    issueDate: Date
    expiryDate: Date | undefined
    details: string
}

interface CertificationTabProps {
    certificates: Certificate[],
    productId: string,
}

const CertificationTab = ({ certificates: intial, productId }: Readonly<CertificationTabProps>) => {
    const [certificates, setCertificates] = useState<Certificate[]>(intial)
    const [certificateDelete, setCertificateDelete] = useState<Certificate | undefined>(undefined)
    const [isCerticicateForm, setIsCerticicateForm] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const isCertificateValid = (expiryDate: Date | undefined) => {
        if (expiryDate === undefined)
            return true;

        const today = new Date()
        return today < expiryDate
    }

    useEffect(() => {
        setCertificates(intial)
    }, [intial])

    const { mutate: certifictionMutation, isPending } = useMutation({
        mutationFn: async (values: any) => {
            try {
                const { id,
                    agency,
                    name,
                    issueDate,
                    expiryDate,
                    details } = values;

                const createCertificateData = () => {
                    const baseData = {
                        productId,
                        agency,
                        name,
                        issueDate,
                        details
                    };
                    return expiryDate !== "" ? { ...baseData, expiryDate } : baseData;
                };

                const res = id === undefined
                    ? await createCertificate(createCertificateData())
                    : await updateCertificate(values)
                if (!res?.isSuccess) {

                    throw new Error(id === undefined ? "Lỗi tạo thêm chứng chỉ" : "Lỗi cập nhật chứng chỉ")
                }
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống")
            }
        },
        onSuccess: () => {
            toast.success("Tạo chứng chỉ thành công")
            handlerCloseForm();
            queryClient.invalidateQueries({ queryKey: ["detail-mange", productId] })
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })
    const form = useForm<z.infer<typeof FormCertificateSafeTypes>>({
        resolver: zodResolver(FormCertificateSafeTypes),
    });
    const onSubmit = async (values: z.infer<typeof FormCertificateSafeTypes>) => {
        certifictionMutation(values)
    }

    const handlerSetUpdateForm = (cert: Certificate) => {
        setIsCerticicateForm(true)
        form.reset({
            id: cert.id,
            agency: cert.agency,
            name: cert.name,
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate ?? undefined,
            details: cert.details
        })
    }


    const handlerCloseForm = () => {
        form.reset({
            id: undefined,
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
        <TabsContent value="certification">
            <Card className="w-full">
                <CardHeader className="border-b-2">
                    <CardTitle className="flex items-center">
                        Chứng chỉ sản phẩm
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {certificates.map((cert: Certificate) => (
                            <Card key={cert.id} className="border shadow-sm hover:shadow transition-shadow relative group hover:cursor-pointer">
                                <div className="absolute z-10 hidden group-hover:flex -top-3 -right-3 space-x-2 bg-white">
                                    <button
                                        className="p-1 w-fit rounded-md bg-blue-600 text-white cursor-pointer"
                                        onClick={() => handlerSetUpdateForm(cert)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => setCertificateDelete(cert)}
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
                            className={`text-center border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
                        >
                            <div className="flex items-center sm:p-5 space-x-5 font-bold">
                                <CirclePlusIcon />
                                <span>Thêm mới</span>
                            </div>
                        </button>
                    </div>
                </CardContent>
            </Card>
            {isCerticicateForm && (
                <Dialog open={isCerticicateForm} onOpenChange={handlerCloseForm}>
                    <DialogContent className="w-full">
                        <DialogHeader>
                            <DialogTitle>{`${buttonLable} chứng chỉ`}</DialogTitle>
                        </DialogHeader>
                        <FormValues form={form} onSubmit={onSubmit} >
                            <FormInputControl
                                form={form}
                                disabled={isPending}
                                name='name'
                                label='Tên'
                                require
                            />
                            <FormInputControl
                                form={form}
                                disabled={isPending}
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
                                disabled={isPending}
                                name='details'
                                label='Nội dung'
                            />
                            <ButtonCustomized
                                type="submit"
                                className="max-w-fit bg-green-700 hover:bg-green-800"
                                variant="secondary"
                                disabled={isPending}
                                label={
                                    isPending ? (
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
            {certificateDelete && (
                <DeleteDialog
                    id={certificateDelete.id}
                    isOpen={certificateDelete !== undefined}
                    onClose={() => setCertificateDelete(undefined)}
                    name={certificateDelete?.name}
                    deleteFunction={deleteProductCertification}
                    refreshKey={[["detail-mange", productId]]}
                />)}
        </TabsContent>
    )

}

export default CertificationTab

