"use client"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, ListCollapse } from 'lucide-react'
import React from 'react'
import { useParams } from 'next/navigation';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ApiResponse } from '@/types/types';
import Information from './information';
import Variant, { ProductVariant } from './variant';

export interface Promotion {
    promotionId: string;
    name: string;
    image: string;
    description: string;
    percentage: number;
    startDate: string;
    endDate: string;
    createdOnUtc: Date;
    modifiedOnUtc: Date | null;
    isDeleted: boolean;
    productVariants: ProductVariant[];
}


const PromotionDetailPage = () => {
    const { id } = useParams();
    const { data: promotion } = useFetch<ApiResponse<Promotion>>(`/Promotions/manage/${id}`, [`${id}`])

    return (
        <div className='p-10 w-full'>
            <div className='Container'>
                <Tabs defaultValue="information">
                    <TabsList className='grid grid-cols-2 gap-10 bg-transparent'>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="information">
                            <Info className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Thông tin"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="variant">
                            <ListCollapse className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Sản phẩm"}</span>
                        </TabsTrigger>
                    </TabsList>
                    <Information promotion={promotion?.value} />
                    <Variant promotion={promotion?.value} />
                </Tabs>
            </div>
        </div>
    )
}

export default PromotionDetailPage