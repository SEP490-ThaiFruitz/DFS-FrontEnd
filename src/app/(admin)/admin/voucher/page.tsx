"use client"
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
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { CirclePlus, Eye, Filter, Pencil, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

function VoucherPage() {
    const [pageIndex, setPageIndex] = useState(1);
    const [filter, setFilter] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState(10);
    const [coupons, setCoupons] = useState({
        value: {
            items: [
                { name: 'Ưu Đãi Mua Số Lượng Lớn', code: 'bulk50', discount: '50.00', discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-25T12:00:00+00:00' },
                { name: 'Nhu Yếu Phẩm Hàng Tuần', code: 'weekly10', discount: '10.00', discountType: 'Percentage', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
                { name: 'Ưu Đãi Đặc Biệt Tiết Kiệm Tủ Bếp', code: 'pantry25', discount: '25.00', discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
                { name: 'Khuấy Động Sản Phẩm Tươi Sống', code: 'fresh15', discount: '15.00', discountType: 'Percentage', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
                { name: 'Khuyến Mãi Giảm Giá Đặc Biệt', code: 'special30', discount: '30.00', discountType: 'Fixed', startDate: '2025-02-01T00:00:00+00:00', endDate: '2025-02-10T23:59:59+00:00' },
                { name: 'Mua Sắm Cuối Tuần', code: 'weekend20', discount: '20.00', discountType: 'Percentage', startDate: '2025-02-03T00:00:00+00:00', endDate: '2025-02-05T23:59:59+00:00' },
                { name: 'Giảm Giá Đơn Hàng Đầu Tiên', code: 'first5', discount: '5.00', discountType: 'Fixed', startDate: '2025-02-01T00:00:00+00:00', endDate: '2025-02-28T23:59:59+00:00' },
                { name: 'Ưu Đãi Độc Quyền Khách VIP', code: 'vip40', discount: '40.00', discountType: 'Percentage', startDate: '2025-03-01T00:00:00+00:00', endDate: '2025-03-15T23:59:59+00:00' },
                { name: 'Flash Sale 24H', code: 'flash24', discount: '24.00', discountType: 'Fixed', startDate: '2025-04-01T00:00:00+00:00', endDate: '2025-04-01T23:59:59+00:00' },
                { name: 'Giảm Giá Tích Lũy', code: 'save10', discount: '10.00', discountType: 'Percentage', startDate: '2025-04-05T00:00:00+00:00', endDate: '2025-04-10T23:59:59+00:00' },
                { name: 'Tháng 5 May Mắn', code: 'lucky5', discount: '5.00', discountType: 'Fixed', startDate: '2025-05-01T00:00:00+00:00', endDate: '2025-05-31T23:59:59+00:00' },
                { name: 'Giảm Giá Hè Rực Rỡ', code: 'summer30', discount: '30.00', discountType: 'Percentage', startDate: '2025-06-01T00:00:00+00:00', endDate: '2025-06-15T23:59:59+00:00' },
                { name: 'Combo Siêu Tiết Kiệm', code: 'combo25', discount: '25.00', discountType: 'Fixed', startDate: '2025-07-01T00:00:00+00:00', endDate: '2025-07-10T23:59:59+00:00' },
                { name: 'Khuyến Mãi Tân Sinh Viên', code: 'student15', discount: '15.00', discountType: 'Percentage', startDate: '2025-08-01T00:00:00+00:00', endDate: '2025-08-31T23:59:59+00:00' },
                { name: 'Siêu Deal Mùa Thu', code: 'fall50', discount: '50.00', discountType: 'Fixed', startDate: '2025-09-01T00:00:00+00:00', endDate: '2025-09-30T23:59:59+00:00' },
                { name: 'Ngày Đặc Biệt 10.10', code: 'october10', discount: '10.00', discountType: 'Percentage', startDate: '2025-10-10T00:00:00+00:00', endDate: '2025-10-10T23:59:59+00:00' },
                { name: 'Lễ Hội Giáng Sinh', code: 'xmas20', discount: '20.00', discountType: 'Fixed', startDate: '2025-12-20T00:00:00+00:00', endDate: '2025-12-25T23:59:59+00:00' },
                { name: 'Năm Mới Giảm Giá', code: 'newyear30', discount: '30.00', discountType: 'Percentage', startDate: '2026-01-01T00:00:00+00:00', endDate: '2026-01-07T23:59:59+00:00' },
                { name: 'Tết Nguyên Đán Rộn Ràng', code: 'tet50', discount: '50.00', discountType: 'Fixed', startDate: '2026-02-01T00:00:00+00:00', endDate: '2026-02-10T23:59:59+00:00' },
                { name: 'Đại Tiệc Mua Sắm 11.11', code: 'single11', discount: '11.00', discountType: 'Percentage', startDate: '2026-11-11T00:00:00+00:00', endDate: '2026-11-11T23:59:59+00:00' },
            ],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 20,
            hasNextPage: true,
            hasPreviousPage: false,
        },
        isSuccess: true,
        error: {
            code: '',
            message: '',
        },
    });
    const [coupon, setCoupon] = useState<{
        name: string;
        code: string;
        discount: string;
        discountType: string;
        startDate: string;
        endDate: string;
    }>();
    const [deleteCoupon, setDeleteCoupon] = useState(false);
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

    const getCouponStatus = (startDate: string, endDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (now < start) {
            return { status: 'Chuẩn bị diễn ra', color: 'bg-yellow-50 text-yellow-600' };
        } else if (now >= start && now <= end) {
            return { status: 'Đang diễn ra', color: 'bg-green-50 text-green-600' };
        } else if (now > end) {
            return { status: 'Đã hết hạn', color: 'bg-red-50 text-red-600' };
        }
        return { status: 'Hết hạn', color: 'bg-gray-50 text-gray-600' };
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
                        {coupons.value.items.map((coupon) => {
                            const { status, color } = getCouponStatus(coupon.startDate, coupon.endDate);
                            return <TableRow key={coupon.code}>
                                <TableCell className="font-bold">{coupon.name}</TableCell>
                                <TableCell>{coupon.code}</TableCell>
                                <TableCell>
                                    {coupon.discountType === "Percentage" ? (
                                        <div className="bg-blue-50 text-blue-600 w-fit py-1 px-2 rounded-lg">Phần trăm</div>
                                    ) : (
                                        <div className="bg-orange-50 text-orange-600 w-fit py-1 px-2 rounded-lg">Cố định</div>
                                    )}
                                </TableCell>
                                <TableCell className="font-bold">
                                    {coupon.discountType === "Percentage" ? formatNumberWithUnit(coupon.discount, "%") : formatVND(coupon.discount)}
                                </TableCell>
                                <TableCell>
                                    <div className={`w-fit py-1 px-2 rounded-lg ${color}`}>
                                        {status}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Link href={`/admin/voucher/${coupon.code}`}>
                                            <Button
                                                variant="outline"
                                                className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                                            >
                                                <Eye />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/voucher/update/${coupon.code}`}><Button
                                            variant="outline"
                                            className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                                        >
                                            <Pencil />
                                        </Button>
                                        </Link>
                                        <Button
                                            onClick={() => {
                                                setDeleteCoupon(!deleteCoupon);
                                                setCoupon(coupon)
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
            <PaginationCustom itemsPerPage={pageSize} totalItems={coupons.value.totalCount} onChangePageIndex={setPageIndex} />
            <DeleteDialog id={coupon?.code ?? ""} isOpen={deleteCoupon} onClose={() => setDeleteCoupon(!deleteCoupon)} name={''} deleteFunction={function (id: string): Promise<{ success: boolean; message: string } | undefined> {
                throw new Error('Function not implemented.')
            }} />
        </div>
    )
}

export default VoucherPage