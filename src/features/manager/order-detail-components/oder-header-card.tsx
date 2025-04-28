import {
  Calendar,
  CreditCard,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { vietnameseDate } from "@/utils/date";
import { formatVND } from "@/lib/format-currency";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { getStatusText } from "../report-orders/order-status-badge";
import { OrderDetailData } from "./order-detail.types";

interface OrderHeaderCardProps {
  orderData: OrderDetailData;
}

export default function OrderHeaderCard({ orderData }: OrderHeaderCardProps) {
  return (
    <Card className="overflow-hidden cardStyle">
      <div className="bg-gradient-to-br from-yellow-50 via-zinc-50 to-lime-50 px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-700">
              Đơn Hàng{" "}
              <span className="underlined">#{orderData?.orderId ?? "N/A"}</span>
            </h2>
            <p className="text-sm text-slate-700 mt-1 flex items-center">
              <Calendar className="h-4 w-4 inline mr-1" />
              {vietnameseDate(orderData.buyDate, true)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20 text-slate-700 backdrop-blur-sm border border-white/30">
              <AdvancedColorfulBadges color="green">
                {getStatusText(orderData.orderStatus)}
              </AdvancedColorfulBadges>

              {/* <AdvancedColorfulBadges color="violet">
                {orderTypeLabel(orderData.paymentMethod)}
              </AdvancedColorfulBadges> */}
            </div>
            <div className="flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-slate-700 backdrop-blur-sm border border-white/30">
              <CreditCard className="h-4 w-4 mr-1" />
              Thanh toán: {orderData.paymentStatus}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3 shadow-sm">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold">Loại Đơn Hàng</p>
                <AdvancedColorfulBadges
                  color="green"
                  className="text-sm font-semibold"
                >
                  {orderData.orderType}
                </AdvancedColorfulBadges>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3 shadow-sm">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold">Phương Thức Thanh Toán</p>
                <AdvancedColorfulBadges color="violet">
                  {orderData.paymentMethod}
                </AdvancedColorfulBadges>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3 shadow-sm">
                <Truck className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold">Phí Vận Chuyển</p>
                <span className="text-base text-sky-500 font-semibold">
                  {formatVND(orderData.delivery.fee)}
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3 shadow-sm">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold">Tổng Sản Phẩm</p>
                <p className="text-sm text-muted-foreground">
                  {orderData.orderItems.length} sản phẩm
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
