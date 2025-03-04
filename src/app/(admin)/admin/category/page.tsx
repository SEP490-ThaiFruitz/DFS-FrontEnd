"use client";
import { deleteCategory, getCategories } from "@/actions/category";
import { CreateCategoryDialog } from "@/components/custom/_custom-dialog/create-category-dialog";
import { UpdateCategoryDialog } from "@/components/custom/_custom-dialog/update-category-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageResult, ApiResponse } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog";
import { DataTable } from "@/components/global-components/data-table/data-table";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";

type Category = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  isActive: boolean;
};

const CategoryPage = () => {
  const [data, setData] = useState<PageResult<Category>>();
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCategoryUpdate, setSelectedCategoryUpdate] =
    useState<Category>();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategoryDelete, setSelectedCategoryDelete] =
    useState<Category>();

  // console.log("data: ", categories.value.items);

  useEffect(() => {
    getCategories().then((response: any) => {
      if (response?.success) {
        const data = response?.data as ApiResponse<PageResult<Category>>;
        console.log({ data })
        setData(data?.value);
      } else {
        toast.error(response.message);
      }
    });
  }, []);

  const {
    isPending,
    data: categories,
    isError,
    isFetching,
  } = useFetch("/Categories", ["test"]);

  console.log({ data });

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Tên",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("name")}</div>
      ),
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
            src={(thumbnailUrl as string) || `/images/dried-fruit.webp`}
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
              onClick={() => handlerChooseUpdateCategory(category)}
            >
              <Pencil />
            </Button>
            <Button
              variant="outline"
              className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => handlerChooseDeleteCategory(category)}
            >
              <Trash2 />
            </Button>
          </div>
        );
      },
    },
  ];

  const handlerChooseUpdateCategory = (category: Category) => {
    setSelectedCategoryUpdate(category);
    setOpenUpdate(true);
  };
  const handlerChooseDeleteCategory = (category: Category) => {
    setSelectedCategoryDelete(category);
    setOpenDelete(true);
  };
  return (
    <div className="p-4">
      <div className="flex justify-end">
        <CreateCategoryDialog />
      </div>
      <div className="py-4">
        {/* <DataTable data={data?.items || []} columns={columns} /> */}

        <DataTable
          data={data?.items || []}
          columns={columns}
          searchFiled="name"
        />
      </div>
      {selectedCategoryUpdate && (
        <UpdateCategoryDialog
          isOpen={openUpdate}
          onClose={() => {
            setOpenUpdate(false);
            setSelectedCategoryUpdate(undefined);
          }}
          category={selectedCategoryUpdate}
        />
      )}
      {selectedCategoryDelete && (
        <DeleteDialog
          deleteFunction={deleteCategory}
          name={selectedCategoryDelete.name}
          isOpen={openDelete}
          onClose={() => {
            setOpenDelete(false);
            setSelectedCategoryDelete(undefined);
          }}
          id={selectedCategoryDelete.id}
        />
      )}
    </div>
  );
};

export default CategoryPage;
