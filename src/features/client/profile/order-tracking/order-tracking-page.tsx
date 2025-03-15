"use client";

import { motion } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderHeader } from "./order-header";
import { OrderItem, ProductList } from "./product-list";
import { OrderAddressDelivery, ShippingInfo } from "./shipping-info";
import { OrderSummary } from "./order-summary";
import { Policies } from "./policy";
import { Columns4, FileBox, MessageSquareQuote, PackageCheck, PackagePlus, PackageX, Search, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import OrderDetailPage from "../order-detail/order-detail-page";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse, PageResult } from "@/types/types";
import { number, string } from "zod";


interface Order {
  orderId: string;
  status: string;
  buyDate: string;
  orderItems: OrderItem[];
  delivery: Delivery | null;
  voucherPrice: number | null;
  pointUsed: number;
  totalPrice: number,
  orderAddressDelivery: OrderAddressDelivery;
}

interface Delivery {
  fee: number,
  estimateDate: string
}

const MotionCard = motion.div;

export const OrderTrackingPage = () => {
  const status = [
    { value: "all", label: "Tất cả", icon: Columns4 },
    { value: "waiting", label: "Chờ xác nhận", icon: FileBox },
    { value: "packing", label: "Đang đóng gói", icon: PackagePlus },
    { value: "delivering", label: "Đang vận chuyển", icon: Truck },
    { value: "delivered", label: "Đã giao hàng", icon: PackageCheck },
    { value: "feedbacked", label: "Đã đánh giá", icon: MessageSquareQuote },
    { value: "canceled", label: "Đã hủy", icon: PackageX },
  ];
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [activeStatus, setActiveStatus] = useState("all");
  const { data: orders, isPending, refetch } = useFetch<ApiResponse<PageResult<Order>>>(`/Orders/user/orders?pageIndex=1&pageSize=10&status=${activeStatus === "all" ? "" : activeStatus}`, ["Customer", "Orders"])

  useEffect(() => {
    refetch()
  }, [refetch, activeStatus])

  return (
    orderId !== undefined ? <OrderDetailPage onBack={() => setOrderId(undefined)} orderId={orderId} /> : <>
      <div className="grid w-full grid-cols-7 h-auto py-4 mb-4 bg-white rounded-md px-5">
        {status.map((trigger) => (
          <button
            key={trigger.value}
            className={`flex items-center justify-center gap-2 py-3 transition-all duration-200 ease-in-out font-bold rounded-sm ${activeStatus === trigger.value
              ? "bg-slate-100 text-slate-700"
              : "hover:bg-gray-100"
              }`}
            onClick={() => setActiveStatus(trigger.value)}
          >
            <trigger.icon className="h-5 w-5" />
            <span className="hidden lg:inline">{trigger.label}</span>
          </button>
        ))}
      </div>
      <div className="py-2 flex items-center space-x-2 mb-4 w-full">
        <div className="relative w-full">
          <Input
            placeholder="Tìm kiếm đơn hàng"
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
        {orders?.value?.items.map((order: Order) => (
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
            <CardContent className="p-6 space-y-6">
              <ScrollArea className="h-[220px] -mx-6 px-6">
                <ProductList orderItems={order.orderItems} />
              </ScrollArea>
              <div className="grid gap-6 sm:grid-cols-2">
                <ShippingInfo orderAddressDelivery={order.orderAddressDelivery} />
                <OrderSummary
                  discountPrice={order.voucherPrice}
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
