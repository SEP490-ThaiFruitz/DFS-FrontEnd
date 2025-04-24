"use client"

import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import { FormValues } from "@/components/global-components/form/form-values"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { type z } from "zod"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { API } from "@/actions/client/api-config"
import FormInformation from "./create-form-information"
import { CreateProductSafeTypes } from "@/zod-safe-types/product-safe-types"
import Variant from "./variant"
import Nutrition from "./nutrition"
import ConfirmInformation from "./confirm-information"
import Certification from "./certification"


const CreateProduct = () => {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { id: 1, title: "Thông tin sản phẩm" },
    { id: 2, title: "Các biến thể" },
    { id: 3, title: "Chất dinh dưỡng" },
    { id: 4, title: "Các chứng chỉ" },
    { id: 5, title: "Xác nhận thông tin" },
  ]

  const totalSteps = steps.length

  const form = useForm<z.infer<typeof CreateProductSafeTypes>>({
    resolver: zodResolver(CreateProductSafeTypes),
    defaultValues: {
      categoryIds: [],
      productVariants: [],
      servingSize: "0",
      nutritionFacts: [],
      certificates: [],
      tagNames: [],
      ingredients: []
    }
  })

  const onSubmit = async (values: z.infer<typeof CreateProductSafeTypes>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("origin", values.origin);
      formData.append("dryingMethod", values.dryingMethod);
      formData.append("moistureContent", values.moistureContent);

      values.tagNames.forEach((value) => {
        formData.append("tags", value.value);
      })
      values.categoryIds.forEach((value) => {
        formData.append("categoryIds", value);
      })

      formData.append("image", values.image[0]);

      values.other.forEach((value: any) => {
        formData.append("other", value);
      })

      let index = 0
      values.certificates.forEach((certificate) => {
        formData.append(`certificates[${index}]`, certificate.id?.toString() ?? "");
        index += 1;
      });
      values.ingredients.forEach((value) => {
        formData.append("nutrition.ingredients", value.value);
      })
      formData.append("nutrition.servingSize", values.servingSize);

      index = 0
      values.nutritionFacts.forEach((nutritionFact) => {
        formData.append(`nutrition.nutritionFacts[${index}][nutrientId]`, nutritionFact.nutrientId);
        formData.append(`nutrition.nutritionFacts[${index}][amount]`, nutritionFact.amount);
        index += 1;
      });

      index = 0
      values.productVariants.forEach((productVariant) => {
        console.log(productVariant.image[0])
        formData.append(`variants[${index}][stockQuantity]`, "0");
        formData.append(`variants[${index}][packagingWidth]`, productVariant.packagingWidth);
        formData.append(`variants[${index}][shelfLife]`, productVariant.shelfLife);
        formData.append(`variants[${index}][packagingLength]`, productVariant.packagingLength);
        formData.append(`variants[${index}][price]`, productVariant.price);
        formData.append(`variants[${index}][packagingHeight]`, productVariant.packagingHeight);
        formData.append(`variants[${index}][reOrderPoint]`, productVariant.reOrderPoint);
        formData.append(`variants[${index}][preservationMethod]`, productVariant.preservationMethod);
        formData.append(`variants[${index}][netWeight]`, productVariant.netWeight);
        formData.append(`variants[${index}][packagingTypeId]`, productVariant.packagingTypeId);
        formData.append(`variants[${index}][grossWeight]`, productVariant.grossWeight);
        formData.append(`productVariantImages`, productVariant.image[0]);
        index += 1;
      });

      const response = await API.post("/Products", formData)

      if (response) {
        toast.success("Tạo sản phẩm thành công")
        form.reset({
          categoryIds: [],
          productVariants: [],
          servingSize: "0",
          nutritionFacts: [],
          certificates: [],
          tagNames: [],
          ingredients: []
        });
        form.clearErrors()
        setCurrentStep(1)
      }
    } catch (error) {
      console.log({ error });
    }
  }

  const nextStep = () => {
    let currentFields: string[] = [];
    if (currentStep === 1) {
      currentFields = ["name", "percentage", "description", "origin", "dryingMethod", "image", "other", "moistureContent", "categoryIds", "tagNames"];
    } else if (currentStep === 2) {
      currentFields = ["productVariants"];
    } else if (currentStep === 3) {
      currentFields = ["ingredients", "servingSize", "nutritionFacts"];
    } else if (currentStep === 4) {
      currentFields = ["certificates"];
    }

    form.trigger(currentFields as any).then((isValid) => {
      console.log(form.getFieldState("certificates"))
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

                {index !== steps.length - 1 && <Separator className="max-w-10" />}
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
                return <FormInformation formProduct={form} />;
              case 2:
                return <Variant formProduct={form} />;
              case 3:
                return <Nutrition formProduct={form} />;
              case 4:
                return <Certification formProduct={form} />;
              case 5:
                return <ConfirmInformation formProduct={form} />;
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
        )}
      </div>
    </FormValues >
  )
}

export default CreateProduct

