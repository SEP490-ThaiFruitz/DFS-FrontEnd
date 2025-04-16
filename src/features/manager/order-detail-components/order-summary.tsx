import { CreditCard, Gift, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatVND } from "@/lib/format-currency";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

interface OrderSummaryProps {
  orderData: any;
}

export default function OrderSummary({ orderData }: OrderSummaryProps) {
  // Calculate subtotal (sum of all items)
  const subtotal = orderData.orderItems.reduce(
    (sum: number, item: any) => sum + item.discountPrice * item.quantity,
    0
  );

  return (
    <Card className=" cardStyle">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
          Tổng Thanh Toán
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính</span>
            <span className="text-base text-sky-500 font-semibold">
              {formatVND(subtotal)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Phí vận chuyển</span>
            {/* <span className="text-base text-sky-500 font-semibold">{formatVND(subtotal)}</span> */}
            <span className="text-base text-sky-500 font-semibold">
              {formatVND(orderData?.delivery?.fee)}
            </span>
          </div>

          {orderData?.voucherPrice && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Gift className="h-4 w-4 mr-1" />
                Voucher
              </span>
              <span>{formatVND(subtotal)}</span>
              <span className="text-amber-600">
                -{formatVND(orderData?.voucherPrice)}
              </span>
            </div>
          )}

          {orderData.pointUsed > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground flex items-center">
                <Coins className="h-4 w-4 mr-1" />
                Điểm sử dụng
              </span>
              <span>{orderData.pointUsed} điểm</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-base text-sky-500 font-semibold">
              {formatVND(orderData?.totalPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-amber-50 p-4 rounded-lg mt-4 border border-amber-100 cardStyle">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
              <span className="font-semibold">Phương thức thanh toán</span>
            </div>
            <AdvancedColorfulBadges color="violet" className="font-semibold">
              {orderData?.paymentMethod}
            </AdvancedColorfulBadges>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
