import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";

interface DeliveryAddressCardProps {
  address: {
    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
  };
}

export default function DeliveryAddressCard({
  address,
}: DeliveryAddressCardProps) {
  return (
    <Card className="overflow-hidden cardStyle">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-amber-600" />
          Địa Chỉ Giao Hàng
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="flex items-start">
          <div className="bg-amber-50 p-3 rounded-lg mr-4 shadow-sm">
            <MapPin className="h-6 w-6 text-amber-600" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-sky-500 text-lg">
              {address.receiverName}
            </p>
            <p className="text-sm">
              {formatVietnamesePhoneNumber(address.receiverPhone)}
            </p>
            <p className="text-sm font-semibold underline text-muted-foreground">
              {address.receiverAddress}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
