"use client";
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiResponse } from '@/types/types';
import { CreateBlogSafeTypes } from '@/zod-safe-types/blog-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BlogCategory } from '../category/page';
import { API } from '@/actions/client/api-config';
import { BLOG_KEY } from '@/app/key/admin-key';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FancyMultiSelect } from '@/components/custom/_custom_select/multi-select';
import { BLOG_TAGS } from '@/features/admin/admin-lib/admin-lib';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { SerializedEditorState } from 'lexical';
import { initialValue } from '@/features/manager/blog/blog-form';

const Editor = dynamic(() => import("@/components/blocks/editor-x/editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-[300px] w-full items-center justify-center rounded-md border border-dashed">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
    ),
});

function CreateBlogPage() {
    const { data: categoriesBlog } = useFetch<ApiResponse<BlogCategory[]>>("/BlogCategories", [BLOG_KEY.BLOG_CATEGORY_ADMIN])
    const [editorState, setEditorState] =
        useState<SerializedEditorState>(initialValue);

    const form = useForm<z.infer<typeof CreateBlogSafeTypes>>({
        resolver: zodResolver(CreateBlogSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof CreateBlogSafeTypes>) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", JSON.stringify(editorState));
        if (values.image) {
            formData.append("thumbnail", values.image[0]);
        }
        formData.append("blogCategoryId", values.categoryBlogId);
        values.tagNames.forEach((tag) => {
            formData.append("tagNames", tag.value);
        });
        try {
            const response = await API.post("/Blogs", formData);
            if (response) {
                toast.success("Tạo bài viết thành công")
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
            <Card>
                <CardHeader>
                    <CardTitle>Tạo bài viết</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <FormInputControl
                            form={form}
                            name="title"
                            disabled={form.formState.isSubmitting}
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
                            disabled={form.formState.isSubmitting}
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
                            require
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
                    </div>
                </CardContent>
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
