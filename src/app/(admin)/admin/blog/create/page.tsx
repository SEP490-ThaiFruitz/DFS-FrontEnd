"use client";
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiResponse } from '@/types/types';
import { FormBlogSafeTypes } from '@/zod-safe-types/blog-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BlogCategory } from '../category/page';
import { createBlog } from '@/actions/blog';

function CreateBlogPage() {
    const { data: categoriesBlog } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", ["BlogCategories", "select"])
    const { isPending, mutate: createBlogMutation } = useMutation({
        mutationFn: async (values: FormData) => {
            const response = await createBlog(values);
            if (response?.isSuccess) {
                return "Tạo bài viết thành công"
            } else {
                throw new Error(response?.status === 409 ? "Tên bài viết đã tồn tại" : "Lỗi hệ thống");
            }
        },
        onSuccess: (value) => {
            form.reset();
            toast.success(value)
        },
        onError: (value) => {
            toast.error(value.message)
        }
    })

    const form = useForm<z.infer<typeof FormBlogSafeTypes>>({
        resolver: zodResolver(FormBlogSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof FormBlogSafeTypes>) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);
        formData.append("thumbnail", values.image);
        formData.append("blogCategoryId", values.categoryBlogId);

        createBlogMutation(formData);
    };

    return (
        <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
            <Card>
                <CardHeader>
                    <CardTitle>Tạo bài viết</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
                        <div className="space-y-6">
                            <FormInputControl
                                form={form}
                                name="title"
                                disabled={isPending}
                                require
                                label="Tên bài viết"
                            />
                            <FormSelectControl
                                form={form}
                                name="categoryBlogId"
                                classNameInput='h-fit'
                                placeholder='Chọn loại loại bài viết'
                                items={categoriesBlog?.value?.map((blogCategory) => ({
                                    id: blogCategory.id.toString(),
                                    name: blogCategory.name
                                })) || []}
                                disabled={isPending}
                                label="Chọn loại loại bài viết"
                                require
                            />
                            <FormFileControl
                                form={form}
                                name="image"
                                classNameInput="h-30 w-full"
                                mutiple={false}
                                type={"image/jpeg, image/jpg, image/png, image/webp"}
                                disabled={isPending}
                                label="Ảnh bài viết"
                                require
                            />
                        </div>
                        <div className="space-y-6">
                            <FormTextareaControl
                                form={form}
                                name="content"
                                classNameInput='h-fit'
                                placeholder='Nhập mô tả'
                                disabled={isPending}
                                label="Nội dung bài viết"
                                require
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

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
                            className="font-semibold"
                            classNameLabel="font-semibold text-sm"
                        />
                    ) : (
                        "Tạo mới"
                    )
                }
            />
        </FormValues >
    );
}

export default CreateBlogPage;
