"use client"

import { updateProductNutrition } from '@/actions/product'
import { FancyMultiSelect } from '@/components/custom/_custom_select/multi-select'
import { FancySelect } from '@/components/custom/_custom_select/select'
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Spinner } from '@/components/global-components/spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { formatNumberWithUnit } from '@/lib/format-currency'
import { FromNutritionSafeTypes } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface NutriontionHeaderProps {
    productId: string,
    id: string | undefined;
    servingSize: number,
    ingredients: string[],
}

const NutriontionHeader = ({ productId, servingSize, ingredients, id }: Readonly<NutriontionHeaderProps>) => {
    const [isHeaderEditing, setIsHeaderEditing] = useState(false)
    const ingredientsSelect = [
        {
            value: "Đường",
            label: "Đường",
        },
        {
            value: "Muối",
            label: "Muối",
        },
        {
            value: "Chất bảo quản (E220 - SO2)",
            label: "Chất bảo quản (E220 - SO2)",
        },
        {
            value: "Hương tự nhiên",
            label: "Hương tự nhiên",
        },
        {
            value: "Màu thực phẩm",
            label: "Màu thực phẩm",
        },
        {
            value: "Chất làm dẻo",
            label: "Chất làm dẻo",
        },
        {
            value: "Chất tạo ngọt",
            label: "Chất tạo ngọt",
        },
        {
            value: "Chất chống oxy hóa",
            label: "Chất chống oxy hóa",
        },
        {
            value: "Chất chống mốc",
            label: "Chất chống mốc",
        },
        {
            value: "Hương liệu tổng hợp",
            label: "Hương liệu tổng hợp",
        },
        {
            value: "Tinh bột",
            label: "Tinh bột",
        },
        {
            value: "Chất tạo xốp",
            label: "Chất tạo xốp",
        },
        {
            value: "Nước",
            label: "Nước",
        },
        {
            value: "Chất làm mượt",
            label: "Chất làm mượt",
        },
        {
            value: "Chất nhũ hóa",
            label: "Chất nhũ hóa",
        },
        {
            value: "Chất tạo kết dính",
            label: "Chất tạo kết dính",
        },
        {
            value: "Chất bảo vệ",
            label: "Chất bảo vệ",
        },
        {
            value: "Giấm",
            label: "Giấm",
        },
        {
            value: "Gia vị",
            label: "Gia vị",
        },
        {
            value: "Hạt giống",
            label: "Hạt giống",
        }
    ];
    const queryClient = useQueryClient();

    const handleHeaderEdit = () => {
        setIsHeaderEditing(!isHeaderEditing)
    }

    const form = useForm<z.infer<typeof FromNutritionSafeTypes>>({
        resolver: zodResolver(FromNutritionSafeTypes),
        defaultValues: {
            productId: productId,
            ingredients: ingredients?.reduce((ingredients: { label: string, value: string }[], ingredient) => {
                ingredients.push({
                    label: ingredient,
                    value: ingredient
                });
                return ingredients;
            }, []) ?? [],
            servingSize: servingSize.toString() ?? "0"
        }
    });
    const onSubmit = async (values: z.infer<typeof FromNutritionSafeTypes>) => {
        updateNutritionMutation(values)
    }

    const { mutate: updateNutritionMutation, isPending } = useMutation({
        mutationFn: async (values: any) => {
            try {
                const response = await updateProductNutrition({
                    ...values,
                    ingredients: values.ingredients.map((ingredient: any) => ingredient.value)
                }, productId)
                if (!response?.isSuccess) {
                    throw new Error(id ? "Cập nhật thất bại" : "Thêm mới thất bại")
                }
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống")
            }
        },
        onSuccess: () => {
            toast.success(id ? "Cập nhật thành công" : "Thêm mới thành công")
            queryClient.invalidateQueries({ queryKey: ["detail-mange", productId] })
            handleHeaderEdit();
        },
        onError: (error) => {
            toast.error(error?.message)
        }
    })
    const selectDataList: { label: string, value: string }[] = Array.from({ length: 10 }, (_, index) => ({
        label: `${index * 10}`,
        value: `${index * 10}`
    }));

    return (
        <CardHeader className='border-b-2'>
            <div className="flex justify-between items-center">
                <CardTitle>Thông Tin Dinh Dưỡng</CardTitle>
                {!isHeaderEditing && (
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleHeaderEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {isHeaderEditing ? (
                <FormValues form={form} onSubmit={onSubmit}>
                    <Controller
                        name="servingSize"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="pt-8">
                                <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                    Khối lượng khẩu phần
                                </FormLabel>
                                <FancySelect
                                    placeholder='Chọn khối lượng khẩu phần hoặc nhập mới'
                                    options={selectDataList}
                                    onChangeValue={(selectedValues: any) => {
                                        field.onChange(selectedValues.value)
                                    }}
                                    defaultValue={{
                                        label: form.getValues("servingSize"),
                                        value: form.getValues("servingSize")
                                    }}
                                    unit='g'
                                />
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />
                    <Controller
                        name="ingredients"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <FormItem className="pt-8">
                                <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                    Thành phần
                                </FormLabel>
                                <FancyMultiSelect
                                    placeholder='Chọn thành phần sản phẩm hoặc nhập mới'
                                    options={ingredientsSelect}
                                    onChangeValue={(selectedValues) => {
                                        field.onChange(selectedValues)
                                    }}
                                    defaultValues={form.getValues("ingredients")}
                                />
                                <FormMessage>{fieldState.error?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                        >
                            {isPending ? <Spinner /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isPending}
                            onClick={handleHeaderEdit}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </FormValues>
            ) : (
                <div className="text-sm text-muted-foreground">
                    Khối lượng khẩu phần: {servingSize}g<br />
                    Thành phần: <div className='space-x-2'>
                        {ingredients?.map((ingredient: any) => <Badge className='mb-3' variant={"outline"} key={ingredient}>
                            {ingredient}
                        </Badge>)}
                    </div>
                </div>
            )}
        </CardHeader>
    )
}

export default NutriontionHeader