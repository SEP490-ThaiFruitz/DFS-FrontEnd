import { Truck, MapPin } from "lucide-react";

export const ShippingInfo = () => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="font-semibold text-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <Truck className="w-5 h-5" />
        Vận chuyển
      </h2>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-1 text-gray-500" />
          <div>
            <h3 className="font-medium text-sm">Địa chỉ:</h3>
            <p className="text-sm text-muted-foreground">
              1234, Phường 1, Quận 1, TP.HCM
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 mt-1 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
          <div>
            <h3 className="font-medium text-sm">Phương thức:</h3>
            <p className="text-sm text-muted-foreground">
              Giao hàng tiêu chuẩn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
