"use client"
import { sendForgetPassword } from '@/actions/auth';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { DialogFooter } from '@/components/ui/dialog';
import { ForgetPasswordSafeTypes } from '@/zod-safe-types/auth-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { TabType, UserForgetPassword } from './form-forget-password';


interface FormSendForgetPasswordProps {
    setUsername: (values: UserForgetPassword, nameTab: TabType) => void,
    returnButton?: React.ReactNode
}

export const FormSendForgetPassword = ({ setUsername, returnButton }: FormSendForgetPasswordProps) => {
    const [forgetType, setForgetType] = useState<"phone" | "email">("phone");

    const form = useForm<z.infer<typeof ForgetPasswordSafeTypes>>({
        resolver: zodResolver(ForgetPasswordSafeTypes),
        defaultValues: {
            type: "phone"
        }
    });

    const { isPending, mutate: sendForgetPasswordCodeMutation } = useMutation({
        mutationKey: ["ForgetPassword", "Mange"],
        mutationFn: async (data: { email: string | undefined, phone: string | undefined }) => {
            try {

                const response = await sendForgetPassword(data);

                if (!response?.isSuccess) {
                    if (response?.status === 404) {
                        throw new Error("Không tìm thấy tài khoản")
                    }
                    throw new Error(response?.message || "Lỗi hệ thống")
                }
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error.message : "Unknown error");
            }
        },
        onSuccess: () => {
            toast.success("Đã gửi lại mã xác thực")
            const datas = form.getValues();
            setUsername({ email: datas.email, phone: datas.phone, otp: "" }, "verify")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    const onSubmit = async (values: z.infer<typeof ForgetPasswordSafeTypes>) => {
        sendForgetPasswordCodeMutation({ email: values.email, phone: values.phone })
    };

    return (
        <FormValues form={form} onSubmit={onSubmit}>
            <p className="mt-3 w-96 text-center">
                Nhập email hoặc số điện thoại để nhận mã OTP.
            </p>
            {forgetType === "phone" ? (
                <div className="relative">
                    <FormInputControl
                        form={form}
                        name="phone"
                        disabled={isPending}
                        label="Số điện thoại"
                        placeholder="+84..."
                    />
                    <button type="button" disabled={isPending} onMouseDown={() => {
                        setForgetType("email")
                        form.resetField("phone")
                        form.setValue("type", "email")
                    }} className="absolute right-2.5 top-1 font-semibold hover:underline hover:cursor-pointer">Email</button>
                </div>
            ) : (
                <div className="relative">
                    <FormInputControl
                        form={form}
                        name="email"
                        disabled={isPending}
                        label="Email"
                        placeholder="example@mail.com"
                    />
                    <button type="button" disabled={isPending} onMouseDown={() => {
                        setForgetType("phone")
                        form.resetField("email")
                        form.setValue("type", "phone")
                    }} className="absolute right-2.5 top-1 font-bold hover:underline hover:cursor-pointer">Số điện thoại</button>
                </div>
            )}

            <DialogFooter>
                <button disabled={isPending}>
                    {returnButton}
                </button>
                <ButtonCustomized
                    type="submit"
                    className="max-w-fit !h-10 bg-green-500 hover:bg-green-700"
                    variant="secondary"
                    disabled={isPending}
                    label={
                        isPending ? (
                            <WaitingSpinner
                                variant="pinwheel"
                                label="Đang gửi..."
                                className="font-semibold "
                                classNameLabel="font-semibold text-sm"
                            />
                        ) : (
                            "Gửi"
                        )
                    }
                />
            </DialogFooter >
        </FormValues >
    )
}
