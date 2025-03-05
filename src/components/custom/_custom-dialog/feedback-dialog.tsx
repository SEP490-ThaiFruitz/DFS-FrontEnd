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
        defaultValues: feedback || { content: "", star: 3 },
    });

    const [rating, setRating] = useState(feedback?.rating ?? 3);
    const [hoverRating, setHoverRating] = useState<number | null>(null);

    const onSubmit = async (values: z.infer<typeof FeedbackSafeTypes>) => {
        try {
            if (feedback) {
                console.log("Updating feedback:", values);
                toast.success("Đánh giá đã được cập nhật!");
            } else {
                console.log("Creating feedback:", values);
                toast.success("Đánh giá đã được tạo mới!");
            }
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

    const handleStarClick = (starValue: number) => {
        setRating(starValue);
        form.setValue("star", starValue);
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
                    name="star"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="pt-8">
                            <Label>Đánh giá</Label>
                            <div className="flex flex-row items-center justify-between">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        onClick={() => {
                                            handleStarClick(star)
                                            field.onChange(star)
                                        }}
                                        onMouseEnter={() => handleStarHover(star)}
                                        onMouseLeave={handleStarLeave}
                                        className={`cursor-pointer h-20 w-20 ${star <= (hoverRating ?? rating)
                                            ? 'text-yellow-600 fill-yellow-600'
                                            : 'text-gray-300 fill-none'
                                            }`}
                                    />
                                ))}
                            </div>
                        </FormItem>
                    )}
                />
                <FormTextareaControl form={form} label="Nội dung" name="content" rows={6} />
                <FormFileControl
                    form={form}
                    name="images"
                    type={"image/jpeg, image/jpg, image/png, image/webp"}
                    maxFiles={5}
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
                        className="max-w-32 bg-green-700 hover:bg-green-800"
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

