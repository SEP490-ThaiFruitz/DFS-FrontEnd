import {
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PackageOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return <Clock className="h-3.5 w-3.5" />;
      case "packaging":
        return <PackageOpen className="h-3.5 w-3.5" />;
      case "delivering":
        return <Truck className="h-3.5 w-3.5" />;
      case "delivered":
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case "cancel":
        return <XCircle className="h-3.5 w-3.5" />;
      // Keep backward compatibility with old status names
      case "pending":
        return <Clock className="h-3.5 w-3.5" />;
      case "confirmed":
        return <PackageOpen className="h-3.5 w-3.5" />;
      case "shipped":
        return <Truck className="h-3.5 w-3.5" />;
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      case "packaging":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "delivering":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "cancel":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      // Keep backward compatibility with old status names
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
      case "confirmed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "shipped":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "waiting":
        return "Chờ xử lý";
      case "packaging":
        return "Đang đóng gói";
      case "delivering":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancel":
        return "Đã hủy";
      // Keep backward compatibility with old status names
      case "pending":
        return "Chờ xử lý";
      case "confirmed":
        return "Đang đóng gói";
      case "shipped":
        return "Đang giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const statusIcon = getStatusIcon(status);
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        statusColor,
        className
      )}
    >
      {statusIcon}
      <span>{statusText}</span>
    </div>
  );
}
