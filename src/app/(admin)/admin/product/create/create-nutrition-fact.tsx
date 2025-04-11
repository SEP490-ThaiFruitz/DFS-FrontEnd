"use client";

import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { FancySelect } from '@/components/custom/_custom_select/select';
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { FormItem, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { QUANTITY_SELECT } from '@/features/admin/admin-lib/admin-lib';
import { formatNumberWithUnit } from '@/lib/format-currency';
import { ApiResponse } from '@/types/types';
import { FromNutrionFact } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, CirclePlusIcon, Pencil, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export interface NutritionFact {
    nutritionFactId: number;
    amount: number;
    nutrientId: number;
}

interface NutritionFactProps {
    formProduct: UseFormReturn<any>
}

interface Nutrient {
    id: number;
    name: string;
    unit: string;
}

const NutritionFact = ({ formProduct }: Readonly<NutritionFactProps>) => {
    const { data: nutritions } = useFetch<ApiResponse<Nutrient[]>>("/Products/products/nutrients")
    const [nutritionFacts, setNutritionFacts] = useState<NutritionFact[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const form = useForm<z.infer<typeof FromNutrionFact>>({
        resolver: zodResolver(FromNutrionFact),
    });



    useEffect(() => {
        const nutritionFacts = formProduct.getValues("nutritionFacts");
        if (nutritionFacts) {
            setNutritionFacts(nutritionFacts);
        }
    }, [formProduct.getValues("nutritionFacts")]);

    const handleEdit = (fact: NutritionFact) => {
        setEditingId(fact.nutritionFactId)
        form.setValue("nutritionFactId", fact?.nutritionFactId?.toString());
        form.setValue("amount", fact?.amount.toString())
        form.setValue("nutrientId", fact?.nutrientId.toString() ?? "1")
        handleUnit();
    }


    const onSubmit = async (values: z.infer<typeof FromNutrionFact>) => {
        const { amount, nutrientId, nutritionFactId } = values;
        const createNutritionFacts = formProduct.getValues("nutritionFacts");
        const nutritionFactIndex = createNutritionFacts.findIndex((fact: any) => fact.nutrientId == nutrientId);

        if (nutritionFactIndex !== -1) {
            createNutritionFacts[nutritionFactIndex] = { amount, nutrientId, nutritionFactId }
        } else {
            formProduct.setValue("nutritionFacts", [...createNutritionFacts, { amount, nutrientId, nutritionFactId }])
        }
        form.reset();
        setEditingId(null)
    }

    const handleCancel = () => {
        setEditingId(null)
        setNutritionFacts(nutritionFacts.filter((f: NutritionFact) => f.nutritionFactId !== 0))
    }

    const handleUnit = () => {
        const nutritionId: string = form.getValues("nutrientId");
        return nutritions?.value?.find((nutrition: Nutrient) => nutrition.id.toString() == nutritionId)?.unit
    }

    const handleAddNew = () => {
        const newNutritionFact: NutritionFact = {
            nutritionFactId: nutritionFacts.length + 1,
            amount: 0,
            nutrientId: 1
        }
        setNutritionFacts([...nutritionFacts, newNutritionFact])
        handleEdit(newNutritionFact)
    }
    const handleRemoveFact = (fact: NutritionFact) => {
        const values = formProduct.getValues("nutritionFacts");
        formProduct.setValue("nutritionFacts", values.filter((f: any) => f.nutrientId != fact.nutrientId))
    }

    return (
        <CardContent className='p-2'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50%]">Dinh dưỡng</TableHead>
                        <TableHead>Hàm lượng</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {nutritionFacts?.map((fact: NutritionFact) =>
                        editingId === fact.nutritionFactId ? (
                            <TableRow key={`edit-${fact.nutritionFactId}`}>
                                <TableCell className="font-medium">
                                    <FormSelectControl
                                        form={form}
                                        name="nutrientId"
                                        defaultValue={fact?.nutrientId.toString() ?? 1}
                                        items={nutritions?.value
                                            ?.filter(item =>
                                                item.id !== fact?.nutrientId ||
                                                !nutritionFacts.some(fact => fact.nutrientId !== item.id)
                                            )
                                            .map(item => ({
                                                id: item.id,
                                                name: item.name,
                                            }))}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Controller
                                        name="amount"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <FormItem className='mt-4'>
                                                <FancySelect
                                                    placeholder='Chọn hoặc nhập số lượng mới'
                                                    classNameSelect='!max-h-32'
                                                    options={QUANTITY_SELECT}
                                                    onChangeValue={(selectedValues: any) => {
                                                        field.onChange(selectedValues?.value)
                                                    }}
                                                    unit={handleUnit()}
                                                    isNumber
                                                    defaultValue={{
                                                        label: String(form.getValues("amount") ?? ""),
                                                        value: String(form.getValues("amount") ?? "")
                                                    }}
                                                />
                                                <FormMessage>{fieldState.error?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className='flex space-x-3'>
                                    <Button onClick={form.handleSubmit(onSubmit)} type='button' size="sm" variant="outline">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button type='button' size="sm" variant="outline" onClick={handleCancel}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>

                        ) : (
                            <TableRow key={fact.nutritionFactId}>
                                <TableCell className="font-medium">{nutritions?.value?.find(x => x.id == fact.nutrientId)?.name}</TableCell>
                                <TableCell>{`${formatNumberWithUnit(fact.amount)} ${nutritions?.value?.find(x => x.id == fact.nutrientId)?.unit}`}</TableCell>
                                <TableCell className='flex space-x-3'>
                                    <Button type='button' size="sm" variant="outline" onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(fact)
                                    }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button type='button' size="sm" variant="outline" onClick={() => handleRemoveFact(fact)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    )}

                    {editingId === null && !nutritionFacts.some(x => x.nutritionFactId === 0) && (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <button type='button' onClick={handleAddNew} className="flex items-center justify-center sm:p-5 space-x-5 font-bold hover:cursor-pointer">
                                    <CirclePlusIcon />
                                    <span>Thêm mới</span>
                                </button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </CardContent>
    )
}

export default NutritionFact;
