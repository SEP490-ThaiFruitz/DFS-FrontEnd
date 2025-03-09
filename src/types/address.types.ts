export interface AddressTypes {
  id: string;
  tagName: string;
  userId: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  longitude: number | null;
  latitude: number | null;
  isDefault: boolean;
  provinceID: number;
  districtID: number;
  wardID: number;
}
