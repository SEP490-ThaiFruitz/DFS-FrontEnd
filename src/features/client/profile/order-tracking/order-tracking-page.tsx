"use client";

import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderHeader } from "./order-header";
import { OrderItem, ProductList } from "./product-list";
import { OrderAddressDelivery, ShippingInfo } from "./shipping-info";
import { OrderSummary } from "./order-summary";
import { Policies } from "./policy";
import { Columns4, CreditCard, FileBox, PackageCheck, PackagePlus, PackageX, Search, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import OrderDetailPage from "../order-detail/order-detail-page";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { API } from "@/actions/client/api-config";


interface OrderResponse {
  orders: Order[],
  statusCounts: StatusCounts
}

interface Order {
  orderId: string;
  status: string;
  buyDate: string;
  orderItems: OrderItem[];
  delivery: Delivery | null;
  discountPrice: number | null;
  paymentStatus: string,
  pointUsed: number;
  totalPrice: number,
  orderAddressDelivery: OrderAddressDelivery;

}

interface Delivery {
  fee: number,
  estimateDate: string
}

interface StatusCounts {
  "Pending": number;
  "Packaging": number;
  "Delivering": number;
}

const MotionCard = motion.div;

export const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [activeStatus, setActiveStatus] = useState("All");
  const { data: orders, isPending, refetch } = useFetch<ApiResponse<OrderResponse>>('/Orders/user/orders', ["Customer", "Orders"])
  const [searchText, setSearchText] = useState<string | undefined>()

  const status = [
    { value: "All", label: "Tất cả", icon: Columns4 },
    { value: "Pending", label: "Chờ xác nhận", icon: FileBox, quantity: orders?.value?.statusCounts["Pending"] },
    { value: "Packaging", label: "Đang đóng gói", icon: PackagePlus, quantity: orders?.value?.statusCounts["Packaging"] },
    { value: "Delivering", label: "Đang vận chuyển", icon: Truck, quantity: orders?.value?.statusCounts["Delivering"] },
    { value: "Delivered", label: "Đã giao hàng", icon: PackageCheck },
    { value: "Canceled", label: "Đã hủy", icon: PackageX },
  ];

  const orderSearch = searchText ? orders?.value?.orders.filter((order: Order) => order.orderId.includes(searchText))
    : orders?.value?.orders

  const orderFilter = activeStatus === "All" ? orderSearch :
    orderSearch?.filter((order: Order) => order.status === activeStatus);

  const handleReceivedOrder = async (orderId: string) => {
    try {
      const response = await API.patch(`/Orders/${orderId}/confirm`, "")
      if (response) {
        refetch();
        toast.success("Xác nhận nhận hàng thành công")
      } else {
        toast.error("Xác nhận nhận hàng thất bại")
      }
    } catch (error) {
      console.log(error)
      toast.error("Lỗi hệ thống")
    }
  }

  return (
    orderId !== undefined ? <OrderDetailPage onBack={() => setOrderId(undefined)} orderId={orderId} /> : <>
      <div className="grid w-full grid-cols-6 h-auto py-4 mb-4 bg-white rounded-md px-5">
        {status.map((trigger) => (
          <button
            key={trigger.value}
            className={`relative flex items-center justify-center gap-2 py-3 transition-all duration-200 ease-in-out font-bold rounded-sm ${activeStatus === trigger.value
              ? "bg-slate-100 text-slate-700"
              : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveStatus(trigger.value)}
          >
            <trigger.icon className="h-5 w-5" />
            <span className="hidden lg:inline">{trigger.label}</span>

            <span className={`absolute right-0 top-0 bg-red-500 text-white leading-6 w-6 text-sm rounded-full ${trigger.quantity && trigger.quantity > 0 ? 'block' : 'hidden'}`}>{trigger.quantity}</span>

          </button>
        ))}
      </div>
      <div className="py-2 flex items-center space-x-2 mb-4 w-full">
        <div className="relative w-full">
          <Input
            placeholder="Tìm kiếm mã đơn hàng"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value.toLocaleUpperCase())}
            className="h-14 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button className="h-14 px-6 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200">
          Tìm kiếm
        </Button>
      </div>
      <div className="min-h-screen grid lg:grid-cols-2 gap-10">
        {/* <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 p-4 flex items-center justify-center"> */}
        {orderFilter?.map((order: Order) => (
          <MotionCard
            key={order.orderId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl bg-white/60 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-200 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <OrderHeader
              orderId={order.orderId}
              status={order.status}
              buyDate={order.buyDate}
              timeEstimateDelivery={order.delivery?.estimateDate}
              onClickDetail={() => setOrderId(order.orderId)} />

            <div className="px-6 pb-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">Trạng thái thanh toán:</span>
                  {order.paymentStatus === "Paid" ?
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 font-medium">
                      Đã thanh toán
                    </Badge> : <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 font-medium">
                      Chưa thanh toán
                    </Badge>
                  }
                </div>
                {order.paymentStatus === "Fail" && (
                  <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 font-medium">
                    Thanh toán thất bại
                  </Badge>
                )}
                {order.paymentStatus !== "Paid" && (
                  <Button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors text-sm">
                    Thanh toán ngay
                  </Button>
                )}
                {order.status === "Delivered" && (
                  <Button onClick={() => handleReceivedOrder(order.orderId)} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors text-sm">
                    Đã nhận hàng
                  </Button>
                )}
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              <ScrollArea className="h-[220px] -mx-6 px-6">
                <ProductList orderStatus={order.status} orderItems={order.orderItems} />
              </ScrollArea>
              <div className="grid gap-6 sm:grid-cols-2">
                <ShippingInfo orderAddressDelivery={order.orderAddressDelivery} />
                <OrderSummary
                  discountPrice={order.discountPrice}
                  feeShip={order.delivery?.fee}
                  pointUsed={order.pointUsed}
                  orderItems={order.orderItems}
                  totalPrice={order.totalPrice} />
              </div>
              <Policies />
            </CardContent>
          </MotionCard>
        ))}
      </div>
    </>
  );
};
