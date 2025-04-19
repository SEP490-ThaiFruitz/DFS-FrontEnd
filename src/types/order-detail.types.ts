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
    image: string;
    customImages: string | null;
    itemType: string;
    quantity: number;
    unitPrice: number;
    percentage: number;
    discountPrice: number;
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
}
