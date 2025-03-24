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

export enum OrderStatus {
  Pending = "Đơn hàng đang chờ xử lý", // Đơn hàng đang chờ xử lý
  Confirmed = "Đơn hàng đã được xác nhận", // Đơn hàng đã được xác nhận
  Packing = "Đơn hàng đang được đóng gói", // Đơn hàng đang được đóng gói
  Shipping = "Đơn hàng đang được vận chuyển", // Đơn hàng đang được vận chuyển
  Delivering = "Đơn hàng đang trên đường giao tới khách hàng", // Đơn hàng đang trên đường giao tới khách hàng
  Delivered = "Đơn hàng đã được giao đến khách hàng", // Đơn hàng đã được giao đến khách hàng
  Received = "Đơn hàng đã được nhận bởi khách hàng", // Đơn hàng đã được nhận bởi khách hàng
  Cancelled = "Đơn hàng đã bị hủy", // Đơn hàng đã bị hủy
  Returned = "Đơn hàng đã được trả lại", // Đơn hàng đã được trả lại
}
