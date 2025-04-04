"use client";
import React from "react";
import { Tickets } from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import Image from "next/image";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { useMutation } from "@tanstack/react-query";
import { collectVoucher } from "@/actions/voucher";
import { toast } from "sonner";
import { Voucher } from "./voucher-slide";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";

export interface CardVoucherProps {
  voucher: Voucher;
}

const CardVoucher = ({ voucher }: Readonly<CardVoucherProps>) => {
  const { mutate: collectVoucherMutation, isPending } = useMutation({
    mutationFn: async (voucherId: string) => {
      try {
        const response = await collectVoucher({ voucherId });
        if (!response?.isSuccess) {
          if (response?.status === 400) {
            if (response.detail.includes("already exist")) {
              throw new Error("Bạn đã có mã giảm giá này rồi");
            }
          }
          if (response?.status === 401) {
            throw new Error("Vui lòng đăng nhập");
          }
          throw new Error("Lỗi");
        }
      } catch (error: unknown) {
        throw new Error(
          error instanceof Error ? error?.message : "Lỗi hệ thống"
        );
      }
    },
    onSuccess: () => {
      toast.success("Đã thêm vào ví voucher");
    },
    onError: (error) => {
      toast.error(error?.message);
    },
  });

  return (
    // <div
    //   key={voucher.name}
    //   className="grid grid-cols-3  gap-4  shadow-sm min-h-32 cardStyle"
    // >
    //   {voucher.image ? (
    //     <div className="relative h-full rounded-md flex items-center justify-center bg-green-700">
    //       <Image
    //         src="/images/dried-fruit.webp"
    //         alt={"tes"}
    //         width={1000}
    //         height={1000}
    //         className="h-16 w-16 object-fill"
    //       />
    //       <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
    //         {[...Array(8)].map((_, i) => (
    //           <div
    //             key={i + 1}
    //             className="h-2 w-2 rounded-full bg-white -ml-1"
    //           />
    //         ))}
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="relative h-full rounded-md flex items-center justify-center bg-green-700 rounded-l-3xl">
    //       <Tickets className="h-16 w-16 text-white" />
    //       <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
    //         {[...Array(8)].map((_, i) => (
    //           <div
    //             key={i + 1}
    //             className="h-2 w-2 rounded-full bg-white -ml-1"
    //           />
    //         ))}
    //       </div>
    //     </div>
    //   )}
    //   <div className="py-1">
    //     <div className="font-bold text-sm sm:text-base">{voucher.name}</div>
    //     <span className="font-light text-xs sm:text-sm text-slate-600">
    //       {"Đơn tối thiểu " +
    //         formatVND(voucher.minimumOrderAmount) +
    //         (voucher.discountType === "Percentage"
    //           ? " - Giảm tối đa " + formatVND(voucher.maximumDiscountAmount)
    //           : "")}
    //     </span>
    //     <div className="font-light text-xs sm:text-sm text-slate-600 text-nowrap">
    //       <div>Ngày kết thúc:</div>
    //       {formatTimeVietNam(new Date(voucher.endDate))}
    //     </div>
    //   </div>
    //   <button
    //     disabled={isPending}
    //     onClick={() => collectVoucherMutation(voucher.id)}
    //     className="bg-green-700 h-12 text-white w-fit mx-auto py-1 px-2 rounded-md hover:bg-green-600"
    //   >
    //     {isPending ? (
    //       <WaitingSpinner
    //         label="Đang..."
    //         classNameLabel="text-sm"
    //         variant="pinwheel"
    //       />
    //     ) : (
    //       "Sưu tầm"
    //     )}
    //   </button>
    // </div>

    <div className="flex shadow-sm min-h-32 rounded-md overflow-hidden bg-white cardStyle">
      {/* Hình ảnh hoặc icon */}
      <div className="relative w-72 flex items-center justify-center bg-green-700">
        {voucher.image ? (
          <Image
            src="/images/dried-fruit.webp"
            alt={"tes"}
            width={1000}
            height={1000}
            className="h-16 w-16 object-fill"
          />
        ) : (
          <Tickets className="h-16 w-16 text-white" />
        )}
        <div className="absolute -right-2 top-0 h-full w-2 flex flex-col justify-between py-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-white -ml-1" />
          ))}
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col justify-between p-2 text-sm">
        <div>
          <div className="font-bold text-base">{voucher.name}</div>
          <div className="text-slate-600 font-semibold mt-1">
            Đơn tối thiểu:{" "}
            <span className="font-bold text-sky-500 text-base">
              {formatVND(voucher.minimumOrderAmount)}
            </span>
            {voucher.discountType === "Percentage" ? (
              <div className="text-slate-600 font-semibold mt-1">
                - Giảm tối đa:{" "}
                <span className="font-bold text-sky-500 text-base">
                  {formatVND(voucher.maximumDiscountAmount)}
                </span>
              </div>
            ) : (
              <div className="text-slate-600 font-semibold mt-1">
                - Giảm tối đa:{" "}
                <span className="font-bold text-sky-500 text-base">
                  {formatVND(0)}
                </span>
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            <div className="font-semibold">Ngày kết thúc:</div>
            <span className="font-light text-xs sm:text-sm text-slate-600">
              {formatTimeVietNam(new Date(voucher.endDate))}
            </span>
          </div>
        </div>

        {/* Nút sưu tầm */}
        <div className="mt-2">
          <button
            disabled={isPending}
            onClick={() => collectVoucherMutation(voucher.id)}
            className="bg-green-700 hover:bg-green-600 transition-all duration-300 text-white py-1 px-4 rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <WaitingSpinner
                label="Đang..."
                classNameLabel="text-sm"
                variant="pinwheel"
              />
            ) : (
              "Sưu tầm"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardVoucher;
