"use client";
import { ViewCardProduct } from "@/components/global-components/card/view-card-product";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/format-currency";
import { Banknote, MessageCircleHeartIcon, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
import { OrderItem as OrderItemTypes } from "../../payment/successful/payment-successful.types";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";
import { FeedbackDialog } from "@/components/custom/_custom-dialog/feedback-dialog";

interface OrderDetaiSummaryProps {
  totalPrice: number;
  feePrice: number;
  voucherPrice: number | null;
  usedPoint: number;
  orderItems: OrderItemTypes[] | [];
  shipCode: boolean;
  orderStatus: string;
}
const OrderDetaiSummary = ({
  orderItems,
  totalPrice,
  feePrice,
  usedPoint,
  voucherPrice,
  shipCode,
  orderStatus,
}: Readonly<OrderDetaiSummaryProps>) => {
  const totalPriceProducts = orderItems.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
  const totalDiscountPriceProducts = orderItems.reduce((total, item) => {
    return total + item.discountPrice * item.quantity;
  }, 0);

  const [isOpenFeedback, setIsOpenFeedback] = useState<Record<string, boolean>>(
    {}
  );

  const handleFeedbackOpen = (orderItemId: string) => {
    setIsOpenFeedback((prev) => ({
      ...prev,
      [orderItemId]: !prev[orderItemId],
    }));
  };

  return (
    <div className="flex flex-col-reverse lg:flex-col gap-4">
      <Card className="top-8 cardStyle">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-2">
            <Banknote className="w-8 h-8" />
            Thông tin thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-700 font-semibold">Tạm tính:</span>
            <span className="text-lg font-bold text-sky-500/70">
              {formatVND(totalPriceProducts)}
            </span>
          </div>
          {totalPriceProducts - totalDiscountPriceProducts > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-700 font-semibold">Giá đã giảm:</span>
              <span className="text-sm text-gray-400">
                - {formatVND(totalPriceProducts - totalDiscountPriceProducts)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Phí vận chuyển:</span>
            <span className="text-lg font-bold text-sky-500/70">{`${formatVND(
              feePrice
            )}`}</span>
          </div>
          {voucherPrice && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Mã giảm giá:</span>
              <span className="text-sm text-gray-400">{`- ${formatVND(
                voucherPrice
              )}`}</span>
            </div>
          )}
          {usedPoint > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-semibold">Số điểm:</span>
              <span className="text-sm text-gray-400">{`- ${formatVND(
                usedPoint
              )}`}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-gray-900 font-semibold">Tổng tiền:</span>
            <span className="text-base font-bold text-sky-500">
              {formatVND(totalPrice)}
            </span>
          </div>
          {shipCode && (
            <div className="flex items-center space-x-2">
              <p className="text-red-500">(*)</p>
              <p className="text-muted-foreground">{`Vui lòng chuẩn bị ${formatVND(
                totalPrice
              )} thanh toán khi nhận hàng`}</p>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="top-8 cardStyle">
        <CardHeader>
          <CardTitle className="flex justify-center items-center gap-2">
            <ShoppingCart className="w-8 h-8" />
            Chi tiết đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-fit overflow-auto">
            <div className="mr-5">
              {orderItems.map((item: OrderItemTypes) => {
                // console.log("is can feedback`, ", item.isCanFeedback);

                return (
                  <div key={item.id}>
                    <OrderItem item={item} />
                    {/* <Separator /> */}

                    {/* {orderStatus?.toLowerCase() === "completed" && ( */}
                    {item.isCanFeedback && (
                      <div
                        className="text-sm text-sky-500 hover:underline flex items-center font-semibold cursor-pointer mt-1"
                        onClick={() => handleFeedbackOpen(item.id)}
                      >
                        <MessageCircleHeartIcon className="size-6 mr-1" />
                        Đánh giá sản phẩm
                      </div>
                    )}

                    {item.isCanFeedback && (
                      <FeedbackDialog
                        orderItemId={item.id}
                        isOpen={isOpenFeedback[item.id]}
                        onClose={() => handleFeedbackOpen(item.id)}
                      />
                    )}
                  </div>

                  // <ViewCardProduct
                  //   key={item.referenceId}
                  //   orderItemId={item.id}
                  //   productName={item.name}
                  //   isCanFeedback={item.isCanFeedback}
                  //   orderStatus={orderStatus}
                  //   productPrice={item.unitPrice}
                  //   productQuantity={item.quantity}
                  //   productImage={item.image | null}
                  //   productPercentage={item.percentage}
                  //   productDiscountPrice={item.discountPrice}
                  // />
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetaiSummary;
