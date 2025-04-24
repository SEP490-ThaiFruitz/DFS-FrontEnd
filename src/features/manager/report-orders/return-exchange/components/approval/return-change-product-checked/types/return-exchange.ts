import { OrderReturnItem } from "@/types/order-detail.types";

export interface OrderItemDetail {
  id: string;
  productVariantId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountedPrice: number;
}

export interface OrderItem {
  id: string;
  referenceId: string;
  name: string;
  image: string | null;
  customImages: string[] | null;
  itemType: "Custom" | "Single" | "Combo";
  quantity: number;
  unitPrice: number;
  percentage: number;
  discountPrice: number;
  orderItemDetails: OrderItemDetail[] | null;
  isCanFeedback: boolean;
}

export interface ReturnExchangeRequestItem {
  returnExchangeRequestItemId: string;
  orderItem: OrderItem;
  requestItemStatus: string;
  customerQuantity: number;
  customerImage: string | null;
  productStatus: string;
  receiveQuantity: number | null;
  receiveImage: string | null;
  note: string | null;
  acceptQuantity: number | null;
  refundAmount: number | null;
  createdAt: string;
}

export interface GroupedOrder {
  orderInfo: {
    id: string;
    referenceId: string;
    name: string;
    itemType: string;
    totalPrice: number;
    createdAt: string;
    image: string | null;

    customImages: string[] | null;
  };
  items: OrderReturnItem[];
  // items: ReturnExchangeRequestItem[];
}
