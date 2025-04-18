import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import { Button } from '@/components/ui/button'
import ProductSelection from './product-selection'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { API } from '@/actions/client/api-config'
import { AddSelectedProducts } from '@/zod-safe-types/combo-safe-types'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'

interface DialogProductProps {
    isOpen: boolean,
    onClose: () => void,
    maxQuantity: number,
    comboId: string,
    oldProductVariant: string[]
}

const DialogProduct = ({ maxQuantity, comboId, onClose, isOpen, oldProductVariant }: Readonly<DialogProductProps>) => {
    const form = useForm<z.infer<typeof AddSelectedProducts>>({
        resolver: zodResolver(AddSelectedProducts),
        defaultValues: {
            selectedProducts: []
        }
    });

    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof AddSelectedProducts>) => {
        try {
            const comboItems = values.selectedProducts.map((value) => ({ productVariantId: value.variantId, quantity: value.quantity }));
            const response = await API.post(`/Combos/${comboId}/items`, { comboId: comboId, comboItems })
            if (response) {
                toast.success("Thêm sản phẩm thành công")
                onClose()
                form.reset({
                    selectedProducts: []
                })
                queryClient.invalidateQueries({ queryKey: [comboId] })
            } else {
                toast.error("Thêm sản phẩm thất bại")
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => !form.formState.isSubmitting && onClose()}>
            <DialogContent className="min-w-[560px] md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Chọn sản phẩm</DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full max-h-[600px] py-3 px-5">
                    <ProductSelection oldProductVariant={oldProductVariant} maxQuantity={maxQuantity} form={form} />
                </ScrollArea>
                <DialogFooter>
                    <Button disabled={form.formState.isSubmitting} type="button" variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <ButtonCustomized
                        type="submit"
                        className="min-w-32  max-w-fit px-2 !h-10 !rounded-md bg-sky-600 hover:bg-sky-700"
                        variant="secondary"
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={form.formState.isSubmitting}
                        label={
                            form.formState.isSubmitting ? (
                                <WaitingSpinner
                                    variant="pinwheel"
                                    label="Đang xác nhận..."
                                    className="font-semibold "
                                    classNameLabel="font-semibold text-sm"
                                />
                            ) : (
                                "Xác nhận"
                            )
                        }
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogProduct