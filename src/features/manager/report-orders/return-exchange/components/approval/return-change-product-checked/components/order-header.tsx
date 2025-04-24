"use client";

import { ChevronDown, ChevronUp, Info, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { vietnameseDate } from "@/utils/date";
import { formatVND } from "@/lib/format-currency";
import { orderTypeLabel } from "@/utils/label";
import { GroupedOrder } from "../types/return-exchange";
import { CustomComboThumbnail } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";

interface OrderHeaderProps {
  orderInfo: GroupedOrder["orderInfo"];
  itemCount: number;
  requestStatus: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  requestDate: string;
}

export default function OrderHeader({
  orderInfo,
  itemCount,
  requestStatus,
  isExpanded,
  onToggleExpand,
  requestDate,
}: OrderHeaderProps) {
  const hasImages = orderInfo.customImages?.length;

  const images: string[] = (
    hasImages ? orderInfo?.customImages ?? [] : [orderInfo?.image]
  ).filter(Boolean) as string[];

  // console.log({ images });

  return (
    <CardHeader className="bg-gradient-to-r from-slate-50 to-white pb-3">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-row gap-1">
          <CustomComboThumbnail
            images={images}
            // className="size-full"
            height={300}
            width={300}
          />

          <div className="flex flex-col">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-slate-700" />
              {orderTypeLabel(orderInfo.itemType)}
            </CardTitle>

            <div>
              <div className="flex items-center gap-2 mt-1 font-semibold text-slate-700">
                <CardDescription>
                  Mã sản phẩm: {orderInfo.id.substring(0, 8)}...
                </CardDescription>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Info className="size-5" />
                        <span className="sr-only">Chi tiết</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mã đơn hàng đầy đủ: {orderInfo.referenceId}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mt-1">
              Ngày tạo: {vietnameseDate(requestDate)}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{itemCount} sản phẩm</span>
            <Badge variant="outline" className="bg-slate-50">
              {requestStatus === "Return" ? "Trả hàng" : "Đổi hàng"}
            </Badge>
          </div>
          <span className="font-semibold text-emerald-600 mt-1">
            {formatVND(orderInfo.totalPrice)}
          </span>
        </div>
      </div>
      <button
        onClick={onToggleExpand}
        className="flex font-semibold` items-center text-sm text-slate-700 hover:text-slate-900 transition-colors mt-2 group"
      >
        {isExpanded ? (
          <>
            Thu gọn{" "}
            <ChevronUp className="h-4 w-4 ml-1 group-hover:translate-y-[-2px] transition-transform" />
          </>
        ) : (
          <>
            Xem chi tiết{" "}
            <ChevronDown className="h-4 w-4 ml-1 group-hover:translate-y-[2px] transition-transform" />
          </>
        )}
      </button>
    </CardHeader>
  );
}
