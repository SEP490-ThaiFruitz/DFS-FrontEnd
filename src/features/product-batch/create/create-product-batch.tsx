"use client"
import { ButtonCustomized } from "@/components/custom/_custom-button/button-customized"
import React from "react"

import { FormSelectControl } from "@/components/global-components/form/form-select-control"
import { FormValues } from "@/components/global-components/form/form-values"
import { WaitingSpinner } from "@/components/global-components/waiting-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { API } from "@/actions/client/api-config"
import type { ApiResponse, PageResult } from "@/types/types"
import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { Check, Pencil, X } from "lucide-react"
import { CreateProductBatchSafeTypes } from "@/zod-safe-types/product-batch-safe-types"
import { formatTimeVietNam } from "@/lib/format-time-vietnam"
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FancySelect } from "@/components/custom/_custom_select/select"
import { PRESERVATION_SELECT, QUANTITY_SELECT } from "@/features/admin/admin-lib/admin-lib"
import { FormDateControl } from "@/components/global-components/form/form-date-control"
import Document from "./document"
import { format } from "date-fns"
import { REQUEST_KEY } from "@/app/key/comm-key"

export interface Request {
  id: string
  name: string
  user: User
  requestDate: string
  updateDate: string | null
  status: string
  expectedDate: string
  description: string
  requestType: "Return" | "Import"
  reasonDeclined: string | null
  productVariants: ProductVariant[]
}

interface User {
  id: string
  avatar: string
  name: string
  role: string
}

export interface ProductVariant {
  productId: string
  packageType: string
  productVariantId: string
  name: string
  image: string
  netWeight: number
  quantity: number
  enteredQuantity: number
}

