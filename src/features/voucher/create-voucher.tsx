"use client";
import { API } from "@/actions/client/api-config";
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized";
import { FancySelect } from "@/components/custom/_custom_select/select";
import { FormDateControl } from "@/components/global-components/form/form-date-control";
import { FormFileControl } from "@/components/global-components/form/form-file-control";
import { FormInputControl } from "@/components/global-components/form/form-input-control";
import { FormNumberInputControl } from "@/components/global-components/form/form-number-control";
import { FormSelectControl } from "@/components/global-components/form/form-select-control";
import { FormValues } from "@/components/global-components/form/form-values";
import { WaitingSpinner } from "@/components/global-components/waiting-spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QUANTITY_SELECT } from "@/features/admin/admin-lib/admin-lib";
import { CreateVoucherSafeTypes } from "@/zod-safe-types/voucher-safe-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

function CreateVoucher() {

    const form = useForm<z.infer<typeof CreateVoucherSafeTypes>>({
        resolver: zodResolver(CreateVoucherSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof CreateVoucherSafeTypes>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.code) {
            formData.append("code", values.code);
        }
        if (values.moneyDiscount) {
            formData.append("value", values.moneyDiscount);
        } else if (values.percentDiscount) {
            formData.append("value", values.percentDiscount);
        }
        formData.append("discountType", values.discountType);
        formData.append("startDate", format(values.startDate, "yyyy-MM-dd"));
        formData.append("endDate", format(values.endDate, "yyyy-MM-dd"));
        if (values.image) {
            formData.append("image", values.image[0]);
        }
        formData.append("minimumOrderAmount", values.minimumOrderAmount);
        formData.append("maximumDiscountAmount", values.maximumDiscount);
        formData.append("quantity", values.quantity);

        const response = await API.post("/Vouchers", formData);
        if (response) {
            form.reset();
            toast.success("Tạo mã giảm giá thành công");
        }
    };

    useEffect(() => {
        if (form.watch("discountType") === "Amount") {
            form.setValue("percentDiscount", undefined);
        } else {
            form.setValue("moneyDiscount", undefined);
        }
    }, [form.watch("discountType")]);

    return (
        <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
            <Card>
                <CardHeader>
                    <CardTitle>Tạo mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
                        <div className="space-y-6">
                            <FormInputControl
                                form={form}
                                name="name"
                                disabled={form.formState.isSubmitting}
                                label="Tên mã giảm giá"
                                require
                            />
                            <FormInputControl
                                form={form}
                                name="code"
                                disabled={form.formState.isSubmitting}
                                label="Mã giảm giá"
                            />
                            <FormSelectControl
                                form={form}
                                name="discountType"
                                classNameInput="h-fit"
                                placeholder="Chọn loại giảm giá"
                                items={[
                                    { id: "Amount", name: "Cố định" },
                                    { id: "Percentage", name: "Phần trăm" },
                                ]}
                                disabled={form.formState.isSubmitting}
                                label="Chọn loại giảm giá"
                                require
                            />
                            {form.watch("discountType") === "Amount" ? (
                                <FormNumberInputControl
                                    form={form}
                                    name="moneyDiscount"
                                    isMoney
                                    disabled={form.formState.isSubmitting}
                                    label="Số tiền giảm"
                                    require
                                />
                            ) : (
                                <div>
                                    <Controller
                                        name="percentDiscount"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                    Số phần trăm giảm
                                                </FormLabel>
                                                <FancySelect
                                                    placeholder="Số phần trăm giảm hoặc nhập mới"
                                                    options={QUANTITY_SELECT}
                                                    onChangeValue={(selectedValues: any) => {
                                                        field.onChange(selectedValues.value);
                                                    }}
                                                    defaultValue={{
                                                        label: form.getValues("percentDiscount") ?? "0",
                                                        value: form.getValues("percentDiscount") ?? "0",
                                                    }}
                                                    isNumber
                                                    unit="%"
                                                />
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                            <div className="grid sm:grid-cols-2 gap-5">
                                <FormDateControl
                                    minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    form={form}
                                    name="startDate"
                                    disabled={form.formState.isSubmitting}
                                    label="Ngày bắt đầu"
                                    require
                                />
                                <FormDateControl
                                    minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    form={form}
                                    name="endDate"
                                    disabled={form.formState.isSubmitting}
                                    label="Ngày kết thúc"
                                    require
                                />
                                <FormNumberInputControl
                                    form={form}
                                    name="minimumOrderAmount"
                                    disabled={form.formState.isSubmitting}
                                    isMoney
                                    label="Đơn hàng tối thiểu"
                                    require
                                />
                                <FormNumberInputControl
                                    form={form}
                                    name="maximumDiscount"
                                    disabled={form.formState.isSubmitting}
                                    isMoney
                                    label="Giảm tối đa"
                                    require
                                />
                                <div>
                                    <Controller
                                        name="quantity"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                                    Số lượng
                                                </FormLabel>
                                                <FancySelect
                                                    placeholder="Số lượng hoặc nhập mới"
                                                    options={QUANTITY_SELECT}
                                                    onChangeValue={(selectedValues: any) => {
                                                        field.onChange(selectedValues.value);
                                                    }}
                                                    defaultValue={{
                                                        label: form.getValues("quantity") ?? "",
                                                        value: form.getValues("quantity") ?? "",
                                                    }}
                                                    isNumber
                                                />
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <FormFileControl
                                form={form}
                                name="image"
                                classNameInput="h-30 w-full"
                                mutiple={false}
                                type={"image/jpeg, image/jpg, image/png, image/webp"}
                                disabled={form.formState.isSubmitting}
                                label="Ảnh mã giảm giá"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ButtonCustomized
                type="submit"
                className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
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
        </FormValues>
    );
}

export default CreateVoucher;
