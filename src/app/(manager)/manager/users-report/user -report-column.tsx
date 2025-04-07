"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  Phone,
  MoreHorizontal,
  CreditCard,
  Calendar,
  User,
  ExternalLink,
  Shield,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
} from "lucide-react";
import { getSexLabel, getUserInitials } from "@/utils/label";
import { formatDate, formatRelativeTime } from "@/utils/date";
import { formatVND } from "@/lib/format-currency";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";

export interface AddressType {
  tagName: string;
  wardId: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  longtitude: number | null;
  latitude: number | null;
  isDefault: boolean;
}

export interface CustomerType {
  id: string;
  avatar: string | null;
  name: string;
  gender: string;
  role: string;
  email: string;
  addresses: AddressType[];
  phone: string | null;
  birthday: string | null;
  point: number;
  status: boolean;
  totalSpend: number;
  createdAt: string;
  updatedAt: string | null;
}

export const userReportColumns: ColumnDef<CustomerType>[] = [
  {
    id: "Tên khách hàng",

    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-slate-700" />
          <span className="font-semibold">Khách hàng</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const customer = row.original;
      const userInitials = getUserInitials(customer.name);

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild className="cursor-pointer">
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    <AvatarImage
                      src={customer.avatar || undefined}
                      alt={customer.name}
                    />
                    <AvatarFallback className="bg-primary/10 font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  {customer.status && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {customer.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-xs font-normal"
                    >
                      {customer.role.toLowerCase() === "customer" &&
                        "Khách hàng"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="h-5 px-1.5 text-xs font-normal"
                    >
                      {getSexLabel(customer.gender)}
                    </Badge>
                  </div>
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="p-4 max-w-lg z-50">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={customer.avatar || undefined}
                      alt={customer.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-bold text-base">{customer.name}</h4>
                    <p className="text-sm text-slate-700">{customer.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm pt-2">
                  <span className="text-slate-700">Mã khách hàng ID:</span>
                  <span className="line-clamp-2 font-mono text-xs">
                    {customer.id}
                  </span>
                  <span className="text-slate-700">Trạng thái:</span>
                  <span>{customer.status ? "Active" : "Inactive"}</span>
                  <span className="text-slate-700">Đã tạo:</span>
                  <span>{formatDate(customer.createdAt)}</span>
                </div>
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
    id: "email",
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-slate-700" />
          <span className="font-semibold">Thông tin liên lạc</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const customer = row.original;
      return (
        <div className="flex flex-col gap-1.5 min-w-[220px]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-sky-50 text-sky-600 dark:bg-sky-900/20">
              <Mail className="h-3.5 w-3.5" />
            </div>
            <span className="text-sm font-semibold line-clamp-2 max-w-[180px]">
              {customer.email}
            </span>
          </div>
          {customer.phone ? (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-green-50 text-green-600 dark:bg-green-900/20">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium">
                {formatVietnamesePhoneNumber(customer.phone)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-slate-50 text-slate-400 dark:bg-slate-800/20">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm text-slate-700">Chưa có</span>
            </div>
          )}
        </div>
      );
    },
    meta: {
      align: "center",
      export: { pdf: { header: "Thông tin liên lạc" } },
    },
    filterFn: "filterRows",
  },
  {
    id: "Trạng thái",
    accessorKey: "status",

    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-slate-700" />
          <span className="font-semibold">Trạng thái</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2">
          {status ? (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-semibold text-sm">Hoạt động</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full dark:bg-slate-800/40 dark:text-slate-400">
              <XCircle className="h-4 w-4" />
              <span className="font-semibold text-sm">Không hoạt động</span>
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (value === "all") return true;
      if (value === "active") return row.original.status === true;
      if (value === "inactive") return row.original.status === false;
      return true;
    },

    meta: { align: "center", export: { pdf: { header: "Trạng thái" } } },
  },
  {
    id: "Tổng đã chi và điểm",
    accessorKey: "totalSpend",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-slate-700" />
          <span className="font-semibold">Đã chi & Điểm</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const customer = row.original;

      // Determine spending tier
      let spendingTier = "low";
      let tierColor = "bg-slate-50 text-slate-600 dark:bg-slate-800/20";

      if (customer.totalSpend > 10000000) {
        spendingTier = "high";
        tierColor = "bg-green-50 text-green-600 dark:bg-green-900/20";
      } else if (customer.totalSpend > 1000000) {
        spendingTier = "medium";
        tierColor = "bg-amber-50 text-amber-600 dark:bg-amber-900/20";
      }

      return (
        <div className="flex flex-col min-w-[180px]">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${tierColor}`}>
              <CreditCard className="h-4 w-4" />
            </div>
            <span
              className={`font-bold text-lg ${
                spendingTier === "high"
                  ? "text-green-600 dark:text-green-400"
                  : spendingTier === "medium"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {formatVND(customer.totalSpend)}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1.5 pl-9">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-sm font-medium">{customer.point} điểm</span>
            </div>
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return rowB.original.totalSpend - rowA.original.totalSpend;
    },

    meta: { align: "center", export: { pdf: { header: "Đã chi & Điểm" } } },
    filterFn: "filterRows",
  },
  {
    id: "Đã tạo vào",
    accessorKey: "joined",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-slate-700" />
          <span className="font-semibold">Đã tạo vào</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      const formattedDate = formatDate(createdAt);
      const relativeTime = formatRelativeTime(createdAt);

      // Calculate how recent the customer is
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(createdAt).getTime()) /
          (1000 * 3600 * 24)
      );
      const isRecent = daysSince < 7;

      return (
        <div className="flex flex-col min-w-[160px]">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                isRecent
                  ? "bg-sky-50 text-sky-600 dark:bg-sky-900/20"
                  : "bg-slate-50 text-slate-600 dark:bg-slate-800/20"
              }`}
            >
              <Activity className="size-5" />
            </div>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 pl-9">
            <Activity className="size-5 text-slate-700" />
            <span
              className={`text-xs flex items-center gap-1 ${
                isRecent ? "text-sky-600 font-medium" : "text-slate-700"
              }`}
            >
              {relativeTime}
              {isRecent && (
                <Badge
                  variant="outline"
                  className="text-green-600 bg-green-500/10 border-green-500/20 rounded-full"
                >
                  Mới
                </Badge>
              )}
            </span>
          </div>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      return (
        new Date(rowB.original.createdAt).getTime() -
        new Date(rowA.original.createdAt).getTime()
      );
    },

    meta: { align: "center", export: { pdf: { header: "Đã tạo vào" } } },
    filterFn: "filterRows",
  },
  {
    id: "Địa chỉ",
    accessorKey: "addresses",
    header: ({ column }) => {
      return (
        <div className="flex items-center space-x-2">
          <ExternalLink className="h-4 w-4 text-slate-700" />
          <span className="font-semibold">Địa chỉ</span>
        </div>
      );
    },
    cell: ({ row }) => {
      const addresses = row.original.addresses;
      const addressCount = addresses.length;

      if (addressCount === 0) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-slate-700">
              Chưa có địa chỉ
            </Badge>
          </div>
        );
      }

      const defaultAddress = addresses.find((addr) => addr.isDefault);

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Badge className="bg-sky-100 w-24 text-center text-sky-700 hover:bg-sky-200 dark:bg-sky-900/30 dark:text-sky-400">
                  {addressCount} địa chỉ
                </Badge>
                {defaultAddress && (
                  <Badge variant="outline" className="border-dashed">
                    Mặc định: {defaultAddress.tagName}
                  </Badge>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="p-0 max-w-md z-30">
              <div className="p-2 space-y-2 max-h-[300px] overflow-y-auto">
                <h4 className="font-semibold px-2 pt-1">Địa chỉ khách hàng</h4>
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-md text-sm ${
                      address.isDefault
                        ? "bg-muted/50 border border-primary/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{address.tagName}</span>
                      {address.isDefault && (
                        <Badge variant="outline" className="h-5 text-xs">
                          Mặc định
                        </Badge>
                      )}
                    </div>
                    <div className="text-slate-700 space-y-1">
                      <div className="flex items-start gap-2">
                        <User className="size-4.5 mt-0.5" />
                        <span className="text-sm font-semibold italic">
                          {address.receiverName}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Phone className="size-4.5 text-xs font-semibold mt-0.5" />
                        <span>
                          {formatVietnamesePhoneNumber(address.receiverPhone)}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <ExternalLink className="size-4.5 mt-0.5" />
                        <span className="break-words">
                          {address.receiverAddress}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },

    meta: { align: "center", export: { pdf: { header: "Địa chỉ" } } },
    filterFn: "filterRows",
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(customer.id)}
              >
                <User className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                View orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Edit customer
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Delete customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },

    meta: { align: "center", export: false },
    filterFn: "filterRows",
  },
];
