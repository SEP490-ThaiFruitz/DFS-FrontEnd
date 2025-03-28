"use client"

import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumberWithUnit } from '@/lib/format-currency'
import { CreateProductNutritionSafeTypes } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
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
            ingredients: "",
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
                        variant="ghost"
                        type='button'
                        onClick={handleHeaderEdit}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </div>
            {isHeaderEditing ? (
                <>
                    <div className='grid sm:grid-cols-2 mt-2 items-start gap-5'>
                        <FormNumberInputControl
                            form={form}
                            name="servingSize"
                            label='Khối lượng khẩu phần'
                            require
                            unit='g'
                        />
                        <FormTextareaControl
                            form={form}
                            name="ingredients"
                            label='Thành phần'
                            require
                        />
                    </div>
                    <div className="flex gap-2">
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
                </>
            ) : (
                <div className="text-sm text-muted-foreground">
                    Khối lượng khẩu phần: {formProduct.getValues("ingredients")} g<br />
                    Thành phần: {`${formatNumberWithUnit(formProduct.getValues("servingSize"))} g`}
                </div>
            )}
        </CardHeader>
    )
}

export default NutriontionHeader