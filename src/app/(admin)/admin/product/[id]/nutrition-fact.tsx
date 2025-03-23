"use client";

import { createNutritionFact, deleteNutritionFact, updateNutritionFact } from '@/actions/product';
import { DeleteDialog } from '@/components/custom/_custom-dialog/delete-dialog';
import { FormNumberInputControl } from '@/components/global-components/form/form-number-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control'
import { FormValues } from '@/components/global-components/form/form-values'
import { Spinner } from '@/components/global-components/spinner';
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { FromNutrionFact } from '@/zod-safe-types/nutrition-safe-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, CirclePlusIcon, Pencil, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
                    productId
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
        setNutritionFacts(nutritionFacts.filter((f: NutritionFact) => f.id !== 0))
    }

    const handleUnit = () => {
        const nutritionId: string = form.getValues("nutrientId");
        return nutritionSelect.find((nutrition: NutritionSelect) => nutrition.Id.toString() === nutritionId)?.Unit
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
                            <TableHead>Số lượng</TableHead>
                            <TableHead>% Giá trị hàng ngày</TableHead>
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
                                            items={nutritionSelect
                                                .filter(item =>
                                                    item.Id === fact?.nutrient?.id ||
                                                    !nutritionFacts.some(fact => fact.nutrient?.id === item.Id)
                                                )
                                                .map(item => ({
                                                    id: item.Id,
                                                    name: item.Name,
                                                }))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <FormNumberInputControl
                                            form={form}
                                            name="amount"
                                            unit={handleUnit()}
                                        />
                                    </TableCell>
                                    <TableCell>

                                    </TableCell>
                                    <TableCell className='flex space-x-3'>
                                        <Button disabled={isPending} type='submit' size="sm" variant="ghost">
                                            {isPending ? <Spinner /> : <Check className="h-4 w-4" />}
                                        </Button>
                                        <Button disabled={isPending} type='button' size="sm" variant="ghost" onClick={handleCancel}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>

                            ) : (
                                <TableRow key={fact.id}>
                                    <TableCell className="font-medium">{fact?.nutrient?.name}</TableCell>
                                    <TableCell>{`${fact.amount} ${fact?.nutrient?.unit}`}</TableCell>
                                    <TableCell>{fact.dailyValue}</TableCell>
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
