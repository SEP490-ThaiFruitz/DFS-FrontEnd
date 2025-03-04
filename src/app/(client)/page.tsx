"use client"

import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse, Favorite, PageResult } from "@/types/types";
import { Product } from "@/features/client/sidebar-filter/sidebar-filter";
import { CardProduct } from "@/components/global-components/card/card-product";
import { getFavoriteProducts } from "@/actions/favorite";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Tickets } from "lucide-react";
import { useState } from "react";
import { Voucher } from "@/features/client/profile/voucher/voucher-tab";
import { formatVND } from "@/lib/format-currency";
import { Category } from "@/features/admin/category/column";
import { getCategories } from "@/actions/category";
import Link from "next/link";

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",
  ];
  const { data: products, isLoading: isLoadingProducts } = useFetch<ApiResponse<PageResult<Product>>>(
    "/Products",
    ["products"]
  );

  const categories: Category[] = [
    {
      id: "1d2c3b7e-4a5f-49a6-9f7e-8d2b9a7e2c5f",
      name: "Trái cây hỗn hợp",
      description: "Trái cây sấy hỗn hợp, giữ nguyên hương vị tự nhiên.",
      thumbnail: "https://nuts.com/images/auto/228x152fill/assets/ae16c735a6a560b8.jpg",
      isActive: true,
    },
    {
      id: "2a5b9c7e-3d8f-49a6-9f7e-1d2c3b7e2a5f",
      name: "Dâu rừng",
      description: "Dâu rừng sấy khô, thơm ngon và bổ dưỡng.",
      thumbnail: "https://nuts.com/images/auto/228x152fill/assets/07eb1a837cffa52f.jpg",
      isActive: true,
    },
    {
      id: "2a5e7b3f-8d1c-49a8-9c7f-3e6d2f9b7e2c",
      name: "Mơ sấy",
      description: "Mơ sấy khô, có vị chua nhẹ và ngọt tự nhiên.",
      thumbnail: "https://nuts.com/images/auto/228x152fill/assets/4af094199b2e493a.jpg",
      isActive: true,
    },
    {
      id: "3b7e9a5c-2d8f-49a6-9c7f-1e2b3d7e2a5f",
      name: "Dứa sấy",
      description: "Dứa sấy khô, giữ được hương vị thơm ngon đặc trưng.",
      thumbnail: "https://nuts.com/images/auto/228x152fill/assets/1c33f0880c7183e2.jpg",
      isActive: true,
    },
    {
      id: "3e8f9a5c-2d7b-49a6-9f7e-1d2c3b7e2a5f",
      name: "Xoài sấy",
      description: "Xoài sấy dẻo, ngọt tự nhiên và giàu vitamin.",
      thumbnail: "https://nuts.com/images/auto/228x152fill/assets/e808889d81020418.jpg",
      isActive: true,
    },
    {
      id: "3f2c6f8a-7b4d-42f0-9a6b-3e7d1c9f7e2b",
      name: "Chuối sấy",
      description: "Chuối sấy giòn, vị ngọt nhẹ tự nhiên.",
      thumbnail: "https://nuts.com/images/auto/228x152fill/assets/2a67232c5f8d5a7a.jpg",
      isActive: true,
    }
  ];



  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await getFavoriteProducts();
      if (!res?.isSuccess) throw new Error("Error fetching favorites");
      const data: ApiResponse<PageResult<Favorite>> = res.data;
      return data.value?.items;
    },
  });

  const isLoading = isLoadingProducts || isLoadingFavorites;
  const [vouchers, setvouchers] = useState<ApiResponse<PageResult<Voucher>>>({
    value: {
      items: [
        { isUsed: false, image: null, name: 'Ưu Đãi Mua Số Lượng Lớn', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-25T12:00:00+00:00' },
        { isUsed: false, image: "/images/dried-fruit.webp", name: 'Nhu Yếu Phẩm Hàng Tuần', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Percentage', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
        { isUsed: false, image: null, name: 'Ưu Đãi Đặc Biệt Tiết Kiệm Tủ Bếp', discount: 50, minimunOrderOrice: 20000, maximunPriceDiscount: 40000, discountType: 'Fixed', startDate: '2025-01-19T08:00:00+00:00', endDate: '2025-01-19T12:00:00+00:00' },
      ],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 20,
      totalPages: 1,
      hasNextPage: true,
      hasPreviousPage: false,
    },
    isSuccess: true,
    error: {
      code: '',
      message: '',
    },
  });

  return (
    <div className="flex flex-col h-full">
      <ImagesSlider images={images} className="h-[85vh]">
        <BannerText />
      </ImagesSlider>
      <div className="p-10 sm:p-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20">
        {vouchers.value?.items.map((voucher: Voucher) => (
          <div key={voucher.name} className="grid grid-cols-3 items-center gap-4 border shadow-sm">
            {voucher.image ? (
              <div className="relative h-full rounded-md flex items-center justify-center bg-green-500">
                <Image
                  src="/images/dried-fruit.webp"
                  alt={"tes"}
                  width={1000}
                  height={1000}
                  className="h-16 w-16 object-fill"
                />
                <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i + 1} className="h-2 w-2 rounded-full bg-white -ml-1" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative h-full rounded-md flex items-center justify-center bg-green-500">
                <Tickets className="h-16 w-16 text-white" />
                <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i + 1} className="h-2 w-2 rounded-full bg-white -ml-1" />
                  ))}
                </div>
              </div>
            )}
            <p className="py-1">
              <p className="font-bold text-sm sm:text-base">{voucher.name}</p>
              <p className="font-light text-xs sm:text-sm text-slate-600">
                {`Đơn tối thiểu ${formatVND(voucher.minimunOrderOrice)} ${voucher.discountType === "Percentage" ? `- Giảm tối đa ${formatVND(voucher.maximunPriceDiscount)}` : ''}`}
              </p>
            </p>
            <button className="bg-green-500 text-white w-fit mx-auto p-1 rounded-md">Sưu tầm</button>
          </div>
        ))}
      </div>


      <div className="p-10 sm:p-20 grid grid-cols-2 gap-20">
        <div className="min-h-72 bg-[url('/images/single.jpg')] bg-cover bg-center rounded-md">

        </div>
        <div className="min-h-72 bg-[url('/images/combo.jpg')] bg-cover bg-center rounded-md">

        </div>
      </div>
      <div className="p-10 sm:p-20">
        <div className="font-bold text-2xl mb-5">Danh sách loại sản phẩm</div>
        <div className="mt-10 grid  grid-cols-3 lg:grid-cols-6 gap-10">
          {categories.map((category: Category) => (
            <Link href={`/find?category=${category.name}`} key={category.id} className="border text-center p-1 shadow-sm rounded-md hover:cursor-pointer animate-out hover:scale-105">
              <div>
                <Image className="object-cover" src={category.thumbnail} alt={category.name} height={1000} width={1000} />
              </div>
              <div className="font-bold">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="p-10 sm:p-20">
        <div className="font-bold text-2xl mb-5">Sản phẩm đề xuất</div>
        <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-10">
          {products?.value?.items?.slice(0, 6).map((product: Product) => (
            <CardProduct
              key={product.id}
              isFavorite={
                Array.isArray(favorites)
                  ? !!favorites.find(x => x.productId === product.id)
                  : false
              }
              {...product}
            />))}
        </div>
      </div>
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
    </div>
  );
};

export default ClientPage;
