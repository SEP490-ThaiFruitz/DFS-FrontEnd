"use client"

import { FancyMultiSelect } from '@/components/custom/_custom_select/multi-select'
import { FancySelect } from '@/components/custom/_custom_select/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { INGREDIENTS_SELECT, QUANTITY_SELECT } from '@/features/admin/admin-lib/admin-lib'
import { formatNumberWithUnit } from '@/lib/format-currency'
import { CreateProductNutritionSafeTypes } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

interface NutriontionHeaderProps {
    formProduct: UseFormReturn<any>
}

const NutriontionHeader = ({ formProduct }: Readonly<NutriontionHeaderProps>) => {
    const [isHeaderEditing, setIsHeaderEditing] = useState(false)


    const handleHeaderEdit = () => {
        setIsHeaderEditing(!isHeaderEditing)
    }

    const form = useForm<z.infer<typeof CreateProductNutritionSafeTypes>>({
        resolver: zodResolver(CreateProductNutritionSafeTypes),
        defaultValues: {
            ingredients: [],
            servingSize: "",
        }
    });
    const onSubmit = async (values: z.infer<typeof CreateProductNutritionSafeTypes>) => {
        formProduct.setValue("ingredients", values.ingredients)
        formProduct.setValue("servingSize", values.servingSize)
        setIsHeaderEditing(false)
    }

    return (
        <CardHeader className='border-b-2'>
            <div className="flex justify-between items-center">
                <CardTitle>Thông Tin Dinh Dưỡng</CardTitle>
                {!isHeaderEditing && (
                    <Button
                        size="sm"
                        variant="outline"
                        type='button'
                        onClick={handleHeaderEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {isHeaderEditing ? (
                <div className='pt-4'>
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
                                        isNumber
                                        unit='g'
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
                                        defaultValues={formProduct.getValues("ingredients")}
                                    />
                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Button
                            size="sm"
                            variant="outline"
                            type='button'
                            onClick={form.handleSubmit(onSubmit)}
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            type='button'
                            onClick={handleHeaderEdit}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">
                    Khối lượng khẩu phần: {`${formatNumberWithUnit(formProduct.getValues("servingSize"), "g")}`}<br />
                    Thành phần: <div className='space-x-2'>
                        {formProduct.getValues("ingredients")?.map((ingredient: any) => <Badge className='mb-3' variant={"outline"} key={ingredient.value}>
                            {ingredient.value}
                        </Badge>)}
                    </div>
                </div>
            )}
        </CardHeader>
    )
}

export default NutriontionHeader