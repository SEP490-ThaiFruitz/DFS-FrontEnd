"use client";

import { ImagesSlider } from "@/components/global-components/images-slider";
import { BannerText } from "@/components/global-components/banner-text";
import { ApiResponse, Favorite, PageResult } from "@/types/types";
import { getFavoriteProducts } from "@/actions/favorite";
import { useQuery } from "@tanstack/react-query";
import VoucherSlide from "@/features/client/home/voucher-slide";
import Promotion from "@/features/client/home/promotion";
import Suggest from "@/features/client/home/suggest";
import BestSellter from "@/features/client/home/best-seller";
import CategorySlide from "@/features/client/home/category-slide";
import { ThreeDMarquee } from "@/components/ui/3d-marque";
import Image from "next/image";

const ClientPage = () => {
  const images = [
    "/images/first-background.jpg",
    "/images/third-background.png",
    "/images/second-background.png",
    "/images/forth-background.png",

    "/marque/image-1.avif",
    "/marque/image-2.avif",
    "/marque/image-3.avif",
    "/marque/image-4.avif",
    "/marque/image-5.avif",
    "/marque/image-6.avif",
    "/marque/image-7.avif",
    "/marque/image-8.avif",
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
      <ImagesSlider images={images} className="h-[85vh]">
        <BannerText />
      </ImagesSlider>
      <VoucherSlide />
      <Promotion />

      <CategorySlide />

      {/* <div className=" my-10 max-w-full rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800"> 
      
      */}
      <div className="mx-auto my-10 max-w-8xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
        <ThreeDMarquee
          images={[
            "/images/first-background.jpg",
            "/images/third-background.png",
            "/images/second-background.png",
            "/images/forth-background.png",

            "/marque/image-1.avif",
            "/marque/image-2.avif",
            "/marque/image-3.avif",
            "/marque/image-4.avif",
            "/marque/image-5.avif",
            "/marque/image-6.avif",
            "/marque/image-7.avif",
            "/marque/image-8.avif",

            "/images/first-background.jpg",
            "/images/third-background.png",
            "/images/second-background.png",
            "/images/forth-background.png",

            "/marque/image-1.avif",
            "/marque/image-2.avif",
            "/marque/image-3.avif",
            "/marque/image-4.avif",
            "/marque/image-5.avif",
            "/marque/image-6.avif",
            "/marque/image-7.avif",
            "/marque/image-8.avif",

            "/images/first-background.jpg",
            "/images/third-background.png",
            "/images/second-background.png",
            "/images/forth-background.png",

            "/marque/image-1.avif",
            "/marque/image-2.avif",
            "/marque/image-3.avif",
            "/marque/image-4.avif",
            "/marque/image-5.avif",
            "/marque/image-6.avif",
            "/marque/image-7.avif",
            "/marque/image-8.avif",

            "/images/first-background.jpg",
            "/images/third-background.png",
            "/images/second-background.png",
            "/images/forth-background.png",

            "/marque/image-1.avif",
            "/marque/image-2.avif",
            "/marque/image-3.avif",
            "/marque/image-4.avif",
            "/marque/image-5.avif",
            "/marque/image-6.avif",
            "/marque/image-7.avif",
            "/marque/image-8.avif",
          ]}
        />
      </div>

      {/* <Suggest favorites={favorites} /> */}
      <BestSellter favorites={favorites} />
    </div>
  );
};

export default ClientPage;
