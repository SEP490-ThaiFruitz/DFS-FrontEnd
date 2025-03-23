"use client"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Info, ListCollapse } from 'lucide-react'
import React from 'react'
import { useParams } from 'next/navigation';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ApiResponse } from '@/types/types';
import Information from './information';
import Variant, { ComboItem } from './variant';

export interface Combo {
    id: string,
    name: string,
    image: string,
    capacity: number,
    type: "Fixed" | "Custom",
    price: number,
    eventId: string,
    description: string,
    userId: string,
    isLocked: boolean,
    isCustomer: boolean,
    createdOnUtc: string,
    modifiedOnUtc: string | null,
    isDeleted: boolean,
    comboItems: ComboItem[]
}


const ComboDetailPage = () => {
    const { id } = useParams();
    const { data: combo } = useFetch<ApiResponse<Combo>>(`/Combos/${id}`, [`${id}`])
    console.log(combo)
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
                    <Information combo={combo?.value} />
                    <Variant combo={combo?.value} />
                </Tabs>
            </div>
        </div>
    )
}

export default ComboDetailPage