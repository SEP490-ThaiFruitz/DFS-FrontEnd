"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export type Category = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isActive: boolean;
};

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("description")}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "thumbnail",
    header: "Ảnh",
    cell: ({ row }) => {
      const thumbnailUrl = row.getValue("thumbnail");
      const name = row.getValue("name");
      return (
        <Image
          src={thumbnailUrl as string ||`/images/dried-fruit.webp`}
          height={100}
          width={100}
          alt={`${name}`}
        />
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      return (
        <Badge
          className={`border ${
            isActive
              ? "border-green-400 text-green-700"
              : "border-red-400 text-red-700"
          }`}
          variant="outline"
        >
          {isActive ? "Hoạt động" : "Đã ngưng"}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Pencil /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:cursor-pointer">
              <Trash2 /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
