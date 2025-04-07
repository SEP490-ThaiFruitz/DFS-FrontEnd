"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValues } from '@/components/global-components/form/form-values';
import { formatTimeVietNam } from '@/lib/format-time-vietnam';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { API } from '@/actions/client/api-config';
import { toast } from 'sonner';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { ApiResponse } from '@/types/types';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { UpdateComboSafeTypes } from '@/zod-safe-types/combo-safe-types';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { Combo } from './page';
import { formatVND } from '@/lib/format-currency';
import { ComboItem } from './variant';

interface InformationProps {
    combo: Combo | undefined
}

interface Event {
    id: string;
    name: string;
    image: string,
}


const Information = ({ combo }: Readonly<InformationProps>) => {
    const [isEditing, setIsEditing] = useState(false)
    const { data: events } = useFetch<ApiResponse<Event[]>>("/Events", ["events"])
    const comboTypes = [
        { id: "Fixed", name: "Cố định" },
        { id: "Custom", name: "Tùy chỉnh" },
    ];
    const form = useForm<z.infer<typeof UpdateComboSafeTypes>>({
        resolver: zodResolver(UpdateComboSafeTypes),
        defaultValues: {
            comboId: combo?.id ?? "",
            name: combo?.name ?? "",
            capacity: combo?.capacity.toString() ?? "",
            type: combo?.type ?? "",
            eventId: combo?.eventId ?? "",
            quantity: combo?.quantity.toString() ?? "",
            description: combo?.description ?? ""
        }
    });

    useEffect(() => {
        form.reset({
            comboId: combo?.id ?? "",
            name: combo?.name ?? "",
            capacity: combo?.capacity.toString() ?? "",
            type: combo?.type ?? "",
            eventId: combo?.eventId ?? "",
            quantity: combo?.quantity.toString() ?? "",
            description: combo?.description ?? ""
        })
    }, [combo])

    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof UpdateComboSafeTypes>) => {
        try {
            const currentQuantity = combo?.comboItems?.reduce(
                (total: number, comboItem: ComboItem) => total + (comboItem.quantity || 0),
                0
            ) ?? 0;

            const capacity = Number(values.capacity) || 0;

            if (capacity < currentQuantity) {
                form.setError("capacity", { message: `Số lượng phải lớn hơn ${currentQuantity}` });
                return;
            }
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === "image" && value) {
                    formData.append("image", value[0])
                } else {
                    formData.append(key, String(value))
                }
            })
            const response = await API.update(`/Combos/${combo?.id}`, formData)

            if (response) {
                toast.success("Cập nhật gói quà thành công")
                setIsEditing(false)
                queryClient.invalidateQueries({ queryKey: [combo?.id] })
            } else {
                toast.error("Cập nhật gói quà thất bại")
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <TabsContent value="information">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b-2">
                    <CardTitle>Thông tin gói quà</CardTitle>
                    {!isEditing && !combo?.isLocked && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </Button>
                    )}
                </CardHeader>
                <CardContent className='py-5'>
                    {isEditing ? (
                        <FormValues form={form} onSubmit={onSubmit} classNameForm="grid sm:grid-cols-2 gap-6 sm:gap-20">
                            <div className="space-y-6">
                                <FormInputControl
                                    form={form}
                                    name="name"
                                    disabled={form.formState.isSubmitting}
                                    label="Tên gói quà"
                                    require
                                />
                                <FormNumberInputControl
                                    form={form}
                                    name="capacity"
                                    disabled={form.formState.isSubmitting}
                                    label="Sức chứa"
                                    require
                                />

                                <FormNumberInputControl
                                    form={form}
                                    name="quantity"
                                    disabled={form.formState.isSubmitting}
                                    label="Số lượng"
                                    require
                                />

                                <FormSelectControl
                                    form={form}
                                    name="type"
                                    classNameInput='h-fit'
                                    placeholder='Chọn một loại quà'
                                    items={comboTypes}
                                    disabled={form.formState.isSubmitting}
                                    label="Loại quà"
                                    require
                                />
                                <FormSelectControl
                                    form={form}
                                    name="eventId"
                                    classNameInput='h-fit'
                                    placeholder='Chọn một sự kiện'
                                    items={events?.value?.map((event: Event) => ({
                                        id: event.id,
                                        name: event.name,
                                        thumbnail: event.image
                                    }))}
                                    isImage
                                    disabled={form.formState.isSubmitting}
                                    label="Sự kiện"
                                />
                                <FormTextareaControl
                                    form={form}
                                    name="description"
                                    label="Mô tả"
                                    disabled={form.formState.isSubmitting}
                                    rows={8}
                                    placeholder='Nhập mô tả sản phẩm...'
                                    require
                                />
                            </div>
                            <div className="space-y-6">
                                <FormFileControl
                                    form={form}
                                    name="image"
                                    classNameInput="h-30 w-full"
                                    mutiple={false}
                                    type={"image/jpeg, image/jpg, image/png, image/webp"}
                                    disabled={form.formState.isSubmitting}
                                    label="Ảnh"
                                />
                            </div>
                            {isEditing && (
                                <CardFooter className="flex justify-start gap-2">
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Hủy
                                    </Button>
                                    <ButtonCustomized
                                        type="submit"
                                        className="max-w-fit px-2 !h-10 !rounded-md bg-green-500 hover:bg-green-700"
                                        variant="secondary"
                                        disabled={form.formState.isSubmitting}
                                        label={
                                            form.formState.isSubmitting ? (
                                                <WaitingSpinner
                                                    variant="pinwheel"
                                                    label="Đang cập nhật..."
                                                    className="font-semibold"
                                                    classNameLabel="font-semibold text-sm"
                                                />
                                            ) : (
                                                "Cập nhật"
                                            )
                                        }
                                    />
                                </CardFooter>
                            )}
                        </FormValues>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Tên gói quà:</div>
                                    <div className="text-base font-medium">{combo?.name}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Sức chứa:</div>
                                    <div className="text-base font-medium">{combo?.capacity}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Số lượng:</div>
                                    <div className="text-base font-medium">{combo?.quantity}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Loại quà:</div>
                                    <div className="text-base font-medium">
                                        {combo?.type === "Fixed" ? "Cố định" : "Tùy chỉnh"}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Sự kiện:</div>
                                    <div className="text-base font-medium">
                                        {
                                            events?.value?.find((event: Event) => event.id === combo?.eventId)?.name ?? "—"
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Giá:</div>
                                    <div className="text-lg font-bold">
                                        {formatVND(combo?.price ?? 0)}
                                    </div>
                                </div>
                                {combo?.isCustomer && (
                                    <div className="flex items-center space-x-2">
                                        <div className="font-bold">Khách hàng:</div>
                                        <div className="text-base font-medium">
                                            {combo?.isCustomer ? "Có" : "Không"}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Ngày tạo:</div>
                                    <div className="text-base font-medium">{formatTimeVietNam(new Date(combo?.createdOnUtc ?? "N/A"), true)}</div>
                                </div>
                                {combo?.modifiedOnUtc && (
                                    <div className="flex items-center space-x-2">
                                        <div className="font-bold">Ngày cập nhật:</div>
                                        <div className="text-base font-medium">{formatTimeVietNam(new Date(combo?.modifiedOnUtc ?? "N/A"), true)}</div>
                                    </div>
                                )
                                }
                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Trạng thái:</div>
                                    {combo?.isDeleted ? (
                                        <span className="py-2 p-1 w-fit bg-red-50 text-red-600 rounded-md">
                                            Đã ẩn
                                        </span>
                                    ) : (
                                        <span className="py-2 p-1 w-fit bg-green-50 text-green-600 rounded-md">
                                            Hoạt động
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div className="font-bold">Mô tả:</div>
                                    <div className="text-base">{combo?.description}</div>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <Image
                                    className="max-h-fit object-contain rounded-md"
                                    src={combo?.image ?? "/images/dried-fruit.webp"}
                                    height={400}
                                    width={400}
                                    alt={combo?.name ?? "Combo image"}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent >
    )
}


export default Information