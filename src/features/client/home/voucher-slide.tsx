"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse, PageResult } from "@/types/types";
import React from "react";
import CardVoucher from "./card-voucher";
import CustomSlide from "@/components/global-components/slide/custom-slide";
import { CarouselCustomized } from "@/components/custom/carousel-customized";
import { CarouselItem } from "@/components/ui/carousel";

export interface Voucher {
  id: string;
  name: string;
  value: number;
  image?: string;
  discountType: "Amount" | "Percentage";
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
}

export type VoucherResponse = {
  value: Voucher[];
};

const VoucherSlide = () => {
  const { data: vouchers, isLoading } = useFetch<ApiResponse<Voucher[]>>(
    "/Vouchers/vouchers-for-home-page",
    ["Voucher", "Home"]
  );

  return (
    <div className=" w-full">
      {/* <CustomSlide
        mobile={1}
        tablet={2}
        pc={3}
        classNameSlide="w-fit lg:px-20 group"
        classNameSub="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-16"
        data={vouchers?.value?.items ?? []}
      > */}

      <CarouselCustomized title="Voucher" delay={3000}>
        {!isLoading &&
          vouchers?.value?.map((voucher: Voucher) => {
            return (
              <CarouselItem
                key={voucher.id}
                className="md:basis-1/2 lg:basis-1/3 pl-4"
              >
                <CardVoucher voucher={voucher} />
              </CarouselItem>
            );
          })}
        {/* {(voucher: Voucher) => (
          <CarouselItem key={voucher.id}>
            <CardVoucher key={voucher.id} voucher={voucher} />
          </CarouselItem>
        )} */}
      </CarouselCustomized>
      {/* </CustomSlide> */}
    </div>
  );
};

export default VoucherSlide;
