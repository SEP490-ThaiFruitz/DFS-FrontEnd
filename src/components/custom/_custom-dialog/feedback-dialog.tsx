import React from "react";
import { useForm } from "react-hook-form";
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

interface FeedbackDialogProps {
    feedback?: {
        id: string;
        rating: number;
        content: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackDialog = ({ feedback, isOpen, onClose }: FeedbackDialogProps) => {
    const form = useForm<z.infer<typeof FeedbackSafeTypes>>({
        resolver: zodResolver(FeedbackSafeTypes),
        defaultValues: feedback || { content: "", rating: 3 },
    });

    const onSubmit = async (values: z.infer<typeof FeedbackSafeTypes>) => {
        try {
            if (feedback) {
                // Handle Update Logic
                console.log("Updating feedback:", values);
                // Example: await updateFeedback(feedback.id, values);
                toast.success("Đánh giá đã được cập nhật!");
            } else {
                // Handle Create Logic
                console.log("Creating feedback:", values);
                // Example: await createFeedback(values);
                toast.success("Đánh giá đã được tạo mới!");
            }
            onClose(); // Close dialog after submission
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error?.message : "Có lỗi xảy ra khi xử lý yêu cầu!");
        }
    };

    const title = (
        <div className="text-center">
            {feedback ? "Cập nhật đánh giá sản phẩm" : "Thêm mới đánh giá sản phẩm"}
        </div>
    );

    const buttonLabel = feedback ? "Cập nhật" : "Thêm mới";

    const body = (
        <div className="max-h-[600px] overflow-y-auto px-4" style={{ scrollbarWidth: 'thin' }}>
            <FormValues form={form} onSubmit={onSubmit}>
                <div className="mt-4">
                    <label className="block text-sm font-semibold">Đánh giá</label>
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <label key={rating} className="flex items-center">
                                <input
                                    type="radio"
                                    value={rating}
                                    {...form.register("rating")}
                                    className="mr-1"
                                />
                                {rating}
                            </label>
                        ))}
                    </div>
                    {form.formState.errors.rating && (
                        <div className="text-sm text-red-600">
                            {form.formState.errors.rating.message}
                        </div>
                    )}
                </div>
                
                <FormTextareaControl form={form} label="Nội dung" name="content" row={6} />
                <FormFileControl
                    form={form}
                    name="images"
                    type={"image/jpeg, image/jpg, image/png, image/webp"}
                    maxFile={5}
                    mutiple
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
                                    label={feedback ? "Đang cập nhật..." : "Đang tạo mới..."}
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
        </div>
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
