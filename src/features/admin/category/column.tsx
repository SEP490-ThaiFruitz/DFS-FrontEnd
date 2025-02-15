import { deleteCategory } from '@/actions/category';
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog';
import { UpdateCategoryDialog } from '@/components/custom/_custom-dialog/update-category-dialog';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { useState } from 'react';

export type Category = {
    id: string,
    name: string;
    description: string;
    thumbnail: string;
    isActive: boolean;
}

export const columns: ColumnDef<Category>[] = [
    {
        header: "STT",
        cell: ({ row, table }) => {
            const pageSize = table.getState().pagination.pageSize;
            const pageIndex = table.getState().pagination.pageIndex;
            return <p>{row.index + 1 + pageIndex * pageSize}</p>;
        },
    },
    {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Mô tả",
        cell: ({ row }) => <div className="lowercase">{row.getValue("description")}</div>,
    },
    {
        accessorKey: "thumbnail",
        header: "Ảnh",
        cell: ({ row }) => {
            const thumbnail = `${process.env.NEXT_PUBLIC_URL_IMAGE}/${row.getValue("thumbnail")}`;
            const name = row.getValue("name");
            return (
                <Image
                    src={thumbnail || `/images/dried-fruit.webp`}
                    height={100}
                    width={100}
                    alt={name as string}
                />
            );
        },
    },
    {
        accessorKey: "actions",
        header: "Hành động",
        cell: ({ row }) => {
            const category = row.original;
            return <ActionButtons category={category} />;
        },
    },
]

const ActionButtons = ({ category }: { category: Category }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex gap-2">
            <UpdateCategoryDialog isOpen={open} onClose={() => setOpen(!open)} category={category} />
            <DeleteDialog id={category.id} name={category.name} deleteFunction={deleteCategory} />
        </div>
    );
};

