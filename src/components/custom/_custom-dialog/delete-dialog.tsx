import React from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteDialogProps {
    name: string,
    deleteFunction: (id: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    isOpen: boolean;
    onClose: () => void
    id: string,
    isIcon?: boolean,
    refreshKey?: [string, string][]
}


export function DeleteDialog({ name, deleteFunction, id, onClose, isOpen, isIcon, refreshKey }: Readonly<DeleteDialogProps>) {
    const queryClient = useQueryClient();
    const { isPending: isSubmitting, mutateAsync: deleteItem } = useMutation({
        mutationFn: async () => {
            try {
                const res = await deleteFunction(id)
                if (!res.success)
                    throw new Error(res.message);
                return res.message;
            } catch (error) {
                console.log(error);
                throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
            }
        },
        onSuccess: (message: string) => {
            onClose();
            toast.success(message)
            Promise.all(
                refreshKey?.map((key: [string, string]) => {
                    return queryClient.invalidateQueries({ queryKey: key });
                }) || []
            )
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (<Dialog open={isOpen} onOpenChange={onClose}>
        {isIcon && <DialogTrigger asChild>
            <Button variant="outline" type="button">
                <Trash2 size={20} />
            </Button>
        </DialogTrigger>}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
                <DialogDescription>
                    Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa {name} không?
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button">Hủy</Button>
                </DialogTrigger>
                <Button disabled={isSubmitting} onClick={() => deleteItem()} variant="destructive" type="submit">{isSubmitting ? <WaitingSpinner
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
