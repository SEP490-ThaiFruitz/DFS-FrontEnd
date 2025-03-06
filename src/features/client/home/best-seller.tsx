"use client"
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { Skeleton } from '@/components/ui/skeleton'
import { ApiResponse, Favorite, PageResult } from '@/types/types';
import React from 'react'
import { Product } from '../sidebar-filter/sidebar-filter';
import { CardProduct } from '@/components/global-components/card/card-product';

interface BestSellterProps {
    favorites: Favorite[] | undefined
}

const BestSellter = ({ favorites }: Readonly<BestSellterProps>) => {
    const { data: products, isLoading } = useFetch<ApiResponse<PageResult<Product>>>(
        "/Products",
        ["products"]
    );
    return (
        <div className="p-10 sm:p-20">
            <div className="font-bold text-2xl mb-5">Danh sách sản phẩm bán chạy</div>
            {!isLoading ? (
                (products?.value?.items?.length ?? 0) > 0 ? (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-10">
                        {products?.value?.items?.map((product: Product) => (
                            <CardProduct
                                key={product.id}
                                isFavorite={
                                    Array.isArray(favorites)
                                        ? !!favorites.find(x => x.productId === product.id)
                                        : false
                                }
                                {...product}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">No products match your filters</div>
                )
            ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-10">
                    {[...Array(9)].map((_, index: number) => (
                        <Skeleton className="h-96" key={index + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BestSellter
