"use client"
import { updateProfile } from '@/actions/user'
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized'
import { FormDateControl } from '@/components/global-components/form/form-date-control'
import { FormInputControl } from '@/components/global-components/form/form-input-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { WaitingSpinner } from '@/components/global-components/waiting-spinner'
import { FormControl, FormItem } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'
import { Profile } from '@/types/types'
import { ProfileSafeTypes } from '@/zod-safe-types/user-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { RadioGroup } from '@radix-ui/react-radio-group'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

function InformationPersonal() {
    const { data: user } = useQuery<Profile>({
        queryKey: ["authUser"]
    });
    const queryClient = useQueryClient();
    const { mutate: updateProfileMutation, isPending } = useMutation({
        mutationFn: async (values: FormData) => {
            try {
                const res = await updateProfile(values);
                if (!res?.isSuccess) {
                    if (res?.status === 409) {
                        if (res?.detail.includes("phone")) {
                            throw new Error("Số điện thoại đã tồn tại")
                        }
                        throw new Error("Email đã tồn tại")
                    }
                    throw new Error(res?.detail === "Invalid old password" ? "Mật khẩu cũ không đúng" : res?.message)
                }
            } catch (error: any) {
                throw new Error(error?.message ?? "Lỗi hệ thống")
            }
        },
        onSuccess: () => {
            toast.success("Cập nhật thông tin thành công")
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const form = useForm<z.infer<typeof ProfileSafeTypes>>({
        resolver: zodResolver(ProfileSafeTypes),
    });

    const onSubmit = async (values: z.infer<typeof ProfileSafeTypes>) => {
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('phone', values.phone);
        formData.append('email', values.email);
        formData.append('birthday', values.birthday.toDateString());
        formData.append('gender', values.gender);

        updateProfileMutation(formData)
    };
    return (
        <>
            <h4 className="text-xl font-semibold mb-6 text-purple-700">
                Thông tin cá nhân
            </h4>
            <FormValues form={form} onSubmit={onSubmit} classNameForm="space-y-2">
                <div className='grid sm:grid-cols-2 gap-10'>
                    <FormInputControl
                        name='name'
                        form={form}
                        disabled={isPending}
                        label='Họ và tên'
                        defaultValue={user?.name}
                    />
                    <FormInputControl
                        name='phone'
                        form={form}
                        disabled={isPending}
                        label='Số điện thoại'
                        defaultValue={user?.phone}
                    />
                    <FormInputControl
                        name='email'
                        form={form}
                        disabled={isPending}
                        label='Email'
                        defaultValue={user?.email}
                    />
                    <FormDateControl
                        maxDate={new Date(new Date().setHours(0, 0, 0, 0))}
                        name='birthday'
                        form={form}
                        disabled={isPending}
                        label='Ngày sinh nhật'
                        defaultValue={user?.birthday}
                        require
                    />
                </div>
                <Controller
                    name="gender"
                    control={form.control}
                    defaultValue={user?.gender}
                    render={({ field }) => (
                        <FormItem className="grid sm:grid-cols-2 items-center justify-between gap-2 py-5">
                            <p className="text-sm font-medium">Giới tính</p>
                            <FormControl className="grid sm:grid-cols-3 gap-3 sm:gap-10">
                                <RadioGroup
                                    onValueChange={(e) => field.onChange(e)}
                                    defaultValue={user?.gender}
                                >
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <RadioGroupItem value="Male" id="r1" />
                                        <Label htmlFor="r1">Nam</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <RadioGroupItem value="Female" id="r2" />
                                        <Label htmlFor="r2">Nữ</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 cursor-pointer">
                                        <RadioGroupItem value="Other" id="r3" />
                                        <Label htmlFor="r3">Khác</Label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
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
                            <>
                                Lưu thay đổi <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                        )
                    }
                    className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                />
            </FormValues >
        </>
    )
}

export default InformationPersonal