import { DollarSign } from "lucide-react";

export const OrderSummary = () => {
  return (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="font-semibold text-lg flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
        <DollarSign className="w-5 h-5" />
        Tổng quan đơn hàng
      </h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tạm tính:</span>
          <span>523.000đ</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Giảm giá:</span>
          <span className="text-green-600 dark:text-green-400">
            -52.300đ (10%)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Vận chuyển:</span>
          <span>30.000đ</span>
        </div>
        <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-200 dark:border-gray-700">
          <span>Tổng:</span>
          <span className="text-indigo-600 dark:text-indigo-400">550.000đ</span>
        </div>
      </div>
    </div>
  );
};
