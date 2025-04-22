"use client"

import { CirclePlus, Pencil, Trash2, } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ApiResponse } from '@/types/types';
import { formatTimeVietNam } from '@/lib/format-time-vietnam';
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog';
import { API } from '@/actions/client/api-config';
import ImagePreview from '@/components/custom/_custom-image/image-preview';
import DialogEvent from './event-dialog';
import { DataTableSkeleton } from '@/components/global-components/custom-skeleton/data-table-skeleton';
import { DataTableCustom } from '@/components/global-components/data-table/data-table-custom';
import { EVENT_KEY } from '@/app/key/admin-key';

export interface Event {
    id: string,
    name: string,
    image: string,
    description: string,
    startDate: string,
    endDate: string
}


const EventPage = () => {
    const { data: events, isLoading } = useFetch<ApiResponse<Event[]>>("/Events", [EVENT_KEY.EVENT])
    const [eventRemove, setEventRemove] = useState<Event | undefined>(undefined)
    const [eventEdit, setEventEdit] = useState<Event | undefined>(undefined)
    const [formEvent, setFormEvent] = useState<boolean>(false)

    const columns: ColumnDef<Event>[] = [
        {
            accessorKey: "image",
            header: "Hình ảnh",
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    {row.original.image && (
                        <ImagePreview
                            images={[row.original.image]}
                            className="h-30 w-30 rounded-md object-cover"
                        />
                    )}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: "Tên sự kiện",
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => {
                const description = row.original.description
                return (
                    <div className="max-w-[200px] truncate" title={description}>
                        {description}
                    </div>
                )
            },
        },
        {
            accessorKey: "startDate",
            header: "Ngày bắt đầu",
            cell: ({ row }) => {
                const date = new Date(row.original.startDate)
                return formatTimeVietNam(date)
            },
        },
        {
            accessorKey: "endDate",
            header: "Ngày kết thúc",
            cell: ({ row }) => {
                const date = new Date(row.original.endDate)
                return formatTimeVietNam(date)
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const date = new Date();
                const startDate = new Date(row.original.startDate).getTime();
                const endDate = new Date(row.original.endDate).getTime();
                const now = date.getTime();

                const isOngoing = now >= startDate && now <= endDate;

                return isOngoing ? (
                    <div className="bg-green-50 text-green-600 w-fit py-1 px-2 rounded-lg">Đang diễn ra</div>
                ) : (
                    <div className="bg-red-50 text-red-600 w-fit py-1 px-2 rounded-lg">Đã kết thúc</div>
                );
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setFormEvent(true)
                            setEventEdit(row.original)
                        }}
                        className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                    >
                        <Pencil />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => setEventRemove(row.original)}
                    >
                        <Trash2 />
                    </Button>
                </div >
            ),
        },
    ]

    const handleDelete = async (id: string) => {
        return await API.remove(`/Events/${id}`)
    }

    return (
        <div className="m-10">
            <div className='flex justify-between items-center'>
                <div className='text-2xl font-semibold leading-none tracking-tight'>Danh sách sự kiện</div>
                <Button
                    onClick={() => {
                        setFormEvent(true)
                    }}
                    size={"sm"}
                    className='text-white bg-sky-600 hover:bg-sky-700'>
                    <CirclePlus />
                    Tạo mới
                </Button>

            </div>
            <div className="mt-8 bg-white rounded-lg shadow border">
                {isLoading ? <DataTableSkeleton /> :
                    <DataTableCustom
                        data={events?.value ?? []} columns={columns} searchFiled="name" placeholder='tên'
                    />
                }
            </div>

            {eventRemove && (
                <DeleteDialog
                    deleteFunction={handleDelete}
                    name={eventRemove.name}
                    isOpen={eventRemove !== undefined}
                    onClose={() => {
                        setEventRemove(undefined);
                    }}
                    refreshKey={[[EVENT_KEY.EVENT]]}
                    id={eventRemove.id}
                />
            )}
            {formEvent && (
                <DialogEvent
                    event={eventEdit}
                    isOpen={formEvent}
                    onClose={() => {
                        setFormEvent(false)
                        setEventEdit(undefined)
                    }}
                />
            )}
        </div>
    )
}

export default EventPage