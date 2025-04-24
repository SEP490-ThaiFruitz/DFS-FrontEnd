"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { COMBO_KEY } from "@/app/key/comm-key"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatVND } from "@/lib/format-currency"
import type { ApiResponse } from "@/types/types"
import { ChevronDown, ChevronRight, MinusCircle, PlusCircle, Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

interface ProductVariant {
  productVariantId: string
  image: string
  netWeight: number
  packageType: string
  price: number
}

interface Product {
  productId: string
  name: string
  image: string
  productVariants: ProductVariant[]
}

interface ProductSelectionProps {
  form: UseFormReturn<any>,
  maxQuantity: number,
  oldProductVariant: string[]
}

const ProductSelection = ({ form, maxQuantity, oldProductVariant }: ProductSelectionProps) => {

  const { data: apiResponse } = useFetch<ApiResponse<Product[]>>(
    '/Products/select-products',
    [COMBO_KEY.COMBOS_PRODUCT_MANAGE],
  )

  const products = apiResponse?.value?.map(product => {
    return {
      ...product,
      productVariants: product.productVariants.filter((variant: ProductVariant) =>
        !oldProductVariant?.includes(variant.productVariantId)
      )
    };
  }
  )?.filter(product => product.productVariants.length > 0) ?? [];

  const [searchTerm, setSearchTerm] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>(
    form.getValues("selectedProducts").reduce((quantities: Record<string, number>, variant: any) => {
      quantities[variant.variantId] = variant.quantity;
      return quantities;
    }, {})
  );
  const totalQuantity = Object.values(quantities).reduce((total, num) => total + num, 0)
  const [expandedProducts, setExpandedProducts] = useState<string[]>(
    form.getValues("selectedProducts").reduce((expandedProducts: string[], variant: any) => {

      expandedProducts.push(variant.productId);

      return expandedProducts;
    }, [])
  );
  const filteredProducts = products.filter((product: Product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const [selectedVariants, setSelectedVariants] = useState<string[]>(
    form.getValues("selectedProducts").reduce((variants: string[], variant: any) => {
      return [...variants, variant.variantId];
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
      variants.push(variant.productVariantId);

      return variants;
    }, [])

    if (isChecked) {
      if (!handleMaxQuantity(variantIds.length)) {
        return []
      }
      // Select all variants of this product
      const newSelectedVariants = [...selectedVariants]

      variantIds.forEach((variantId) => {
        if (!newSelectedVariants.includes(variantId)) {
          newSelectedVariants.push(variantId)
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
  }

  // Handle variant selection
  const handleSelectVariant = (variantId: string, isChecked: boolean) => {
    if (isChecked) {
      if (!handleMaxQuantity(1)) {
        return;
      }
      setSelectedVariants((prev) => [...prev, variantId])

      setQuantities((prev) => ({ ...prev, [variantId]: 1 }))
    } else {
      setSelectedVariants((prev) => prev.filter((id) => id !== variantId))
      // Remove quantity for deselected variant
      const newQuantities = { ...quantities }
      delete newQuantities[variantId]
      setQuantities(newQuantities)
    }
  }

  // Update form value with selected variants and quantities
  const updateFormValue = () => {
    const selectedItems: any = []
    for (const product of products) {
      const selectedProductVariants = product.productVariants.filter((variant: ProductVariant) =>
        selectedVariants.includes(variant.productVariantId),
      )

      if (selectedProductVariants.length > 0) {
        selectedProductVariants.forEach((variant: ProductVariant) => {
          selectedItems.push({
            productId: product.productId,
            variantId: variant.productVariantId,
            image: variant.image,
            name: product.name,
            packageType: variant.packageType,
            netWeight: variant.netWeight,
            price: variant.price,
            quantity: quantities[variant.productVariantId] || 1,

          })
        })
      }
    }
    form.setValue("selectedProducts", selectedItems, { shouldValidate: true })
  }

  // Handle quantity change for a variant
  const handleQuantityChange = (variantId: string, value: number) => {
    // Ensure quantity is at least 1
    const newValue = Math.max(1, value)
    if (handleMaxQuantity(quantities[variantId] > value ? -1 : 1))
      setQuantities((prev) => ({ ...prev, [variantId]: newValue }))

  }

  // Handle select all
  const handleSelectAll = () => {
    const allVariantIds = products.flatMap((product: Product) =>
      product.productVariants.reduce((variants: string[], variant: ProductVariant) => {

        variants.push(variant.productVariantId);

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
        if (!handleMaxQuantity(Object.values(newQuantities).reduce((total, num) => total + num, 0))) {
          return [...selectedVariants]
        }
        setQuantities(newQuantities)
        setExpandedProducts(products.map((p) => p.productId))
        return allVariantIds
      }
    })
  }
  const handleMaxQuantity = (quantity: number) => {
    if ((totalQuantity + quantity) > maxQuantity) {
      toast.error(`Số lượng tối đa ${maxQuantity}`)
      return false;
    }
    return true;
  }

  useEffect(() => {
    updateFormValue();
  }, [quantities])

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
      <div className="mt-3">
        (Số lượng tối đa {totalQuantity}  / {maxQuantity})
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
                  checked={
                    selectedVariants.length > 0 &&
                    selectedVariants.length === products.flatMap((p) => p.productVariants).length
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="Chọn tất cả"
                />
              </TableHead>
              <TableHead className="w-12">Ảnh</TableHead>
              <TableHead>Tên sản phẩm / Biến thể</TableHead>
              <TableHead className="text-right">Giá gốc</TableHead>
              <TableHead className="text-center">Số lượng</TableHead>
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

                // Product row
                const productRow = (
                  <TableRow
                    key={product.productId}
                    className={isFullySelected || isPartiallySelected ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 mr-1"
                          onClick={() => toggleProductExpansion(product.productId)}
                        >
                          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </Button>
                        <Checkbox
                          checked={isFullySelected}
                          data-state={isPartiallySelected ? "indeterminate" : "unchecked"}
                          onCheckedChange={(checked) => handleSelectProduct(product, checked === true)}
                          aria-label={`Chọn ${product.name}`}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ImagePreview
                        images={[product.image]}
                        initialWidth={40}
                        initialHeight={40}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                  </TableRow>
                )

                // Variant rows (only if product is expanded)
                const variantRows = isExpanded
                  ? product.productVariants.map((variant) => {
                    const isSelected = selectedVariants.includes(variant.productVariantId)

                    return (
                      <TableRow key={variant.productVariantId} className={isSelected ? "bg-muted/30" : ""}>
                        <TableCell>
                          <div className="flex items-center pl-8">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleSelectVariant(variant.productVariantId, checked === true)
                              }
                              aria-label={`Chọn biến thể ${variant.packageType}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {variant.image ? (
                            <ImagePreview
                              images={[variant.image]}
                              initialWidth={40}
                              initialHeight={40}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-muted rounded-md"></div>
                          )}
                        </TableCell>
                        <TableCell className="pl-8 text-sm">
                          {variant.packageType} - {variant.netWeight}g
                        </TableCell>
                        <TableCell className="text-right">{formatVND(variant.price)}</TableCell>
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
            selectedVariants.length
          }
        </h3>
        {selectedVariants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {products?.map((product: Product) => {
              const selectedProductVariants = product.productVariants.filter((variant: ProductVariant) =>
                selectedVariants.includes(variant.productVariantId),
              )

              if (selectedProductVariants.length === 0) return null

              return selectedProductVariants.map((variant: ProductVariant) => (
                <div key={variant.productVariantId} className="bg-background p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Image
                      src={variant.image || "/placeholder.svg"}
                      width={30}
                      height={30}
                      alt={product.name}
                      className="rounded-md object-cover"
                    />
                    <span className="font-medium text-sm truncate">{product.name}</span>
                  </div>

                  <div className="pl-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {variant.packageType} - {variant.netWeight}g
                      </span>
                      <span>SL: {quantities[variant.productVariantId] || 1}</span>
                    </div>
                  </div>
                </div>
              ))
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

