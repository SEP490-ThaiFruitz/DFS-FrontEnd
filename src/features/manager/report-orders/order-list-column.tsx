"use client";

import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Calendar,
  CreditCard,
  Tag,
  CheckCircle2,
  XCircle,
  Receipt,
  ExternalLink,
  PackageOpen,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrderData } from "@/types/report-orders.types";
import { OrderStatusBadge } from "./order-status-badge";
import { formatVND } from "@/lib/format-currency";

// Format date
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm");
  } catch (error) {
    return dateString;
  }
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: vi,
    });
  } catch (error) {
    return dateString;
  }
};

// Update the getStatusStep function to reflect the new order flow
// Get status step
const getStatusStep = (status: string) => {
  switch (status.toLowerCase()) {
    case "waiting":
      return 0;
    case "packaging":
      return 1;
    case "delivering":
      return 2;
    case "delivered":
      return 3;
    case "cancel":
      return -1;
    // Keep backward compatibility with old status names
    case "pending":
      return 0;
    case "confirmed":
      return 1;
    case "shipped":
      return 2;
    case "cancelled":
      return -1;
    default:
      return 0;
  }
};

// Get user initials
const getUserInitials = (name: string) => {
  if (!name) return "UN";
  const parts = name.split(" ");
  if (parts.length === 1) return name.substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface SortButtonProps<T> {
  column: ColumnDef<T>;
  label: string;
}

const SortButton = <T,>({
  column,
  label,
}: Partial<HeaderContext<T, unknown>> & { label: string }) => {
  return (
    <Button
      variant="ghost"
      onClick={() => column?.toggleSorting(column?.getIsSorted() === "asc")}
      className="whitespace-nowrap"
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const orderListColumns: ColumnDef<OrderData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="rounded-md"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="rounded-md"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortButton<OrderData> column={column} label="Mã đơn hàng" />;
    },
    cell: ({ row }) => {
      const order = row.original;
      const statusStep = getStatusStep(order.status);
      const statusColor =
        statusStep === -1
          ? "bg-red-50 text-red-600 dark:bg-red-900/20"
          : "bg-blue-50 text-blue-600 dark:bg-blue-900/20";

      return (
        <div className="flex flex-col min-w-[180px]">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${statusColor}`}>
              <Receipt className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{order.id}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Tag className="h-3 w-3 " />
                <span className="text-xs  font-light">{order.code}</span>
              </div>
            </div>
          </div>
        </div>
      );
    },
    minSize: 180,
  },
  // Update the cell renderer for the status column
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <SortButton<OrderData> column={column} label="Trạng thái" />;
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusStep = getStatusStep(status);

      if (statusStep === -1) {
        return (
          <Badge
            variant="destructive"
            className="flex items-center gap-1 w-fit"
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Đã hủy</span>
          </Badge>
        );
      }

      return (
        <div className="flex flex-col gap-2">
          <OrderStatusBadge status={status} />

          <div className="flex items-center gap-1 w-full max-w-[180px]">
            <div
              className={`h-1.5 w-1/4 rounded-l-full ${
                statusStep >= 0
                  ? "bg-amber-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`h-1.5 w-1/4 ${
                statusStep >= 1 ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`h-1.5 w-1/4 ${
                statusStep >= 2
                  ? "bg-indigo-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
            <div
              className={`h-1.5 w-1/4 rounded-r-full ${
                statusStep >= 3
                  ? "bg-green-500"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            ></div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Tổng tiền
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const totalPrice = row.getValue("totalPrice") as number;
      const shipFee = row.original.shipFee;
      const subtotal = totalPrice - shipFee;

      // Determine price tier for visual indication
      let priceTier = "low";
      if (totalPrice > 1000000) priceTier = "high";
      else if (totalPrice > 500000) priceTier = "medium";

      return (
        <div className="flex flex-col min-w-[150px]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                priceTier === "high"
                  ? "bg-green-50 text-green-600 dark:bg-green-900/20"
                  : priceTier === "medium"
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-800/20"
              }`}
            >
              <CreditCard className="h-4 w-4 font-semibold" />
            </div>
            <span
              className={`font-bold ${
                priceTier === "high"
                  ? "text-green-600"
                  : priceTier === "medium"
                  ? "text-blue-600"
                  : ""
              }`}
            >
              {formatVND(totalPrice)}
            </span>
          </div>
          <div className="flex flex-col mt-1 text-xs text-muted-foreground pl-9">
            <div className="flex justify-between">
              <span>Tiền hàng:</span>
              <span className="font-semibold">{formatVND(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Phí ship:</span>
              <span className="font-semibold">{formatVND(shipFee)}</span>
            </div>
          </div>
        </div>
      );
    },
    sortDescFirst: true,
  },
  {
    accessorKey: "voucher",
    header: ({ column }) => {
      return <SortButton<OrderData> column={column} label="Giảm giá" />;
    },
    cell: ({ row }) => {
      const voucher = row.original.voucher;
      const pointUsed = row.original.pointUsed;
      const hasDiscount = voucher !== null || pointUsed > 0;

      if (!hasDiscount) {
        return (
          <div className="flex items-center">
            <Badge
              variant="outline"
              className="text-muted-foreground bg-gray-50 dark:bg-gray-800/30"
            >
              Không có
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1">
          {voucher !== null && (
            <Badge
              variant="secondary"
              className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {voucher.name}
            </Badge>
          )}
          {pointUsed > 0 && (
            <Badge
              variant="secondary"
              className="w-fit bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
            >
              Điểm: {pointUsed} pts
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: ({ column }) => {
      return <SortButton<OrderData> column={column} label="Khách hàng" />;
    },
    cell: ({ row }) => {
      const user = row.original.user;
      const userInitials = getUserInitials(user.name);

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 max-w-[150px]">
                <Avatar className="h-8 w-8">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="truncate font-medium text-sm">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs">{user.email}</p>
                {user.phone && <p className="text-xs">SĐT: {user.phone}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "createdOnUtc",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Ngày tạo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const createdOnUtc = row.getValue("createdOnUtc") as string;
      const formattedDate = formatDate(createdOnUtc);
      const relativeTime = formatRelativeTime(createdOnUtc);

      // Calculate how recent the order is
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(createdOnUtc).getTime()) /
          (1000 * 3600 * 24)
      );
      const isRecent = daysSince < 1;

      return (
        <div className="flex flex-col min-w-[150px]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                isRecent
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-800/20"
              }`}
            >
              <Calendar className="h-4 w-4" />
            </div>
            <span>{formattedDate}</span>
          </div>
          <span
            className={`text-xs pl-9 mt-0.5 ${
              isRecent ? "text-blue-600 font-medium" : "text-muted-foreground"
            }`}
          >
            {relativeTime}
            {isRecent && " ✨"}
          </span>
        </div>
      );
    },
  },
  // Update the actions dropdown menu to match the new status flow
  {
    id: "actions",
    enableHiding: false,
    header: "Thao tác",
    cell: ({ row }) => {
      const order = row.original;
      const status = order.status.toLowerCase();

      return (
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                <span>Sao chép mã</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {(status === "waiting" || status === "pending") && (
                <DropdownMenuItem className="flex items-center gap-2 text-blue-600 focus:text-blue-600">
                  <PackageOpen className="h-4 w-4" />
                  <span>Chuyển sang đóng gói</span>
                </DropdownMenuItem>
              )}

              {status === "packaging" && (
                <DropdownMenuItem className="flex items-center gap-2 text-indigo-600 focus:text-indigo-600">
                  <Truck className="h-4 w-4" />
                  <span>Chuyển sang đang giao</span>
                </DropdownMenuItem>
              )}

              {(status === "delivering" || status === "shipped") && (
                <DropdownMenuItem className="flex items-center gap-2 text-green-600 focus:text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Xác nhận đã giao</span>
                </DropdownMenuItem>
              )}

              {status !== "cancel" &&
                status !== "cancelled" &&
                status !== "delivered" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      <span>Hủy đơn hàng</span>
                    </DropdownMenuItem>
                  </>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
