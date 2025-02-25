"use client"
import { createBlogCategory, deleteBlogCategory, updateBlogCategory } from "@/actions/blog";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ApiResponse } from "@/types/types";
import { FormCategoryBlogSafeTypes } from "@/zod-safe-types/blog-safe-types";
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, Pencil, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner";
import { z } from 'zod'

export interface BlogCategory {
  id: number,
  name: string,
  quantity: number,
  publishedQuantity: number
}

function BlogCategoryPage() {
  const queryClient = useQueryClient();
  const [blogCategory, setBlogCategory] = useState<BlogCategory | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const form = useForm<z.infer<typeof FormCategoryBlogSafeTypes>>({
    resolver: zodResolver(FormCategoryBlogSafeTypes),
  });

  const { data: blogCategories } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", ["BlogCategories", "admin"])
  const { isPending, mutate: createOrUpdateBlogCategory } = useMutation({
    mutationFn: async (values: any) => {
      try {
        const res = blogCategory === undefined ? await createBlogCategory(values) : await updateBlogCategory({ id: blogCategory.id, ...values });
        if (!res.success)
          throw new Error(res.message);
        return res.message;
      } catch (error) {
        console.log(error);
        throw new Error(error instanceof Error ? error.message : 'An unknown error occurred');
      }
    },
    onSuccess: (message: string) => {
      handlerCloseForm()
      toast.success(message)
      queryClient.invalidateQueries({ queryKey: ["BlogCategories", "admin"] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  });

  const onSubmit = async (values: z.infer<typeof FormCategoryBlogSafeTypes>) => {
    createOrUpdateBlogCategory(values)
  };
  const handlerCloseForm = () => {
    setIsOpen(!isOpen);
    form.reset();
    setBlogCategory(undefined);
  }
  return (
    <div className='m-10'>
      <div className='flex justify-between items-center'>
        <p className='text-2xl font-semibold leading-none tracking-tight'>Loại bài viết</p>
        <Dialog open={isOpen} onOpenChange={() => {
          handlerCloseForm()
        }}>
          <DialogTrigger asChild>
            <Button size={"sm"} className='text-white bg-green-500 hover:bg-green-600'>
              <CirclePlus />
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
                      ) :
                        (
                          <p>{blogCategory ? "Cập nhật" : "Lưu"}</p>
                        )

                    }
                  />
                </DialogFooter>
              </FormValues>
            </DialogContent>
          )}
        </Dialog>
      </div>
      <div className="mt-10 border rounded-lg shadow-sm h-fit min-w-full max-w-6xl overflow-x-auto">
        <Table className='overflow-x-auto'>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] min-w-[100px]">STT</TableHead>
              <TableHead className="w-[200px] min-w-[300px]">Tên</TableHead>
              <TableHead className="w-[200px] min-w-[200px]">Số bài viết</TableHead>
              <TableHead className="w-[200px] min-w-[200px]">Số bài viết hiện</TableHead>
              <TableHead className="w-[200px] min-w-[200px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogCategories?.value?.map((blogCategory: BlogCategory, index: number) => <TableRow key={blogCategory.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-bold">{blogCategory.name}</TableCell>
              <TableCell>{blogCategory.quantity}</TableCell>
              <TableCell>{blogCategory.publishedQuantity}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="h-6 w-6 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white"
                    onClick={() => {
                      setIsOpen(true)
                      setBlogCategory(blogCategory)
                    }}
                  >
                    <Pencil />
                  </Button>

                  <Button
                    variant="outline"
                    className="h-6 w-6 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => {
                      setBlogCategory(blogCategory)
                      setIsOpenDelete(true)
                    }}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </TableCell>
            </TableRow>)}
          </TableBody>
        </Table>
      </div>
      <DeleteDialog refreshKey={[["BlogCategories", "admin"]]} id={blogCategory?.id.toString() ?? ""} onClose={() => {
        form.reset();
        setBlogCategory(undefined);
        setIsOpenDelete(false)
      }} name={blogCategory?.name ?? ""} deleteFunction={deleteBlogCategory} isOpen={isOpenDelete} />
    </div>
  )
}

export default BlogCategoryPage