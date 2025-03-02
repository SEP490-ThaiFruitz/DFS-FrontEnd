"use client"

import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { CardProduct } from '@/components/global-components/card/card-product';
import AnimatedLoadingSkeleton from '@/components/global-components/custom-skeleton/animated-loading-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductTypes } from '@/providers/data-provider';
import { ApiResponse, PageResult } from '@/types/types';
import React from 'react'

const FavoritesPage = () => {
  const {
    isLoading,
    data: products,
  } = useFetch<ApiResponse<PageResult<ProductTypes>>>("/Products", ["Favorites"]);



  return (
    <div className='p-10'>
      {isLoading ? <div className='py-4 px-16 flex space-x-3 items-center'>
        <Skeleton className='w-80 h-10' />
      </div> :
        <div className='py-4 px-16 flex space-x-3 items-center'>
          <p className='text-2xl font-bold'>Danh sách yêu thích</p>
          <p>{`(Đã tìm thấy ${products?.value?.totalCount} sản phẩm)`}</p>
        </div>}
      <div className="flex p-4">
        {!isLoading ? (
          <div className="flex-1 h-full overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 lg:gap-4 2xl:gap-6">
            {products?.value?.items?.map((product) => (
              <CardProduct key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <AnimatedLoadingSkeleton className="w-full max-w-full" />
        )}
      </div>
    </div>
  )
}

export default FavoritesPage
