"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { PROMOTION_KEY } from "@/app/key/admin-key"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatVND } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { ApiResponse } from "@/types/types"
import { AlertTriangle, ChevronDown, ChevronRight, MinusCircle, PlusCircle, Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import ProductBatchCell from "./product-batch-warning"

interface ProductVariant {
  productVariantId: string
  image: string
  netWeight: number
  packageType: string
  price: number
  isCanDiscount: boolean,
  productBatches: ProductBatch[]
}

interface Product {
  productId: string
  name: string
  image: string
  productVariants: ProductVariant[]
}

interface ProductBatch {
  productBatchNumber: string,
  quantity: number,
  expirationDate: string
}

interface ProductSelectionProps {
  form: UseFormReturn<any>
}

const ProductSelection = ({ form }: ProductSelectionProps) => {
  const startDate = form.getValues("startDate")?.toISOString().split("T")[0];
  const endDate = form.getValues("endDate")?.toISOString().split("T")[0];
  const { data: apiResponse } = useFetch<ApiResponse<Product[]>>(
    `/Promotions/product?StartDate=${startDate}&EndDate=${endDate}`,
    [PROMOTION_KEY.PROMOTION],
  )

  const products = apiResponse?.value || []
  const [searchTerm, setSearchTerm] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>(
    form.getValues("selectedProducts").reduce((quantities: Record<string, number>, product: any) => {
      product.variants.forEach((variant: { variantId: string, quantity: number }) => {
        quantities[variant.variantId] = variant.quantity;
      });
      return quantities;
    }, {})
  );
  const [expandedProducts, setExpandedProducts] = useState<string[]>(
    form.getValues("selectedProducts").reduce((expandedProducts: string[], product: any) => {
      if (product.variants.length > 0) {
        expandedProducts.push(product.productId);
      }
      return expandedProducts;
    }, [])
  );
  const filteredProducts = products.filter((product: Product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const [selectedVariants, setSelectedVariants] = useState<string[]>(
    form.getValues("selectedProducts").reduce((variants: string[], product: any) => {
      const variantIds = product.variants.map((variant: { variantId: string }) => variant.variantId);
      return [...variants, ...variantIds];
    }, [])
  );

  // Check if all variants of a product are selected
  const isProductFullySelected = (product: Product) => {
    return product.productVariants.every((variant) => selectedVariants.includes(variant.productVariantId))
  }

  // Check if any variant of a product is selected
  const isProductPartiallySelected = (product: Product) => {
    return (
      product.productVariants.some((variant) => selectedVariants.includes(variant.productVariantId)) &&
      !isProductFullySelected(product)
    )
  }

  // Toggle product expansion
  const toggleProductExpansion = (productId: string) => {
    setExpandedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  // Handle product selection (selects all variants)
  const handleSelectProduct = (product: Product, isChecked: boolean) => {
    const variantIds = product.productVariants.reduce((variants: string[], variant: ProductVariant) => {
      if (variant.isCanDiscount) {
        variants.push(variant.productVariantId);
      }
      return variants;
    }, [])

    if (isChecked) {
      // Select all variants of this product
      const newSelectedVariants = [...selectedVariants]

      variantIds.forEach((variantId) => {
        if (!newSelectedVariants.includes(variantId)) {
          newSelectedVariants.push(variantId)
          // Initialize quantity to 1 for newly selected variants
          setQuantities((prev) => ({ ...prev, [variantId]: 1 }))
        }
      })

      setSelectedVariants(newSelectedVariants)
    } else {
      // Deselect all variants of this product
      const newSelectedVariants = selectedVariants.filter((id) => !variantIds.includes(id))

      // Remove quantities for deselected variants
      const newQuantities = { ...quantities }
      variantIds.forEach((id) => {
        delete newQuantities[id]
      })

      setSelectedVariants(newSelectedVariants)
      setQuantities(newQuantities)
    }

    // Expand the product when selected
    if (isChecked && !expandedProducts.includes(product.productId)) {
      setExpandedProducts((prev) => [...prev, product.productId])
    }

    updateFormValue()
  }

  // Handle variant selection
  const handleSelectVariant = (variantId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedVariants((prev) => [...prev, variantId])
      // Initialize quantity to 1 for newly selected variant
      setQuantities((prev) => ({ ...prev, [variantId]: 1 }))
    } else {
      setSelectedVariants((prev) => prev.filter((id) => id !== variantId))
      // Remove quantity for deselected variant
      const newQuantities = { ...quantities }
      delete newQuantities[variantId]
      setQuantities(newQuantities)
    }

    updateFormValue()
  }

  // Update form value with selected variants and quantities
  const updateFormValue = () => {
    const selectedItems = []
    for (const product of products) {
      const selectedProductVariants = product.productVariants.filter((variant: ProductVariant) =>
        selectedVariants.includes(variant.productVariantId),
      )

      if (selectedProductVariants.length > 0) {
        selectedItems.push({
          productId: product.productId,
          name: product.name,
          image: product.image,
          variants: selectedProductVariants.map((variant: ProductVariant) => ({
            variantId: variant.productVariantId,
            packageType: variant.packageType,
            netWeight: variant.netWeight,
            price: variant.price,
            quantity: quantities[variant.productVariantId] || 1,
          })),
        })
      }
    }
    form.setValue("selectedProducts", selectedItems, { shouldValidate: true })
  }

  // Handle quantity change for a variant
  const handleQuantityChange = (variantId: string, value: number) => {
    // Ensure quantity is at least 1
    const newValue = Math.max(1, value)
    setQuantities((prev) => ({ ...prev, [variantId]: newValue }))
    updateFormValue()
  }

  // Handle select all
  const handleSelectAll = () => {
    const allVariantIds = products.flatMap((product: Product) =>
      product.productVariants.reduce((variants: string[], variant: ProductVariant) => {
        if (variant.isCanDiscount) {
          variants.push(variant.productVariantId);
        }
        return variants;
      }, [])
    );

    setSelectedVariants((prevSelected) => {
      const isAllSelected = prevSelected.length === allVariantIds.length

      if (isAllSelected) {
        setQuantities({})
        setExpandedProducts([])
        return []
      } else {

        const newQuantities = allVariantIds.reduce((acc, id) => {
          acc[id] = 1
          return acc
        }, {} as Record<string, number>)

        setQuantities(newQuantities)
        setExpandedProducts(products.map((p) => p.productId))
        return allVariantIds
      }
    })

    updateFormValue()
  }

  useEffect(() => {
    updateFormValue()
  }, [selectedVariants, quantities])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" type="button" onClick={() => setSearchTerm("")}>
          Xóa bộ lọc
        </Button>
      </div>

      {form.formState.errors.selectedProducts && (
        <div className="text-sm text-red-500 mt-1">{form.formState.errors.selectedProducts.message as string}</div>
      )}

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  type="button"
                  checked={
                    selectedVariants.length > 0 &&
                    selectedVariants.length === products.flatMap((p) => p.productVariants).length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Chọn tất cả"
                />
              </TableHead>
              <TableHead className="w-24">Ảnh</TableHead>
              <TableHead>Tên sản phẩm / Biến thể</TableHead>
              <TableHead className="text-right">Giá gốc</TableHead>
              <TableHead className="text-right">Giá sau KM</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
              <TableHead className="text-center">Cảnh báo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Không tìm thấy sản phẩm nào
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.flatMap((product: Product) => {
                const isExpanded = expandedProducts.includes(product.productId)
                const isFullySelected = isProductFullySelected(product)
                const isPartiallySelected = isProductPartiallySelected(product)

                const today = new Date();

                const allBatches = product.productVariants.flatMap(variant => variant.productBatches);

                const nearExpirationBatches = allBatches.filter((batch) => {
                  const expirationDate = new Date(batch.expirationDate);
                  const diffDays = (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
                  return diffDays >= 0 && diffDays <= 60;
                });

                const hasWarning = nearExpirationBatches.length > 0;
                // Product row
                const productRow = (
                  <TableRow
                    key={product.productId}
                    className={cn(isFullySelected || isPartiallySelected ? "bg-muted/50" : "", !product.productVariants.some(x => x.isCanDiscount) ? "bg-slate-100/80" : "")}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="h-6 w-6 p-0 mr-1"
                          onClick={() => toggleProductExpansion(product.productId)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <Checkbox
                          checked={isFullySelected}
                          type="button"
                          data-state={isPartiallySelected ? "indeterminate" : "unchecked"}
                          onCheckedChange={(checked) => handleSelectProduct(product, checked === true)}
                          aria-label={`Chọn ${product.name}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ImagePreview
                        images={[product.image]}
                        initialWidth={200}
                        initialHeight={200}
                        className="h-20"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableHead className="text-center">
                      {hasWarning ? <div className="flex items-center justify-center ">
                        <span className="text-base text-red-500 w-5 h-5 flex items-center justify-center">
                          {nearExpirationBatches.length}
                        </span>
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div> : "-"}
                    </TableHead>
                  </TableRow>
                )

                // Variant rows (only if product is expanded)
                const variantRows = isExpanded
                  ? product.productVariants.map((variant) => {
                    const isSelected = selectedVariants.includes(variant.productVariantId)
                    const discountedPrice = form.watch("percentage")
                      ? variant.price * (1 - form.watch("percentage") / 100)
                      : variant.price

                    return (
                      <TableRow key={variant.productVariantId} className={cn(`${isSelected ? "bg-muted/30" : ""}`, "pl-10", !variant.isCanDiscount ? "bg-slate-100/80" : "")}>
                        <TableCell>
                          <div className="flex items-center pl-8">
                            <Checkbox
                              disabled={!variant.isCanDiscount}
                              checked={isSelected}
                              type="button"
                              onCheckedChange={(checked) =>
                                handleSelectVariant(variant.productVariantId, checked === true)
                              }
                              aria-label={`Chọn biến thể ${variant.packageType}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <ImagePreview
                            images={[variant.image]}
                            initialWidth={80}
                            initialHeight={80}
                          />
                        </TableCell>
                        <TableCell className="pl-8 text-sm">
                          {variant.packageType} - {variant.netWeight}g
                        </TableCell>
                        <TableCell className="text-right text-lg">{formatVND(variant.price)}</TableCell>
                        <TableCell className="text-right text-lg">
                          <span className={isSelected ? "text-green-600 font-medium" : "text-muted-foreground"}>
                            {formatVND(discountedPrice)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {isSelected && (
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  handleQuantityChange(
                                    variant.productVariantId,
                                    (quantities[variant.productVariantId] || 1) - 1,
                                  )
                                }
                              >
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                min="1"
                                value={quantities[variant.productVariantId] || 1}
                                onChange={(e) =>
                                  handleQuantityChange(variant.productVariantId, Number.parseInt(e.target.value) || 1)
                                }
                                className="h-8 w-16 text-center"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                  handleQuantityChange(
                                    variant.productVariantId,
                                    (quantities[variant.productVariantId] || 1) + 1,
                                  )
                                }
                              >
                                <PlusCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center ">
                            <ProductBatchCell batches={variant.productBatches || []} />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                  : []

                return [productRow, ...variantRows]
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-muted/50 p-4 rounded-md">
        <h3 className="font-medium mb-2">
          Sản phẩm đã chọn:{" "}
          {
            products.filter((product: Product) =>
              product.productVariants.some((variant: ProductVariant) => selectedVariants.includes(variant.productVariantId)),
            ).length
          }
        </h3>
        {selectedVariants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {products.map((product: Product) => {
              const selectedProductVariants = product.productVariants.filter((variant: ProductVariant) =>
                selectedVariants.includes(variant.productVariantId),
              )

              if (selectedProductVariants.length === 0) return null

              return (
                <div key={product.productId} className="bg-background p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={30}
                      height={30}
                      className="rounded-md object-cover"
                    />
                    <span className="font-medium text-sm truncate">{product.name}</span>
                  </div>

                  <div className="pl-2 space-y-1">
                    {selectedProductVariants.map((variant) => (
                      <div key={variant.productVariantId} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">
                          {variant.packageType} - {variant.netWeight}g
                        </span>
                        <span>SL: {quantities[variant.productVariantId] || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Chưa có sản phẩm nào được chọn</div>
        )}
      </div>
    </div>
  )
}

export default ProductSelection

