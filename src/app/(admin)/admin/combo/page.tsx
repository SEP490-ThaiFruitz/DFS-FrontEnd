"use client"

import { API } from "@/actions/client/api-config"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { DataTable } from "@/components/global-components/data-table/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { CirclePlus, Eye, Images, Star, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface Combo {
    id: string
    name: string
    image: string
    capacity: number
    comboType: string
    event: string
    isLocked: boolean
    isCustomer: boolean
    createdOnUtc: string
    isDeleted: boolean
}

function ComboPage() {
    const { data: combos } = useFetch<ApiResponse<Combo[]>>("/Combos", ["combos"])
    const [comboRemove, setComboRemove] = useState<Combo | undefined>(undefined)

    const columns: ColumnDef<Combo>[] = [
        {
            accessorKey: "image",
            header: "Hình ảnh",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.image ? (
                        <ImagePreview
                            images={[row.original.image]}
                            className="h-12 w-12 object-cover rounded"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                            <Images className="h-6 w-6 text-muted-foreground" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Tên Combo",
            cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
        },
        {
            accessorKey: "event",
            header: "Sự kiện",
            cell: ({ row }) => <div>{row.original.event}</div>,
        },
        {
            accessorKey: "capacity",
            header: "Sức chứa",
            cell: ({ row }) => <div className="text-center">{row.original.capacity}</div>,
        },
        {
            accessorKey: "comboType",
            header: "Loại Combo",
            cell: ({ row }) => (
                <Badge variant="outline" className={`capitalize ${row.original.comboType === "Fixed" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}`}>
                    {row.original.comboType === "Fixed" ? "Cố định" : "Tùy chỉnh"}
                </Badge>
            ),
        },


        {
            accessorKey: "isCustomer",
            header: "Khách hàng",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.isCustomer ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>Khách</span>
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <span>Công ty</span>
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "createdOnUtc",
            header: "Ngày tạo",
            cell: ({ row }) => <div>{formatTimeVietNam(new Date(row.original.createdOnUtc), true)}</div>,
        },
        {
            accessorKey: "isLocked",
            header: "Trạng thái",
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.isLocked ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                            <span>Khóa</span>
                        </Badge>
                    ) : (
                        <Badge variant="default" className="flex items-center gap-1">
                            <span>Hoạt động</span>
                        </Badge>
                    )}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link href={`/admin/combo/${row.original.id}`}>
                        <Button
                            variant="outline"
                            className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        >
                            <Eye />
                        </Button>
                    </Link>
                    {!row.original.isLocked && (
                        <Button
                            variant="outline"
                            onClick={() => setComboRemove(row.original)}
                            className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 />
                        </Button>
                    )}
                </div>
            ),
        },
    ]

    const handleDelete = async (id: string) => {
        return await API.remove(`/Combos/${id}`)
    }

    return (
        <div className="m-10">
            <div className='flex justify-between items-center'>
                <div className='text-2xl font-semibold leading-none tracking-tight'>Danh sách gói quà</div>
                <Link href="/admin/combo/create">
                    <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                        <CirclePlus />
                        Tạo mới
                    </Button>
                </Link>
            </div>

            <DataTable data={combos?.value ?? []} columns={columns} searchFiled="name" />
            {comboRemove && (
                <DeleteDialog
                    deleteFunction={handleDelete}
                    name={comboRemove.name}
                    isOpen={comboRemove !== undefined}
                    onClose={() => {
                        setComboRemove(undefined);
                    }}
                    refreshKey={[["combos"]]}
                    id={comboRemove.id}
                />
            )}
        </div>
    )
}

export default ComboPage

