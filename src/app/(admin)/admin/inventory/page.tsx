"use client"

import { DataTable } from '@/components/global-components/data-table/data-table'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import React from 'react'

const InventoryPage = () => {
    return (
        <div className="m-10">
            <div className='flex justify-between items-center'>
                <div className='text-2xl font-semibold leading-none tracking-tight'>Danh sách sản phẩm trong kho</div>
                <Button
                    size={"sm"}
                    className='text-white bg-green-500 hover:bg-green-600'>
                    <CirclePlus />
                    Tạo danh sách nhập hàng
                </Button>

            </div>
            {/* 
            <DataTable data={events?.value ?? []} columns={columns} searchFiled="name" /> */}
        </div>
    )
}

export default InventoryPage
