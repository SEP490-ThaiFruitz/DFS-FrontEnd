"use client";
import React, { useState } from "react";
import { Tickets } from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import Image from "next/image";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { useMutation } from "@tanstack/react-query";
import { collectVoucher } from "@/actions/voucher";
import { toast } from "sonner";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { useVoucherStore, Voucher } from "@/hooks/use-vouchers-store";

export interface CardVoucherProps {
  voucher: Voucher;
}

const CardVoucher = ({ voucher }: Readonly<CardVoucherProps>) => {
  const addOrder = useVoucherStore((state) => state.addVoucher);

  const [isPending, setIsPending] = useState<boolean>(false);

  const handleSave = () => {
    setIsPending(true);

    // Giả lập delay để simulate pending
    setTimeout(() => {
      addOrder(voucher); // gọi hành động lưu vào store
      toast.success("Đã lưu voucher!");
      setIsPending(false);
    }, 1500); // 1.5s giả lập pending
  };

  return (
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
            // disabled={isPending}
            onClick={handleSave}
            className="bg-green-700 hover:bg-green-600 transition-all duration-300 text-white py-1 px-4 rounded-lg text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <WaitingSpinner
                label="Đang lưu..."
                classNameLabel="text-sm"
                variant="pinwheel"
              />
            ) : (
              "Lưu voucher"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardVoucher;
