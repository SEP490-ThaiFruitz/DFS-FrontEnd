import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  GroupedOrder,
  ReturnExchangeRequestItem,
} from "./types/return-exchange";
import { OrderReturnItem } from "@/types/order-detail.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Group items by order ID
export const groupItemsByOrder = (items: OrderReturnItem[]): GroupedOrder[] => {
  const grouped: Record<string, GroupedOrder> = {};

  items.forEach((item) => {
    const orderId = item.orderItem.id;
    if (!grouped[orderId]) {
      grouped[orderId] = {
        orderInfo: {
          id: orderId,
          referenceId: item.orderItem.referenceId,
          name: item.orderItem.name,
          itemType: item.orderItem.itemType,
          totalPrice: item.orderItem.discountPrice,
          createdAt: item.createdAt,
          image: item.orderItem?.image ?? null,
          customImages: item.orderItem?.customImages ?? null,
        },
        items: [],
      };
    }

    grouped[orderId].items.push(item);
  });

  return Object.values(grouped);
};
