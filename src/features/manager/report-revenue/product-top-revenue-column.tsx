"use client";

import type { ColumnDef, HeaderContext } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  Edit,
  FileText,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import Image from "next/image";

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
import { formatVND } from "@/lib/format-currency";
import { orderTypeLabel } from "@/utils/label";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

export type ProductRevenue = {
  type: "Single" | "Combo" | "Custom";
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  revenue: number;
  revenueDiscount: number;
};

interface SortButtonProps<T> {
  column: ColumnDef<T>;
  label: string;
}

const SortButton = <T,>({
  column,
  label,
}: Partial<HeaderContext<T, unknown>> & { label: string }) => {
  // console.log(column);
  return (
    <Button
      variant="ghost"
      onClick={() => column?.toggleSorting(column?.getIsSorted() === "asc")}
      className="whitespace-nowrap"
    >
      {/* {} */}
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
};

export const productTopRevenueColumn: ColumnDef<ProductRevenue>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortButton<ProductRevenue> column={column} label="Tên sản phẩm" />
      );
    },
    cell: ({ row }) => {
      const product = row.original;

      // const hasImages = product.image.length > 1 && product.image;

      // console.log({ product });
      return (
        <div className="flex items-center gap-3 min-w-[300px]">
          <div className="h-12 w-12 overflow-hidden rounded-md border bg-background shadow-sm">
            <Image
              src={product.image || "/placeholder.svg?height=48&width=48"}
              alt={product.name}
              width={48}
              height={48}
              className="h-full w-full object-cover transition-all hover:scale-110"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold line-clamp-1 text-base text-slate-700 max-w-[200px]">
              {product.name}
            </span>
            <AdvancedColorfulBadges color="violet" className="w-fit mt-1">
              {orderTypeLabel(product.type)}
            </AdvancedColorfulBadges>
          </div>
        </div>
      );
    },
    enableSorting: false,

    minSize: 200,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Giá
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));

      return (
        <span className="font-bold text-sky-500 text-lg">
          {formatVND(price)}
        </span>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Số lượng
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const quantity = row.getValue("quantity") as number;
      const maxQuantity = 150; // Assuming the max quantity in the dataset
      const percentage = (quantity / maxQuantity) * 100;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-1">
                <span className="font-medium">{quantity}</span>
                <Progress value={percentage} className="h-1.5 w-16" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {quantity} Đã bán ({Math.round(percentage)}% của tổng số lượng)
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "revenue",
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
      const revenue = Number.parseFloat(row.getValue("revenue"));

      return (
        <span className="font-bold text-sky-500 text-lg">
          {formatVND(revenue)}
        </span>
      );
    },
  },
  {
    accessorKey: "revenueDiscount",
    header: ({ column }) => {
      return (
        <div className="">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="whitespace-nowrap"
          >
            Doanh thu sau khi giảm giá
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const revenueDiscount = Number.parseFloat(
        row.getValue("revenueDiscount")
      );
      const revenue = Number.parseFloat(row.getValue("revenue"));

      const discountPercentage =
        revenue > revenueDiscount
          ? Math.round((1 - revenueDiscount / revenue) * 100)
          : 0;

      return (
        <div className="flex items-center justify-end gap-2">
          <span className="font-bold text-sky-500 text-lg">
            {formatVND(revenueDiscount)}
          </span>
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
      );
    },

    sortDescFirst: true,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Điều chỉnh",
    cell: ({ row }) => {
      const product = row.original;

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
              onClick={() => navigator.clipboard.writeText(product.id)}
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copy ID</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>View details</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span>Edit product</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Sales history</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4" />
              <span>Delete product</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
