import { DollarSign } from "lucide-react";
import { formatVND } from "@/lib/format-currency";
import { OrderItem } from "../../payment/successful/payment-successful.types";

interface OrderSummaryProps {
  voucherPrice: number | null;
  pointUsed: number;
  feeShip: number | undefined;
  totalPrice: number;
  orderItems: OrderItem[];
}

export const OrderSummary = ({
  voucherPrice,
  pointUsed,
  feeShip,
  totalPrice,
  orderItems,
}: Readonly<OrderSummaryProps>) => {
  const totalPriceProducts = orderItems.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);
  const totalDiscountPriceProducts = orderItems.reduce((total, item) => {
    return total + item.discountPrice * item.quantity;
  }, 0);

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg cardStyle">
      <h2 className="font-semibold text-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <DollarSign className="w-5 h-5" />
        Tổng quan đơn hàng
      </h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính:</span>
          <span className="text-lg font-bold text-sky-500/70">
            {formatVND(totalPriceProducts)}
          </span>
        </div>
        {totalPriceProducts - totalDiscountPriceProducts > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giá đã giảm:</span>
            <span className="text-sm text-gray-400">
              - {formatVND(totalPriceProducts - totalDiscountPriceProducts)}
            </span>
          </div>
        )}
        {voucherPrice && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã giảm giá:</span>
            <span className="text-green-600 dark:text-green-400">
              - {formatVND(voucherPrice)}
            </span>
          </div>
        )}
        {pointUsed > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Điểm:</span>
            <span className="text-sm text-gray-400">
              - {formatVND(pointUsed)}
            </span>
          </div>
        )}
        {feeShip && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Vận chuyển:</span>
            <span className="text-lg font-bold text-sky-500/70">
              {formatVND(feeShip)}
            </span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Tổng:</span>
          <span className="text-lg font-bold text-sky-500/70">
            {formatVND(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};
