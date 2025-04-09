"use client";

import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderItemCard from "./order-item-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderItem } from "@/app/(client)/payment/success/[[...slug]]/order-confirmation";

import {
  OrderItem as OrderItemType,
  PaymentOrderValue,
} from "@/features/client/payment/successful/payment-successful.types";

interface OrderItemsListProps {
  items: any[];
  onItemClick: (item: any) => void;
}

export default function OrderItemsList({
  items,
  onItemClick,
}: OrderItemsListProps) {
  return (
    <Card className="overflow-hidden cardStyle">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center">
          <Package className="h-5 w-5 mr-2 text-amber-600" />
          Danh Sách Sản Phẩm
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <ScrollArea className="space-y-4 min-h-fit h-[250px] md:h-[300px] lg:h-[400px]">
          {items.map((item: OrderItemType) => (
            <OrderItem item={item} key={item.id} />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
