"use client";

import {
  CalendarRange,
  CreditCard,
  Percent,
  Tag,
  Ticket,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/format-currency";
import { vietnameseDate } from "@/utils/date";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { interactApi } from "@/actions/client/interact-api";
import { interactApiClient } from "@/actions/client/interact-api-client";
import { ApiResponse } from "@/types/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface VoucherData {
  id: string;
  name: string;
  code: string;
  value: number;
  discountType: string;
  startDate: string;
  endDate: string;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  quantity: number;
}

interface VouchersEventsProps {
  voucher: VoucherData;
}

interface ApplyVoucherProps {
  setVoucher: React.Dispatch<React.SetStateAction<VoucherData | undefined>>;
}
export const ApplyVoucher = memo(({ setVoucher }: ApplyVoucherProps) => {
  const [promoCode, setPromoCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [voucherData, setVoucherData] = useState<VoucherData | null>(null);

  const handleApplyPromoCode = async () => {
    if (!isSubmitting) {
      toast.info("Hãy nhập code giảm giá!");
    }

    setIsSubmitting(true);
    try {
      const response = await interactApiClient.get<ApiResponse<VoucherData>>(
        `/Vouchers/code/${promoCode}`
      );

      // console.log(response);

      if (response?.value) {
        setVoucherData(response.value);
        toast.success("Áp dụng mã giảm giá thành công!");
      } else {
        toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn!");

        setVoucherData(null);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        "Chưa thể áp dụng mã giảm giá hoặc có thể mã giảm giá đã được sử dụng!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            Mã giảm giá
          </Label>
          <Input
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="inputStyle"
            disabled={isSubmitting}
          />
        </div>
        <Button
          disabled={isSubmitting}
          onClick={handleApplyPromoCode}
          variant="outline"
        >
          Áp dụng
        </Button>
      </div>

      {voucherData != null && (
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger
              asChild
              onClick={() => {
                setVoucher(voucherData);

                toast.success("Áp dụng mã giảm giá thành công!");
              }}
            >
              <span className="text-slate-600 text-sm cursor-pointer hover:underline text-wrap">
                Bạn có mã giảm giá áp dụng cho đơn tối thiểu{" "}
                <span className="text-sky-500 font-semibold text-base">
                  {formatVND(voucherData?.minimumOrderAmount)}
                </span>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <VouchersEvents voucher={voucherData} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
});

ApplyVoucher.displayName = "ApplyVoucher";

export function VouchersEvents({ voucher }: VouchersEventsProps) {
  const isPercentage = voucher.discountType === "Percentage";
  const now = new Date();
  const endDate = new Date(voucher.endDate);
  const isActive = now <= endDate;

  return (
    <Card className="max-w-lg mx-auto overflow-hidden cardStyle">
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-3" />
      <div className="absolute top-3 right-3">
        <Badge
          variant={isActive ? "default" : "secondary"}
          className="font-medium text-xs px-2 py-0.5"
        >
          {isActive ? "Còn hiệu lực" : "Hết hạn"}
        </Badge>
      </div>
      <CardHeader className="pb-2 pt-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold text-emerald-800">
            {voucher.name}
          </CardTitle>
          <CardDescription className="text-sm">
            Mã giảm giá cho đơn hàng của bạn
          </CardDescription>
        </div>
        <div className="mt-2 flex items-center justify-between bg-muted/30 p-3 rounded-lg border border-dashed border-emerald-200">
          <span className="text-sm font-medium text-muted-foreground">
            Mã voucher:
          </span>
          <Badge
            variant="outline"
            className="font-mono text-sm px-3 py-1 bg-white border-2 border-dashed border-emerald-300"
          >
            {voucher.code}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100">
          <div className="flex items-center gap-2">
            {isPercentage ? (
              <Percent className="h-6 w-6 text-emerald-600" />
            ) : (
              <CreditCard className="h-6 w-6 text-emerald-600" />
            )}
            <span className="font-medium">Giá trị giảm giá</span>
          </div>
          <div className="text-xl font-bold text-sky-500">
            {isPercentage ? `${voucher.value}%` : formatVND(voucher.value)}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-muted">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              <span className="text-sm">Đơn hàng tối thiểu:</span>
            </div>
            <span className="font-semibold">
              {formatVND(voucher.minimumOrderAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-muted">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-emerald-600" />
              <span className="text-sm">Giảm giá tối đa:</span>
            </div>
            <span className="font-semibold">
              {formatVND(voucher.maximumDiscountAmount)}
            </span>
          </div>
        </div>

        <Separator className="my-1" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5 text-emerald-600" />
            <span className="font-medium">Thời gian hiệu lực:</span>
          </div>
          <div className="grid grid-cols-1 gap-2 pl-7 text-sm">
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/10">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Từ:</span>
              </div>
              <span>{vietnameseDate(voucher.startDate, true)}</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-md bg-muted/10">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Đến:</span>
              </div>
              <span>{vietnameseDate(voucher.endDate)}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gradient-to-r from-emerald-50 to-teal-50 flex justify-between items-center py-4 px-6 border-t border-emerald-100">
        <div className="flex items-center gap-2">
          <Ticket className="h-5 w-5 text-emerald-600" />
          <span className="text-sm text-muted-foreground">Còn lại:</span>
          <span className="font-medium text-emerald-700">
            {voucher.quantity} voucher
          </span>
        </div>

        <div className="text-xs text-muted-foreground">
          ID: {voucher.id.substring(0, 8)}...
        </div>
      </CardFooter>
    </Card>
  );
}
