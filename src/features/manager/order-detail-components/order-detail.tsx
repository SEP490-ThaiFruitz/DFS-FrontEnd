"use client";

import { useState } from "react";
import { Eye, Loader2, ViewIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DeliveryAddressCard from "./delivery-address-card";
import OrderHeaderCard from "./oder-header-card";
import OrderItemsList from "./order-list";
import OrderSummary from "./order-summary";
import OrderTimeline from "./order-timeline";
import { Logo } from "@/components/global-components/logo";
import { OrderDetailData } from "./order-detail.types";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ORDERS_KEY } from "@/app/key/manager-key";
import { ApiResponse } from "@/types/types";
import { NotData } from "@/components/global-components/no-data";

interface OrderDetailsProps {
  orderId: string;
}

export default function OrderDetails({ orderId }: OrderDetailsProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const openItemDetails = (item: any) => {
    setSelectedItem(item);
    setIsSheetOpen(true);
  };

  const openOrderDetails = () => {
    setSelectedItem(null);
    setIsSheetOpen(true);
  };

  const orderDetailData = useFetch<ApiResponse<OrderDetailData>>(
    `/Orders/${orderId}`,
    [`${ORDERS_KEY.ORDER_LIST_DETAIL}/${orderId}`]
  );

  if (orderDetailData.isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
      </div>
    );
  }

  if (orderDetailData.isError) {
    return (
      <NotData
        action={{
          label: "Thử tải lại",
          onClick: () => orderDetailData.refetch(),
        }}
      />
    );
  }
  const orderDetail = orderDetailData.data?.value as OrderDetailData;

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 w-full">
          <ViewIcon className="size-4" />
          Xem Chi Tiết Đơn Hàng
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-full md:min-w-[65%] lg:min-w-[70%] rounded-3xl mr-2 overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between ">
            <Logo height={120} width={120} classNameLabel="text-4xl" />

            <div className="flex flex-col gap-1">
              <SheetTitle className="text-lg font-semibold">
                Chi Tiết Đơn Hàng
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Xem thông tin chi tiết về đơn hàng của bạn.
              </SheetDescription>
            </div>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Đóng
            </Button>
          </div>
        </SheetHeader>

        <div className="max-w-6xl  mx-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Order info and items */}
            <div className="lg:col-span-2 space-y-6">
              <OrderHeaderCard orderData={orderDetail} />
              <DeliveryAddressCard
                address={orderDetail?.orderAddressDelivery}
              />
              <OrderItemsList
                items={orderDetail?.orderItems}
                onItemClick={openItemDetails}
              />
            </div>

            {/* Right column - Summary and Timeline */}
            <div className="space-y-6">
              <OrderSummary orderData={orderDetail} />
              <OrderTimeline timeline={orderDetail?.timeline} />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
