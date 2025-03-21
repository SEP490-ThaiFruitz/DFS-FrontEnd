"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { Promotion } from './page'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { FormDateControl } from '@/components/global-components/form/form-date-control';
import { FormFileControl } from '@/components/global-components/form/form-file-control';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdatePromotionSafeTypes } from '@/zod-safe-types/promotion-safe-types';
import { FormValues } from '@/components/global-components/form/form-values';
import { formatTimeVietNam } from '@/lib/format-time-vietnam';
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { API } from '@/actions/client/api-config';
import { toast } from 'sonner';

interface InformationProps {
    promotion: Promotion | undefined
}

const Information = ({ promotion }: Readonly<InformationProps>) => {
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<z.infer<typeof UpdatePromotionSafeTypes>>({
        resolver: zodResolver(UpdatePromotionSafeTypes),
    });
    const queryClient = useQueryClient();
    const onSubmit = async (values: z.infer<typeof UpdatePromotionSafeTypes>) => {
        try {
            const formData = new FormData();
            formData.append("id", promotion?.promotionId ?? "");
            formData.append("name", values.name);
            formData.append("percentage", values.percentage);
            formData.append("description", values.description);
            if (values.image) {
                formData.append("image", values.image[0]);
            }
            const response = await API.update("/Promotions", formData)

            if (response) {
                toast.success("Cập nhật khuyến mãi thành công")
                setIsEditing(false)
                queryClient.invalidateQueries({ queryKey: [promotion?.promotionId] })
            } else {
                toast.error("Cập nhật khuyến mãi thất bại")
            }
        } catch (error) {
            console.log({ error });
        }
    };

    return (
        <TabsContent value="information">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between border-b-2">
                    <CardTitle>Thông tin khuyến mãi</CardTitle>
                    {!isEditing && (
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
                                    form={form} name="name"
                                    disabled={form.formState.isSubmitting}
                                    label="Tên"
                                    defaultValue={promotion?.name}
                                    require
                                />

                                <FormNumberInputControl
                                    form={form}
                                    name="percentage"
                                    disabled={form.formState.isSubmitting}
                                    label="Phần trăm"
                                    unit="%"
                                    defaultValue={promotion?.percentage.toString()}
                                    require
                                />

                                <FormTextareaControl
                                    form={form}
                                    name="description"
                                    disabled={form.formState.isSubmitting}
                                    label="Mô tả"
                                    defaultValue={promotion?.description}
                                    require
                                />

                                <div className="grid xl:grid-cols-2 gap-5">
                                    <FormDateControl
                                        form={form}
                                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                        name="startDate"
                                        mode="single"
                                        disabled
                                        label="Ngày bắt đầu"
                                        defaultValue={new Date(promotion?.startDate ?? "")}
                                        require
                                    />
                                    <FormDateControl
                                        form={form}
                                        name="endDate"
                                        mode="single"
                                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                        disabled
                                        label="Ngày kết thúc"
                                        defaultValue={new Date(promotion?.endDate ?? "")}
                                        require
                                    />
                                </div>
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
                                    <div className="font-bold">Tên khuyến mãi:</div>
                                    <div className="text-base">{promotion?.name}</div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Phần trăm giảm giá:</div>
                                    <div className="text-base">{promotion?.percentage}%</div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Mô tả:</div>
                                    <div className="text-base">{promotion?.description}</div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Ngày bắt đầu:</div>
                                    <span>{formatTimeVietNam(new Date(promotion?.startDate ?? "N/A"), true)}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Ngày kết thúc:</div>
                                    <span>{formatTimeVietNam(new Date(promotion?.endDate ?? "N/A"), true)}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="font-bold">Ngày tạo:</div>
                                    <div className="text-base">{formatTimeVietNam(new Date(promotion?.createdOnUtc ?? "N/A"), true)}</div>
                                </div>
                                {promotion?.modifiedOnUtc && (
                                    <div className="flex items-center space-x-2">
                                        <div className="font-bold">Ngày sửa:</div>
                                        <div className="text-base">{formatTimeVietNam(new Date(promotion?.modifiedOnUtc ?? "N/A"), true)}</div>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <span className="font-bold">Trạng thái:</span>
                                    {promotion?.isDeleted ? (
                                        <span className="py-2 p-1 w-fit bg-red-300 text-red-600 rounded-md">
                                            Đã ẩn
                                        </span>
                                    ) : (
                                        <span className="py-2 p-1 w-fit bg-green-300 text-green-600 rounded-md">
                                            Hoạt động
                                        </span>
                                    )}
                                </div>

                            </div>

                            <div className="flex flex-col items-center justify-center">
                                <Image
                                    className="max-h-fit object-contain rounded-md"
                                    src={promotion?.image ?? "/images/dried-fruit.webp"}
                                    height={400}
                                    width={400}
                                    alt={promotion?.name ?? "Promotion image"}
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