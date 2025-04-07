"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, CirclePlus, Pencil, X } from "lucide-react"
import { formatVND } from "@/lib/format-currency"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeleteDialog } from "@/components/custom/_custom-dialog/delete-dialog"
import { API } from "@/actions/client/api-config"
import FormVariant from "./form-variant"
import InformationDiscount from "./information-discount"

export interface PackagingType {
  id: string
  name: string
  packagingType: string
  packagingMaterial: string
  description: string
}

export interface ProductVariantDetail {
  id: string
  sku: string
  image: string
  netWeight: number
  grossWeight: number
  packagingLength: number
  packagingWidth: number
  packagingHeight: number
  packagingVolume: number
  shelfLife: string,
  preservationMethod: string,
  productVariantDetail: string,
  price: number
  stockQuantity: number
  reOrderPoint: number
  packagingType: PackagingType
  discounts: Discount[]
}


export interface Discount {
  id: string
  startDate: string
  endDate: string
  percentage: number
  quantity: number
  quantitySold: number
  description: string
  createdOnUtc: Date
  modifiedOnUtc: Date | null
}

interface VariantTabProps {
  productVariants: ProductVariantDetail[],
  productId: string,
}

const VariantTab = ({ productVariants, productId }: Readonly<VariantTabProps>) => {
  const [isForm, setIsForm] = useState(false)
  const [productVariantRemove, setProductVariantRemove] = useState<ProductVariantDetail | undefined>(undefined);
  const [productVariantUpdate, setProductVariantUpdate] = useState<ProductVariantDetail | undefined>(undefined);

  const removeProductVariant = async (id: string) => {
    return await API.remove(`/Products/product-variants/${id}`)
  }

  return (
    <TabsContent value="variant">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between border-b-2">
          <CardTitle>Danh sách biến thể</CardTitle>
          <Button onClick={() => setIsForm(true)} variant="outline">
            <CirclePlus />
            Thêm mới
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {productVariants.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mb-4 text-muted-foreground/50" />
              <div>Không có biến thể nào</div>
            </div>
          ) : (
            <div className="space-y-4">
              {productVariants.map((variant) => (
                <Card key={variant.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative h-52 sm:h-auto sm:w-52 md:w-64 bg-muted/20">
                      <ImagePreview
                        images={[variant.image]}
                        className="object-cover h-full"
                      />
                      {variant.stockQuantity <= variant.reOrderPoint && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="destructive" className="flex items-center gap-1 px-2 py-1 font-medium">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Tồn kho thấp
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 md:p-6 flex-1">
                      <div className="flex flex-col h-full">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
                          <h3 className="font-medium text-lg">
                            {variant.sku} - {variant.packagingType.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button
                              className="border"
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setProductVariantUpdate(variant)
                                setIsForm(true)
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => setProductVariantRemove(variant)} className="border" type="button" size="sm" variant="ghost">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mt-2">
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Kích thước</div>
                            <div className="flex items-center">
                              {variant.packagingLength} × {variant.packagingWidth} × {variant.packagingHeight} cm
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Thể tích</div>
                            <div className="flex items-center">
                              {variant.packagingVolume} cm<sup>3</sup>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Trọng lượng</div>
                            <div className="flex items-center space-x-2">
                              <div>Tịnh: {variant.netWeight}g</div>
                              <div className="text-muted-foreground">|</div>
                              <div>Tổng: {variant.grossWeight}g</div>
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Tồn kho</div>
                            <div>
                              {variant.stockQuantity}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Điểm cảnh báo</div>
                            <div>{variant.reOrderPoint}</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Hạn sử dụng</div>
                            <div>{variant.shelfLife}</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Cách bảo quản</div>
                            <div>{variant.preservationMethod}</div>
                          </div>
                          <div className="space-y-1.5">
                            <div className="text-muted-foreground font-medium">Giá</div>
                            <div className="font-semibold text-xl text-primary">{formatVND(variant.price)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                  <InformationDiscount productId={productId} discounts={variant.discounts} productVariantId={variant.id} />
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <FormVariant productId={productId} productVariantDetail={productVariantUpdate} isOpen={isForm} onClose={() => {
        setIsForm(false)
        setProductVariantUpdate(undefined)
      }} />
      <DeleteDialog
        id={productVariantRemove?.id ?? ""}
        isOpen={productVariantRemove !== undefined}
        onClose={() => setProductVariantRemove(undefined)}
        name={`${productVariantRemove?.packagingType.name} - ${productVariantRemove?.netWeight}g`}
        deleteFunction={removeProductVariant}
        refreshKey={[["detail-mange", `${productId}`]]}
      />
    </TabsContent>
  )
}

export default VariantTab

