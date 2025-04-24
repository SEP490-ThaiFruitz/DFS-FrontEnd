"use client"

import { useFetch } from "@/actions/tanstack/use-tanstack-actions"
import { REQUEST_KEY } from "@/app/key/comm-key"
import ImagePreview from "@/components/custom/_custom-image/image-preview"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { calculateGrowthRate } from "@/lib/calculate"
import { formatVND } from "@/lib/format-currency"
import { cn } from "@/lib/utils"
import type { ApiResponse } from "@/types/types"
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays, subMonths, subWeeks, subYears } from "date-fns"
import { AlertTriangle, CalendarIcon, ChevronDown, ChevronRight, MinusCircle, PlusCircle, Search } from "lucide-react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import type { UseFormReturn } from "react-hook-form"

interface ProductVariant {
  productVariantId: string
  image: string
  netWeight: number
  packageType: string
  price: number,
  lowQuantity: number,
  warningPercentage: number,
  soldQuantity: number,
  revenue: number,
}

interface Product {
  productId: string
  name: string
  image: string
  productVariants: ProductVariant[]
}

interface ProductSelectionProps {
  form: UseFormReturn<any>,
  isUpdate: boolean
}

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

type DateRangeOption = {
  label: string
  getValue: () => DateRange
  getValueOld: () => DateRange
}


