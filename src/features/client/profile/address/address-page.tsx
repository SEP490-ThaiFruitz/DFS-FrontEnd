"use client"
import React, { useState } from 'react'
import { MotionCard } from '../profile-client';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FormAddress from './form-address';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { CirclePlusIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAddresses } from '@/actions/address';
import { ApiResponse, PageResult } from '@/types/types';

export interface Address {
    id: string;
    tagName: string;
    userId: string;
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    longitude: number | null;
    latitude: number | null;
    isDefault: boolean;
    provinceID: number,
    districtID: number,
    wardID: number,
}

function AddressPage() {
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const [address, setAddress] = useState<Address | undefined>(undefined)
    const { isPending, data: addresses } = useQuery({
        queryKey: ["addresses"],
        queryFn: async () => {
            try {
                const response = await getAddresses();
                if (response?.isSuccess) {
                    const data: ApiResponse<PageResult<Address>> = response.data
                    return data;
                }
            } catch (error) {
                console.log(error)
            }
        }

    })
    return (
        <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
        >
            <CardHeader className="space-y-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <CardTitle className="text-3xl font-bold">
                    Địa chỉ giao hàng của bạn
                </CardTitle>
                <CardDescription className="text-purple-100">
                    Cung cấp thông tin địa chị giao hàng thuận tiện cho việc mua hàng sau này!
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-slate-100/90">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-[600px] rounded-lg border bg-card"
                >
                    <ResizablePanel defaultSize={70} minSize={30} className="p-4">
                        <div className="m-5 grid sm:grid-cols-3 gap-6">
                            {addresses?.value?.items.map((item: Address) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setIsCreate(false)
                                        setAddress(item)
                                    }}
                                    className={`text-left border shadow-sm rounded-xl p-2 hover:cursor-pointer ${item.id == address?.id ? "border-purple-700" : ""}`}
                                >
                                    {item.isDefault ?
                                        <div className='flex justify-between'>
                                            <h3 className="font-bold mb-3">{item.tagName}</h3>
                                            <p className='h-5 w-5 bg-purple-500 rounded-full' />
                                        </div> :
                                        <h3 className="font-bold mb-3">{item.tagName}</h3>
                                    }
                                    <p className="line-clamp-2 whitespace-pre-line">{item.receiverAddress}</p>
                                </button>
                            ))}
                            <button
                                className={`text-left border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
                                onClick={() => {
                                    setIsCreate(true)
                                    setAddress(undefined)
                                }}
                            >
                                <div className='flex items-center p-5 space-x-5 font-bold'>
                                    <CirclePlusIcon />
                                    <p>Thêm mới</p>
                                </div>
                            </button>
                        </div>
                    </ResizablePanel>

                    {address && !isCreate && (<FormAddress onClose={() => setAddress(undefined)} address={address} />)}
                    {isCreate && address === undefined && (<FormAddress onClose={() => setIsCreate(false)} address={undefined} />)}

                </ResizablePanelGroup>
            </CardContent>
        </MotionCard>

    )
}

export default AddressPage;