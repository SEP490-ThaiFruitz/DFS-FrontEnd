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

const inputOptions = {
    phone: {
        name: "phone",
        label: "Số điện thoại",
        placeholder: "+84...",
        switchTo: "email",
        switchLabel: "Email",
    },
    email: {
        name: "email",
        label: "Email",
        placeholder: "example@mail.com",
        switchTo: "phone",
        switchLabel: "Số điện thoại",
    },
} as const;

type LoginType = keyof typeof inputOptions;

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
    const handleSwitch = (type: LoginType) => {
        const current = inputOptions[type];
        const opposite = inputOptions[current.switchTo];

        form.resetField(opposite.name);
        form.setValue("type", type);
        form.trigger("type");
        setForgetType(type);

        setTimeout(() => {
            const inputElement = document.querySelector(
                `input[name="${current.name}"]`
            ) as HTMLInputElement;
            inputElement?.focus();
        }, 0);
    };

    const current = inputOptions[forgetType];
    return (
        <FormValues form={form} onSubmit={onSubmit}>
            <p className="mt-3 w-96 text-center">
                Nhập email hoặc số điện thoại để nhận mã OTP.
            </p>
            <div className="relative">
                <FormInputControl
                    key={current.name}
                    form={form}
                    name={current.name}
                    disabled={form.formState.isSubmitting}
                    label={current.label}
                    placeholder={current.placeholder}
                />
                <button
                    type="button"
                    onClick={() => handleSwitch(current.switchTo)}
                    className="absolute right-2.5 top-1 font-semibold hover:underline hover:cursor-pointer"
                >
                    {current.switchLabel}
                </button>
            </div>

            <DialogFooter>
                {returnButton}
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
