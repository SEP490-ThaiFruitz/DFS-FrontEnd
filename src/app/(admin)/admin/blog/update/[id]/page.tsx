"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FormFileControl } from "@/components/global-components/form/form-file-control";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormSelectControl } from "@/components/global-components/form/form-select-control";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse } from "@/types/types";
import { UpdateBlogSafeTypes } from "@/zod-safe-types/blog-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { BlogCategory } from "../../category/page";
import { useParams } from "next/navigation";
import { Blog } from "../../page";
import { FormSwitchControl } from "@/components/global-components/form/form-switch-control";
import { BLOG_KEY } from "@/app/key/admin-key";
import { API } from "@/actions/client/api-config";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FancyMultiSelect } from "@/components/custom/_custom_select/multi-select";
import { BLOG_TAGS } from "@/features/admin/admin-lib/admin-lib";

import { SerializedEditorState } from 'lexical';
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { initialValue } from "@/features/manager/blog/blog-form";

const Editor = dynamic(() => import("@/components/blocks/editor-x/editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
      <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
    </div>
  ),
});

function UpdateBlogPage() {
  const { id } = useParams();
  const { data: blog } = useFetch<ApiResponse<Blog>>(`/Blogs/${id}`, [BLOG_KEY.BLOG_DETAIL_ADMIN, id as string]);
  const { data: categoriesBlog } = useFetch<ApiResponse<BlogCategory[]>>(
    "/BlogCategories",
    [BLOG_KEY.BLOG_CATEGORY_ADMIN]
  );
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  useEffect(() => {
    if (blog) {
      const content = blog.value?.content;
      if (typeof content === 'string') {
        setEditorState(JSON.parse(content));
      } else {
        setEditorState(content ?? initialValue);
      }
    }
  }, [blog])

  const form = useForm<z.infer<typeof UpdateBlogSafeTypes>>({
    resolver: zodResolver(UpdateBlogSafeTypes),
  });

  const onSubmit = async (values: z.infer<typeof UpdateBlogSafeTypes>) => {
    const formData = new FormData();
    const id = blog?.value?.id;
    if (id !== undefined) {
      formData.append("id", id);
    }
    formData.append("title", values.title);
    formData.append("isPublished", values.isPublished.toString());
    formData.append("content", JSON.stringify(editorState) ?? "");
    if (values.image) {
      formData.append("thumbnail", values.image);
    }
    formData.append("blogCategoryId", values.categoryBlogId);
    values.tagNames.forEach((tag) => {
      formData.append("tagNames", tag.value);
    });
    try {
      const response = await API.update(`/Blogs`, formData);
      if (response) {
        toast.success("Cập nhật bài viết thành công")
      }
    } catch (error) {
      console.log(error)
    }

  };

  return (
    <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
      <Card>
        <CardHeader>
          <CardTitle>Cập nhật bài viết</CardTitle>
        </CardHeader>
        {blog && (
          <CardContent>
            <div className="space-y-6">
              <FormInputControl
                form={form}
                name="title"
                defaultValue={blog?.value?.title}
                disabled={form.formState.isSubmitting}
                require
                label="Tên bài viết"
              />
              <FormSelectControl
                form={form}
                name="categoryBlogId"
                classNameInput="h-fit"
                placeholder="Chọn loại loại bài viết"
                items={
                  categoriesBlog?.value?.map((blogCategory) => ({
                    id: blogCategory.id.toString(),
                    name: blogCategory.name,
                  })) || []
                }
                disabled={form.formState.isSubmitting}
                defaultValue={blog?.value?.blogCategory.id.toString()}
                label="Chọn loại loại bài viết"
                require
              />
              <div>
                <Controller
                  name="tagNames"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                        Thẻ tag
                      </FormLabel>
                      <FancyMultiSelect
                        placeholder='Chọn tag sản phẩm hoặc nhập mới'
                        options={BLOG_TAGS}
                        onChangeValue={(selectedValues) => field.onChange(selectedValues)}
                        defaultValues={blog?.value?.tagNames.reduce((tags: { label: string, value: string }[], tag) => {
                          tags.push({
                            label: tag,
                            value: tag
                          });
                          return tags;
                        }, []) ?? []}
                      />
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
              <FormFileControl
                form={form}
                name="image"
                classNameInput="h-30 w-full"
                mutiple={false}
                type={"image/jpeg, image/jpg, image/png, image/webp"}
                disabled={form.formState.isSubmitting}
                label="Ảnh bài viết"
              />
              <Controller
                control={form.control}
                name="content"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Editor
                          maxLength={5000}
                          editorSerializedState={editorState}
                          onSerializedChange={(value) =>
                            setEditorState(value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormSwitchControl
                form={form}
                name="isPublished"
                label="Trạng thái"
                disabled={form.formState.isSubmitting}
                classNameInput="!mt-0"
                classNameForm="flex items-center space-x-3"
                defaultValue={blog?.value?.isPublished}
              />
            </div>
          </CardContent>
        )}
      </Card>

      <ButtonCustomized
        type="submit"
        className="px-2 min-w-32 max-w-fit bg-sky-600 hover:bg-sky-700"
        variant="secondary"
        disabled={form.formState.isSubmitting}
        label={
          form.formState.isSubmitting ? (
            <WaitingSpinner
              variant="pinwheel"
              label="Đang cập nhật..."
              className="font-semibold"
              classNameLabel="font-semibold text-sm"
            />
          ) : (
            "Cập nhật"
          )
        }
      />
    </FormValues>
  );
}

export default UpdateBlogPage;
