"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { deleteVoucher } from '@/actions/voucher'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumberWithUnit, formatVND } from '@/lib/format-currency'
import { ApiResponse, PageResult } from '@/types/types'
import { CirclePlus, Eye, Filter, Pencil, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

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
    const [pageIndex, setPageIndex] = useState(1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    const { data: vouchers } = useFetch<ApiResponse<PageResult<Voucher>>>(`/Vouchers?pageIndex=${pageIndex}&pageSize=${pageSize}`)
    const [voucher, setVoucher] = useState<Voucher>();
    const [isDeleteVoucher, setIsDeleteVoucher] = useState(false);
    const form = useForm({
        defaultValues: {
            name: "",
            code: "",
            discount: "",
            discountType: "",
            startDate: "",
            endDate: "",
            minimumOrderAmount: "",
            maximumDiscount: "",
            quantity: "",
        },
    });

    const onSubmit = (data: any) => {
        console.log({ data })
    };

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
    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Mã giảm giá</p>
                <Link href="/admin/voucher/create">
                    <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                        <CirclePlus />
                        Tạo mã giảm giá
                    </Button>
                </Link>
            </div>
            {filter && (<div className='border p-5 rounded-lg shadow-sm mt-5 transform origin-top-right transition-all duration-5000 ease-in-out'>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10'>
                        <FormInputControl
                            form={form}
                            name="name"
                            disabled={form.formState.isSubmitting}
                            label="Tên giảm giá"
                        />
                        <FormInputControl
                            form={form}
                            name="code"
                            disabled={form.formState.isSubmitting}
                            label="Mã giảm giá"
                        />
                        <FormInputControl
                            form={form}
                            name="discount"
                            disabled={form.formState.isSubmitting}
                            label="Giảm giá"
                        />
                        <FormSelectControl
                            form={form}
                            name="discountType"
                            disabled={form.formState.isSubmitting}
                            label="Loại giảm giá"
                            items={[
                                { id: 'fixed', name: 'Cố định' },
                                { id: 'percentage', name: 'Phần trăm' }
                            ]}
                        />
                        <FormInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="startDate"
                            type='Date'
                            disabled={form.formState.isSubmitting}
                            label="Ngày bắt đầu"
                        />
                        <FormInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="endDate"
                            type='Date'
                            disabled={form.formState.isSubmitting}
                            label="Ngày kết thúc"
                        />
                        <FormNumberInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="minimumOrderAmount"
                            isMoney
                            disabled={form.formState.isSubmitting}
                            label="Số tiền đặt hàng tối thiểu"
                        />
                        <FormNumberInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="maximumDiscount"
                            isMoney
                            disabled={form.formState.isSubmitting}
                            label="Số tiền đặt hàng tối thiểu"
                        />
                        <FormNumberInputControl
                            classNameInput='block w-full'
                            form={form}
                            name="quantity"
                            disabled={form.formState.isSubmitting}
                            label="Số lượng"
                        />
                    </div>
                    <div className='space-x-7 mt-4'>
                        <Button
                            size={"sm"}
                            type="submit"
                            className="bg-green-500 text-white hover:bg-green-600"
                        >
                            <Search /> Tìm kiếm
                        </Button>
                        <Button
                            variant={"outline"}
                            size={"sm"}
                            type="button"
                            onClick={() => form.reset()}
                        >
                            <Trash2 /> Xóa
                        </Button>
                    </div>
                </FormValues>
            </div>)}
            <div className='mt-10 flex'>
                <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                        setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="w-fit whitespace-nowrap">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="[&_*[role=option]>span]:end-2 [&_*[role=option]>span]:start-auto [&_*[role=option]]:pe-8 [&_*[role=option]]:ps-2">
                        {[5, 10, 25, 50, 100, 1000].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button className='ml-auto' onClick={() => setFilter(!filter)} size={"icon"} variant={"outline"}>
                    <Filter />
                </Button>
            </div>
            <div className="mt-3 border overflow-hidden shadow-sm rounded-lg min-w-full max-w-6xl overflow-x-auto">
                <Table className='overflow-x-auto'>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px] min-w-[200px]">Tên Mã Giảm Giá</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Mã</TableHead>
                            <TableHead className="w-fit min-w-[130px]">Loại</TableHead>
                            <TableHead className="w-fit min-w-[150px]">Giảm Giá</TableHead>
                            <TableHead className="w-fit min-w-[180px]">Trạng thái</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vouchers?.value?.items?.map((voucher: Voucher) => {
                            const colorStatus: { status: string, color: string } | undefined = getCouponStatus(voucher.quantity, voucher.startDate, voucher.endDate);
                            return <TableRow key={voucher.id}>
                                <TableCell className="font-bold">{voucher.name}</TableCell>
                                <TableCell>{voucher.code}</TableCell>
                                <TableCell>
                                    {voucher.discountType === "Percentage" ? (
                                        <div className="bg-blue-50 text-blue-600 w-fit py-1 px-2 rounded-lg">Phần trăm</div>
                                    ) : (
                                        <div className="bg-orange-50 text-orange-600 w-fit py-1 px-2 rounded-lg">Cố định</div>
                                    )}
                                </TableCell>
                                <TableCell className="font-bold">
                                    {voucher.discountType === "Percentage" ? formatNumberWithUnit(voucher.value, "%") : formatVND(voucher.value)}
                                </TableCell>
                                <TableCell>
                                    <div className={`w-fit py-1 px-2 rounded-lg ${colorStatus?.color}`}>
                                        {colorStatus?.status}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/voucher/${voucher.id}`}>
                                            <Button
                                                variant="outline"
                                                className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                            >
                                                <Eye />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/voucher/update/${voucher.id}`}><Button
                                            variant="outline"
                                            className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                        >
                                            <Pencil />
                                        </Button>
                                        </Link>
                                        <Button
                                            onClick={() => {
                                                setIsDeleteVoucher(!isDeleteVoucher);
                                                setVoucher(voucher)
                                            }}
                                            variant="outline"
                                            className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
            <PaginationCustom itemsPerPage={pageSize} totalItems={vouchers?.value?.totalCount ?? 0} onChangePageIndex={setPageIndex} />
            <DeleteDialog id={voucher?.code ?? ""} isOpen={isDeleteVoucher} onClose={() => setIsDeleteVoucher(!isDeleteVoucher)} name={''} deleteFunction={deleteVoucher} />
        </div>
    )
}

export default VoucherPage