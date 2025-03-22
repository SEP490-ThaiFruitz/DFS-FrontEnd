"use client";

import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Copy,
  Eye,
  Calendar,
  ShoppingBag,
  CreditCard,
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
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { formatVietnamesePhoneNumber } from "@/lib/format-phone-number";
import { vietnameseDate } from "@/utils/date";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

// Define the customer data type
export type Customer = {
  userName: string;
  email: string;
  phone: string;
  address: string;
  moneySpend: number;
  lastBuyDate: string;
  quantityOfOrder: number;
};

// Helper function to format currency
export const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to get initials from username
const getInitials = (name: string) => {
  return name.substring(0, 2).toUpperCase();
};

// Helper function to get a deterministic color based on username
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
  ];

  // Simple hash function to get a consistent color for the same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Get spending tier
const getSpendingTier = (amount: number) => {
  if (amount > 10000000) return "high";
  if (amount > 5000000) return "medium";
  return "low";
};

// Get badge variant based on spending tier
const getSpendingBadgeVariant = (tier: string) => {
  switch (tier) {
    case "high":
      return "default";
    case "medium":
      return "secondary";
    case "low":
      return "outline";
    default:
      return "outline";
  }
};

// Format date
const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (error) {
    return dateString;
  }
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

export const customerRevenueColumns: ColumnDef<Customer>[] = [
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
    minSize: 15,
  },
  {
    accessorKey: "userName",
    header: ({ column }) => {
      return <SortButton<Customer> column={column} label="Khách hàng" />;
    },
    cell: ({ row }) => {
      const customer = row.original;
      const avatarColor = getAvatarColor(customer.userName);

      return (
        <div className="flex items-center gap-3 min-w-[250px]">
          <Avatar>
            <AvatarImage
              src={`/placeholder.svg?height=40&width=40&text=${getInitials(
                customer.userName
              )}`}
              alt={customer.userName}
            />
            <AvatarFallback className={avatarColor}>
              {getInitials(customer.userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className=" line-clamp-1 font-bold text-slate-900 italic">
              {customer.userName}
            </span>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {customer.email}
            </span>
          </div>
        </div>
      );
    },
    minSize: 200,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return <SortButton<Customer> column={column} label="Liên hệ" />;
    },
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;

      return (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span>{formatVietnamesePhoneNumber(phone)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return <SortButton<Customer> column={column} label="Địa chỉ" />;
    },
    cell: ({ row }) => {
      const address = row.getValue("address") as string;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 max-w-[200px]">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{address}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{address}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "quantityOfOrder",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số đơn hàng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue("quantityOfOrder") as number;
      const maxQuantity = 20; // Assuming the max quantity in the dataset
      const percentage = (quantity / maxQuantity) * 100;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{quantity}</span>
                </div>
                <Progress value={percentage} className="h-1.5 w-16" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <span>
                {quantity} đơn hàng ({Math.round(percentage)}% của khách hàng
                cao cấp)
              </span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "moneySpend",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Doanh thu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const moneySpend = row.getValue("moneySpend") as number;
      const spendingTier = getSpendingTier(moneySpend);
      const badgeVariant = getSpendingBadgeVariant(spendingTier);

      return (
        <div className="flex items-center gap-2 min-w-[200px]">
          <CreditCard className="size-6 text-muted-foreground" />
          <AdvancedColorfulBadges color="green" className="font-medium">
            {formatVND(moneySpend)}
          </AdvancedColorfulBadges>
        </div>
      );
    },
    sortDescFirst: true,
    minSize: 200,
  },
  {
    accessorKey: "lastBuyDate",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Lần mua cuối
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const lastBuyDate = row.getValue("lastBuyDate") as string;
      const formattedDate = vietnameseDate(new Date(lastBuyDate));

      // Calculate days since last purchase
      const daysSince = Math.floor(
        (new Date().getTime() - new Date(lastBuyDate).getTime()) /
          (1000 * 3600 * 24)
      );

      let badgeVariant: "default" | "secondary" | "outline" | "destructive" =
        "outline";
      if (daysSince < 7) {
        badgeVariant = "default";
      } else if (daysSince < 30) {
        badgeVariant = "secondary";
      } else if (daysSince > 90) {
        badgeVariant = "destructive";
      }

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Calendar className="size-8 text-muted-foreground" />
            <span>{formattedDate}</span>
          </div>
          <AdvancedColorfulBadges color="amber" className="w-fit text-xs">
            {daysSince === 0 ? "Hôm nay" : `${daysSince} ngày trước`}
          </AdvancedColorfulBadges>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Điều chỉnh",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(customer.userName.toString())
              }
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy ID</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>Xem chi tiết</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Chỉnh sửa</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Gửi email</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              <span>Xóa khách hàng</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
