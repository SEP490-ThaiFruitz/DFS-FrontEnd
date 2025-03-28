"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiResponse } from '@/types/types'
import { Award, Images, Info, ListCollapse, UtensilsCrossed } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import ImageOtherTab from './image-other'
import NutritionTab, { ProductNutrition } from './nutrition'
import CertificationTab, { Certificate } from './certification'
import VariantTab, { ProductVariantDetail } from './variant'
import Information from './information'

export interface Product {
    id: string;
    name: string;
    description: string;
    origin: string;
    mainImageUrl: string;
    moistureContent: number;
    dryingMethod: string;
    tagNames: string;
    categories: Category[] | null;
    productImages: ProductImage[];
    productCertifications: Certificate[];
    productVariantDetailManges: ProductVariantDetail[];
    productNutrition: ProductNutrition;
    createdOnUtc: string;
    modifiedOnUtc: string | null;
    isDeleted: boolean;
}

export interface Category {
    id: string;
    name: string;
}

export interface ProductImage {
    id: string,
    imageUrl: string,
}

const ProductDetail = () => {
    const { id } = useParams();
    const { data: product } = useFetch<ApiResponse<Product>>(`/Products/mange/${id}`, ["detail-mange", `${id}`])

    return (
        <div className='p-10 w-full'>
            <div className='Container'>
                <Tabs defaultValue="information">
                    <TabsList className='grid grid-cols-5 gap-10 bg-transparent'>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="information">
                            <Info className='sm:mr-2' size={15} />
                            <span className="hidden sm:inline">{"Thông tin"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="image">
                            <Images className='sm:mr-2' size={15} />
                            <span className="hidden sm:inline">{"Ảnh phụ"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="nutrition">
                            <UtensilsCrossed className='sm:mr-2' size={15} />
                            <span className="hidden sm:inline">{"Dinh dưỡng"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="certification">
                            <Award className='sm:mr-2' size={15} />
                            <span className="hidden sm:inline">{"Chứng chỉ"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="variant">
                            <ListCollapse className='sm:mr-2' size={15} />
                            <span className="hidden sm:inline">{"Biến thể"}</span>
                        </TabsTrigger>
                    </TabsList>
                    <Information product={product?.value ?? null} />
                    <ImageOtherTab
                        images={product?.value?.productImages ?? []}
                        productId={product?.value?.id ?? ""}
                    />
                    <NutritionTab productId={product?.value?.id ?? ""} productNutrion={product?.value?.productNutrition} />
                    <CertificationTab productId={product?.value?.id ?? ""} certificates={product?.value?.productCertifications ?? []} />
                    <VariantTab productId={product?.value?.id ?? ""} productVariants={product?.value?.productVariantDetailManges ?? []} />
                </Tabs>
            </div>
        </div>
    )
}

export default ProductDetail
