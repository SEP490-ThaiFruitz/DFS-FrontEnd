"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { formatNumberWithUnit, formatVND } from '@/lib/format-currency'
import { ApiResponse, PageResult } from '@/types/types'
import { CirclePlus, Eye, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { VOUCHER_KEY } from '@/app/key/admin-key'
import { DataTableCustom } from '@/components/global-components/data-table/data-table-custom'
import { API } from '@/actions/client/api-config'
import { DataTableSkeleton } from '@/components/global-components/custom-skeleton/data-table-skeleton'

export interface Voucher {
    id: string;
    name: string;
    code: string | null;
    value: number;
    discountType: "Percentage" | "Amount";
    startDate: string;
    endDate: string;
    minimumOrderAmount: number;
    maximumDiscountAmount: number;
    quantity: number;
}


function VoucherPage() {
    const { data: vouchers, isLoading } = useFetch<ApiResponse<PageResult<Voucher>>>(`/Vouchers?pageIndex=${1}&pageSize=${1000}`, [VOUCHER_KEY.VOUCHER])
    const [voucher, setVoucher] = useState<Voucher | undefined>(undefined);

    const getCouponStatus = (quantity: number, startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (quantity === 0)
            return { status: 'Đã hết', color: 'bg-gray-50 text-gray-600' };

        if (now < start) {
            return { status: 'Chuẩn bị diễn ra', color: 'bg-yellow-50 text-yellow-600' };
        } else if (now >= start && now <= end) {
            return { status: 'Đang diễn ra', color: 'bg-green-50 text-green-600' };
        } else if (now > end) {
            return { status: 'Đã hết hạn', color: 'bg-red-50 text-red-600' };
        }
    };
    const columns: ColumnDef<Voucher>[] = [
        {
            header: 'Tên Mã Giảm Giá',
            accessorKey: 'name',
        },
        {
            header: 'Mã',
            accessorKey: 'code',
        },
        {
            header: 'Loại',
            accessorKey: 'discountType',
            cell: ({ row }) =>
                row.original.discountType === "Percentage" ? (
                    <div className="bg-blue-50 text-blue-600 w-fit py-1 px-2 rounded-lg">Phần trăm</div>
                ) : (
                    <div className="bg-orange-50 text-orange-600 w-fit py-1 px-2 rounded-lg">Cố định</div>
                )
        },
        {
            header: 'Giảm Giá',
            accessorKey: 'value',
            cell: ({ row }) => <div className='font-bold'>
                {row.original.discountType === "Percentage" ? formatNumberWithUnit(row.original.value, "%") : formatVND(row.original.value)}
            </div>
        },
        {
            header: 'Số lượng',
            accessorKey: 'quantity',
        },
        {
            header: 'Trạng thái',
            cell: ({ row }) => {
                const colorStatus: { status: string, color: string } | undefined = getCouponStatus(row.original.quantity, row.original.startDate, row.original.endDate);
                return <div className={`w-fit py-1 px-2 rounded-lg ${colorStatus?.color}`}>
                    {colorStatus?.status}
                </div>
            }
        },
        {
            header: 'Hành động',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link href={`/admin/voucher/${row.original.id}`}>
                        <Button variant="outline" className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                            <Eye />
                        </Button>
                    </Link>
                    <Link href={`/admin/voucher/update/${row.original.id}`}>
                        <Button variant="outline" className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white">
                            <Pencil />
                        </Button>
                    </Link>
                    <Button
                        onClick={() => setVoucher(row.original)}
                        variant="outline"
                        className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <Trash2 />
                    </Button>
                </div>
            )
        }
    ];

    const deleteVoucher = async (id: string) => {
        return await API.remove(`/Vouchers/${id}`)
    }

    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Mã giảm giá</p>
                <Link href="/admin/voucher/create">
                    <Button size={"sm"} className='text-white bg-sky-600 hover:bg-sky-700'>
                        <CirclePlus />
                        Tạo mã giảm giá
                    </Button>
                </Link>
            </div>
            <div className="mt-8 bg-white rounded-lg shadow border">
                {isLoading ? <DataTableSkeleton /> :
                    <DataTableCustom
                        data={vouchers?.value?.items || []}
                        columns={columns}
                        placeholder='tên mã giả giá'
                        searchFiled="name"
                    />}
            </div>
            <DeleteDialog
                id={voucher?.id ?? ""}
                isOpen={voucher !== undefined}
                onClose={() => setVoucher(undefined)}
                name={voucher?.name}
                deleteFunction={deleteVoucher}
                refreshKey={[[VOUCHER_KEY.VOUCHER]]} />
        </div>
    )
}

export default VoucherPage