import {
  OrderAddressDelivery,
  OrderItem,
  OrderItemHaveChild,
} from "@/features/client/payment/successful/payment-successful.types";
import { OrderItemDetailsTypes } from "@/features/manager/order-detail-components/order-detail.types";

export type VoucherTypes = {
  id: string;
  name: string;
  image: string | null;
  code: string | null;
  value: number;
  discountType: string;
  startDate: string;
  endDate: string;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  quantity: number;
  createdOnUtc: string;
  modifiedOnUtc: string | null;
  isDeleted: boolean;
} | null;

export type CancelOrderTypes = {
  userId: string;
  name: string;
  image: string | null;
  role: string;
  date: string;
  reason: string;
};

export type AddressDeliveryTypes = {
  id: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  longtitude: string | null;
  latitude: string | null;
  createdOnUtc: string;
  updatedOnUtc: string | null;
};

export type OrderData = {
  id: string;
  code: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    gender: string;
    avatar: string | null;
  };
  totalPrice: number;
  cancel: CancelOrderTypes | null;
  voucher: VoucherTypes;
  voucherPrice: number | null;
  shipFee: number;
  addressDelivery: AddressDeliveryTypes;
  pointUsed: number;
  status: string;
  createdOnUtc: string;
  modifiedOnUtc: string | null;
};

export enum OrderStatusEnum {
  PENDING = "pending",
  // CONFIRMED = "confirmed",
  PACKAGING = "packaging",
  SHIPPING = "shipping",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  RECEIVED = "received",

  COMPLETED = "completed",

  CANCELLED = "cancelled",
  RETURNED = "returned",

  EXCHANGED = "exchanged",
  REQUESTING = "requesting",
}
export const OrderStatus = {
  pending: "Đơn hàng đang chờ xử lý",
  // confirmed: "Đơn hàng đã được xác nhận",
  packaging: "Đơn hàng đang được đóng gói",
  shipping: "Đơn hàng đang được vận chuyển",
  delivering: "Đơn hàng đang trên đường giao tới khách hàng",
  delivered: "Đơn hàng đã được giao đến khách hàng",
  received: "Đơn hàng đã được nhận bởi khách hàng",
  completed: "Đơn hàng đã hoàn tất",

  // exceptions status
  cancelled: "Đơn hàng bị hủy",
  returned: "Đơn hàng được trả lại",
  exchanged: "Đơn hàng đã được đổi",
  requesting: "Đơn hàng đang được yêu cầu đổi trả",
} as const;

export type OrderStatusType = keyof typeof OrderStatus;

export const OrderStatusKey = Object.keys(OrderStatus) as OrderStatusType[];

export type OrderDetailTypes = {
  orderId: string;
  // orderStatus: "Received" | "Processing" | "Completed" | "Cancelled" | string;
  orderStatus: string;
  paymentStatus: "Pending" | "Paid" | "Failed" | string;
  // paymentMethod: "VnPay" | "Cash" | "Momo" | string;
  paymentMethod: string;
  buyDate: string; // ISO 8601 date string
  orderItems: OrderItemHaveChild[];
  delivery: {
    fee: number;
    estimateDate: string | null;
  };
  voucherPrice: number | null;
  pointUsed: number;
  totalPrice: number;
  cancel: any; // Unknown structure, can replace with appropriate type if known
  orderAddressDelivery: OrderAddressDelivery;
  timeline: any[]; // Can refine this type if structure is known

  // orderItemDetails: OrderItemDetailsTypes[];
};
