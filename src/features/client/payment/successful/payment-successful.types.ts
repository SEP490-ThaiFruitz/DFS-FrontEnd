export type OrderItem = {
  id: string;
  referenceId: string;
  name: string;
  image: string;
  itemType: "Single" | "Combo" | "Custom"; // Assuming there are only these types
  quantity: number;
  unitPrice: number;
  percentage: number;
  discountPrice: number;
  isCanFeedback: boolean;
};

export type Delivery = {
  fee: number;
  estimateDate: string; // ISO 8601 date string
};

type Payment = {
  transactionNo: string;
  orderId: string;
  content: string;
  amount: number;
  type: string; // Assuming there are multiple types of payments
  status: string; // Assuming common payment statuses
  createdOnUtc: string; // ISO 8601 date string
  updateOnUtc: string; // ISO 8601 date string
};

export type OrderAddressDelivery = {
  id: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  longtitude: number | null;
  latitude: number | null;
};

export type PaymentOrderValue = {
  orderId: string;
  status: string; // Example of possible statuses
  buyDate: string; // ISO 8601 date string
  orderItems: OrderItem[];
  delivery: Delivery;
  discountPrice: number | null;
  payment: Payment;
  pointUsed: number;
  totalPrice: number;
  orderAddressDelivery: OrderAddressDelivery;
};