const ProductSelection = ({ form, isUpdate }: ProductSelectionProps) => {
  const today = new Date()
  const [date, setDate] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  })

  const [dateOld, setDateOld] = useState<DateRange>({
    from: new Date(),
    to: new Date(),
  })

  const [isCustomRange, setIsCustomRange] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("3days")

  const dateRangeOptions: Record<string, DateRangeOption> = {
    "3days": {
      label: "3 ngày",
      getValue: () => ({
        from: subDays(today, 2),
        to: today,
      }),
      getValueOld: () => ({
        from: subDays(today, 5),
        to: subDays(today, 3),
      }),
    },
    thisWeek: {
      label: "Tuần này",
      getValue: () => ({
        from: startOfWeek(today, { weekStartsOn: 1 }),
        to: endOfWeek(today, { weekStartsOn: 1 }),
      }),
      getValueOld: () => ({
        from: startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
        to: endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }),
      }),

    },
    thisMonth: {
      label: "Tháng này",
      getValue: () => ({
        from: startOfMonth(today),
        to: endOfMonth(today),
      }),
      getValueOld: () => ({
        from: startOfMonth(subMonths(today, 1)),
        to: endOfMonth(subMonths(today, 1)),
      }),
    },
    custom: {
      label: "Từ ngày đến ngày",
      getValue: () => date,
      getValueOld: () => ({
        from: subYears(startOfMonth(subMonths(today, 1)), 1),
        to: subYears(endOfMonth(subMonths(today, 1)), 1),
      }),
    },
  }

  useEffect(() => {
    if (selectedOption !== "custom") {
      setDate(dateRangeOptions[selectedOption].getValue())
      setDateOld(dateRangeOptions[selectedOption].getValueOld())
    }
  }, [selectedOption])

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setIsCustomRange(option === "custom")
    if (option === "custom") {
      setCalendarOpen(true)
    } else {
      setCalendarOpen(false)
    }
  }

  const formatDateRange = () => {
    if (!date.from) return "Chọn ngày"
    if (!date.to) return format(date.from, "dd/MM/yyyy")
    return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
  }

  const formattedUrl = useMemo(() => {
    if (!date?.from || !date?.to) return '/Products/select-products';
    const from = format(date.from, "yyyy-MM-dd");
    const to = format(date.to, "yyyy-MM-dd");
    return `/Products/select-products?startDate=${from}&endDate=${to}`;
  }, [date]);

  const { data: apiResponse, refetch } = useFetch<ApiResponse<Product[]>>(
    formattedUrl,
    [REQUEST_KEY.REQUEST_PRODUCT_MANAGE]
  );

  const formattedOldUrl = useMemo(() => {
    if (!dateOld?.from || !dateOld?.to) return '/Products/select-products';
    const from = format(dateOld.from, "yyyy-MM-dd");
    const to = format(dateOld.to, "yyyy-MM-dd");
    return `/Products/select-products?startDate=${from}&endDate=${to}`;
  }, [dateOld]);

  const { data: apiOldResponse, refetch: refreshOld } = useFetch<ApiResponse<Product[]>>(
    formattedOldUrl,
    [REQUEST_KEY.REQUEST_PRODUCT_OLD_MANAGE]
  );

  useEffect(() => {
    refreshOld()
    refetch()
  }, [date])

  const products = apiResponse?.value || []
  const defaultProducrs = form.getValues("requestItems")
  const [searchTerm, setSearchTerm] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>(
    defaultProducrs.reduce((quantities: Record<string, number>, variant: any) => {
      quantities[variant.variantId] = variant.quantity;
      return quantities;
    }, {})
  );

  const [expandedProducts, setExpandedProducts] = useState<string[]>(
    defaultProducrs.reduce((expandedProducts: string[], variant: any) => {

      expandedProducts.push(variant.productId);

      return expandedProducts;
    }, [])
  );
  const filteredProducts = products.filter((product: Product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const [selectedVariants, setSelectedVariants] = useState<string[]>(
    defaultProducrs.reduce((variants: string[], variant: any) => {
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
            quantity: quantities[variant.productVariantId] || 1
          })
        })
      }
    }
    form.setValue("requestItems", selectedItems.length > 0 ? selectedItems : defaultProducrs, { shouldValidate: true })
  }

  useEffect(() => {

    updateFormValue();

  }, [isUpdate]);


  // Handle quantity change for a variant
  const handleQuantityChange = (variantId: string, value: number) => {
    // Ensure quantity is at least 1
    const newValue = Math.max(1, value)
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
        setQuantities(newQuantities)
        setExpandedProducts(products.map((p) => p.productId))
        return allVariantIds
      }
    })

  }

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
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between sm:w-auto">
              {dateRangeOptions[selectedOption].label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleOptionSelect("3days")}>3 ngày</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("thisWeek")}>Tuần này</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("thisMonth")}>Tháng này</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOptionSelect("custom")}>Từ ngày đến ngày</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover open={isCustomRange && calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left sm:w-auto", !date.from && "text-muted-foreground")}
              onClick={() => isCustomRange && setCalendarOpen(true)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formatDateRange()}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date.from}
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate as DateRange)
                if (newDate?.to) {
                  setCalendarOpen(false)
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {form.formState.errors.requestItems && (
        <div className="text-sm text-red-500 mt-1">{form.formState.errors.requestItems.message as string}</div>
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
              <TableHead className="w-24">Ảnh</TableHead>
              <TableHead>Tên sản phẩm / Biến thể</TableHead>
              <TableHead className="text-right">Giá gốc</TableHead>
              <TableHead className="text-right">Đã bán</TableHead>
              <TableHead className="text-right">Số tiền</TableHead>
              <TableHead className="text-right">Tăng trưởng</TableHead>
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
                const lowStocks = product.productVariants.reduce((variantTotal: number, productVariant: ProductVariant) => {
                  return productVariant.warningPercentage < 100 ? variantTotal + 1 : variantTotal;
                }, 0);

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
                          className="h-20 w-20 p-0 mr-1"
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
                        initialWidth={80}
                        initialHeight={80}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">-</TableCell>
                    <TableCell className="text-right">
                      {lowStocks > 0 && (
                        <div className="flex items-center gap-1">
                          {lowStocks}
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                      )}
                    </TableCell>
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
                              initialWidth={80}
                              initialHeight={80}
                              className="rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-20 w-20 bg-muted rounded-md"></div>
                          )}
                        </TableCell>
                        <TableCell className="pl-8 text-sm">
                          {variant.packageType} - {variant.netWeight}g
                        </TableCell>
                        <TableCell className="text-right">{formatVND(variant.price)}</TableCell>
                        <TableCell className="text-center">{variant.soldQuantity}</TableCell>
                        <TableCell className="text-center">{formatVND(variant.revenue)}</TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const oldVariant = apiOldResponse?.value
                              ?.find((p) => p.productId === product.productId)
                              ?.productVariants.find((v) => v.productVariantId === variant.productVariantId)

                            return calculateGrowthRate(variant.revenue, oldVariant?.revenue ?? 0)
                          })()}
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
                        <TableCell className={`font-bold ${variant.warningPercentage < 100 ? 'text-red-500' : 'text-green-500'}`}>
                          {variant.warningPercentage} %
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
            {products.map((product: Product) => {
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

