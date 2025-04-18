"use client";
import { ButtonCustomized } from '@/components/custom/_custom-button/button-customized';
import { FormInputControl } from '@/components/global-components/form/form-input-control';
import { FormSelectControl } from '@/components/global-components/form/form-select-control';
import { FormTextareaControl } from '@/components/global-components/form/form-textarea-control';
import { FormValues } from '@/components/global-components/form/form-values';
import { WaitingSpinner } from '@/components/global-components/waiting-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CreatePlanSafeTypes } from '@/zod-safe-types/inventory-safe-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlusIcon, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import DialogProduct from '../dialog-product';
import { Button } from '@/components/ui/button';
import ImagePreview from '@/components/custom/_custom-image/image-preview';
import { API } from '@/actions/client/api-config';
import { FormDateControl } from '@/components/global-components/form/form-date-control';

function CreatePlanPage() {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const form = useForm<z.infer<typeof CreatePlanSafeTypes>>({
        resolver: zodResolver(CreatePlanSafeTypes),
        defaultValues: {
            requestItems: []
        }
    });

    const onSubmit = async (values: z.infer<typeof CreatePlanSafeTypes>) => {
        try {
            const { requestItems, ...restValues } = values;
            const res = await API.post("/Requests", {
                ...restValues,
                requestItems: requestItems.map((item) => (
                    {
                        productVariantId: item.variantId,
                        quantity: item.quantity
                    }
                ))
            })
            if (res) {
                toast.success("Tạo kế hoạch thành công")
                form.reset();
            } else {
                toast.error("Tạo kế hoạch thất bại")
            }
        } catch (error) {
            console.log({ error })
            toast.error("Lỗi hệ thống")
        }
    };

    const handleDelete = (indexDelete: number) => {
        const variants = form.getValues("requestItems");
        const newVariants = variants.filter((_: any, index: number) => index !== indexDelete);
        form.setValue("requestItems", newVariants);
    };

    const totalQuantity = () => {
        const variants = form.getValues("requestItems");
        return <div>
            Tổng sản phẩm: {variants.length}  | Tổng số lượng: {variants.reduce((total: number, item) => total + item.quantity, 0)}
        </div>

    }

    return (
        <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
            <Card>
                <CardHeader>
                    <CardTitle>Tạo kế hoạch</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 gap-6 sm:gap-20">
                        <div className="space-y-5">
                            <FormInputControl
                                form={form}
                                name="name"
                                disabled={form.formState.isSubmitting}
                                label="Tên kế hoạch"
                                require
                            />
                            <FormSelectControl
                                form={form}
                                name="requestType"
                                classNameInput='h-fit'
                                placeholder='Chọn loại kế hoạch'
                                items={[
                                    { id: 'Import', name: 'Nhập hàng' },
                                    { id: 'Return', name: 'Trả hàng' },
                                ]}
                                disabled={form.formState.isSubmitting}
                                label="Chọn loại kế hoạch"
                                require
                            />
                            <FormDateControl
                                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                form={form}
                                name="expectedDate"
                                disabled={form.formState.isSubmitting}
                                label="Ngày dự tính nhận hàng"
                                require
                            />
                        </div>

                        <FormTextareaControl
                            form={form}
                            name="description"
                            disabled={form.formState.isSubmitting}
                            label="Mô tả kế hoạch"
                            rows={6}
                            require
                        />

                    </div>

                    <Separator className='px-10 mt-10' />

                    <div className='mt-4'>
                        <div className='flex items-center'>
                            <div className='mr-auto font-bold text-2xl'>Danh sách sản phẩm </div>
                            {totalQuantity()}
                        </div>

                        <div className='mt-4'>
                            {form.watch("requestItems") && form.getValues("requestItems").map((variant: any, index: number) => (
                                <Card key={variant.variantId} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6">
                                    <div className="flex flex-col sm:flex-row">
                                        <div className="h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                                            <ImagePreview
                                                images={[variant.image]}
                                                className="object-cover h-40"
                                            />
                                        </div>
                                        <CardContent className="p-4 md:p-6 flex-1">
                                            <div className="flex flex-col h-full">
                                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                                                    <h3 className="font-medium text-lg">
                                                        {variant.name} - {variant.packageType}
                                                    </h3>
                                                    <Button onClick={() => handleDelete(index)} className="border" type="button" size="sm" variant="ghost">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mt-2">
                                                    <div className="space-y-1.5">
                                                        <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                                        <div className="font-semibold text-xl text-primary">{variant.netWeight}g</div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="text-muted-foreground font-medium">Số lượng</div>
                                                        <div className="font-semibold text-xl text-primary">{variant.quantity}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                            <button
                                type='button' onClick={() => setIsOpen(true)}
                                className={`text-center border shadow-sm rounded-xl p-2 hover:cursor-pointer`}
                            >
                                <div className="flex items-center sm:p-5 space-x-5 font-bold">
                                    <CirclePlusIcon />
                                    <span>Thêm sản phẩm</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    <DialogProduct
                        form={form}
                        isOpen={isOpen}
                        onClose={() => {
                            setIsOpen(false)
                        }}
                    />
                </CardContent>
            </Card>

            <ButtonCustomized
                type="submit"
                className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
                variant="secondary"
                disabled={form.formState.isSubmitting}
                label={
                    form.formState.isSubmitting ? (
                        <WaitingSpinner
                            variant="pinwheel"
                            label="Đang tạo..."
                            className="font-semibold"
                            classNameLabel="font-semibold text-sm"
                        />
                    ) : (
                        "Tạo mới"
                    )
                }
            />
        </FormValues >
    );
}

export default CreatePlanPage;
