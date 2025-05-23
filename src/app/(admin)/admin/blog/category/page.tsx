"use client"

import { API } from "@/actions/client/api-config"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { BLOG_KEY } from "@/app/key/admin-key"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { DataTableSkeleton } from "@/components/global-components/custom-skeleton/data-table-skeleton"
import { DataTableCustom } from "@/components/global-components/data-table/data-table-custom"
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
import { useQueryClient } from "@tanstack/react-query"
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

  const { data: blogCategories, isLoading } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", [BLOG_KEY.BLOG_CATEGORY_ADMIN])

  const onSubmit = async (values: z.infer<typeof FormCategoryBlogSafeTypes>) => {
    try {
      const res =
        blogCategory === undefined
          ? await API.post("/BlogCategories", { name: values.name })
          : await API.update("/BlogCategories", { id: blogCategory.id, name: values.name })
      if (res) {
        const meessage = blogCategory === undefined ? "Tạo mới loại bài viết thành công" : "Cập nhật loại bài viết thành công"
        handlerCloseForm()
        toast.success(meessage)
        queryClient.invalidateQueries({ queryKey: [BLOG_KEY.BLOG_CATEGORY_ADMIN] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlerCloseForm = () => {
    setIsOpen(!isOpen)
    form.reset()
    setBlogCategory(undefined)
  }

  const deleteBlogCategory = async (id: string) => {
    return await API.remove(`/BlogCategories/${id}`);
  };


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
            <Button size="sm" className="text-white bg-sky-600 hover:bg-sky-700">
              <CirclePlus className="mr-1" />
              Tạo loại bài viết
            </Button>
          </DialogTrigger>
          {isOpen && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{blogCategory ? "Cập nhật " : "Tạo "}loại bài viết</DialogTitle>
              </DialogHeader>
              <FormValues form={form} onSubmit={onSubmit} classNameForm="grid gap-4">
                <FormInputControl
                  form={form}
                  name="name"
                  disabled={form.formState.isSubmitting}
                  label="Tên loại bài viết"
                  defaultValue={blogCategory?.name}
                  require
                />
                <DialogFooter>
                  <ButtonCustomized
                    onClick={() => setIsOpen(false)}
                    className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
                    variant="outline"
                    label="Hủy"
                  />

                  <ButtonCustomized
                    type="submit"
                    className="px-2 min-w-32 max-w-fit bg-sky-600 hover:bg-sky-700"
                    variant="secondary"
                    disabled={form.formState.isSubmitting}
                    label={
                      form.formState.isSubmitting ? (
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

      <div className="mt-8">
        {isLoading ? <DataTableSkeleton /> :
          <div className="bg-white cardStyle shadow border">
            <DataTableCustom
              data={blogCategories?.value || []} columns={columns} placeholder="tên loại bài viết" searchFiled="name"
            />
          </div>
        }
      </div>

      <DeleteDialog
        refreshKey={[[BLOG_KEY.BLOG_CATEGORY_ADMIN]]}
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

