"use client";

import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import Image from "next/image";
import { ApiResponse } from "@/types/types";
import { Tickets } from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import Link from "next/link";

export interface Voucher {
  name: string;
  image: string | null;
  value: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  discountType: "Fixed" | "Percentage";
  startDate: string;
  endDate: string;
  isUsed: boolean;
}

const VoucherTab = () => {
  const { data: vouchers, isPending } = useFetch<ApiResponse<Voucher[]>>(
    "/Vouchers/my-vouchers"
  );

  const getVoucherStatusText = (voucher: Voucher) => {
    if (voucher.isUsed) return;
    return new Date() <= new Date(voucher.endDate) ? (
      <button className="px-2 py-1 font-bold bg-green-700 text-white rounded-md hover:bg-green-600   ">
        Sử dụng
      </button>
    ) : (
      <></>
    );
  };
  const getRemainingTime = (endDate: string) => {
    const remainingMilliseconds =
      new Date(endDate).getTime() - new Date().getTime();
    const remainingDays = Math.floor(
      remainingMilliseconds / (1000 * 60 * 60 * 24)
    );
    if (remainingMilliseconds <= 0)
      return (
        <div className="px-2 py-1 bg-red-50 w-fit rounded-md text-red-700 font-bold text-center">
          Đã hết hạn
        </div>
      );

    return (
      <div
        className={`px-2 py-1  w-fit rounded-md font-bold text-center ${
          remainingDays > 3
            ? "bg-green-50 text-green-700 "
            : "bg-yellow-50 text-yellow-700 "
        }`}
      >
        {remainingDays} ngày
      </div>
    );
  };
  return isPending ? (
    Array.from({ length: 3 }).map((_, index) => (
      <div
        key={index + 1}
        className="p-4 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center gap-4 bg-white"
      >
        <Skeleton className="h-24" />
        <Skeleton className="h-10 w-full lg:col-span-2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    ))
  ) : (
    <div className="space-y-2">
      <div className="hidden p-4 sm:grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center gap-4 bg-white ">
        <div className="hidden md:block">Hình ảnh</div>
        <div className="lg:col-span-2">Nội dung</div>
        <div>Giảm giá</div>
        <div className="w-full flex justify-center md:w-36 mx-auto md:mx-0">
          Thời gian
        </div>
        <div className="w-full flex justify-center md:w-32 mx-auto md:mx-0">
          Trạng thái
        </div>
      </div>

      {vouchers?.value?.map((voucher: Voucher, index) => (
        <div
          key={index + 1}
          className="p-4 grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 items-center gap-4 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="relative w-full h-24 flex-shrink-0 mx-auto md:mx-0">
            {voucher.image ? (
              <div className="relative p-5 rounded-md flex items-center justify-center bg-green-700">
                <Image
                  src="/images/dried-fruit.webp"
                  alt={voucher.name}
                  width={1000}
                  height={1000}
                  className="h-16 w-16 object-fill"
                />
                <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i + 1}
                      className="h-2 w-2 rounded-full bg-white -ml-1"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="relative p-5 rounded-md flex items-center justify-center bg-green-700">
                <Tickets className="h-16 w-16 text-white" />
                <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i + 1}
                      className="h-2 w-2 rounded-full bg-white -ml-1"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 text-center md:text-left">
            <p className="font-bold text-sm sm:text-base">{voucher.name}</p>
            <p className="font-light text-xs sm:text-sm text-slate-600">
              {"Đơn tối thiểu " +
                formatVND(voucher.minimumOrderAmount) +
                (voucher.discountType === "Percentage"
                  ? " - Giảm tối đa " + formatVND(voucher.maximumDiscountAmount)
                  : "")}
            </p>
          </div>

          <div className="w-fit font-bold text-sm sm:text-base mx-auto md:mx-0">
            {voucher.discountType === "Percentage"
              ? `${voucher.value} %`
              : formatVND(voucher.value)}
          </div>

          <div className="w-full flex justify-center md:w-36 mx-auto md:mx-0">
            {voucher.isUsed ? (
              <div className="px-2 py-1 bg-slate-50 w-fit rounded-md text-slate-700 font-bold text-center">
                Đã sử dụng
              </div>
            ) : (
              getRemainingTime(voucher.endDate)
            )}
          </div>

          <Link
            href={"/find"}
            className="w-full flex justify-center md:w-32 mx-auto md:mx-0"
          >
            {getVoucherStatusText(voucher)}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default VoucherTab;
