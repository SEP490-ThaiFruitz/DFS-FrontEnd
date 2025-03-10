"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog'
import PaginationCustom from '@/components/global-components/data-table/paging-custom'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Product } from '@/features/admin/product/column'
import { PageResult, ApiResponse } from '@/types/types'
import { CirclePlus, Filter, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

function ProductPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    const [isDeleteVoucher, setIsDeleteVoucher] = useState(false);
    const form = useForm({
        defaultValues: {
            name: ""
        },
    });
    return (
        <div className='m-10'>
            <div className='flex justify-between items-center'>
                <p className='text-2xl font-semibold leading-none tracking-tight'>Sản phẩm</p>
                <Link href="/admin/product/create">
                    <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
                        <CirclePlus />
                        Tạo sản phẩm
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
                            label="Tên sản phẩm"
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
                        <TableHead className="w-[200px] min-w-[200px]">Image</TableHead>
                            <TableHead className="w-[200px] min-w-[200px]">Tên</TableHead>
                            <TableHead className="w-fit min-w-[120px]">Loại sản phẩm</TableHead>
                            <TableHead className="w-fit min-w-[150px]">Tổng số lượng</TableHead>
                            <TableHead className="w-fit min-w-[180px]">Trạng thái</TableHead>
                            <TableHead className="w-fit min-w-[140px]">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                    </TableBody>
                </Table>
            </div>
            {/* <PaginationCustom itemsPerPage={pageSize} totalItems={vouchers?.value?.totalCount ?? 0} onChangePageIndex={setPageIndex} />
            <DeleteDialog id={voucher?.code ?? ""} isOpen={isDeleteVoucher} onClose={() => setIsDeleteVoucher(!isDeleteVoucher)} name={''} deleteFunction={deleteVoucher} /> */}
        </div>
    )
}

export default ProductPage;
