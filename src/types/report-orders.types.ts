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
  CONFIRMED = "confirmed",
  PACKAGING = "packaging",
  SHIPPING = "shipping",
  DELIVERING = "delivering",
  DELIVERED = "delivered",
  RECEIVED = "received",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}
export const OrderStatus = {
  pending: "Đơn hàng đang chờ xử lý",
  confirmed: "Đơn hàng đã được xác nhận",
  packaging: "Đơn hàng đang được đóng gói",
  shipping: "Đơn hàng đang được vận chuyển",
  delivering: "Đơn hàng đang trên đường giao tới khách hàng",
  delivered: "Đơn hàng đã được giao đến khách hàng",
  received: "Đơn hàng đã được nhận bởi khách hàng",
  cancelled: "Đơn hàng bị hủy",
  returned: "Đơn hàng được trả lại",
} as const;

export type OrderStatusType = keyof typeof OrderStatus;

export const OrderStatusKey = Object.keys(OrderStatus) as OrderStatusType[];
