"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { ApiResponse, PageResult } from '@/types/types'
import React from 'react'
import CardVoucher from './card-voucher';
import CustomSlide from '@/components/global-components/slide/custom-slide';

export interface Voucher {
    id: string;
    name: string;
    value: number;
    image?: string;
    discountType: "Amount" | "Percentage";
    minimumOrderAmount: number;
    maximumDiscountAmount: number;
}

const VoucherSlide = () => {

    const { data: vouchers } = useFetch<ApiResponse<PageResult<Voucher>>>("/Vouchers/vouchers-for-home-page", ["Voucher", "Home"])
    return (
        <div className="p-10 w-full">
            <CustomSlide
                mobile={1}
                tablet={2}
                pc={3}
                classNameSlide='w-fit lg:px-20 group'
                classNameSub='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-16'
                data={vouchers?.value?.items ?? []}
            >
                {(voucher: Voucher) => (
                    <CardVoucher key={voucher.id} voucher={voucher} />
                )}
            </CustomSlide>
        </div>
    )
}

export default VoucherSlide
