"use client";
import { updateCategory } from "@/actions/category";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { UpdateCategorySafeTypes } from "@/zod-safe-types/category-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control";
import { FormFileControl } from "@/components/global-components/form/form-file-control";
import { Category } from "@/features/admin/category/column";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateCategoryDialogProps {
  category: Category;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateCategoryDialog = ({
  category,
  isOpen,
  onClose,
}: UpdateCategoryDialogProps) => {
  const form = useForm<z.infer<typeof UpdateCategorySafeTypes>>({
    resolver: zodResolver(UpdateCategorySafeTypes),
  });
  const queryClient = useQueryClient();
  const onSubmit = async (values: z.infer<typeof UpdateCategorySafeTypes>) => {
    try {
      const formData = new FormData();
      formData.append("id", category.id);
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.image) {
        formData.append("thumbnail", values.image[0]);
      }

      const response = await updateCategory(formData);
      if (response?.isSuccess) {
        form.reset();
        onClose();
        queryClient.invalidateQueries({ queryKey: ["categories"] })
        toast.success("Cập nhập loại sản phẩm thành công")
      } else {
        toast.error(response?.status == 409 ? "Tên loại sản phẩm đã tồn tại" : "Lỗi hệ thống")
      }

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  };

  const title = <div className="text-center">Cập nhật loại sản phẩm</div>;

  const trigger = (
    <Button
      className="h-6 w-6 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
      variant="outline"
    >
      <Pencil />
    </Button>
  );

  const body = (
    <div>
      <FormValues form={form} onSubmit={onSubmit}>
        <FormInputControl
          form={form}
          name="name"
          disabled={form.formState.isSubmitting}
          defaultValue={category?.name}
          label="Tên loại sản phẩm"
        />

        <FormTextareaControl
          form={form}
          rows={4}
          name="description"
          defaultValue={category?.description}
          disabled={form.formState.isSubmitting}
          label="Mô tả loại sản phẩm"
        />
        <FormFileControl
          form={form}
          name="image"
          classNameInput="h-30 w-full"
          mutiple={false}
          type={"image/jpeg, image/jpg, image/png, image/webp"}
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
                "Cập nhật"
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
      onClose={onClose}
      description="Vui lòng nhập thông tin để cập nhật loại sản phẩm. Nhấn cập nhật để hoàn tất."
      className="min-w-4xl"
    />
  );
};
