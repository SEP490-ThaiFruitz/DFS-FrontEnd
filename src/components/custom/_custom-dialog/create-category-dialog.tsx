"use client"
import { createCategory } from '@/actions/category';
import { DialogReused } from '@/components/global-components/dialog-reused';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { CreateCategorySafeTypes } from '@/zod-safe-types/category-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ButtonCustomized } from '../_custom-button/button-customized';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { useLoginDialog } from '@/hooks/use-login-dialog';
import { CirclePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { FormImageControl } from '@/components/global-components/form/form-image-control';

export const CreateCategoryDialog = () => {
    const [file, setFile] = useState<File>();
    const form = useForm<z.infer<typeof CreateCategorySafeTypes>>({
        resolver: zodResolver(CreateCategorySafeTypes),
    });

    const { isOpen, onChange, onClose } = useLoginDialog();

    const onSubmit = async (values: z.infer<typeof CreateCategorySafeTypes>) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            if (file) {
                formData.append("thumbnail", file);
            }

            const response = await createCategory(formData);

            if (response.success) {
                form.reset();
                setFile(undefined);
                onClose();
            }

            console.log({ response });
        } catch (error) {
            console.log({ error });
        }
    };


    const title = (
        <div className="text-center">
            Tạo mới loại sản phẩm
        </div>
    );

    const trigger = (
        <Button variant="outline">
            <CirclePlus />
            Tạo mới
        </Button>
    );

    const body = (
        <div>
            <FormValues form={form} onSubmit={onSubmit}>
                <FormInputControl
                    form={form}
                    name="name"
                    disabled={form.formState.isSubmitting}
                    label="Tên loại sản phẩm"
                />

                <FormTextareaControl
                    form={form}
                    row={4}
                    name="description"
                    disabled={form.formState.isSubmitting}
                    label="Mô tả loại sản phẩm"
                />

                <FormImageControl
                    form={form}
                    name="image"
                    mutiple={false}
                    onChooseImage={(value: File[]) => setFile(value[0])}
                    imageType={'image/jpeg, image/jpg, image/png, image/webp'}
                    disabled={form.formState.isSubmitting}
                    label="Ảnh loại sản phẩm"
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
                                "Lưu"
                            )
                        }
                    />
                </DialogFooter>
            </FormValues>
        </div>
    );
    return (
        <DialogReused
            content={body}
            asChild
            trigger={trigger}
            title={title}
            open={isOpen}
            onOpen={onChange}
            description="Vui lòng nhập thông tin để tạo mới loại sản phẩm. Nhấn lưu để hoàn tất."
        />
    )
}

