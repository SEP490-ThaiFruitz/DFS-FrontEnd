import React from 'react'
import { ApiResponse, Favorite, PageResult } from '@/types/types';
import { useQuery } from '@tanstack/react-query';

import { Skeleton } from '@/components/ui/skeleton';
import FavoriteCard from './favorite-card';
import { getFavoriteProducts } from '@/actions/favorite';


const FavoriteClientPage = () => {
    const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
        queryKey: ["favorites"],
        queryFn: async () => {
            try {
                const res = await getFavoriteProducts()
                if (!res?.isSuccess) {
                    throw new Error("Lỗi khi lấy danh sách yêu thích");
                }
                const data: ApiResponse<PageResult<Favorite>> = res.data
                return data.value
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống");
            }
        }
    })


    return (
        <div className='px-20 py-10'>
            {isLoadingFavorites ? <div className='p-4 flex space-x-3 items-center'>
                <Skeleton className='w-80 h-10' />
            </div> :
                <div className='p-4 flex space-x-3 items-center'>
                    <span className='text-2xl font-bold'>Danh sách yêu thích</span>
                    <span>{`(Đã tìm thấy ${favorites?.totalCount ?? 0} sản phẩm)`}</span>
                </div>}
            <div className="flex p-4">
                {!isLoadingFavorites ? (
                    <div className="flex-1 h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 lg:gap-10 2xl:gap-6">
                        {favorites?.items?.map((favorite: Favorite) => (
                            <FavoriteCard key={favorite.productId} favorite={favorite} />
                        ))}
                    </div>
                ) :
                    <div className="flex-1 h-full overflow-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 lg:gap-4 2xl:gap-6">
                        {[...Array(9)].map((_, index) => (
                            <Skeleton className='h-96 w-full flex flex-col border shadow-md' key={index + 1} />
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}

export default FavoriteClientPage
