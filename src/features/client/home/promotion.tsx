"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import CustomSlide from "@/components/global-components/slide/custom-slide";
import { CarouselItem } from "@/components/ui/carousel";
import { CarouselCustomized } from "@/components/custom/carousel-customized";

export interface FlashSale {
  id: string;
  name: string;
  image: string;
  description: string;
  percentage: number;
  maxAmount: number;
  startDate: string;
  endDate: string;
}

const Promotion = () => {
  const { data: promotions, isLoading } =
    useFetch<ApiResponse<FlashSale[]>>("/Promotions");

  console.log({ promotions });
  return (
    // <div className="p-10 w-full">
    //   <CustomSlide
    //     mobile={1}
    //     tablet={2}
    //     pc={2}
    //     classNameSlide="w-fit lg:px-20 group"
    //     classNameSub="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-16"
    //     data={promotions?.value ?? []}
    //   >
    //     {(promotion: FlashSale) => (
    //       <div
    //         key={promotion.id}
    //         className="relative rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    //       >
    //         <Image
    //           className="object-cover w-full h-72 rounded-t-lg"
    //           src={"/images/single.jpg"}
    //           alt={promotion.name}
    //           height={1000}
    //           width={1000}
    //         />
    //         <div className="absolute inset-0 flex items-center justify-center p-6">
    //           <div className="text-center bg-black/50 backdrop-blur-sm p-6 rounded-xl w-full max-w-md mx-4">
    //             <h3 className="text-3xl font-bold text-white mb-2">
    //               {promotion.name}
    //             </h3>
    //             <p className="text-gray-100 text-sm mb-4">
    //               {promotion.description}
    //             </p>
    //             <Link href={`/promotion/${promotion.id}`}>
    //               <Button
    //                 className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-full font-medium transition-colors duration-200"
    //                 variant={"outline"}
    //               >
    //                 Khám phá ngay
    //               </Button>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     )}
    //   </CustomSlide>
    // </div>

    <CarouselCustomized title="Sự kiện giảm giá" delay={3200}>
      {!isLoading &&
        promotions?.value?.map((promotion: any) => {
          return (
            <CarouselItem className="hover:cursor-pointer" key={promotion?.id}>
              <div
                key={promotion.id}
                className="relative rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <Image
                  className="object-cover w-full h-72 rounded-t-lg"
                  src={"/images/single.jpg"}
                  alt={promotion.name}
                  height={1000}
                  width={1000}
                />
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  <div className="text-center bg-black/50 backdrop-blur-sm p-6 rounded-xl w-full max-w-md mx-4">
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {promotion.name}
                    </h3>
                    <p className="text-gray-100 text-sm mb-4">
                      {promotion.description}
                    </p>
                    <Link href={`/promotion/${promotion.id}`}>
                      <Button
                        className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-full font-medium transition-colors duration-200"
                        variant={"outline"}
                      >
                        Khám phá ngay
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          );
        })}
    </CarouselCustomized>
  );
};

export default Promotion;
