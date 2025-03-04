import { favoriteProduct } from '@/actions/favorite';
import { Card, CardContent } from '@/components/ui/card';
import { useMutation } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { Favorite } from '@/types/types';
import { formatVND } from '@/lib/format-currency';
import { Button } from '@/components/ui/button';

interface FavoriteCardProps {
    favorite: Favorite;
}

const FavoriteCard = ({ favorite }: Readonly<FavoriteCardProps>) => {
    const [isFavorite, setIsFavorite] = useState(true);
    const { isPending, mutate: favoriteMutation } = useMutation({
        mutationFn: async (productId: string) => {
            try {
                const response = await favoriteProduct({ productId });
                if (!response?.isSuccess) {
                    if (response?.status === 401) {
                        throw new Error('Vui lòng đăng nhập');
                    }
                    throw new Error('Lỗi hệ thống');
                }
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error.message : 'Lỗi hệ thống');
            }
        },
        onSuccess: () => {
            toast.success(
                isFavorite ? 'Đã gỡ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích'
            );
            setIsFavorite(!isFavorite);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    return (
        <Card className="transition-transform transform hover:scale-[1.02] duration-300 ease-in-out shadow-lg rounded-lg overflow-hidden relative">
            <CardContent className="p-4">
                <div className="relative w-full h-56">
                    <Image
                        className="object-cover rounded-md"
                        src={favorite.imageUrl}
                        alt={favorite.name}
                        layout="fill"
                    />
                </div>

                <div className="mt-4 text-center">
                    <p className="text-lg font-semibold">{favorite.name}</p>
                    <div className="mt-2 flex justify-between items-center text-gray-700">
                        <p className="text-md">{formatVND(2000)} - {formatVND(100000)}</p>
                        <Button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
                            Xem ngay
                        </Button>
                    </div>
                </div>

                <button
                    onClick={() => favoriteMutation(favorite.productId)}
                    className="absolute top-0 right-0.5 p-2 bg-white rounded-full shadow-md transition hover:scale-110"
                >
                    <Heart
                        className={`size-6 transition ${isFavorite ? 'fill-green-500 text-green-500' : 'text-gray-400'
                            } ${isPending ? 'animate-spin' : ''}`}
                    />
                </button>

                <div className="absolute top-1 left-1 flex items-center px-2 py-1 bg-red-500 text-white text-sm font-bold rounded-md shadow">
                    <span>20%</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default FavoriteCard;
