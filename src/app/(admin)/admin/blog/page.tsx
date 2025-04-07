"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { deleteBlog } from "@/actions/blog"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { DataTable } from "@/components/global-components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import type { ApiResponse, PageResult } from "@/types/types"
import { CirclePlus, Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export interface Blog {
  id: string
  title: string
  content: string
  thumbnail: string
  user: {
    email: string
    avatar: string
    name: string
  }
  blogCategory: {
    id: string
    name: string
  }
  createdOnUtc: string
  modifiedOnUtc: string
  isPublished: boolean
}

function BlogPage() {
  const { data: blogs } = useFetch<ApiResponse<PageResult<Blog>>>("/Blogs", ["Blogs", "admin"])
  const [blog, setBlog] = useState<Blog | undefined>(undefined)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  // Define columns for the DataTable
  const columns = [
    {
      id: "title",
      header: "Tên bài viết",
      accessorFn: (row: any) => row.title,
      cell: ({ row }: any) => <div className="font-bold">{row.original.title}</div>,
    },
    {
      id: "author",
      header: "Tác giả",
      accessorFn: (row: any) => row.user.name,
    },
    {
      id: "category",
      header: "Loại bài viết",
      accessorFn: (row: any) => row.blogCategory.name,
    },
    {
      id: "createdDate",
      header: "Ngày tạo",
      accessorFn: (row: any) => row.createdOnUtc,
      cell: ({ row }: any) => formatTimeVietNam(new Date(row.original.createdOnUtc)),
    },
    {
      id: "status",
      header: "Trạng thái",
      accessorFn: (row: any) => row.isPublished,
      cell: ({ row }: any) =>
        row.original.isPublished ? (
          <div className="py-1 px-2 w-fit rounded-md text-green-700 font-bold bg-green-100">Đang hiện</div>
        ) : (
          <div className="py-1 px-2 w-fit rounded-md text-red-700 font-bold bg-red-100">Đã ẩn</div>
        ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }: any) => {
        const blogData = row.original
        return (
          <div className="flex gap-2">
            <Link href={`/admin/blog/${blogData.id}`}>
              <Button
                variant="outline"
                className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/admin/blog/update/${blogData.id}`}>
              <Button
                variant="outline"
                className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => {
                setIsOpenDelete(true)
                setBlog(blogData)
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="m-10">
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold leading-none tracking-tight">Bài viết</p>
        <Link href="/admin/blog/create">
          <Button size="sm" className="text-white bg-green-500 hover:bg-green-600">
            <CirclePlus className="mr-1" />
            Tạo bài viết
          </Button>
        </Link>
      </div>

      <div className="mt-3">
        <DataTable data={blogs?.value?.items || []} columns={columns} searchFiled="title" />
      </div>

      <DeleteDialog
        id={blog?.id ?? ""}
        isOpen={isOpenDelete}
        onClose={() => setIsOpenDelete(!isOpenDelete)}
        name={blog?.title}
        deleteFunction={deleteBlog}
        refreshKey={[["Blogs", "admin"]]}
      />
    </div>
  )
}

export default BlogPage

