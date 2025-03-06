"use client"

import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import { ApiResponse, Favorite, PageResult } from "@/types/types";
import { getFavoriteProducts } from "@/actions/favorite";
import { useQuery } from "@tanstack/react-query";
import VoucherSlide from "@/features/client/home/voucher-slide";
import Promotion from "@/features/client/home/promotion";
import Suggest from "@/features/client/home/suggest";
import BestSellter from "@/features/client/home/best-seller";
import Category from "@/features/client/home/category";

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",
  ];

  const { data: favorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await getFavoriteProducts();
      if (!res?.isSuccess) throw new Error("Error fetching favorites");
      const data: ApiResponse<PageResult<Favorite>> = res.data;
      return data.value?.items;
    },
  });

  return (
    <div className="flex flex-col h-full">
      <ImagesSlider images={images}  className="h-[85vh]">
        <BannerText />
      </ImagesSlider>
      <VoucherSlide />
      <Promotion />
      <Category />
      <Suggest favorites={favorites} />
      <BestSellter favorites={favorites} />
    </div>
  );
};

export default ClientPage;
