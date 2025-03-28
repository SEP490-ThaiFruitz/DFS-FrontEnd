"use client"

import { updateProductNutrition } from '@/actions/product'
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control'
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Spinner } from '@/components/global-components/spinner'
import { Button } from '@/components/ui/button'
import { CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumberWithUnit } from '@/lib/format-currency'
import { FromNutritionSafeTypes } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface NutriontionHeaderProps {
    productId: string,
    id: string | undefined;
    servingSize: number,
    ingredients: string,
}

const NutriontionHeader = ({ productId, servingSize, ingredients, id }: Readonly<NutriontionHeaderProps>) => {
    const [isHeaderEditing, setIsHeaderEditing] = useState(false)

    const queryClient = useQueryClient();

    const handleHeaderEdit = () => {
        setIsHeaderEditing(!isHeaderEditing)
    }

    const form = useForm<z.infer<typeof FromNutritionSafeTypes>>({
        resolver: zodResolver(FromNutritionSafeTypes),
        defaultValues: {
            productId: productId,
            ingredients: ingredients ?? "",
            servingSize: servingSize.toString() ?? "0"
        }
    });
    const onSubmit = async (values: z.infer<typeof FromNutritionSafeTypes>) => {
        updateNutritionMutation(values)
    }

    const { mutate: updateNutritionMutation, isPending } = useMutation({
        mutationFn: async (values: any) => {
            try {
                const response = await updateProductNutrition(values, productId)
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
                    <div className='grid sm:grid-cols-2 mt-2 items-start gap-5'>
                        <FormNumberInputControl
                            form={form}
                            disabled={isPending}
                            name="servingSize"
                            label='Khối lượng khẩu phần'
                            require
                            unit='g'
                        />
                        <FormTextareaControl
                            form={form}
                            disabled={isPending}
                            name="ingredients"
                            label='Thành phần'
                            require
                        />
                    </div>
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
                    Thành phần: {formatNumberWithUnit(ingredients)}
                </div>
            )}
        </CardHeader>
    )
}

export default NutriontionHeader