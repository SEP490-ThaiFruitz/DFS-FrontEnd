import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";
import { Truck, MapPin, User, Phone } from "lucide-react";

export interface OrderAddressDelivery {
  id: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  longitude?: number | null;
  latitude?: number | null;
}

interface ShippingInfoProps {
  orderAddressDelivery: OrderAddressDelivery,
}

export const ShippingInfo = ({ orderAddressDelivery }: Readonly<ShippingInfoProps>) => {
  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg cardStyle">
      <h2 className="font-semibold text-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <Truck className="w-5 h-5" />
        Vận chuyển
      </h2>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="w-4 h-4 mt-0.5 text-slate-700 shrink-0" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Người nhận:</h3>
            <p className="text-sm text-muted-foreground">{orderAddressDelivery.receiverName}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Phone className="w-4 h-4 mt-0.5 text-slate-700 shrink-0" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Số điện thoại:</h3>
            <p className="text-sm text-muted-foreground">{formatVietnamesePhoneNumber(orderAddressDelivery.receiverPhone)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <MapPin className="w-4 h-4 mt-0.5 text-slate-700 shrink-0" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Địa chỉ:</h3>
            <p className="text-sm text-muted-foreground">{orderAddressDelivery.receiverAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
