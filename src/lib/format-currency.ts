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
