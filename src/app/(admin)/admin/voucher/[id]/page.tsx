"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumberWithUnit, formatVND } from '@/lib/format-currency'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import { ApiResponse } from '@/types/types'
import { ImageOff } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Voucher } from '../page'
import { useParams } from 'next/navigation'

interface VoucherDetail extends Voucher {
    image: string,
    createdOnUtc: string,
    modifiedOnUtc: string,
    isDeletedIsDeleted: boolean,
}


function VoucherDetailPage() {
    const { id } = useParams();
    const { data: voucher } = useFetch<ApiResponse<VoucherDetail>>(`/Vouchers/${id}`)
    
    return (
        <div className='m-10'>
            <Card>
                <CardHeader className='border-b-2'>
                    <CardTitle>Thông tin mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent className='my-5 sm:mx-8 grid lg:grid-cols-2 gap-20'>
                    <div className='border shadow-md rounded-xl h-full'>
                        {voucher?.value?.image ?
                            <Image className='h-full w-full p-2' src={voucher?.value?.image} height={100} width={100} alt='image' />
                            : <div className="h-full text-gray-500 w-full flex items-center justify-center text-center text-xl font-semibold">
                                <div className='flex space-x-5'>
                                    <ImageOff />
                                    <p>Không có ảnh</p>
                                </div>
                            </div>}
                    </div>
                    <div className='grid gap-5'>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Tên:</p>
                            <p>{voucher?.value?.name}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Mã giảm giá:</p>
                            <p>{voucher?.value?.code}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Loại giảm giá:</p>
                            <p>{voucher?.value?.discountType === "Amount" ? "Cố định" : "Phần trăm"}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Giảm giá:</p>
                            <p>{voucher?.value?.discountType === "Amount" ? formatVND(voucher?.value?.value) : formatNumberWithUnit(voucher?.value?.value, "%")}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày bắt đầu:</p>
                            <p>{formatTimeVietNam(new Date(voucher?.value?.startDate), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày kết thúc:</p>
                            <p>{formatTimeVietNam(new Date(voucher?.value?.endDate), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Đơn hàng tối thiểu:</p>
                            <p>{formatVND(voucher?.value?.minimumOrderAmount)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Giảm tối đa:</p>
                            <p>{formatVND(voucher?.value?.maximumDiscountAmount)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Số lượng:</p>
                            <p>{formatNumberWithUnit(voucher?.value?.quantity)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày tạo:</p>
                            <p>{formatTimeVietNam(new Date(voucher?.value?.createdOnUtc), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày cập nhật:</p>
                            <p>{formatTimeVietNam(new Date(voucher?.value?.modifiedOnUtc), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Ngày cập nhật:</p>
                            <p>{formatTimeVietNam(new Date(voucher?.value?.modifiedOnUtc), true)}</p>
                        </div>
                        <div className="flex justify-between gap-20">
                            <p className='font-bold'>Trạng thái:</p>
                            {voucher?.value?.isDeletedIsDeleted ? 
                            <p className='py-2 p-1 w-fit bg-red-300 text-red-600 rounded-md'>Đã xóa</p> 
                            : <p className='py-2 p-1 w-fit bg-green-300 text-green-600 rounded-md'>Hoạt động</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default VoucherDetailPage
