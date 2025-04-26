import { API } from '@/actions/client/api-config'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FormPassword } from '@/components/global-components/form/form-password'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { UpdatePasswordSafeTypes } from '@/zod-safe-types/auth-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function ProfilePassword() {
    const form = useForm<z.infer<typeof UpdatePasswordSafeTypes>>({
        resolver: zodResolver(UpdatePasswordSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof UpdatePasswordSafeTypes>) => {
        try {
            const res = await API.update("/Auths/change-password", {
                oldPassword: values.oldPassword,
                newPassword: values.newPassword,
            });
            if (res) {
                toast.success("Cập nhật mẩu khẩu thành công")
                form.reset({
                    oldPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                });
            }
        } catch (error) {
            console.log(error)
        }
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
                    disabled={form.formState.isSubmitting}
                />
                <FormPassword
                    form={form}
                    name='newPassword'
                    label='Mật khẩu mới'
                    disabled={form.formState.isSubmitting}
                />
                <FormPassword
                    form={form}
                    name='confirmNewPassword'
                    label='Xác nhận mật khẩu mới'
                    disabled={form.formState.isSubmitting}
                />
                <ButtonCustomized
                    disabled={form.formState.isSubmitting}
                    type='submit'
                    label={
                        form.formState.isSubmitting ? (
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