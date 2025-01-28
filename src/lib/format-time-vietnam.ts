export function formatTimeVietNam(date: Date, isTime?: boolean) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const day = new Date(date).toLocaleDateString("vi-VN", options);
  const time = new Date(date).toLocaleTimeString("vi-VN");

  if (isTime) {
    return `${day} ${time}`;
  }

  return `${day}`;
}
