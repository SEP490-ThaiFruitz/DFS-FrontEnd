"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { DataTable } from "@/components/global-components/data-table/data-table"
import type { ApiResponse } from "@/types/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"

interface User {
  id: string
  name: string
  role: string
  avatar: string
}

interface ProductDetail {
  productBatchId: number
  productBatchNumber: string
  productVariantId: string
  productId: string
  productName: string
  image: string
  packagingType: string
  netWeight: number
  price: number
}

interface ProductItem {
  id: number
  productBatchItemId: number
  user: User
  orderId: string
  note: string
  quantity: number
  type: string
  createdOnUtc: string
  details: ProductDetail[]
}

const PickingItemPage = () => {
  const { data: pickingitems } = useFetch<ApiResponse<ProductItem[]>>("/ProductBatches/pickingitems")
  const exportTypeColors: Record<string, { color: string; text: string }> = {
    Import: {
      color: "bg-green-100 text-green-800",
      text: "Nhập hàng vào kho",
    },
    Sale: {
      color: "bg-blue-100 text-blue-800",
      text: "Lấy hàng để bán cho khách",
    },
    ReturnToSupplier: {
      color: "bg-yellow-100 text-yellow-800",
      text: "Trả hàng về cho nhà cung cấp",
    },
    Damaged: {
      color: "bg-red-100 text-red-800",
      text: "Hàng bị hỏng cần xuất khỏi kho",
    },
    Expired: {
      color: "bg-gray-100 text-gray-800",
      text: "Hàng hết hạn sử dụng",
    },
    Other: {
      color: "bg-purple-100 text-purple-800",
      text: "Lý do khác",
    },
  };


  const columns: ColumnDef<ProductItem>[] = [
    {
      accessorKey: "details",
      header: "Sản phẩm",
      cell: ({ row }) => {
        const details: ProductDetail[] = row.getValue("details")
        if (!details || details.length === 0) return "N/A"

        const firstProduct = details[0]
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={firstProduct.image || "/placeholder.svg"} alt={firstProduct.productName} />
              <AvatarFallback>{firstProduct.productName.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{firstProduct.productName} - {firstProduct.packagingType} - {firstProduct.netWeight}g</span>
              <span className="text-xs text-muted-foreground">{firstProduct.productBatchNumber}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "Số lượng",
    },
    {
      accessorKey: "user",
      header: "Người thực hiện",
      cell: ({ row }) => {
        const user: User = row.getValue("user")
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "orderId",
      header: "Mã đơn hàng",
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
    },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${exportTypeColors[type]?.color ||
              "bg-gray-100 text-gray-800"
              }`}
          >
            {exportTypeColors[type]?.text || "Không xác định"}
          </span>
        )
      },
    },
    {
      accessorKey: "createdOnUtc",
      header: "Ngày tạo",
      cell: ({ row }) => {
        const date = row.original.createdOnUtc
        return formatTimeVietNam(new Date(date), true)
      },
    },
  ]

  return (
    <div className="m-10">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-semibold leading-none tracking-tight">Lịch sử sản phẩm trong kho</div>
      </div>

      <DataTable data={pickingitems?.value ?? []} columns={columns} searchFiled="orderId" />
    </div>
  )
}

export default PickingItemPage
