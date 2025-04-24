import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import ProductSelection from './product-selection'
import { Button } from '@/components/ui/button'

interface DialogProductProps {
    form: UseFormReturn<any>,
    isOpen: boolean,
    onClose: () => void,
}

const DialogProduct = ({ form, onClose, isOpen }: Readonly<DialogProductProps>) => {
    const [isUpdate, setIsUpdate] = useState<boolean>(false)
    const handleConfirm = () => {
        setIsUpdate(!isUpdate)
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[560px] md:min-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Chọn sản phẩm</DialogTitle>
                </DialogHeader>
                <ScrollArea className="w-full max-h-[600px] py-3 px-5">
                    <ProductSelection isUpdate={isUpdate} form={form} />
                </ScrollArea>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>
                        Hủy
                    </Button>
                    <Button type="button" className='bg-sky-600 hover:bg-sky-700 text-white' onClick={handleConfirm}>
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DialogProduct