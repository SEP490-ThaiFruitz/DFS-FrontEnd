import {
  Delivery,
  OrderAddressDelivery,
  OrderItem,
} from "@/features/client/payment/successful/payment-successful.types";

export type TimelineDetail = {
  statusTime: string;
  content: string;
};

export type TimelineItem = {
  status: string;
  date: string;
  details: TimelineDetail[];
};

export type OrderDetailData = {
  orderId: string;
  orderStatus: string;
  orderType: string;
  paymentStatus: string;
  paymentMethod: string;
  buyDate: string;
  orderItems: OrderItem[];
  delivery: Delivery;
  voucherPrice: number | null;
  pointUsed: number;
  totalPrice: number;
  cancel: any; // hoặc có thể khai báo rõ hơn nếu có cấu trúc cụ thể
  orderAddressDelivery: OrderAddressDelivery;
  timeline: TimelineItem[];
};
