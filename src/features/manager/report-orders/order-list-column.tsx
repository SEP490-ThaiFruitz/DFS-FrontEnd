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
import { formatRelativeTime, vietnameseDate } from "@/utils/date";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

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
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="rounded-md"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="rounded-md"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  //   filterFn: "filterRows",

  //   meta: { export: { pdf: false } },
  // },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => {
      return <span className="">Mã đơn hàng</span>;
    },
    cell: ({ row }) => {
      const order = row.original;
      const statusStep = getStatusStep(order.status);
      const statusColor =
        statusStep === -1
          ? "bg-red-50 text-red-600 dark:bg-red-900/20"
          : "bg-sky-50 text-sky-600 dark:bg-sky-900/20";

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

    meta: { align: "center", export: { pdf: { header: "Id" } } },
    filterFn: "filterRows",
  },
  {
    id: "status",

    accessorKey: "status",
    header: ({ column }) => {
      return <span>Trạng thái đơn hàng</span>;
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
                statusStep >= 1 ? "bg-sky-500" : "bg-gray-200 dark:bg-gray-700"
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

    meta: {
      align: "center",
      export: { pdf: { header: "Trạng thái đơn hàng" } },
    },
    filterFn: "filterRows",
  },
  {
    id: "totalPrice",

    accessorKey: "totalPrice",
    header: ({ column }) => {
      return <span className="">Tổng tiền</span>;
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
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20"
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
                  ? "text-sky-600"
                  : ""
              }`}
            >
              {formatVND(totalPrice)}
            </span>
          </div>
          <div className="flex flex-col mt-1 text-xs text-muted-foreground pl-9 gap-2">
            <div className="flex justify-between">
              <span className="font-semibold">Tiền hàng:</span>
              <span className="font-semibold text-sky-600">
                {formatVND(subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Phí ship:</span>
              <span className="font-semibold text-sky-600">
                {formatVND(shipFee)}
              </span>
            </div>
          </div>
        </div>
      );
    },
    sortDescFirst: true,

    meta: { align: "center", export: { pdf: { header: "Tổng tiền" } } },
    filterFn: "filterRows",
  },
  {
    id: "voucher",
    accessorKey: "voucher",
    header: ({ column }) => {
      return <span>Giảm giá</span>;
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
              className="text-slate-700 bg-slate-50 dark:bg-slate-800/30 font-thin"
            >
              Không có
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-1">
          {voucher !== null && (
            <AdvancedColorfulBadges
              // variant="secondary"
              className="w-fit font-thin"
              color={voucher !== null ? "indigo" : "blush"}
              // className="w-fit bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300"
            >
              {voucher.name}
            </AdvancedColorfulBadges>
          )}
          {pointUsed > 0 && (
            <AdvancedColorfulBadges
              className="w-fit font-thin"
              color={pointUsed > 0 ? "amber" : "sapphire"}
              // variant="secondary"
              // className="w-fit bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300"
            >
              Điểm: {pointUsed} pts
            </AdvancedColorfulBadges>
          )}
        </div>
      );
    },
    meta: { align: "center", export: { pdf: { header: "Voucher" } } },
    filterFn: "filterRows",
  },
  {
    id: "user",
    accessorKey: "user",
    header: ({ column }) => {
      return <span>Khách hàng</span>;
    },
    cell: ({ row }) => {
      const user = row.original.user;
      const userInitials = getUserInitials(user.name);

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 max-w-[150px] hover:underline transition duration-300 cursor-pointer">
                <Avatar className="h-8 w-8">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : null}
                  <AvatarFallback className="bg-primary/10 text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="truncate font-bold text-sm ">
                    {user.name}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-violet-600">
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-xs">{user.email}</p>
                {user.phone && (
                  <p className="text-xs">
                    SĐT: {formatVietnamesePhoneNumber(user.phone)}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },

    meta: { align: "center", export: { pdf: { header: "Khách hàng" } } },
    filterFn: "filterRows",
  },
  {
    id: "createdOnUtc",
    accessorKey: "createdOnUtc",
    header: ({ column }) => {
      return <span className="">Ngày tạo</span>;
    },
    cell: ({ row }) => {
      const createdOnUtc = row.getValue("createdOnUtc") as string;
      const formattedDate = vietnameseDate(new Date(createdOnUtc));
      const relativeTime = formatRelativeTime(createdOnUtc);

      // Calculate how recent the order is
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(createdOnUtc).getTime()) /
          (1000 * 3600 * 24)
      );
      const isRecent = daysSince < 1;

      return (
        <div className="flex flex-col items-start  min-w-[150px]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                isRecent
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-800/20"
              }`}
            >
              <Calendar className="h-4 w-4" />
            </div>
            <span className="font-light">{formattedDate}</span>
          </div>
          <span
            className={`text-xs pl-9 mt-0.5 ${
              isRecent ? "text-sky-600 font-medium" : "text-slate-700"
            }`}
          >
            {relativeTime}
            {isRecent && " ✨"}
          </span>
        </div>
      );
    },

    meta: { align: "center", export: { pdf: { header: "Ngày tạo" } } },
    filterFn: "filterRows",
  },
  // Update the actions dropdown menu to match the new status flow
  {
    id: "actions",
    header: "Thao tác",
    cell: ({ row }) => {
      const order = row.original;
      const status = order.status.toLowerCase();

      return (
        <div className="flex items-center justify-end gap-2">
          <TooltipProvider delayDuration={100}>
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
                <DropdownMenuItem className="flex items-center gap-2 text-sky-600 focus:text-sky-600">
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

    // meta: { align: "center", export: { pdf: { header: "Id" } } },
    meta: {
      align: "right",
      export: { pdf: false },
    },
    filterFn: "filterRows",

    // enableHiding: false,
  },
];
