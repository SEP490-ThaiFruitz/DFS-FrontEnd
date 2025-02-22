import type React from "react";
import { BadgeAlertIcon, Box, Truck } from "lucide-react";

export const Policies = () => {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400">
        Chính sách quan tâm
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <PolicyItem icon={BadgeAlertIcon} text="Vấn đề về sản phẩm" />
        <PolicyItem icon={Truck} text="Phương thức giao hàng" />
        <PolicyItem icon={Box} text="Đổi trả" />
      </div>
    </div>
  );
};

const PolicyItem = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900">
    <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);
