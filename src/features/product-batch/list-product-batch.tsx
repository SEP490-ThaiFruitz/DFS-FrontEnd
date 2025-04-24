"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import type { ApiResponse, Profile } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { CirclePlus, Eye } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import DialogProductBatchDetail from "./dialog-product-batch-detail"
import { PRODUCT_BATCH_KEY } from "@/app/key/comm-key"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
import { getRoleDisplay } from "../admin/admin-lib/admin-lib"
import { useQueryClient } from "@tanstack/react-query"
import { USER_KEY } from "@/app/key/user-key"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string
}

export interface ProductBatch {
  id: number
  number: string
  requestName: string
  user: User
  totalProduct: number
  totalQuantity: number
  createdOnUtc: string
}

const ListProductBatch = () => {
  const { data: productBatchs, isLoading } = useFetch<ApiResponse<ProductBatch[]>>("/ProductBatches", [PRODUCT_BATCH_KEY.PRODUCT_BATCHES_INVENTORY_MANAGE])
  const [productBatch, setProductBatch] = useState<ProductBatch | null>(null);
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<ApiResponse<Profile>>([USER_KEY.PROFILE])

  const columns: ColumnDef<ProductBatch>[] = [
    {
      accessorKey: "number",
      header: "Mã lô",
    },
    {
      accessorKey: "requestName",
      header: "Tên kế hoạch",
    },
    {
      accessorKey: "user",
      header: "Người nhập",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{getRoleDisplay(user?.role)}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "totalProduct",
      header: "Tổng sản phẩm",
    },
    {
      accessorKey: "totalQuantity",
      header: "Tổng số lượng",
    },
    {
      accessorKey: "createdOnUtc",
      header: "Ngày nhập",
      cell: ({ row }) => {
        const date = new Date(row.original.createdOnUtc)
        return <div>{formatTimeVietNam(date, true)}</div>
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setProductBatch(row.original)}
              className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              <Eye />
            </Button>
          </div>
        )
      },
    },
  ]


  return (
    <div className="m-10">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold leading-none tracking-tight">Danh sách nhập hàng</div>
        <Link href={user?.value?.role === 'Administrator'
          ? "/admin/product-batch/create"
          : "/manager/product-batch/create"}>
          <Button size={"sm"} className="text-white bg-sky-600 hover:bg-sky-700">
            <CirclePlus className="mr-2 h-4 w-4" />
            Tạo nhập hàng
          </Button>
        </Link>
      </div>
      <div className="mt-8">
        {isLoading ? <DataTableSkeleton /> :
          <div className="bg-white cardStyles shadow border">
            <DataTableCustom
              data={productBatchs?.value ?? []} columns={columns} searchFiled="requestName" placeholder="tên yêu cầu"
            />
          </div>
        }
      </div>
      {productBatch && <DialogProductBatchDetail
        id={productBatch.id}
        isOpen={productBatch !== null}
        onClose={() => setProductBatch(null)}
      />}
    </div>
  )
}

export default ListProductBatch
