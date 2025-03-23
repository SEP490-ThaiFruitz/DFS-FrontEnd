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
