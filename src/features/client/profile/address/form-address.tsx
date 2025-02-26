import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// UI Components
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';

// Custom Components
import { FormValues } from '@/components/global-components/form/form-values';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormSelectControl, SelectData } from '@/components/global-components/form/form-select-control';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';

// Hooks & Utilities
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';

// Types
import { ApiResponse } from '@/types/types';
import { FormAddressSafeTypes } from '@/zod-safe-types/address-safe-types';

interface FormAddressProps {
    address?: {
        id: number;
        name: string;
        tag: string;
        address: string;
        phone: string;
        isDefault: boolean;
    };
    onClose: () => void;
}

const useAddressForm = (address?: FormAddressProps['address']) => {
    const form = useForm<z.infer<typeof FormAddressSafeTypes>>({
        resolver: zodResolver(FormAddressSafeTypes),
        defaultValues: address
            ? {
                tag: address.tag,
                name: address.name,
                phone: address.phone,
                address: address.address,
            }
            : undefined,
    });

    const onSubmit = (values: z.infer<typeof FormAddressSafeTypes>) => {
        console.log(values);
    };

    return { form, onSubmit };
};

function FormAddress({ address, onClose }: Readonly<FormAddressProps>) {
    const { form, onSubmit } = useAddressForm(address);

    const { data: provinces } = useFetch<ApiResponse<SelectData[]>>("/Addresses/province", ["provinces"]);

    const provinceId = form.watch('province');
    const districtId = form.watch('district');

    const { data: districts } = useFetch<ApiResponse<SelectData[]>>(
        `/Addresses/district/${provinceId}`,
        ["districts", provinceId],
        {},
        { enabled: !!provinceId }
    );

    const { data: wards } = useFetch<ApiResponse<SelectData[]>>(
        `/Addresses/${districtId}/ward`,
        ["wards", districtId],
        {},
        { enabled: !!districtId }
    );

    if (!provinces) {
        return (
            <ResizablePanel defaultSize={60} minSize={40} className="p-4 flex justify-center items-center">
                <WaitingSpinner variant="pinwheel" label="Đang tải..." />
            </ResizablePanel>
        );
    }

    const isEditMode = !!address;
    const title = isEditMode ? "Cập nhật địa chỉ người nhận" : "Tạo địa chỉ mới người nhận";
    const submitLabel = isEditMode ? "Cập nhật" : "Tạo mới";
    const submittingLabel = isEditMode ? "Đang cập nhật..." : "Đang tạo mới...";

    return (
        <>
            <ResizableHandle withHandle className="bg-purple-200" />
            <ResizablePanel defaultSize={60} minSize={40} className="p-4">
                <h4 className="text-xl font-semibold mb-6 text-purple-700">{title}</h4>
                <FormValues<z.infer<typeof FormAddressSafeTypes>> form={form} onSubmit={onSubmit}>
                    <div className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-10">
                            <FormInputControl form={form} name="tag" label="Tên thẻ" />
                            <FormInputControl form={form} name="name" label="Tên" />
                            <FormInputControl form={form} name="phone" label="Số điện thoại" />
                            <FormSelectControl
                                form={form}
                                name="province"
                                label="Tỉnh / Thành phố"
                                placeholder="Chọn tỉnh / thành phố"
                                items={provinces?.value}
                            />
                            <FormSelectControl
                                form={form}
                                name="district"
                                label="Quận / Huyện"
                                placeholder="Chọn quận / huyện"
                                items={districts?.value}
                            />
                            <FormSelectControl
                                form={form}
                                name="ward"
                                label="Phường / Xã"
                                placeholder="Chọn phường / xã"
                                items={wards?.value}
                            />
                        </div>
                        <FormTextareaControl form={form} name="address" label="Địa chỉ" />
                        <div className="flex flex-row-reverse justify-between">
                            <Button
                                className="h-10"
                                onClick={() => {
                                    onClose();
                                    form.reset();
                                }}
                                variant="outline"
                            >
                                Đóng
                            </Button>
                            <ButtonCustomized
                                type="submit"
                                className="max-w-32 h-10 rounded-md bg-purple-500 hover:bg-purple-700"
                                variant="secondary"
                                disabled={form.formState.isSubmitting}
                                label={
                                    form.formState.isSubmitting ? (
                                        <WaitingSpinner
                                            variant="pinwheel"
                                            label={submittingLabel}
                                            className="font-semibold"
                                            classNameLabel="font-semibold text-sm"
                                        />
                                    ) : (
                                        submitLabel
                                    )
                                }
                            />
                        </div>
                    </div>
                </FormValues>
            </ResizablePanel>
        </>
    );
}

export default FormAddress;