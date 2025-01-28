export function formatVietnamesePhoneNumber(phone: string): string {
  const cleanedPhone = phone.replace(/\D/g, "");

  if (cleanedPhone.length === 10) {
    return cleanedPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1.$2.$3");
  }

  return phone;
}
