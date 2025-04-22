"use client";

import { CreateCategoryDialog } from "@/components/custom/_custom-dialog/create-category-dialog";
import { UpdateCategoryDialog } from "@/components/custom/_custom-dialog/update-category-dialog";
import { Button } from "@/components/ui/button";
import { PageResult, ApiResponse } from "@/types/types";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom";
import { CATEGORY_KEY } from "@/app/key/admin-key";
import { API } from "@/actions/client/api-config";
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton";

type Category = {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
};

const CategoryPage = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedCategoryUpdate, setSelectedCategoryUpdate] =
    useState<Category>();
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategoryDelete, setSelectedCategoryDelete] =
    useState<Category>();

  const {
    data: categories,
    isLoading
  } = useFetch<ApiResponse<PageResult<Category>>>("/Categories", [CATEGORY_KEY.CATEGORY]);

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
      accessorKey: "action",
      header: "Hành động",
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

  const deleteCategory = async (id: string) => {
    return await API.remove(`/Categories/${id}`)
  }

  return (
    <div className="m-10">
      <div className='flex justify-between items-center'>
        <p className='text-2xl font-semibold leading-none tracking-tight'>Loại sản phẩm</p>
        <CreateCategoryDialog />
      </div>
      <div className="mt-8 bg-white cardStyle shadow border">
        {isLoading ? <DataTableSkeleton /> :
          <DataTableCustom
            data={categories?.value?.items || []}
            columns={columns}
            placeholder="tên loại"
            searchFiled="name"
          />
        }
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
          refreshKey={[[CATEGORY_KEY.CATEGORY]]}
          id={selectedCategoryDelete.id}
        />
      )}
    </div>
  );
};

export default CategoryPage;