function CreateProductBatch() {
  const { data: requests } = useFetch<ApiResponse<PageResult<Request>>>("/Requests", [
    REQUEST_KEY.REQUEST_MANAGE,
  ])

  const [productVariantEditId, setProductVariantEditId] = React.useState<string | null>(null)

  const form = useForm<z.infer<typeof CreateProductBatchSafeTypes>>({
    resolver: zodResolver(CreateProductBatchSafeTypes),
    defaultValues: {
      requestId: "",
      requestItems: [],
      documents: [],
    },
  })

  // Calculate total quantity of all products
  const totalQuantity = () => {
    const items = form.watch("requestItems") || []
    const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const importTotal = items.reduce((sum, item) => sum + (Number(item.importQuantity) || 0), 0)
    return (
      <div className="text-sm font-medium">
        Tổng số lượng: <span className="font-bold text-primary">{importTotal} / {total}</span>
      </div>
    )
  }

  // Handle deleting an item from the form
  const handleDelete = (index: number) => {
    const currentItems = form.getValues("requestItems")
    const updatedItems = [...currentItems]
    updatedItems.splice(index, 1)
    form.setValue("requestItems", updatedItems)
  }

  // Handle request selection
  const handleRequestSelection = (requestId: string) => {
    if (!requests?.value?.items) return

    const selectedRequest = requests.value.items.find((req) => req.id === requestId)

    if (selectedRequest && selectedRequest.productVariants) {
      const requestItems = selectedRequest.productVariants
        .filter(variant => variant.enteredQuantity < variant.quantity)
        .map((variant) => ({
          variantId: variant.productVariantId,
          productId: variant.productId,
          name: variant.name,
          image: variant.image,
          packageType: variant.packageType,
          netWeight: variant.netWeight,
          quantity: variant.quantity,
          enteredQuantity: variant.enteredQuantity,
          importQuantity: "",
          productionDate: new Date(),
          expirationDate: new Date(),
          preservationMethod: "",
        }))

      form.setValue("requestItems", requestItems)
    } else {
      form.setValue("requestItems", [])
    }
  }

  // Watch for changes in the requestId field
  const requestId = form.watch("requestId")

  // Update items when requestId changes
  React.useEffect(() => {
    if (requestId) {
      handleRequestSelection(requestId)
    }
  }, [requestId])

  const onSubmit = async (values: z.infer<typeof CreateProductBatchSafeTypes>) => {
    try {
      const formData = new FormData();
      formData.append("requestId", requestId);

      values.requestItems.forEach((item, index) => {
        formData.append(`productBatchItems[${index}].productVariantId`, item.variantId);
        formData.append(`productBatchItems[${index}].quantity`, item.importQuantity.toString());
        formData.append(`productBatchItems[${index}].preservationMethod`, item.preservationMethod);
        formData.append(`productBatchItems[${index}].productionDate`, format(item.productionDate, "yyyy-MM-dd"));
        formData.append(`productBatchItems[${index}].expirationDate`, format(item.expirationDate, "yyyy-MM-dd"));
      });

      values.documents.forEach((item) => {
        formData.append('documentNames', item.name);
        formData.append('documentAttachments', item.document[0]);
      })

      const response = await API.post("/ProductBatches", formData)

      if (response) {
        toast.success("Tạo nhập hàng thành công")
        form.reset()
      }
    } catch (error) {
      console.log({ error })
    }
  }

  // Format requests for dropdown
  const requestOptions =
    requests?.value?.items
      ?.filter((req) => (req.status === "Processing" || req.status === "PartiallyCompleted") && req.requestType === "Import")
      ?.map((req) => ({
        id: req.id,
        name: `${req.name} - ${req.user.name} - ${formatTimeVietNam(new Date(req.requestDate), true)}`,
      })) || []

  const handleRequestChange = (index: number) => {
    form.trigger(`requestItems.${index}`).then((isValid) => {
      console.log(form.getFieldState(`requestItems.${index}`, form.formState).error)
      if (isValid) {
        setProductVariantEditId(null)
      }
    })
  }

  return (
    <FormValues form={form} onSubmit={onSubmit} classNameForm="m-10">
      <Card>
        <CardHeader>
          <CardTitle>Tạo nhập hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <FormSelectControl
              form={form}
              name="requestId"
              classNameInput="h-fit"
              placeholder="Chọn yêu cầu"
              items={requestOptions}
              disabled={form.formState.isSubmitting}
              label="Chọn yêu cầu"
              require
            />
          </div>

          <Separator className="px-10 mt-10" />

          <div className="mt-4">
            <div className="flex items-center">
              <div className="mr-auto font-bold text-2xl">Danh sách sản phẩm </div>
              {totalQuantity()}
            </div>

            <div className="mt-4">
              {form.watch("requestItems") &&
                form.getValues("requestItems").map((variant: any, index: number) =>
                  productVariantEditId === variant.variantId ? (
                    <Card
                      key={variant.variantId}
                      className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                          <ImagePreview images={[variant.image]} className="object-cover h-full" />
                        </div>
                        <CardContent className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col h-full">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                              <h3 className="font-medium text-lg">
                                {variant.name} - {variant.packageType}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button disabled={form.formState.isSubmitting} type='button' size="sm" variant="outline" onClick={(e) => {
                                  e.preventDefault();
                                  handleRequestChange(index)
                                }}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(index)}
                                  disabled={form.formState.isSubmitting}
                                  className="border"
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 text-sm mt-2">
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                <div className="font-semibold text-xl text-primary">{variant.netWeight}g</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Số lượng yêu cầu</div>
                                <div className="font-semibold text-xl text-primary">{variant.quantity}</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Số lượng đã nhập</div>
                                <div className="font-semibold text-xl text-primary">{variant.enteredQuantity}</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="font-semibold text-xl text-primary">
                                  <Controller
                                    name={`requestItems.${index}.importQuantity`}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                      <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium after:content-['*'] after:text-red-500 after:ml-1">
                                          Số lượng nhập
                                        </FormLabel>
                                        <FancySelect
                                          placeholder='Chọn hoặc nhập số lượng mới'
                                          classNameSelect='!max-h-32'
                                          options={QUANTITY_SELECT}
                                          onChangeValue={(selectedValues: any) => {
                                            field.onChange(selectedValues?.value)
                                          }}
                                          defaultValue={{
                                            label: String(form.getValues(`requestItems.${index}.importQuantity`)),
                                            value: String(form.getValues(`requestItems.${index}.importQuantity`))
                                          }}
                                          isNumber
                                        />
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="font-semibold text-xl text-primary">
                                  <Controller
                                    name={`requestItems.${index}.preservationMethod`}
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                      <FormItem>
                                        <FormLabel className="text-muted-foreground font-medium after:content-['*'] after:text-red-500 after:ml-1">
                                          Cách bảo quản
                                        </FormLabel>
                                        <FancySelect
                                          placeholder='Chọn cách bảo quản hoặc nhập mới'
                                          options={PRESERVATION_SELECT}
                                          onChangeValue={(selectedValues: any) => {
                                            field.onChange(selectedValues.value)
                                          }}
                                          defaultValue={{
                                            label: String(form.getValues(`requestItems.${index}.preservationMethod`)),
                                            value: String(form.getValues(`requestItems.${index}.preservationMethod`))
                                          }}
                                          disabled={form.formState.isSubmitting}
                                        />
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 text-sm mt-5">
                              <div className="space-y-1.5">
                                <div className="font-semibold text-xl text-primary">
                                  <FormDateControl
                                    maxDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    form={form}
                                    name={`requestItems.${index}.productionDate`}
                                    disabled={form.formState.isSubmitting}
                                    label="Ngày sản xuất"
                                    classNameLabel="text-muted-foreground font-medium"
                                    require
                                  />
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="font-semibold text-xl text-primary">
                                  <FormDateControl
                                    minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                    form={form}
                                    name={`requestItems.${index}.expirationDate`}
                                    disabled={form.formState.isSubmitting}
                                    label="Ngày hết hạn"
                                    classNameLabel="text-muted-foreground font-medium"
                                    require
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ) : (
                    <Card
                      key={variant.variantId}
                      className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow mb-6"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                          <ImagePreview images={[variant.image]} className="object-cover h-full" />
                        </div>
                        <CardContent className="p-4 md:p-6 flex-1">
                          <div className="flex flex-col h-full">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                              <h3 className="font-medium text-lg">
                                {variant.name} - {variant.packageType}
                              </h3>
                              <div className="flex items-center gap-2">
                                <Button disabled={form.formState.isSubmitting} type='button' size="sm" variant="outline" onClick={(e) => {
                                  e.preventDefault();
                                  setProductVariantEditId(variant.variantId)
                                }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDelete(index)}
                                  className="border"
                                  disabled={form.formState.isSubmitting}
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 text-sm mt-2">
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Trọng lượng</div>
                                <div className="font-semibold text-xl text-primary">{variant.netWeight}g</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Số lượng yêu cầu</div>
                                <div className="font-semibold text-xl text-primary">{variant.quantity}</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Số lượng đã nhập</div>
                                <div className="font-semibold text-xl text-primary">{variant.enteredQuantity}</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Số lượng nhập</div>
                                <div className="font-semibold text-xl text-primary">{variant.importQuantity}</div>
                                {form.formState.errors.requestItems?.[index]?.importQuantity && (
                                  <div className="text-sm text-red-500 mt-1">
                                    {form.formState.errors.requestItems[index].importQuantity.message as string}
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Cách bảo quản</div>
                                <div className="font-semibold text-xl text-primary">{variant.preservationMethod}</div>
                                {form.formState.errors.requestItems?.[index]?.preservationMethod && (
                                  <div className="text-sm text-red-500 mt-1">
                                    {form.formState.errors.requestItems[index].preservationMethod.message as string}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5 text-sm mt-5">
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Ngày sản xuất</div>
                                <div className="font-semibold text-xl text-primary">{formatTimeVietNam(variant.productionDate)}</div>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-muted-foreground font-medium">Ngày hết hạn</div>
                                <div className="font-semibold text-xl text-primary">{formatTimeVietNam(variant.expirationDate)}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}

              {(!form.watch("requestItems") || form.getValues("requestItems").length === 0) && (
                <div className="text-center py-10 text-muted-foreground">
                  Chưa có sản phẩm nào. Vui lòng chọn yêu cầu để hiển thị danh sách sản phẩm.
                </div>
              )}
            </div>
          </div>

          <Separator className="px-10 mt-10" />
          <Document form={form} />
        </CardContent>
      </Card>

      <ButtonCustomized
        type="submit"
        className="min-w-32 px-2 max-w-fit bg-sky-600 hover:bg-sky-700"
        variant="secondary"
        disabled={
          form.formState.isSubmitting || !form.watch("requestItems") || form.getValues("requestItems").length === 0
        }
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
  )
}

export default CreateProductBatch
