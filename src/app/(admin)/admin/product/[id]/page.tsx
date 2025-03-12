"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ApiResponse } from '@/types/types'
import { Award, Images, Info, ListCollapse, UtensilsCrossed } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React from 'react'
import ImageOtherTab from './image-other'
import NutritionTab, { ProductNutrition } from './nutrition'
import { formatTimeVietNam } from '@/lib/format-time-vietnam'
import CertificationTab, { Certificate } from './certification'

interface PackagingType {
    id: string;
    name: string;
    packagingType: string;
    packagingMaterial: string;
    description: string;
}

interface ProductVariantDetail {
    id: string;
    sku: string;
    image: string;
    netWeight: number;
    grossWeight: number;
    packagingLength: number;
    packagingWidth: number;
    packagingHeight: number;
    packagingVolume: number;
    shelfLife: string;
    price: number;
    stockQuantity: number;
    reOrderPoint: number;
    packagingType: PackagingType;
    discounts: any[];
}


interface Product {
    id: string;
    name: string;
    description: string;
    origin: string;
    mainImageUrl: string;
    moistureContent: number;
    dryingMethod: string;
    categories: Category[] | null;
    productImages: ProductImage[];
    productCertifications: Certificate[];
    productVariantDetailManges: ProductVariantDetail[];
    productNutrition: ProductNutrition;
    createdOnUtc: string;
    modifiedOnUtc: string | null;
    isDeleted: boolean;
}

interface Category {
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
    const dryingMethods = [
        { id: "SunDrying", name: "Sấy bằng ánh nắng mặt trời" },
        { id: "HotAirDrying", name: "Sấy bằng không khí nóng" },
        { id: "FreezeDrying", name: "Sấy đông khô" },
        { id: "MicrowaveDrying", name: "Sấy bằng sóng vi ba" },
        { id: "VacuumDrying", name: "Sấy theo phương pháp chân không" },
        { id: "InfraredDrying", name: "Sấy bằng bức xạ hồng ngoại" },
        { id: "DrumDrying", name: "Sấy trong máy trống" }
    ];

    return (
        <div className='p-10 w-full'>
            <div className='Container'>
                <Tabs defaultValue="information">
                    <TabsList className='grid grid-cols-5 gap-10 bg-transparent'>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="information">
                            <Info className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Thông tin"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="image">
                            <Images className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Ảnh phụ"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="nutrition">
                            <UtensilsCrossed className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Dinh dưỡng"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="certification">
                            <Award className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Chứng chỉ"}</span>
                        </TabsTrigger>
                        <TabsTrigger className='bg-white shadow-sm border data-[state=active]:!bg-green-500 data-[state=active]:text-white' value="variant">
                            <ListCollapse className='mr-2' size={15} />
                            <span className="hidden sm:inline">{"Biến thể"}</span>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="information">
                        <Card>
                            <CardHeader className='border-b-2'>
                                <CardTitle>Thông tin sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className='p-5'>
                                <div className='grid md:grid-cols-2 gap-20'>
                                    <div className='space-y-5'>
                                        <div><strong className='mr-3'>Tên sản phẩm:</strong> {product?.value?.name}</div>
                                        <div><strong className='mr-3'>Xuất xứ:</strong> {product?.value?.origin}</div>
                                        <div><strong className='mr-3'>Độ ẩm:</strong> {product?.value?.moistureContent} %</div>
                                        <div><strong className='mr-3'>Phương pháp sấy:</strong> {dryingMethods.find(x => x.id === product?.value?.dryingMethod)?.name}</div>
                                        <div><strong className='mr-3'>Loại sản phẩm:</strong> {product?.value?.categories?.map((category: Category) => category.name).join(", ")}</div>
                                        {product?.value?.createdOnUtc && (
                                            <div><strong className='mr-3'>Ngày tạo:</strong>{formatTimeVietNam(new Date(product?.value?.createdOnUtc), true)}</div>
                                        )}
                                        {product?.value?.modifiedOnUtc && (
                                            <div><strong className='mr-3'>Ngày cập nhật:</strong> {formatTimeVietNam(new Date(product?.value?.modifiedOnUtc), true)}</div>
                                        )}
                                        <div><strong className='mr-3'>Trạng thái:</strong>
                                            {!product?.value?.isDeleted ? <span className='px-2 py-1 text-green-600 bg-green-50 rounded font-bold'>Hoạt động</span> : <span className='px-2 py-1 text-red-600 bg-red-50 rounded font-bold'>Đã ẩn</span>}
                                        </div>
                                    </div>
                                    <Image className='max-h-fit' src={product?.value?.mainImageUrl ?? "/images/dried-fruit.webp"} height={1000} width={1000} alt={product?.value?.name ?? "image"} />
                                </div>
                                <div>
                                    <strong>Mô tả sản phẩm:</strong>
                                    <div dangerouslySetInnerHTML={{ __html: product?.value?.description ?? "" }}></div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <ImageOtherTab
                        images={product?.value?.productImages ?? []}
                        productId={product?.value?.id ?? ""}
                    />
                    <NutritionTab productId={product?.value?.id ?? ""} productNutrion={product?.value?.productNutrition} />
                    <CertificationTab productId={product?.value?.id ?? ""} certificates={product?.value?.productCertifications ?? []} />
                </Tabs>
            </div>
        </div>
    )
}

export default ProductDetail
