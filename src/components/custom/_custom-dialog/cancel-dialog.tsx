import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { FormTextareaControl } from "@/components/global-components/form/form-textarea-control";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { toast } from "sonner";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { CancelOrderSafeTypes } from "@/zod-safe-types/order-safe-types";
import { API } from "@/actions/client/api-config";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CancelDialogProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
    refreshKey?: [string, ...string[]];
}

export const CancelDialog = ({ isOpen, onClose, orderId, refreshKey }: CancelDialogProps) => {
    const CANCEL_REASONS = [
        { label: "Thay đổi ý định mua hàng" },
        { label: "Tôi không có nhà vào 4 hoặc vài ngày tới" },
        { label: "Tôi bị nhầm thông tin giao hàng" },
        { label: "Lí do khác" },
    ];

    const form = useForm<z.infer<typeof CancelOrderSafeTypes>>({
        resolver: zodResolver(CancelOrderSafeTypes)
    });
    const queryClient = useQueryClient();

    const onSubmit = async (values: z.infer<typeof CancelOrderSafeTypes>) => {
        try {
            const value = {
                orderId,
                reasonCancel: values.reason === "Lí do khác" ? values.context : values.reason,
            }
            if (values.reason === "Lí do khác") {
                if (!values.context) {
                    form.setError("context", { message: "Vui lòng nhập lí do" })
                    return;
                }
            }
            const response = await API.patch(`/Orders/cancel`, value)
            if (response) {
                toast.success("Huỷ đơn hàng thành công")
                queryClient.invalidateQueries({ queryKey: refreshKey })
                onClose()
            } else {
                toast.error("Huỷ đơn hàng thất bại")
            }
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error?.message : "Có lỗi xảy ra khi xử lý yêu cầu!");
        }
    };

    const body = (
        <ScrollArea className="max-h-[600px]">
            <FormValues classNameForm="p-4" form={form} onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-base font-medium">Chọn lí do hủy</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                    {CANCEL_REASONS.map((reason) => (
                                        <FormItem
                                            key={reason.label}
                                            className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                        >
                                            <FormControl>
                                                <RadioGroupItem checked={form.getValues("reason") == reason.label} value={reason.label} className="text-primary" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer text-sm leading-tight">{reason.label}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
                {form.watch("reason") == "Lí do khác" && (
                    <FormTextareaControl
                        form={form}
                        disabled={form.formState.isSubmitting}
                        label="Lí do"
                        name="context"
                        classNameInput="w-full"
                        rows={6} />
                )}
                <FormMessage className="text-sm text-destructive" />

                <DialogFooter>
                    <ButtonCustomized
                        disabled={form.formState.isSubmitting}
                        onClick={onClose}
                        type="button"
                        className="w-32 bg-slate-100 text-slate-900 hover:bg-slate-300"
                        variant="outline"
                        label="Hủy"
                    />

                    <ButtonCustomized
                        type="submit"
                        className="max-w-32 bg-red-700 hover:bg-red-800"
                        variant="secondary"
                        disabled={form.formState.isSubmitting}
                        label={
                            form.formState.isSubmitting ? (
                                <WaitingSpinner
                                    variant="pinwheel"
                                    label={"Đang hủy..."}
                                    className="font-semibold"
                                    classNameLabel="font-semibold text-sm"
                                />
                            ) : (
                                "Hủy đơn hàng"
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
            title={"Hủy đơn hàng"}
            open={isOpen}
            onClose={onClose}
        />
    );
};

