import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { z } from 'zod'
import { DocumentSafeTypes } from '@/zod-safe-types/product-batch-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'

interface DialogDocumentProps {
    form: UseFormReturn<any>,
    isOpen: boolean,
    onClose: () => void,
}

const DialogDocument = ({ form: fromProductPatch, onClose, isOpen }: Readonly<DialogDocumentProps>) => {

    const form = useForm<z.infer<typeof DocumentSafeTypes>>({
        resolver: zodResolver(DocumentSafeTypes),
    })

    const onSubmit = async (values: z.infer<typeof DocumentSafeTypes>) => {
        const documents = fromProductPatch.getValues("documents") || []
        if(documents.find((document: any) => document.name.toLowerCase().trim() === values.name.toLowerCase().trim())){
            form.setError("name", {
                message:  "Tên tài liệu này đã có"
            })
            return;
        }

        fromProductPatch.setValue("documents", [...documents, {
            name: values.name,
            document: values.document
        }])
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[560px] md:min-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chọn tài liệu</DialogTitle>
                </DialogHeader>

                <FormInputControl
                    form={form}
                    name="name"
                    disabled={form.formState.isSubmitting}
                    label="Tên tài liệu"
                    require
                />
                <FormFileControl
                    mutiple={false}
                    form={form}
                    name="document"
                    type="
                    image/jpeg,
                    image/jpg,
                    image/png,
                    image/webp,
                    application/pdf,
                    application/msword,
                    application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                    application/vnd.ms-excel,
                    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-powerpoint,
                    application/vnd.openxmlformats-officedocument.presentationml.presentation,
                    text/plain,
                    .zip,
                    .rar
                  "
                    disabled={form.formState.isSubmitting}
                    label="Tên tài liệu"
                    require
                />

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="button" className='bg-sky-600 hover:bg-sky-700 text-white' onClick={form.handleSubmit(onSubmit)}>
                        Thêm mới
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogDocument