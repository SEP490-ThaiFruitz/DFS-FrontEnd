"use client";

import { createNutritionFact, deleteNutritionFact, updateNutritionFact } from '@/actions/product';
import { useFetch } from '@/actions/tanstack/use-tanstack-actions';
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog';
import { FancySelect } from '@/components/custom/_custom_select/select';
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Spinner } from '@/components/global-components/spinner';
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { FormItem, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { NUTRITIONS_SELECT, QUANTITY_SELECT } from '@/features/admin/admin-lib/admin-lib';
import { formatNumberWithUnit } from '@/lib/format-currency';
import { ApiResponse } from '@/types/types';
import { FromNutrionFact } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, CirclePlusIcon, Pencil, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner';
import { z } from 'zod'

export interface NutritionFact {
    id: number | null;
    amount: number;
    dailyValue: number;
    nutrient: Nutrient | null;
}
interface Nutrient {
    id: number;
    name: string;
    unit: string;
    dailyValueReference: DailyValueReference | null;
}

interface DailyValueReference {
    nutrientId: string;
    dVR: number;
    unit: string;
}

interface NutritionFactProps {
    nutritionFacts: NutritionFact[],
    productId: string,
    productNutritionId: string | undefined,
}

interface NutritionSelect {
    Id: number;
    Name: string;
    Unit: string;
};

const NutritionFactTab = ({ nutritionFacts: intialNutritionFacts, productId, productNutritionId }: Readonly<NutritionFactProps>) => {
    const { data: nutritions } = useFetch<ApiResponse<Nutrient[]>>("/Products/products/nutrients")

    const [nutritionFacts, setNutritionFacts] = useState<NutritionFact[]>(intialNutritionFacts)
    const [nutritionFact, setNutritionFact] = useState<NutritionFact | undefined>(undefined)
    const [editingId, setEditingId] = useState<number | null>(null)
    const form = useForm<z.infer<typeof FromNutrionFact>>({
        resolver: zodResolver(FromNutrionFact),
    });

    useEffect(() => {
        setNutritionFacts(intialNutritionFacts)
    }, [intialNutritionFacts])

    const handleEdit = (fact: NutritionFact) => {
        if (fact.id !== 0 && editingId === 0) {
            setNutritionFacts((prev) => prev.filter((nutritionFact: NutritionFact) => nutritionFact.id !== 0))
        }
        setEditingId(fact.id)
        form.setValue("nutritionFactId", fact.id?.toString())
        form.setValue("amount", fact?.amount.toString())
        form.setValue("nutrientId", fact?.nutrient?.id.toString() ?? "1")
    }
    const queryClient = useQueryClient();

    const { mutate: nutritionMutation, isPending } = useMutation({
        mutationFn: async (values: any) => {
            try {
                const { nutritionFactId, amount, nutrientId } = values;
                const res = nutritionFactId == 0 ? await createNutritionFact({
                    productNutritionId,
                    amount,
                    nutrientId
                }, productId) : await updateNutritionFact(
                    {
                        nutritionFactId,
                        amount,
                        nutrientId
                    },
                    nutritionFactId
                );
                if (!res?.isSuccess) {
                    throw new Error(nutritionFactId == 0 ? "Thêm dinh dưỡng thất bại" : "Cập nhật dinh dưỡng thất bại")
                }

                return nutritionFactId == 0 ? "Thêm dinh dưỡng thành công" : "Cập nhật dinh dưỡng thành công"
            } catch (error: unknown) {
                throw new Error(error instanceof Error ? error?.message : "Lỗi hệ thống")
            }
        },
        onSuccess: (message: string) => {
            toast.success(message)
            handleCancel();
            queryClient.invalidateQueries({ queryKey: ["detail-mange", productId] })
        },
        onError: (error) => {
            toast.error(error?.message)
        },
    })

    const onSubmit = async (values: z.infer<typeof FromNutrionFact>) => {
        nutritionMutation(values);
    }


    const handleCancel = () => {
        setEditingId(null)
        setNutritionFacts(nutritionFacts.filter((f: NutritionFact) => f.id !== 0))
    }

    const handleUnit = () => {
        const nutritionId: string = form.getValues("nutrientId");
        return nutritions?.value?.find((nutrition: Nutrient) => nutrition.id.toString() == nutritionId)?.unit
    }

    const handleAddNew = () => {
        const newNutritionFact: NutritionFact = {
            id: 0,
            amount: 0,
            nutrient: null,
            dailyValue: 0,
        }
        setNutritionFacts([...nutritionFacts, newNutritionFact])
        handleEdit(newNutritionFact)
    }
    const handleRemoveFact = (fact: NutritionFact) => {
        if (fact.id === 0) {
            setNutritionFacts(nutritionFacts.filter((f: NutritionFact) => f.id !== fact.id))
        } else {
            setNutritionFact(fact)
        }
    }

    return (
        <CardContent>
            <FormValues form={form} onSubmit={onSubmit}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Dinh dưỡng</TableHead>
                            <TableHead>Hàm lượng</TableHead>
                            <TableHead>Giá trị hàng ngày</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {nutritionFacts?.map((fact: NutritionFact) =>
                            editingId === fact.id ? (
                                <TableRow key={fact.id} >
                                    <TableCell className="font-medium">
                                        <FormSelectControl
                                            form={form}
                                            name="nutrientId"
                                            defaultValue={fact?.nutrient?.id?.toString()}
                                            items={nutritions?.value
                                                ?.filter(item =>
                                                    item.id === fact?.nutrient?.id ||
                                                    !nutritionFacts.some(fact => fact.nutrient?.id === item.id)
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
                                                        defaultValue={{
                                                            label: String(form.getValues("amount") ?? ""),
                                                            value: String(form.getValues("amount") ?? "")
                                                        }}
                                                        isNumber
                                                    />
                                                    <FormMessage>{fieldState.error?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell className='flex space-x-3'>
                                        <Button disabled={isPending} type='submit' size="sm" variant="outline">
                                            {isPending ? <Spinner /> : <Check className="h-4 w-4" />}
                                        </Button>
                                        <Button disabled={isPending} type='button' size="sm" variant="outline" onClick={handleCancel}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            ) : (
                                <TableRow key={fact.id}>
                                    <TableCell className="font-medium">{fact?.nutrient?.name}</TableCell>
                                    <TableCell>{`${fact.amount} ${fact?.nutrient?.unit}`}</TableCell>
                                    <TableCell>{formatNumberWithUnit(fact.dailyValue, "%")}</TableCell>
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

                        {editingId === null && !nutritionFacts.some(x => x.id === 0) && (
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <button type='button' disabled={isPending} onClick={handleAddNew} className="flex items-center justify-center sm:p-5 space-x-5 font-bold hover:cursor-pointer">
                                        <CirclePlusIcon />
                                        <span>Thêm mới</span>
                                    </button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </FormValues>
            <DeleteDialog
                id={nutritionFact?.id?.toString() ?? ""}
                isOpen={nutritionFact !== undefined}
                onClose={() => setNutritionFact(undefined)}
                name={nutritionFact?.nutrient?.name ?? ""}
                deleteFunction={deleteNutritionFact}
                refreshKey={[["detail-mange", productId]]}
            />
        </CardContent>
    )
}

export default NutritionFactTab;
