export const ORDER_STATUS_FLOW = [
  "pending", // 0
  "packaging", // 1
  "shipping", // 2
  "delivering", // 3
  "delivered", // 4
  "received", // 5
  "cancelled", // 6
  "returned", // 7
] as const;

export type OrderStatusType = (typeof ORDER_STATUS_FLOW)[number];

export const getOrderStatusStep = (status: string): number => {
  const normalized = status.toLowerCase();

  if (normalized === "cancelled" || normalized === "returned") {
    return -1; // or some special handling
  }

  return ORDER_STATUS_FLOW.indexOf(normalized as OrderStatusType);
};
