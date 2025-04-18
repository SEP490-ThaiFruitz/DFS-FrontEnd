import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TabsContent } from '@/components/ui/tabs'
import React, { useState } from 'react'
import { ProductImage } from './page'
import { CirclePlusIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FormFileControl } from '@/components/global-components/form/form-file-control'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FormImageSafeTypes } from '@/zod-safe-types/product-safe-types'
import { z } from 'zod'
import { FormValues } from '@/components/global-components/form/form-values'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProductImages, deleteProductImage } from '@/actions/product'
import { toast } from 'sonner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import ImagePreview from '@/components/custom/_custom-image/image-preview'

interface ProductImageWithName extends ProductImage {
    name?: string;
}

interface ImageOtherTab {
    images: ProductImage[],
    productId: string,
}
const ImageOtherTab = ({ images, productId }: Readonly<ImageOtherTab>) => {
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [imageDelete, setImageDelete] = useState<ProductImageWithName | undefined>(undefined)

    const form = useForm<z.infer<typeof FormImageSafeTypes>>({
        resolver: zodResolver(FormImageSafeTypes),
    });
    const onSubmit = async (values: z.infer<typeof FormImageSafeTypes>) => {
        const formData = new FormData();
        formData.append("productId", productId)
        values.images.forEach((image: File) => {
            formData.append("images", image);
        });
        createImagesMutation(formData)
    }
    const queryClient = useQueryClient();
    const { mutate: createImagesMutation, isPending } = useMutation({
        mutationFn: async (values: FormData) => {
            try {
                const res = await createProductImages(values, productId)
                if (!res?.isSuccess) {
                    throw new Error("Lỗi tạo mới hình ảnh")
                }
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống")
            }
        },
        onSuccess: () => {
            toast.success("Tạo thành công")
            setIsCreate(false)
            queryClient.invalidateQueries({ queryKey: ["detail-mange", productId] })
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })

    return (
        <TabsContent value="image">
            <Card>
                <CardHeader className='border-b-2'>
                    <CardTitle>Ảnh phụ sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className='p-5'>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                        {images?.map((image: ProductImage, index: number) => (
                            <div key={image.id} className="my-2 flex flex-col justify-between border rounded-sm relative group hover:cursor-pointer">
                                <ImagePreview
                                    className="object-cover rounded-lg w-full"
                                    images={[image.imageUrl, ...images.filter(x => x.id !== image.id).map((img: ProductImage) => img.imageUrl)]}
                                />
                                <div className='text-center font-bold py-5'>Ảnh {index + 1}</div>
                                <button
                                    onClick={() => setImageDelete({ ...image, name: `Ảnh ${index + 1}` })}
                                    className="absolute hidden group-hover:flex -top-3 -right-3 p-1 w-fit rounded-md bg-red-600 text-white cursor-pointer"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => setIsCreate(true)}
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
            {isCreate && (
                <Dialog open={isCreate} onOpenChange={() => setIsCreate(false)}>
                    <DialogContent className="w-full">
                        <DialogHeader>
                            <DialogTitle>Thêm ảnh</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="w-full max-h-[600px] overflow-y-auto p-4">
                            <FormValues form={form} onSubmit={onSubmit} >
                                <FormFileControl
                                    form={form}
                                    mutiple={true}
                                    disabled={isPending}
                                    name='images'
                                    label='Hình ảnh'
                                    require
                                    type={"image/jpeg, image/jpg, image/png, image/webp"}
                                />
                                <ButtonCustomized
                                    type="submit"
                                    className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
                                    variant="secondary"
                                    disabled={isPending}
                                    label={
                                        isPending ? (
                                            <WaitingSpinner
                                                variant="pinwheel"
                                                label={"Đang tạo mới..."}
                                                className="font-semibold"
                                                classNameLabel="font-semibold text-sm"
                                            />
                                        ) : (
                                            "Tạo mới"
                                        )
                                    }
                                />
                            </FormValues>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
            {imageDelete && (
                <DeleteDialog
                    id={imageDelete.id}
                    isOpen={imageDelete !== undefined}
                    onClose={() => setImageDelete(undefined)}
                    name={imageDelete?.name}
                    deleteFunction={deleteProductImage}
                    refreshKey={[["detail-mange", productId]]}
                />)}
        </TabsContent>
    )
}

export default ImageOtherTab