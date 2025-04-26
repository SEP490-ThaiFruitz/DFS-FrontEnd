"use client"

import { Button } from '@/components/ui/button'
import { CirclePlusIcon, Trash2, File } from 'lucide-react'
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import DialogDocument from './dialog-document'
import ImagePreview from '@/components/custom/_custom-image/image-preview'

interface DocumentProps {
    form: UseFormReturn<any>
}

const Document = ({ form }: Readonly<DocumentProps>) => {
    const documents = form.watch("documents") || []
    const [isCreate, setIsCreate] = useState<boolean>()

    const handleRemoveDocument = (index: number) => {
        const currentDocuments = [...documents]
        currentDocuments.splice(index, 1)
        form.setValue("documents", currentDocuments)
    }
    return (
        <div className="mt-4">
            <div className="flex items-center">
                <div className="mr-auto font-bold text-2xl">Danh sách tài liệu </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 mt-4 gap-5 sm:gap-10">
                {documents.map((doc: any, index: number) => (
                    <div key={index + 1} className="flex items-center justify-between p-3 border rounded-lg gap-5 w-full">
                        <div className='w-full'>
                            <div className='font-bold mb-2'>
                                {doc.name}
                            </div>
                            <div
                                className="flex items-center rounded-lg bg-neutral-400/10 p-1"
                            >
                                {doc.document[0].type.startsWith("image/") ? (
                                    <ImagePreview
                                        images={[doc.document[0].preview]}
                                        className="mr-2 size-10 rounded object-cover hover:cursor-pointer"
                                    />
                                ) : (
                                    <File onClick={() => window.open(doc.document[0].preview, '_blank')} className="mr-2 size-10 text-neutral-500 hover:cursor-pointer hover:scale-105 ease-linear" />
                                )}
                                <span className="flex-1 truncate text-neutral-600 text-xs tracking-tighter dark:text-neutral-400">
                                    {doc.document[0].name}
                                </span>
                            </div>
                        </div>
                        <Button type='button' disabled={form.formState.isSubmitting} className='shrink-0' variant="outline" size="icon" onClick={() => handleRemoveDocument(index)} aria-label="Xóa tài liệu">
                            <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                    </div>
                ))}
            </div>

            <Button
                type='button'
                size={"lg"}
                disabled={form.formState.isSubmitting}
                variant={"outline"}
                onClick={() => setIsCreate(true)}
                className={`text-center border shadow-sm rounded-xl p-2 hover:cursor-pointer mt-5`}
            >
                <div className="flex items-center sm:p-5 space-x-5 font-bold">
                    <CirclePlusIcon />
                    <span>Thêm mới</span>
                </div>
            </Button>
            {form.formState.errors.documents && (
                <div className="text-sm text-red-500 mt-1">{form.formState.errors.documents.message as string}</div>
            )}
            {isCreate && <DialogDocument form={form} isOpen={isCreate} onClose={() => setIsCreate(false)} />}
        </div >
    )
}

export default Document