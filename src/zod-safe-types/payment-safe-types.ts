import { z } from "zod";

export enum DeliveryMethod {
  GHN = "ghn",
  FAST = "fast",
  STANDARD = "standard",
}

export enum PaymentMethod {
  VNPAY = "vnpay",
  PAYOS = "payos",
}

export const PaymentSafeTypes = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      type: z.string(),
    })
  ),

  paymentMethod: z.enum([PaymentMethod.VNPAY, PaymentMethod.PAYOS]),

  voucherId: z.string().optional().nullable(),

  // shippingUnitId: z.string(),

  shipType: z.enum([DeliveryMethod.STANDARD]),
  addressId: z.string({
    message: "Bạn hãy chọn địa chỉ giao hàng",
  }),

  // shipType:

  pointUsed: z.number().optional().default(0),
});
