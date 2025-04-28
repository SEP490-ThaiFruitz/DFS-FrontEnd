"use client";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getStatusColor,
  getStatusIcon,
} from "@/features/manager/report-orders/order-status-badge";
import { formatTimeVietNam } from "@/lib/format-time-vietnam";
import { OrderStatus } from "@/types/report-orders.types";
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { ScrollTextIcon, Plane, Package, Boxes, Wallet } from "lucide-react";
import React from "react";

interface OrderHeaderProps {
  status: string;
  orderId: string;
  buyDate: string;
  timeEstimateDelivery?: string | null;
  onClickDetail: () => void;
}

export const OrderHeader = ({
  status,
  orderId,
  buyDate,
  timeEstimateDelivery,
  onClickDetail,
}: Readonly<OrderHeaderProps>) => {
  // const orderStatusMap: Record<string, string> = {
  //   Pending: "Đang chờ xử lý",
  //   Packaging: "Đang đóng gói",
  //   Shipping: "Đang vận chuyển",
  //   Delivering: "Đang giao",
  //   Delivered: "Đã giao hàng",
  //   Received: "Đã nhận hàng",
  //   Completed: "Đơn hàng đã hoàn tất",

  //   // exception status
  //   Cancelled: "Đã hủy",
  //   Returned: "Đã trả hàng",
  //   Exchanged: "Đã đổi hàng",
  //   Requesting: "Đang được yêu cầu đổi/trả",
  // };

  return (
    <div className="bg-gradient-to-br from-slate-400 via-neutral-400 to-zinc-500 text-white p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <AdvancedColorfulBadges
            // color="violet"
            className={`mb-2 bg-white p-2 font-semibold text-base ${getStatusColor(
              status
            )}`}
          >
            {getStatusIcon(status)}
            {OrderStatus[status.toLowerCase() as keyof typeof OrderStatus]}
          </AdvancedColorfulBadges>
          <h2 className="hidden xl:flex text-2xl font-bold items-center gap-2">
            <Package className="w-12 h-12 shrink-0" />
            Mã đơn hàng: {orderId}
          </h2>
        </div>
        <div className="flex gap-2">
          {/* <Button
            size="sm"
            variant="secondary"
            className="bg-white/20 hover:bg-white/30 text-white border-none sm:inline-flex hidden"
          >
            <ScrollTextIcon className="w-4 h-4 mr-1" /> Hoá Đơn
          </Button> */}
          <Button
            size="sm"
            variant="secondary"
            onClick={onClickDetail}
            className="bg-white/20 hover:bg-white/30 text-white border-none"
          >
            <Boxes className="w-4 h-4 mr-1" /> Xem chi tiết
          </Button>
        </div>
      </div>
      <h2 className="lg:hidden text-2xl font-bold flex items-center gap-2">
        <Package className="w-6 h-6" />
        Mã đơn hàng: {orderId}
      </h2>
      <div className="flex flex-row sm:flex-row sm:items-center text-sm gap-2 sm:gap-4 text-white cardStyle p-4">
        <div>
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Ngày mua:
          </div>
          <div className="flex flex-col gap-y-1">
            <span className="font-semibold text-base underline">
              {vietnameseDate(buyDate, true)}
            </span>
            <span className="font-semibold text-base underline">
              {formatRelativeTime(buyDate)}
            </span>
          </div>
        </div>

        {timeEstimateDelivery && (
          <>
            <span className="hidden sm:inline">•</span>
            <div>
              <div className="flex items-center gap-1">
                <Plane className="w-4 h-4 shrink-0" /> Ước tính vận chuyển:
              </div>
              <div>{vietnameseDate(timeEstimateDelivery, true)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
