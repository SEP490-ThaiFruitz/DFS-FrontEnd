"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Button } from '@/components/ui/button'
import { columns, Product } from '@/features/admin/product/column'
import { DataTable } from '@/features/admin/product/data-table'
import { PageResult, ApiResponse } from '@/types/types'
import { CirclePlus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function ProductPage() {
    const { data: products } = useFetch<ApiResponse<PageResult<Product>>>("/Products", ["products"])
    console.log(products?.value?.items)
    return (
        <div className='mx-4 lg:mx-20'>
            <div className="flex justify-end">
                <Link href={"/admin/product/create"} >
                    <Button variant="outline">
                        <CirclePlus />
                        Tạo mới
                    </Button>
                </Link>
            </div>
            <div className="py-4">
                <DataTable data={products?.value?.items || []} columns={columns} />
            </div>
        </div>
    )
}

export default ProductPage;
