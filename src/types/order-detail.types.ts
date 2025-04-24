import { OrderItemDetailsTypes } from "@/features/manager/order-detail-components/order-detail.types";

export interface OrderReturnData {
  id: string;
  orderId: string;
  orderExchangeId: string | null;
  handler: string | null;
  user: {
    name: string;
    role: string;
    email: string;
    phone: string | null;
    avatar: string;
  };
  requestStatus: string;
  requestDate: string;
  processedDate: string | null;
  reason: string;
  reasonReject: string | null;
  reasonCancel: string | null;
  linkDocument: string | null;
  note: string | null;
  shippingFeeResponsibility: string;
  items: OrderReturnItem[];
}

export interface OrderReturnItem {
  returnExchangeRequestItemId: string;
  orderItem: {
    id: string;
    referenceId: string;
    name: string;
    image: string | null;
    customImages: string[] | null;
    itemType: string;
    quantity: number;
    unitPrice: number;
    percentage: number;
    discountPrice: number;

    isCanFeedback: boolean;

    // orderItemDetails:
    orderItemDetails: OrderItemDetailsTypes | null;
  };
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
