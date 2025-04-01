"use client";

import { FancySelect } from '@/components/custom/_custom_select/select';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { FormItem, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumberWithUnit } from '@/lib/format-currency';
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

interface NutritionSelect {
    Id: number;
    Name: string;
    Unit: string;
};

const NutritionFact = ({ formProduct }: Readonly<NutritionFactProps>) => {
    const [nutritionFacts, setNutritionFacts] = useState<NutritionFact[]>([])
    const [editingId, setEditingId] = useState<number | null>(null)
    const form = useForm<z.infer<typeof FromNutrionFact>>({
        resolver: zodResolver(FromNutrionFact),
    });

    const selectDataList: { label: string, value: string }[] = Array.from({ length: 10 }, (_, index) => ({
        label: `${index * 10}`,
        value: `${index * 10}`
    }));

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

    const nutritionSelect: NutritionSelect[] = [
        { Id: 1, Name: "Tổng chất béo", Unit: "g" },
        { Id: 2, Name: "Chất béo bão hòa", Unit: "g" },
        { Id: 3, Name: "Chất béo chuyển hóa", Unit: "g" },
        { Id: 4, Name: "Cholesterol", Unit: "mg" },
        { Id: 5, Name: "Natri", Unit: "mg" },
        { Id: 6, Name: "Tổng carbohydrate", Unit: "g" },
        { Id: 7, Name: "Chất xơ", Unit: "g" },
        { Id: 8, Name: "Tổng đường", Unit: "g" },
        { Id: 9, Name: "Đường bổ sung", Unit: "g" },
        { Id: 10, Name: "Chất đạm", Unit: "g" },
    ];

    const handleCancel = () => {
        setEditingId(null)
        setNutritionFacts(nutritionFacts.filter((f: NutritionFact) => f.nutritionFactId !== 0))
    }

    const handleUnit = () => {
        const nutritionId: string = form.getValues("nutrientId");
        return nutritionSelect.find((nutrition: NutritionSelect) => nutrition.Id.toString() == nutritionId)?.Unit
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
                                        items={nutritionSelect
                                            .filter(item =>
                                                item.Id == fact.nutrientId ||
                                                !nutritionFacts.some(fact => fact.nutrientId == item.Id)
                                            )
                                            .map(item => ({
                                                id: item.Id,
                                                name: item.Name,
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
                                                    options={selectDataList}
                                                    onChangeValue={(selectedValues: any) => {
                                                        field.onChange(selectedValues?.value)
                                                    }}
                                                    unit={handleUnit()}
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
                                    <Button onClick={form.handleSubmit(onSubmit)} type='button' size="sm" variant="ghost">
                                        <Check className="h-4 w-4" />
                                    </Button>
                                    <Button type='button' size="sm" variant="ghost" onClick={handleCancel}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>

                        ) : (
                            <TableRow key={fact.nutritionFactId}>
                                <TableCell className="font-medium">{nutritionSelect.find(x => x.Id == fact.nutrientId)?.Name}</TableCell>
                                <TableCell>{`${formatNumberWithUnit(fact.amount)} ${nutritionSelect.find(x => x.Id == fact.nutrientId)?.Unit}`}</TableCell>
                                <TableCell className='flex space-x-3'>
                                    <Button type='button' size="sm" variant="ghost" onClick={(e) => {
                                        e.preventDefault();
                                        handleEdit(fact)
                                    }}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button type='button' size="sm" variant="ghost" onClick={() => handleRemoveFact(fact)}>
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
