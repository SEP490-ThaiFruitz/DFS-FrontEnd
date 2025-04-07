export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const calculateDiscountedPrice = (price: number, percentage: number) => {
  return price - price * (percentage / 100);
};

export const formatDate = (dateString: Date | string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const calculatePromotionDaysLeft = (endDate: Date | string) => {
  if (!endDate) return 0;
  const end = new Date(endDate).getTime();
  const now = new Date().getTime();
  const diffTime = end - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const calculateStockStatus = (
  quantity: number,
  reOrderPoint: number
) => {
  if (quantity <= reOrderPoint * 0.5) return "low";
  if (quantity <= reOrderPoint) return "medium";
  return "high";
};
