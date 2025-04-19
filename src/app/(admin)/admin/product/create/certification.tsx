import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import ImagePreview from '@/components/custom/_custom-image/image-preview'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { Calendar, CirclePlusIcon, Clock, Info, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

export interface Certificate {
    id: number,
    name: string
    image: any,
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
    const [selectedCertifications, setSelectedCertifications] = useState<Certificate[]>([]);
    const { data: certifications } = useFetch<Certificate[]>("/Certifications", ["certifications"])

    const onSubmit = () => {
        const certificates = formProduct.getValues("certificates");
        formProduct.setValue("certificates", [...selectedCertifications, ...certificates])

        handlerCloseForm();
    };


    const isCertificateValid = (expiryDate: Date | undefined | null) => {
        if (expiryDate === undefined || expiryDate === null)
            return true;
        const today = new Date()
        return today < new Date(expiryDate)
    }

    const handlerCloseForm = () => {
        setSelectedCertifications([]);
        setIsCerticicateForm(false)
    }

    const handleSelectCertfication = (certificate: Certificate) => {
        const selectedCertification = selectedCertifications.filter((cert) => cert.id === certificate.id)
        if (selectedCertification.length > 0) {
            setSelectedCertifications((prev) => prev.filter((cert) => cert.id !== certificate.id));
        } else {
            setSelectedCertifications((prev) => [certificate, ...prev])
        }
    }

    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {formProduct?.getValues("certificates")?.map((cert: Certificate) => (
                    <Card key={cert.id} className="border shadow-sm hover:shadow transition-shadow relative group hover:cursor-pointer">
                        <div className="absolute z-10 hidden group-hover:flex -top-3 -right-3 space-x-2 bg-white">
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
                            <div className="mb-4">
                                <ImagePreview initialHeight={30} images={[cert.image]} className="object-contain" />
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
                        <span>Chọn chứng chỉ</span>
                    </div>
                </button>
                {isCerticicateForm && (
                    <Dialog open={isCerticicateForm} onOpenChange={handlerCloseForm}>
                        <DialogContent className="min-w-[460px] md:min-w-[800px]">
                            <DialogHeader>
                                <DialogTitle>Chọn chứng chỉ</DialogTitle>
                            </DialogHeader>
                            <ScrollArea className="w-full max-h-[600px] pr-4">
                                {certifications?.map((certificate) => {
                                    const certSelected = formProduct?.getValues("certificates").find((cert: any) => cert.id === certificate.id)

                                    if (!certSelected) {
                                        return (
                                            <div key={certificate.id} className="pb-4 border-b">
                                                <div className="flex flex-col md:flex-row gap-4 items-start">
                                                    <div className="w-full md:w-1/3 aspect-square max-w-[200px] rounded-md overflow-hidden border">
                                                        {certificate.image && (
                                                            <ImagePreview
                                                                images={[certificate.image]}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        )}

                                                    </div>
                                                    <div className="flex-1 space-y-3">
                                                        <h3 className="text-lg font-medium">{certificate.name}</h3>
                                                        <div className="grid grid-cols-[80px_1fr] items-center gap-1 text-sm">
                                                            <span className="font-medium">Cơ quan:</span>
                                                            <span>{certificate.agency}</span>
                                                        </div>

                                                        <div className="grid grid-cols-[80px_1fr] items-center gap-1 text-sm">
                                                            <span className="font-medium">Ngày cấp:</span>
                                                            <span>{formatTimeVietNam(certificate.issueDate)}</span>

                                                        </div>

                                                        {certificate.expiryDate && (
                                                            <div className="grid grid-cols-[80px_1fr] items-center gap-1 text-sm">
                                                                <span className="font-medium">Hết hạn:</span>
                                                                <span>{formatTimeVietNam(certificate.expiryDate)}</span>
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-[80px_1fr] items-start gap-1 text-sm pt-1">
                                                            <span className="font-medium">Mô tả:</span>
                                                            <div>{certificate.details}</div>
                                                        </div>
                                                    </div>
                                                    <Checkbox onClick={() => handleSelectCertfication(certificate)} className='h-5 w-5' />
                                                </div>
                                            </div>)
                                    }
                                })}
                            </ScrollArea>
                            <ButtonCustomized
                                type="button"
                                onClick={onSubmit}
                                className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
                                variant="secondary"
                                label={(
                                    "Chọn chứng chỉ"
                                )
                                }
                            />
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
