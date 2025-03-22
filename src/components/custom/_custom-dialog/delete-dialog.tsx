import React from 'react'
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteDialogProps {
    deleteFunction: (id: string) => Promise<any>;
    isOpen: boolean;
    onClose: () => void
    id: string,
    button?: React.ReactNode,
    refreshKey?: [string, ...string[]][];
    title?: string,
    content?: React.ReactNode,
    name: string | undefined,
    message?: string,
    classNameButton?: string
}


export function DeleteDialog({ deleteFunction, id, onClose, isOpen, button, refreshKey, title, content, message = "Xóa", name = "", classNameButton = "" }: Readonly<DeleteDialogProps>) {
    const queryClient = useQueryClient();
    const { isPending: isSubmitting, mutateAsync: deleteItem } = useMutation({
        mutationFn: async () => {
            try {
                const res = await deleteFunction(id)
                if (res)
                    return
                throw new Error(res);
            } catch (error: any) {
                console.log(error);
                throw new Error(error?.message);
            }
        },
        onSuccess: () => {
            onClose();
            toast.success(`${message} ${name} thành công`)
            Promise.all(
                refreshKey?.map((key: [string, ...string[]]) => {
                    return queryClient.invalidateQueries({ queryKey: key });
                }) || []
            )
        },
        onError: (error) => {
            console.log(error)
            toast.error(`${message} ${name} thất bại`)
        }
    });

    return (<Dialog open={isOpen} onOpenChange={onClose}>
        {button && <DialogTrigger asChild>
            {button}
        </DialogTrigger>}
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title ?? "Bạn có chắc chắn không?"}</DialogTitle>
                <DialogDescription>
                    {content ?? `Thao tác này không thể hoàn lại. Bạn có chắc chắn muốn ${message.toLowerCase()} ${name} không?`}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <DialogTrigger asChild>
                    <Button variant="outline" type="button">Hủy</Button>
                </DialogTrigger>
                <Button className={classNameButton} disabled={isSubmitting} onClick={() => deleteItem()} variant="destructive" type="submit">{isSubmitting ? <WaitingSpinner
                    variant="pinwheel"
                    label="Đang thực hiện..."
                    className="font-semibold "
                    classNameLabel="font-semibold text-sm"
                /> : "Xác nhận"}</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}
