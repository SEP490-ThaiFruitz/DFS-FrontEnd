export const formatVND = (value: number | string) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(Number(value))
    .replace(/\./g, ",");
};

export const formatNumberWithUnit = (value: number | string, unit?: string) => {
  const formattedValue = new Intl.NumberFormat("us").format(Number(value));
  return unit ? `${formattedValue} ${unit}` : formattedValue;
};

export const vndToWords = (value: number): string => {
  if (!value) return "";

  return `${formatVND(value)} (bằng chữ: ${new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value)})`;
};
