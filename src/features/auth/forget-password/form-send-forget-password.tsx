"use client"

import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { DialogFooter } from '@/components/ui/dialog';
import { ForgetPasswordSafeTypes } from '@/zod-safe-types/auth-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { TabType, UserForgetPassword } from './form-forget-password';
import { API } from '@/actions/client/api-config';


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

    const onSubmit = async (values: z.infer<typeof ForgetPasswordSafeTypes>) => {
        try {

            const response = await API.post("/Auths/forgot-password", { email: values.email, phone: values.phone });

            if (response) {
                toast.success("Đã gửi lại mã xác thực")
                const datas = form.getValues();
                setUsername({ email: datas.email, phone: datas.phone, otp: "" }, "verify")
            }
        } catch (error) {
            console.log(error)
        }
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
                        disabled={form.formState.isSubmitting}
                        label="Số điện thoại"
                        placeholder="+84..."
                    />
                    <button type="button" disabled={form.formState.isSubmitting} onMouseDown={() => {
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
                        disabled={form.formState.isSubmitting}
                        label="Email"
                        placeholder="example@mail.com"
                    />
                    <button type="button" disabled={form.formState.isSubmitting} onMouseDown={() => {
                        setForgetType("phone")
                        form.resetField("email")
                        form.setValue("type", "phone")
                    }} className="absolute right-2.5 top-1 font-bold hover:underline hover:cursor-pointer">Số điện thoại</button>
                </div>
            )}

            <DialogFooter>
                <button disabled={form.formState.isSubmitting}>
                    {returnButton}
                </button>
                <ButtonCustomized
                    type="submit"
                    className="max-w-fit !h-10 bg-sky-600 hover:bg-sky-700"
                    variant="secondary"
                    disabled={form.formState.isSubmitting}
                    label={
                        form.formState.isSubmitting ? (
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
