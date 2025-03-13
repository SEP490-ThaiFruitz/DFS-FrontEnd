"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import React from "react";
import CardVoucher from "./card-voucher";
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
  startDate: string,
  endDate: string,
}

export type VoucherResponse = {
  value: Voucher[];
};

const VoucherSlide = () => {
  const { data: vouchers, isLoading } = useFetch<ApiResponse<Voucher[]>>(
    "/Vouchers/vouchers-for-home-page",
    ["Voucher", "Home"]
  );

  return vouchers?.value && vouchers?.value?.length > 0 ? (
    <div className=" w-full">
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
      </CarouselCustomized>
    </div>
  ) : <></>;
};

export default VoucherSlide;
