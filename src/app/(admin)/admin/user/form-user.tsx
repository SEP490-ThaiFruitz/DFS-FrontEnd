"use client"
import { createUser, updateUser } from '@/actions/user';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormPassword } from '@/components/global-components/form/form-password';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { FormControl, FormItem } from '@/components/ui/form';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch';
import { FormUserSafeTypes } from '@/zod-safe-types/user-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface FormUserProps {
    user?: {
        id: string;
        email: string;
        phone: string;
        name: string;
        isActive: boolean;
        role: string;
    };
    isOpen: boolean;
    onClose: () => void;
}

const FormUser = ({
    user,
    isOpen,
    onClose
}: Readonly<FormUserProps>) => {
    const form = useForm<z.infer<typeof FormUserSafeTypes>>({
        resolver: zodResolver(FormUserSafeTypes),
        defaultValues: {
            id: user?.id,
            email: user?.email,
            phone: user?.phone,
            name: user?.name,
            isActive: user?.isActive,
            role: user?.role,
        }
    });
    const queryClient = useQueryClient();
    const { mutate: formUserMutation, isPending } = useMutation({
        mutationFn: async (values: any) => {
            try {
                const { id, confirmPassword, role, ...resetValue } = values
                const response = user ? await updateUser({ userId: id, ...resetValue }) : await createUser({role, ...resetValue})
                if (!response?.isSuccess) {
                    if (response?.status === 404) {
                        throw new Error("Ko tìm thấy tài khoản")
                    }
                    if (response?.detail.includes("Email")) {
                        throw new Error("Email đã tồn tại. Vui lòng đăng nhập")
                    }
                    if (response?.detail.includes("Phone")) {
                        throw new Error("Số điện thoại đã tồn tại. Vui lòng đăng nhập")
                    }
                    throw new Error("Lỗi hệ thống")
                }
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống")
            }
        },
        onSuccess: () => {
            toast.success(user ? "Cập nhật tài khoản thành công" : "Thêm tài khoản thành công")
            onClose()
            queryClient.invalidateQueries({ queryKey: ["Users"] })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const onSubmit = async (values: z.infer<typeof FormUserSafeTypes>) => {
        formUserMutation(values)
    };

    const title = (
        <div className="text-center">
            {user ? "Cập nhật tài khoản" : "Thêm tài khoản"}
        </div>
    );

    const buttonLabel = user ? "Cập nhật" : "Thêm mới";
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className='min-w-fit'>
                <SheetHeader className='mb-4'>
                    <SheetTitle>{title}</SheetTitle>
                </SheetHeader>
                <FormValues form={form} onSubmit={onSubmit}>
                    <div className='grid grid-cols-2 space-x-5'>
                        <FormInputControl
                            form={form}
                            name="name"
                            disabled={isPending}
                            label="Họ và tên"
                            placeholder="Nguyễn Anh Minh"
                        />
                        <FormInputControl
                            form={form}
                            name="phone"
                            disabled={isPending}
                            label="Số điện thoại"
                            placeholder="+84..."
                        />
                    </div>
                    <FormInputControl
                        form={form}
                        name="email"
                        disabled={isPending}
                        label="Email"
                        placeholder="example@mail.com"
                    />
                    <FormSelectControl
                        form={form}
                        name="role"
                        disabled={isPending}
                        label="Vai trò"
                        items={[
                            { id: "Administrator", name: "Quản trị viên" },
                            { id: "Mangager", name: "Quản lí" },
                            { id: "Staff", name: "Nhân viên" },
                            { id: "Customer", name: "Khách hàng" },
                        ]}
                    />
                    <Controller
                        name="isActive"
                        control={form.control}
                        disabled={isPending}
                        defaultValue={user?.isActive ?? false}
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between">
                                <p className="text-sm font-medium">Trạng thái</p>
                                <FormControl>
                                    <Switch
                                        className={`${field.value ? "!bg-green-500" : "!bg-red-500"}`}
                                        checked={field.value ?? false}
                                        onCheckedChange={(checked) => field.onChange(checked)}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormPassword
                        form={form}
                        name="password"
                        disabled={isPending}
                        label="Mật Khẩu"
                        placeholder="Nhập mật khẩu"
                    />
                    <FormPassword
                        form={form}
                        name="confirmPassword"
                        disabled={isPending}
                        label="Xác Nhận Mật Khẩu"
                        placeholder="Nhập lại mật khẩu"
                    />
                    <SheetFooter className='mt-5'>
                        <ButtonCustomized
                            type="submit"
                            className="w-fit h-10 bg-green-700 hover:bg-green-800 text-white hover:font-semibold duration-300 transition mr-auto"
                            variant="secondary"
                            disabled={isPending}
                            label={
                                isPending ? (
                                    <WaitingSpinner
                                        variant="pinwheel"
                                        label={`Đang ${buttonLabel.toLocaleLowerCase()} ...`}
                                        className="font-semibold "
                                        classNameLabel="font-semibold text-sm"
                                    />
                                ) : buttonLabel}
                        />
                    </SheetFooter>
                </FormValues>
            </SheetContent>
        </Sheet>
    )
}

export default FormUser
