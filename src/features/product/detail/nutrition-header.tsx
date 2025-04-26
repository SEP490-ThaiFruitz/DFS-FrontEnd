"use client"

import { API } from '@/actions/client/api-config'
import { PRODUCT_KEY } from '@/app/key/comm-key'
import { FancyMultiSelect } from '@/components/custom/_custom_select/multi-select'
import { FancySelect } from '@/components/custom/_custom_select/select'
import { FormValues } from '@/components/global-components/form/form-values'
import { Spinner } from '@/components/global-components/spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { INGREDIENTS_SELECT, QUANTITY_SELECT } from '@/features/admin/admin-lib/admin-lib'
import { FromNutritionSafeTypes } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Check, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface NutriontionHeaderProps {
    productId: string,
    id: string | undefined;
    servingSize: number,
    calories: number | undefined,
    ingredients: string[],
}

const NutriontionHeader = ({ productId, servingSize, ingredients, id, calories }: Readonly<NutriontionHeaderProps>) => {
    const [isHeaderEditing, setIsHeaderEditing] = useState(false)
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
        try {
            const response = await API.update(`/Products/products/${productId}/nutrition`, {
                ...values,
                ingredients: values.ingredients.map((ingredient: any) => ingredient.value)
            })
            if (response) {
                toast.success(id ? "Cập nhật thành công" : "Thêm mới thành công")
                queryClient.invalidateQueries({ queryKey: [PRODUCT_KEY.PRODUCT_DETAIL_MANAGE, productId] })
                handleHeaderEdit();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <CardHeader className='border-b-2'>
            <div className="flex justify-between items-center">
                <CardTitle>Thông Tin Dinh Dưỡng</CardTitle>
                {!isHeaderEditing && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleHeaderEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {isHeaderEditing ? (
                <FormValues form={form} onSubmit={onSubmit}>
                    <div>
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
                                        options={QUANTITY_SELECT}
                                        onChangeValue={(selectedValues: any) => {
                                            field.onChange(selectedValues.value)
                                        }}
                                        defaultValue={{
                                            label: form.getValues("servingSize"),
                                            value: form.getValues("servingSize")
                                        }}
                                        unit='g'
                                        isNumber
                                    />
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="ingredients"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="text-text-foreground after:content-['*'] after:text-red-500 after:ml-1">
                                        Thành phần
                                    </FormLabel>
                                    <FancyMultiSelect
                                        placeholder='Chọn thành phần sản phẩm hoặc nhập mới'
                                        options={INGREDIENTS_SELECT}
                                        onChangeValue={(selectedValues) => {
                                            field.onChange(selectedValues)
                                        }}
                                        defaultValues={form.getValues("ingredients")}
                                    />
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? <Spinner /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={form.formState.isSubmitting}
                            onClick={handleHeaderEdit}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </FormValues>
            ) : (
                <div className='flex justify-between items-center'>
                    <div className="text-sm text-muted-foreground">
                        Khối lượng khẩu phần: {servingSize}g<br />
                        Thành phần: <div className='space-x-2'>
                            {ingredients?.map((ingredient: any) => <Badge className='mb-3' variant={"outline"} key={ingredient}>
                                {ingredient}
                            </Badge>)}
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        Calories: <div className='font-bold text-xl'>{calories}</div> kcal
                    </div>
                </div>
            )}
        </CardHeader>
    )
}

export default NutriontionHeader