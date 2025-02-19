"use client";
import { getProducts } from "@/actions/product";
import { DataTable } from "@/components/global-components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { columns, Product } from "@/features/admin/product/column";
import { PageResult } from "@/types/types";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const products: Product[] = [
  {
    id: "1",
    name: "Xoài sấy dẻo",
    category: {
      id: "c1",
      name: "Trái cây sấy mềm",
    },
    thumbnail: "https://example.com/images/xoai-say-deo.jpg",
    description: "Xoài sấy dẻo, giữ nguyên hương vị tự nhiên, giàu vitamin C.",
    type: "Trái cây",
    isActive: true,
    isDeleted: false,
    createDate: "2024-02-01T12:00:00Z",
    updateDate: "2024-02-10T12:00:00Z",
  },
  {
    id: "2",
    name: "Chuối sấy giòn",
    category: {
      id: "c2",
      name: "Trái cây sấy khô",
    },
    thumbnail: "https://example.com/images/chuoi-say-gion.jpg",
    description: "Chuối sấy giòn, không chất bảo quản, giòn tan thơm ngon.",
    type: "Trái cây",
    isActive: true,
    isDeleted: false,
    createDate: "2024-01-15T08:30:00Z",
    updateDate: "2024-01-20T10:45:00Z",
  },
  {
    id: "3",
    name: "Hạnh nhân sấy đông lạnh",
    category: {
      id: "c3",
      name: "Quả hạch sấy đông lạnh",
    },
    thumbnail: "https://example.com/images/hanh-nhan-say.jpg",
    description: "Hạnh nhân sấy đông lạnh, giàu dinh dưỡng, tốt cho sức khỏe.",
    type: "Quả hạch",
    isActive: true,
    isDeleted: false,
    createDate: "2023-12-10T14:00:00Z",
    updateDate: "2024-01-05T09:30:00Z",
  },
  {
    id: "4",
    name: "Hỗn hợp hạt dinh dưỡng",
    category: {
      id: "c4",
      name: "Mặt hàng hỗn hợp",
    },
    thumbnail: "https://example.com/images/hon-hop-hat.jpg",
    description:
      "Hỗn hợp các loại hạt dinh dưỡng, bổ sung năng lượng mỗi ngày.",
    type: "Hạt dinh dưỡng",
    isActive: true,
    isDeleted: false,
    createDate: "2024-03-05T11:20:00Z",
    updateDate: "2024-03-10T15:00:00Z",
  },
  {
    id: "5",
    name: "Hộp quà bao bì bán lẻ",
    category: {
      id: "c5",
      name: "Bao bì bán lẻ",
    },
    thumbnail: "https://example.com/images/bao-bi-ban-le.jpg",
    description: "Hộp quà thiết kế sang trọng, thích hợp làm quà biếu.",
    type: "Bao bì",
    isActive: false,
    isDeleted: false,
    createDate: "2024-02-15T10:20:00Z",
    updateDate: "2024-02-20T12:00:00Z",
  },
  {
    id: "6",
    name: "Dâu tây phủ sô cô la",
    category: {
      id: "c6",
      name: "Trái cây & Sôcôla",
    },
    thumbnail: "https://example.com/images/dau-tay-chocolate.jpg",
    description: "Dâu tây tươi ngon kết hợp với sô cô la hảo hạng.",
    type: "Trái cây & Sô cô la",
    isActive: true,
    isDeleted: false,
    createDate: "2024-03-10T09:00:00Z",
    updateDate: "2024-03-15T14:30:00Z",
  },
];

function ProductPage() {
  const [data, setData] = useState<PageResult<Product>>();
  useEffect(() => {
    getProducts()
      .then((response: PageResult<Product>) => setData(response))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="mx-4 lg:mx-20">
      <div className="flex justify-end">
        <Link href={"/admin/product/create"}>
          <Button variant="outline">
            <CirclePlus />
            Tạo mới
          </Button>
        </Link>
      </div>
      <div className="py-4">
        {/* <DataTable data={products || []} columns={columns} /> */}
        <DataTable data={products || []} columns={columns} searchFiled="name" />
      </div>
    </div>
  );
}

export default ProductPage;
