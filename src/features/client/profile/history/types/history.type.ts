import { OrderItem } from "@/features/client/payment/successful/payment-successful.types";

export type HistoryTransaction = {
  buyDate: string;
  orderStatus: string;
  orderItems: OrderItem[];
  orderQuantity: number;
  totalPrice: number;
};

// Định nghĩa kiểu cho toàn bộ dữ liệu trả về
export interface HistoryApiResponse {
  value: {
    orders: HistoryTransaction[];
    moneySpend: number;
  };
  isSuccess: boolean;
  error: {
    code: string;
    message: string;
  };
}
