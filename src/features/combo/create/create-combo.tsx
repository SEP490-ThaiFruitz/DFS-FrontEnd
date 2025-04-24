import React, { useState } from 'react'

import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { FormValues } from "@/components/global-components/form/form-values"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { CreateComboSafeTypes } from "@/zod-safe-types/combo-safe-types"
import { toast } from "sonner"
import { API } from "@/actions/client/api-config"
import FormInformation from './form-information'
import SellectProductVariant from './sellect-product-variant'
import ConfirmInformation from './confirm-information'
function CreateCombo() {
    const [currentStep, setCurrentStep] = useState(1)

    const steps = [
        { id: 1, title: "Thông tin gói quá" },
        { id: 2, title: "Các sản phẩm" },
        { id: 3, title: "Xác nhận thông tin" },
    ]

    const totalSteps = steps.length

    const form = useForm<z.infer<typeof CreateComboSafeTypes>>({
        resolver: zodResolver(CreateComboSafeTypes),
        defaultValues: {
            selectedProducts: []
        }
    })

    const onSubmit = async (values: z.infer<typeof CreateComboSafeTypes>) => {
        try {
            const formData = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (key === "image") {
                    formData.append("image", value[0])
                } else if (key === "selectedProducts") {
                    value.forEach((value: any, index: number) => {
                        formData.append(`comboItemsRequest[${index}].productVariantId`, String(value.variantId))
                        formData.append(`comboItemsRequest[${index}].quantity`, String(value.quantity))
                    });
                } else {
                    formData.append(key, String(value))
                }
            })

            const response = await API.post("/Combos", formData)
            if (response) {
                toast.success("Tạo gói quà thành công")
                form.reset({
                    selectedProducts: []
                });
                setCurrentStep(1)
            } else {
                toast.error("Tạo gói quà thất bại")
            }
        } catch {
            toast.error("Lỗi hệ thống")
        }

    }

    const nextStep = () => {
        let currentFields: string[] = [];
        if (currentStep === 1) {
            currentFields = ["name", "capacity", "description", "type", "eventId", "image"];
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
                <div className="w-full mx-auto border p-5 sm:p-10 cardStyle">
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

            <Card className='cardStyle'>
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        switch (currentStep) {
                            case 1:
                                return <FormInformation formCombo={form} />;
                            case 2:
                                return <SellectProductVariant formCombo={form} />;
                            case 3:
                                return <ConfirmInformation formCombo={form} />;
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
                        className="ml-auto flex items-center gap-2 bg-sky-600 hover:bg-sky-700"
                    >
                        Tiếp theo
                        <ChevronRight size={16} />
                    </Button>
                ) : (
                    <ButtonCustomized
                        type="submit"
                        className="min-w-32  px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
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

export default CreateCombo
