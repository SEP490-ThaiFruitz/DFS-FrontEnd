"use client"
import { createBlogCategory, deleteBlogCategory, updateBlogCategory } from "@/actions/blog-category"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { DataTable } from "@/components/global-components/data-table/data-table"
import { FormInputControl } from "@/components/global-components/form/form-input-control"
import { FormValues } from "@/components/global-components/form/form-values"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ApiResponse } from "@/types/types"
import { FormCategoryBlogSafeTypes } from "@/zod-safe-types/blog-safe-types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CirclePlus, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"

export interface BlogCategory {
  id: number
  name: string
  quantity: number
  publishedQuantity: number
}

function BlogCategoryPage() {
  const queryClient = useQueryClient()
  const [blogCategory, setBlogCategory] = useState<BlogCategory | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  const form = useForm<z.infer<typeof FormCategoryBlogSafeTypes>>({
    resolver: zodResolver(FormCategoryBlogSafeTypes),
  })

  const { data: blogCategories } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", ["BlogCategories", "admin"])

  const { isPending, mutate: createOrUpdateBlogCategory } = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      try {
        const res =
          blogCategory === undefined
            ? await createBlogCategory({ name })
            : await updateBlogCategory({ id: blogCategory.id, name })
        if (!res?.isSuccess) {
          if (res?.status === 409) {
            throw new Error(`${name} đã tồn tại`)
          }
          throw new Error("Lỗi thống")
        }
        return blogCategory === undefined ? "Tạo mới loại bài viết thành công" : "Cập nhật loại bài viết thành công"
      } catch (error: any) {
        throw new Error(error?.message)
      }
    },
    onSuccess: (message: string) => {
      handlerCloseForm()
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["BlogCategories", "admin"] })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = async (values: z.infer<typeof FormCategoryBlogSafeTypes>) => {
    createOrUpdateBlogCategory({ name: values?.name })
  }

  const handlerCloseForm = () => {
    setIsOpen(!isOpen)
    form.reset()
    setBlogCategory(undefined)
  }

  // Define columns for the DataTable
  const columns = [
    {
      id: "index",
      header: "STT",
      accessorFn: (_: any, index: number) => index + 1,
    },
    {
      id: "name",
      header: "Tên",
      accessorFn: (row: any) => row.name,
      cell: ({ row }: any) => <div className="font-bold">{row.original.name}</div>,
    },
    {
      id: "quantity",
      header: "Số bài viết",
      accessorFn: (row: any) => row.quantity,
    },
    {
      id: "publishedQuantity",
      header: "Số bài viết hiện",
      accessorFn: (row: any) => row.publishedQuantity,
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }: any) => {
        const categoryData = row.original
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
              onClick={() => {
                setIsOpen(true)
                setBlogCategory(categoryData)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => {
                setBlogCategory(categoryData)
                setIsOpenDelete(true)
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
        <p className="text-2xl font-semibold leading-none tracking-tight">Loại bài viết</p>
        <Dialog
          open={isOpen}
          onOpenChange={() => {
            handlerCloseForm()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="text-white bg-green-500 hover:bg-green-600">
              <CirclePlus className="mr-1" />
              Tạo loại bài viết
            </Button>
          </DialogTrigger>
          {isOpen && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{blogCategory ? "Cập nhật " : "Tạo "}loại bài viết</DialogTitle>
              </DialogHeader>
              <FormValues form={form} onSubmit={onSubmit} classNameForm="grid gap-4 py-4">
                <FormInputControl
                  form={form}
                  name="name"
                  disabled={isPending}
                  label="Tên loại bài viết"
                  defaultValue={blogCategory?.name}
                  require
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <ButtonCustomized
                      className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
                      variant="outline"
                      label="Hủy"
                    />
                  </DialogClose>

                  <ButtonCustomized
                    type="submit"
                    className="max-w-32 bg-green-500 hover:bg-green-700"
                    variant="secondary"
                    disabled={isPending}
                    label={
                      isPending ? (
                        <WaitingSpinner
                          variant="pinwheel"
                          label="Đang tạo..."
                          className="font-semibold "
                          classNameLabel="font-semibold text-sm"
                        />
                      ) : (
                        <span>{blogCategory ? "Cập nhật" : "Lưu"}</span>
                      )
                    }
                  />
                </DialogFooter>
              </FormValues>
            </DialogContent>
          )}
        </Dialog>
      </div>

      <div className="mt-10">
        <DataTable data={blogCategories?.value || []} columns={columns} searchFiled="name" />
      </div>

      <DeleteDialog
        refreshKey={[["BlogCategories", "admin"]]}
        id={blogCategory?.id?.toString() ?? ""}
        onClose={() => {
          form.reset()
          setBlogCategory(undefined)
          setIsOpenDelete(false)
        }}
        name={blogCategory?.name}
        deleteFunction={deleteBlogCategory}
        isOpen={isOpenDelete}
      />
    </div>
  )
}

export default BlogCategoryPage

