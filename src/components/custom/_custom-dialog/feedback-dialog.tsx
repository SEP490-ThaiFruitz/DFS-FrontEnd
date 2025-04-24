import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeedbackSafeTypes } from "@/zod-safe-types/feedback-safe-types";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { toast } from "sonner";
import { z } from "zod";
import { FormFileControl } from "@/components/global-components/form/form-file-control";
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { API } from "@/actions/client/api-config";

interface FeedbackDialogProps {
  orderItemId: string;
  stars?: number;
  content?: string;
  isOpen: boolean;
  isUpdateFeedback?: boolean;
  onClose: () => void;
  refreshKey?: [string, ...string[]];
}

export const FeedbackDialog = ({
  content,
  stars,
  isOpen,
  onClose,
  orderItemId,
  isUpdateFeedback,
  refreshKey,
}: FeedbackDialogProps) => {
  const form = useForm<z.infer<typeof FeedbackSafeTypes>>({
    resolver: zodResolver(FeedbackSafeTypes),
    defaultValues: {
      orderItemId: orderItemId ?? undefined,
      content: content ?? "",
      stars: stars ?? 3,
    },
  });
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(stars ?? 3);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const onSubmit = async (values: z.infer<typeof FeedbackSafeTypes>) => {
    try {
      const formData = new FormData();
      formData.append("orderItemId", values?.orderItemId);
      if (values?.content) {
        formData.append("content", values?.content);
      }
      if (values?.images) {
        values?.images.forEach((file: File) => {
          formData.append("images", file);
        });
      }
      formData.append("stars", values?.stars.toString());
      if (isUpdateFeedback) {
        const response = await API.update("/Feedbacks", formData);
        if (response?.isSuccess) {
          toast.success("Đánh giá đã được cập nhật!");
          queryClient.invalidateQueries({ queryKey: refreshKey });
          onClose();
        }
      } else {
        const response = await API.post("/Feedbacks", formData);
        if (response?.isSuccess) {
          toast.success("Đánh giá thành công!");
          onClose();
          queryClient.invalidateQueries({ queryKey: refreshKey });
        }
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error?.message
          : "Có lỗi xảy ra khi xử lý yêu cầu!"
      );
    }
  };

  const title = (
    <div className="text-center">
      {isUpdateFeedback ? "Cập nhật đánh giá sản phẩm" : "Đánh giá sản phẩm"}
    </div>
  );

  const buttonLabel = isUpdateFeedback ? "Cập nhật" : "Thêm mới";

  const handleStarClick = (starValue: number) => {
    setRating(starValue);
    form.setValue("stars", starValue);
  };

  const handleStarHover = (starValue: number) => {
    setHoverRating(starValue);
  };

  const handleStarLeave = () => {
    setHoverRating(null);
  };

  const body = (
    <ScrollArea className="max-h-[600px] overflow-auto">
      <FormValues classNameForm="p-4" form={form} onSubmit={onSubmit}>
        <Controller
          name="stars"
          control={form.control}
          render={({ field }) => (
            <FormItem className="pt-8">
              <Label>Đánh giá</Label>
              <div className="flex flex-row items-center justify-between">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => {
                      handleStarClick(star);
                      field.onChange(star);
                    }}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className={`cursor-pointer h-20 w-20 ${star <= (hoverRating ?? rating)
                      ? "text-yellow-600 fill-yellow-600"
                      : "text-gray-300 fill-none"
                      }`}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
        <FormTextareaControl
          form={form}
          disabled={form.formState.isSubmitting}
          label="Nội dung"
          name="content"
          rows={6}
        />
        <FormFileControl
          form={form}
          disabled={form.formState.isSubmitting}
          name="images"
          type={"image/jpeg, image/jpg, image/png, image/webp"}
          maxFiles={5}
          label="Ảnh"
          mutiple
        />
        <DialogFooter>
          <DialogClose asChild>
            <ButtonCustomized
              disabled={form.formState.isSubmitting}
              className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
              variant="outline"
              label="Hủy"
            />
          </DialogClose>
          <ButtonCustomized
            type="submit"
            className="max-w-32 bg-sky-600 hover:bg-sky-700"
            variant="secondary"
            disabled={form.formState.isSubmitting}
            label={
              form.formState.isSubmitting ? (
                <WaitingSpinner
                  variant="pinwheel"
                  label={
                    isUpdateFeedback ? "Đang cập nhật..." : "Đang tạo mới..."
                  }
                  className="font-semibold"
                  classNameLabel="font-semibold text-sm"
                />
              ) : (
                buttonLabel
              )
            }
          />
        </DialogFooter>
      </FormValues>
    </ScrollArea>
  );

  return (
    <DialogReused
      className="px-2"
      content={body}
      asChild
      title={title}
      open={isOpen}
      onClose={onClose}
    />
  );
};
