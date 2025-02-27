import { updatePassword } from '@/actions/user'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormPassword } from '@/components/global-components/form/form-password'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { UpdatePasswordSafeTypes } from '@/zod-safe-types/auth-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Lock } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function ProfilePassword() {
    const { mutate: updatePasswordMutation, isPending } = useMutation({
        mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string, newPassword: string }) => {
            try {
                const res = await updatePassword({ oldPassword, newPassword });
                if (!res?.isSuccess) {
                    throw new Error(res?.detail === "Invalid old password" ? "Mật khẩu cũ không đúng" : res?.message)
                }
            } catch (error: any) {
                throw new Error(error?.message ?? "Lỗi hệ thống")
            }
        },
        onSuccess: () => {
            toast.success("Cập nhật mẩu khẩu thành công")
            form.reset({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const form = useForm<z.infer<typeof UpdatePasswordSafeTypes>>({
        resolver: zodResolver(UpdatePasswordSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof UpdatePasswordSafeTypes>) => {
        updatePasswordMutation(values)
    };
    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-2 flex items-center gap-2 text-purple-700">
                <Lock className="h-5 w-5" /> Thay đổi mật khẩu
            </h4>
            <FormValues form={form} onSubmit={onSubmit}>
                <FormPassword
                    form={form}
                    name='oldPassword'
                    label='Mật khẩu cũ'
                    disabled={isPending}
                />
                <FormPassword
                    form={form}
                    name='newPassword'
                    label='Mật khẩu mới'
                    disabled={isPending}
                />
                <FormPassword
                    form={form}
                    name='confirmNewPassword'
                    label='Xác nhận mật khẩu mới'
                    disabled={isPending}
                />
                <ButtonCustomized
                    disabled={isPending}
                    type='submit'
                    label={
                        isPending ? (
                            <WaitingSpinner
                                variant="pinwheel"
                                label="Đang cập nhật..."
                                className="font-semibold "
                                classNameLabel="font-semibold text-sm"
                            />
                        ) : (
                            "Cập nhật mật khẩu"
                        )
                    }
                    className="w-full"
                />
            </FormValues>
        </div>
    )
}

export default ProfilePassword