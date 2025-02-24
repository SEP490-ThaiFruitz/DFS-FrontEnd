"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumberWithUnit, formatVND } from '@/lib/format-currency'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

function VoucherDetailPage() {
    const [couponData, setCouponData] = useState({
        name: 'Ưu Đãi Mua Số Lượng Lớn',
        code: 'bulk50',
        discountType: 'Fixed',
        discount: '50000',
        startDate: '2025-01-19T08:00:00+00:00',
        endDate: '2025-01-25T12:00:00+00:00',
        minOrder: '100000',
        maxDiscount: '200000',
        quantity: '50',
        image: "/images/dried-fruit.webp"
    });
    return (
        <div className='m-10'>
            <Card>
                <CardHeader className='border-b-2'>
                    <CardTitle>Thông tin mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent className='my-5 sm:mx-8 grid lg:grid-cols-2 gap-20'>
                    <div className='border shadow-md rounded-xl h-full'>
                        {couponData.image ?
                            <Image className='h-full w-full p-2' src={couponData.image} height={100} width={100} alt='image' />
                            : <div className="h-full text-gray-500 w-full flex items-center justify-center text-center text-xl font-semibold">
                                <div className='flex space-x-5'>
                                    <ImageOff />
                                    <p>Không có ảnh</p>
                                </div>
                            </div>}
                    </div>
                    <div className='grid gap-2'>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Tên:</p>
                            <p>{couponData.name}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Mã giảm giá:</p>
                            <p>{couponData.code}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Loại giảm giá:</p>
                            <p>{couponData.discountType === "Fixed" ? "Cố định" : "Phần trăm"}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Giảm giá:</p>
                            <p>{couponData.discountType === "Fixed" ? formatVND(couponData.discount) : formatNumberWithUnit(couponData.discount, "%")}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày bắt đầu:</p>
                            <p>{formatTimeVietNam(new Date(couponData.startDate), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày kết thúc:</p>
                            <p>{formatTimeVietNam(new Date(couponData.endDate), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Đơn hàng tối thiểu:</p>
                            <p>{formatVND(couponData.minOrder)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Giảm tối đa:</p>
                            <p>{formatVND(couponData.maxDiscount)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Số lượng:</p>
                            <p>{formatNumberWithUnit(couponData.quantity)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày tạo:</p>
                            <p>{formatTimeVietNam(new Date(couponData.startDate), true)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VoucherDetailPage
