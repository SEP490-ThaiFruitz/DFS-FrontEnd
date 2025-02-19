"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
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
          src={thumbnailUrl as string || `/images/dried-fruit.webp`}
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
          className={`border ${isActive
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
      const category = row.original;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
            onClick={() => console.log("Cập nhật:", category)}
          >
            <Pencil />
          </Button>
          <Button
            variant="outline"
            className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            onClick={() => console.log("Xóa:", category)}
          >
            <Trash2 />
          </Button>
        </div>
      );
    },
  },
];
