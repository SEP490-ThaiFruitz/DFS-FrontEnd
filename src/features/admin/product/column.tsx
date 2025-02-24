import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Category } from '../category/column';
import Link from 'next/link';

export type Product = {
    id: string;
    name: string;
    category: {
        id: string,
        name: string
    },
    thumbnail: string;
    description: string;
    type: string;
    isActive: boolean;
    isDeleted: boolean;
    createDate: string;
    updateDate: string;
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: "Tên",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: "Loại",
        cell: ({ row }) => {
            const category = row.getValue<Category>("category");
            return (
                <p>{category?.name}</p>
            )
        },
    },
    {
        accessorKey: "thumbnail",
        header: "Ảnh",
        cell: ({ row }) => {
            const thumbnailUrl = row.getValue("thumbnail");
            const name = row.getValue("name");
            return (
                <Image
                    src={thumbnailUrl as string ?? "/images/dried-fruit.webp"}
                    height={100}
                    width={100}
                    alt={`${name}`}
                />
            );
        },
    },
    {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive");
            return (
                <Badge className={`border ${isActive ? 'border-green-400 text-green-700' : 'border-red-400 text-red-700'}`} variant="outline">
                    {isActive ? "Đang bán" : "Đã ngưng bán"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "actions",
        header: "Hành động",
        cell: ({ row }) => {
            const product = row.original;
            return (
                <div className="flex gap-2">
                    <Link href={`/admin/product/${product.id}`} >
                        <Button
                            variant="outline"
                            className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                            <Eye />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                        onClick={() => console.log("Cập nhật:", product)}
                    >
                        <Pencil />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => console.log("Xóa:", product)}
                    >
                        <Trash2 />
                    </Button>
                </div>
            );
        }
    }
]
