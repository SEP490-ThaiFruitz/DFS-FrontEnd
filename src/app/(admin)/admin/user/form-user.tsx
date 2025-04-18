"use client"
import { API } from '@/actions/client/api-config';
import { USER_KEY } from '@/app/key/admin-key';
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
import { useQueryClient } from '@tanstack/react-query';
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

    const onSubmit = async (values: z.infer<typeof FormUserSafeTypes>) => {
        try {
            const { id, confirmPassword, role, ...resetValue } = values
            const response = user ? await API.update("/Users/update-account", { userId: id, role, ...resetValue })
                : await API.post("/Users/create-account", { role, ...resetValue })
            if (response) {
                toast.success(user ? "Cập nhật tài khoản thành công" : "Thêm tài khoản thành công")
                onClose()
                queryClient.invalidateQueries({ queryKey: [USER_KEY.USER] })
            }
        } catch (error) {
            console.log(error)
        }
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
                            disabled={form.formState.isSubmitting}
                            label="Họ và tên"
                            placeholder="Nguyễn Anh Minh"
                        />
                        <FormInputControl
                            form={form}
                            name="phone"
                            disabled={form.formState.isSubmitting}
                            label="Số điện thoại"
                            placeholder="+84..."
                        />
                    </div>
                    <FormInputControl
                        form={form}
                        name="email"
                        disabled={form.formState.isSubmitting}
                        label="Email"
                        placeholder="example@mail.com"
                    />
                    <FormSelectControl
                        form={form}
                        name="role"
                        disabled={form.formState.isSubmitting}
                        label="Vai trò"
                        items={[
                            { id: "Administrator", name: "Quản trị viên" },
                            { id: "Manager", name: "Quản lí" },
                            { id: "Staff", name: "Nhân viên" },
                            { id: "Customer", name: "Khách hàng" },
                        ]}
                    />
                    <Controller
                        name="isActive"
                        control={form.control}
                        disabled={form.formState.isSubmitting}
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
                        disabled={form.formState.isSubmitting}
                        label="Mật Khẩu"
                        placeholder="Nhập mật khẩu"
                    />
                    <FormPassword
                        form={form}
                        name="confirmPassword"
                        disabled={form.formState.isSubmitting}
                        label="Xác Nhận Mật Khẩu"
                        placeholder="Nhập lại mật khẩu"
                    />
                    <SheetFooter className='mt-5'>
                        <ButtonCustomized
                            type="submit"
                            className="min-w-32  w-fit h-10 bg-sky-600 hover:bg-sky-700 text-white hover:font-semibold duration-300 transition mr-auto"
                            variant="secondary"
                            disabled={form.formState.isSubmitting}
                            label={
                                form.formState.isSubmitting ? (
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
