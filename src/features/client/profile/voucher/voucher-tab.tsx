"use client"

import { Skeleton } from '@/components/ui/skeleton'
import React, { useState } from 'react'
import Image from 'next/image';
import { ApiResponse, PageResult } from '@/types/types';
import { Tickets } from 'lucide-react';
import { formatVND } from '@/lib/format-currency';

export interface Voucher {
    name: string,
    image: string | null,
    discount: number,
    minimunOrderOrice: number,
    maximunPriceDiscount: number,
    discountType: 'Fixed' | 'Percentage',
    startDate: string,
    endDate: string,
    isUsed: boolean,
}

const VoucherTab = () => {
    const [vouchers, setvouchers] = useState<ApiResponse<PageResult<Voucher>>>({
        value: {
            items: [
                { isUsed: false, image: null, name: 'Ưu Đãi Mua Số Lượng Lớn', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-25T12:00:00+00:00' },
                { isUsed: false, image: null, name: 'Nhu Yếu Phẩm Hàng Tuần', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
                { isUsed: false, image: null, name: 'Ưu Đãi Đặc Biệt Tiết Kiệm Tủ Bếp', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
                { isUsed: false, image: null, name: 'Khuấy Động Sản Phẩm Tươi Sống', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
                { isUsed: false, image: null, name: 'Khuyến Mãi Giảm Giá Đặc Biệt', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-02-01T00:00:00+00:00', endDate: '2025-02-10T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Mua Sắm Cuối Tuần', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-02-03T00:00:00+00:00', endDate: '2025-02-05T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Giảm Giá Đơn Hàng Đầu Tiên', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-02-01T00:00:00+00:00', endDate: '2025-02-28T23:59:59+00:00' },
                { isUsed: true, image: "/images/dried-fruit.webp", name: 'Ưu Đãi Độc Quyền Khách VIP', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-03-01T00:00:00+00:00', endDate: '2025-03-15T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Flash Sale 24H', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-04-01T00:00:00+00:00', endDate: '2025-04-01T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Giảm Giá Tích Lũy', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-04-05T00:00:00+00:00', endDate: '2025-04-10T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Tháng 5 May Mắn', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-05-01T00:00:00+00:00', endDate: '2025-05-31T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Giảm Giá Hè Rực Rỡ', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-06-01T00:00:00+00:00', endDate: '2025-06-15T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Combo Siêu Tiết Kiệm', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-03-01T00:00:00+00:00', endDate: '2025-03-08T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Khuyến Mãi Tân Sinh Viên', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-08-01T00:00:00+00:00', endDate: '2025-08-31T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Siêu Deal Mùa Thu', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-09-01T00:00:00+00:00', endDate: '2025-09-30T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Ngày Đặc Biệt 10.10', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-10-10T00:00:00+00:00', endDate: '2025-10-10T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Lễ Hội Giáng Sinh', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-12-20T00:00:00+00:00', endDate: '2025-12-25T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Năm Mới Giảm Giá', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2026-01-01T00:00:00+00:00', endDate: '2026-01-07T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Tết Nguyên Đán Rộn Ràng', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2026-02-01T00:00:00+00:00', endDate: '2026-02-10T23:59:59+00:00' },
                { isUsed: false, image: null, name: 'Đại Tiệc Mua Sắm 11.11', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2026-11-11T00:00:00+00:00', endDate: '2026-11-11T23:59:59+00:00' },
            ],
            pageIndex: 1,
            pageSize: 10,
            totalCount: 20,
            totalPages: 1,
            hasNextPage: true,
            hasPreviousPage: false,
        },
        isSuccess: true,
        error: {
            code: '',
            message: '',
        },
    });

    const getVoucherStatusText = (voucher: Voucher) => {
        if (voucher.isUsed)
            return
        return new Date() <= new Date(voucher.endDate) ? <button className='px-2 py-1 font-bold bg-green-500 text-white rounded-md hover:bg-green-600   '>
            Sử dụng
        </button> : <></>
    }
    const getRemainingTime = (endDate: string) => {

        const remainingMilliseconds = new Date(endDate).getTime() - new Date().getTime();
        const remainingDays = Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24));
        if (remainingMilliseconds <= 0)
            return <div className='px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center'>
                Đã hết hạn
            </div>

        return <div className={`px-2 py-1  w-fit rounded-md font-bold text-center ${remainingDays > 3 ? 'bg-green-50 text-green-700 ' : 'bg-yellow-50 text-yellow-700 '}`}>
            {remainingDays} ngày
        </div>;
    }
    const isPending = false;
    return (
        isPending ?
            Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index + 1}
                    className="p-4 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center gap-4 bg-white"
                >
                    <Skeleton className='h-24' />
                    <Skeleton className='h-10 w-full lg:col-span-2' />
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                    <Skeleton className='h-10 w-full' />
                </div>
            ))
            :
            <div className="space-y-2">
                <div className="hidden p-4 sm:grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center gap-4 bg-white ">
                    <div className="hidden md:block">
                        Hình ảnh
                    </div>
                    <div className="lg:col-span-2">
                        Nội dung
                    </div>
                    <div>
                        Giảm giá
                    </div>
                    <div className="w-full flex justify-center md:w-36 mx-auto md:mx-0">
                        Thời gian
                    </div>
                    <div className="w-full flex justify-center md:w-32 mx-auto md:mx-0">
                        Trạng thái
                    </div>
                </div>

                {vouchers?.value?.items.map((voucher: Voucher, index) => (
                    <div
                        key={index + 1}
                        className="p-4 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center gap-4 bg-white hover:bg-gray-50 transition-colors"
                    >
                        <div className="relative w-full h-24 flex-shrink-0 mx-auto md:mx-0">
                            {voucher.image ? (
                                <div className="relative p-5 rounded-md flex items-center justify-center bg-green-500">
                                    <Image
                                        src="/images/dried-fruit.webp"
                                        alt={voucher.name}
                                        width={1000}
                                        height={1000}
                                        className="h-16 w-16 object-fill"
                                    />
                                    <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i + 1} className="h-2 w-2 rounded-full bg-white -ml-1" />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="relative p-5 rounded-md flex items-center justify-center bg-green-500">
                                    <Tickets className="h-16 w-16 text-white" />
                                    <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i + 1} className="h-2 w-2 rounded-full bg-white -ml-1" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2 text-center md:text-left">
                            <p className="font-bold text-sm sm:text-base">{voucher.name}</p>
                            <p className="font-light text-xs sm:text-sm text-slate-600">
                                {`Đơn tối thiểu ${formatVND(voucher.minimunOrderOrice)} ${voucher.discountType === "Percentage" ? `- Giảm tối đa ${formatVND(voucher.maximunPriceDiscount)}` : ''}`}
                            </p>
                        </div>

                        <div className="w-fit font-bold text-sm sm:text-base mx-auto md:mx-0">
                            {voucher.discountType !== "Fixed" ? `${voucher.discount} %` : formatVND(voucher.discount)}
                        </div>

                        <div className="w-full flex justify-center md:w-36 mx-auto md:mx-0">
                            {voucher.isUsed ? (
                                <div className="px-2 py-1 bg-slate-50 w-fit rounded-md text-slate-700 font-bold text-center">
                                    Đã sử dụng
                                </div>
                            ) : (
                                getRemainingTime(voucher.endDate)
                            )}
                        </div>

                        <div className="w-full flex justify-center md:w-32 mx-auto md:mx-0">
                            {getVoucherStatusText(voucher)}
                        </div>
                    </div>
                ))}
            </div>
    )
}

export default VoucherTab