"use client"

import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { FormValues } from "@/components/global-components/form/form-values"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import ProductSelection from "./product-selection"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { CreatePromotionSafeTypes } from "@/zod-safe-types/promotion-safe-types"
import { Separator } from "@/components/ui/separator"
import FormInformation from "./form-information"
import { toast } from "sonner"
import { API } from "@/actions/client/api-config"
import { format } from "date-fns"
import ConfirmInformation from "./confirm-information"


const CreatePromotion = () => {
    const [currentStep, setCurrentStep] = useState(1)

    const steps = [
        { id: 1, title: "Thông tin khuyến mãi" },
        { id: 2, title: "Chọn sản phẩm" },
        { id: 3, title: "Xác nhận thông tin" },
    ]

    const totalSteps = steps.length

    const form = useForm<z.infer<typeof CreatePromotionSafeTypes>>({
        resolver: zodResolver(CreatePromotionSafeTypes),
        defaultValues: {
            selectedProducts: [],
        },
    })

    const onSubmit = async (values: z.infer<typeof CreatePromotionSafeTypes>) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("percentage", values.percentage);
        formData.append("startDate", format(values.startDate, 'yyyy-MM-dd'));
        formData.append("endDate", format(values.endDate, 'yyyy-MM-dd'));
        formData.append("description", values.description);
        formData.append("image", values.image[0]);

        let index = 0
        values.selectedProducts.forEach((product) => {
            product.variants.forEach((variant) => {
                formData.append(`createProductVariant[${index}][productVariantId]`, variant.variantId);
                formData.append(`createProductVariant[${index}][quantity]`, variant.quantity.toString());
                index += 1;
            });
        });

        try {
            const res = await API.post("/Promotions", formData);
            if (res) {
                toast.success("Tạo mới chương trình giảm giá thành công")
                form.reset({
                    selectedProducts: [],
                });
                setCurrentStep(1);
            }
        } catch (error: unknown) {
            console.log(error instanceof Error ? error?.message : "Lỗi hệ thống")
            toast.error("Lỗi hệ thống")
        }
    }

    const nextStep = () => {
        let currentFields: string[] = [];
        if (currentStep === 1) {
            currentFields = ["name", "percentage", "description", "startDate", "endDate", "image"];
        } else if (currentStep === 2) {
            currentFields = ["selectedProducts"];
        }

        form.trigger(currentFields as any).then((isValid) => {

            if (isValid) {
                setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
            }
        })
    }

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    const isLastStep = currentStep === totalSteps
    const isFirstStep = currentStep === 1


    return (
        <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
            <div className="mb-6">
                <div className="w-full mx-auto border p-5 sm:p-10 rounded-lg">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className="flex items-center gap-5">
                                    <div className="flex flex-col justify-center items-center min-w-fit">
                                        <div
                                            className={`flex items-center justify-center min-w-8 h-8 rounded-full text-sm font-medium
                                                    ${currentStep >= step.id
                                                    ? "bg-sky-600 text-white"
                                                    : "bg-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {step.id}
                                        </div>
                                        <div className="mt-2 text-sm font-medium text-gray-700 min-w-fit text-center">
                                            {step.title}
                                        </div>
                                    </div>
                                </div>

                                {index !== steps.length - 1 && <Separator className="max-w-10 xl:max-w-64" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        switch (currentStep) {
                            case 1:
                                return <FormInformation form={form} />;
                            case 2:
                                return <ProductSelection form={form} />;
                            case 3:
                                return <ConfirmInformation form={form} />;
                            default:
                                return null;
                        }
                    })()}
                </CardContent>
            </Card>


            <div className="flex justify-between mt-6">
                {!isFirstStep && (
                    <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                        <ChevronLeft size={16} />
                        Quay lại
                    </Button>
                )}

                {!isLastStep ? (
                    <Button
                        type="button"
                        onClick={nextStep}
                        className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700-700"
                    >
                        Tiếp theo
                        <ChevronRight size={16} />
                    </Button>
                ) : (
                    <ButtonCustomized
                        type="submit"
                        className="min-w-32 max-w-32 !h-10 bg-sky-600 hover:bg-sky-700 ml-auto"
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
                )}
            </div>
        </FormValues >
    )
}

export default CreatePromotion

