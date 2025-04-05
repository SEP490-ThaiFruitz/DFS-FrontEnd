import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ButtonCustomized } from "../_custom-button/button-customized";
import { DialogReused } from "@/components/global-components/dialog-reused";
import { FormValues } from "@/components/global-components/form/form-values";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { toast } from "sonner";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RePaymentOrderSafeTypes } from "@/zod-safe-types/order-safe-types";
import { API } from "@/actions/client/api-config";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { ApiResponse } from "@/types/types";

interface RePaymentDialogProps {
    orderId: string;
    isOpen: boolean;
    onClose: () => void;
}

export const RePaymentDialog = ({ isOpen, onClose, orderId }: RePaymentDialogProps) => {
    const Payments = [
        { label: "VnPay" },
        { label: "PayOs" },
    ];

    const form = useForm<z.infer<typeof RePaymentOrderSafeTypes>>({
        resolver: zodResolver(RePaymentOrderSafeTypes)
    });

    const onSubmit = async (values: z.infer<typeof RePaymentOrderSafeTypes>) => {
        try {
            const response: ApiResponse<string> = await API.get(`/Payments/${orderId}?paymentMethod=${values.paymentType}`)
            if (response) {
                window.open(response.value, "_blank");
                onClose()
            } else {
                toast.error("Lấy link thanh toán thất bại")
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
                    name="paymentType"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-base font-medium">Chọn phương thức thanh toán</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2">
                                    {Payments.map((payment) => (
                                        <FormItem
                                            key={payment.label}
                                            className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                                        >
                                            <FormControl>
                                                <RadioGroupItem checked={form.getValues("paymentType") == payment.label} value={payment.label} className="text-primary" />
                                            </FormControl>
                                            <FormLabel className="font-normal cursor-pointer text-sm leading-tight">{payment.label}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                />
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
                        className="max-w-fit bg-green-700 hover:bg-green-800"
                        variant="secondary"
                        disabled={form.formState.isSubmitting}
                        label={
                            form.formState.isSubmitting ? (
                                <WaitingSpinner
                                    variant="pinwheel"
                                    label={"Đang thanh toán..."}
                                    className="font-semibold"
                                    classNameLabel="font-semibold text-sm"
                                />
                            ) : (
                                "Thanh toán"
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
            title={"Phương thức thanh toán"}
            open={isOpen}
            onClose={onClose}
        />
    );
};

