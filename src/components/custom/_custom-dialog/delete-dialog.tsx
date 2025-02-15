import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';

interface DeleteDialogProps {
    name: string,
    deleteFunction: (id: string) => Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    id: string
}


export function DeleteDialog({ name, deleteFunction, id }: DeleteDialogProps) {
    const [open, setOpen] = useState(false);
    const [submiting, setSubmitting] = useState(false);
    const onSubmit = async () => {
        setSubmitting(true)
        try {
            await deleteFunction(id);
            setOpen(false);
        } catch (error) {
            console.log({ error });
        }

        setSubmitting(false)
    };

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button
                variant="outline"
                className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            >
                <Trash2 />
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
                <DialogDescription>
                    Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {name}?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button">Hủy</Button>
                </DialogTrigger>
                <Button disabled={submiting} onClick={onSubmit} variant="destructive" type="submit">{submiting ? <WaitingSpinner
                    variant="pinwheel"
                    label="Đang xóa..."
                    className="font-semibold "
                    classNameLabel="font-semibold text-sm"
                /> : "Xác nhận"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}
