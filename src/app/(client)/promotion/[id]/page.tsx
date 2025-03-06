"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { ApiResponse } from '@/types/types'
import React from 'react'
import { useParams } from 'next/navigation'
import { FlashSale } from '@/features/client/home/promotion'

const PromotionPage = () => {
    const { id }: { id: string } = useParams();
    const { data: promotion } = useFetch<ApiResponse<FlashSale>>(`"/Promotions/${id}`, ["Promotion", id])
    console.log(promotion)
    return (
        <div className='py-32'>
            <div className='font-bold text-3xl'></div>
        </div>
    )
}

export default PromotionPage
