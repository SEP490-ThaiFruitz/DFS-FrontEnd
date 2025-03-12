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

  console.log({ voucher });

  return (
    <div
      key={voucher.name}
      className="grid grid-cols-3 items-center gap-4 border shadow-sm min-h-32 rounded-md"
    >
      {voucher.image ? (
        <div className="relative h-full rounded-md flex items-center justify-center bg-green-700">
          <Image
            src="/images/dried-fruit.webp"
            alt={"tes"}
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
        <div className="relative h-full rounded-md flex items-center justify-center bg-green-700">
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
      <div className="py-1">
        <div className="font-bold text-sm sm:text-base">{voucher.name}</div>
        <span className="font-light text-xs sm:text-sm text-slate-600">
          {"Đơn tối thiểu " +
            formatVND(voucher.minimumOrderAmount) +
            (voucher.discountType === "Percentage"
              ? " - Giảm tối đa " + formatVND(voucher.maximumDiscountAmount)
              : "")}
        </span>
        <div className="font-light text-xs sm:text-sm text-slate-600 text-nowrap">
          <div>Ngày kết thúc:</div>
          {formatTimeVietNam(new Date(voucher.endDate))}</div>
      </div>
      <button
        disabled={isPending}
        onClick={() => collectVoucherMutation(voucher.id)}
        className="bg-green-700 text-white w-fit mx-auto py-1 px-2 rounded-md hover:bg-green-600"
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
  );
};

export default CardVoucher;
