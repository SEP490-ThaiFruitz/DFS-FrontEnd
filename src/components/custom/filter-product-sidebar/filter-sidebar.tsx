"use client";
import Image from "next/image";
import {
  Apple,
  ArrowUpDown,
  BookmarkPlus,
  CheckCircle,
  ChevronDown,
  CircleCheck,
  DollarSign,
  Filter,
  History,
  Package,
  Percent,
  Search,
  Settings,
  Star,
  Tag,
  Weight,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { formatVND } from "@/lib/format-currency";
import { Dispatch, memo, SetStateAction } from "react";
import { CardProductProps } from "@/components/global-components/card/card-product";
import { Product } from "@/hooks/use-cart-store";
import { FilterTypes } from "./product-filter-sidebar";
import { Logo } from "@/components/global-components/logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";

// This component assumes all the variables from the original code are passed as props
// or defined within the component's parent

interface FilterSidebarProps {
  searchQuery: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeFiltersCount: number;
  resetFilters: () => void;
  filteredProducts: [] | Product[];
  products: Product[];
  saveCurrentFilter?: () => void;
  savedFilters?: any[];
  setSavedFilters?: Dispatch<
    SetStateAction<
      (
        | {
            id: number;
            name: string;
            filters: {
              categories: never[];
              tags: string[];
              hasPromotion: boolean;
            };
          }
        | {
            id: number;
            name: string;
            filters: {
              categories: never[];
              hasPromotion: boolean;
              tags?: undefined;
            };
          }
      )[]
    >
  >;
  applySavedFilter?: (savedFilter: any) => void;
  popularFilters: any[];
  handleTagChange: (tag: string) => void;
  filters: FilterTypes;
  categories: string[];
  handleCategoryChange?: (value: string) => void;
  tags: string[];
  packageTypes: any[];
  handlePackageTypeChange: (packageType: string) => void;
  priceRange: { min: number; max: number };
  handlePriceRangeChange: (value: number[]) => void;
  weightRange: { min: number; max: number };
  handleWeightRangeChange: (value: number[]) => void;
  handleNutritionRangeChange: (nutrient: string, value: number[]) => void;
  handlePromotionChange: (checked: boolean) => void;
  handleInStockChange: (checked: boolean) => void;
  compareList?: any[];
  toggleCompare: (productVariantId: string) => void;
  recentlyViewed: [] | CardProductProps[];
}

const FilterSidebar = ({
  searchQuery = "",
  handleSearchChange,
  activeFiltersCount = 0,
  resetFilters = () => {},
  filteredProducts = [],
  products = [],
  saveCurrentFilter = () => {},
  savedFilters = [],
  setSavedFilters = () => {},
  applySavedFilter = (savedFilter: any) => {},
  popularFilters = [],
  handleTagChange = (tag: string) => {},
  filters,
  categories = [],
  handleCategoryChange = (category: string) => {},
  tags = [],
  packageTypes = [],
  handlePackageTypeChange = (packageType: string) => {},
  priceRange = { min: 0, max: 100000 },
  handlePriceRangeChange = (value: number[]) => {},
  weightRange = { min: 0, max: 100 },
  handleWeightRangeChange,
  handleNutritionRangeChange,
  handlePromotionChange,
  handleInStockChange,
  compareList = [],
  toggleCompare = (productVariantId: string) => {},
  recentlyViewed = [],
}: FilterSidebarProps) => {
  const commonStyle = "bg-white";

  return (
    <ScrollArea className="h-full overflow-hidden rounded-3xl">
      <SidebarHeader className="  bg-white">
        <div className="sticky top-0 z-10 pb-2 pt-3 px-4">
          <Logo height={70} width={70} />

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-9 h-10  inputStyle"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0 bg-white rounded-3xl">
        {/* Filter Summary */}
        <div className="px-4 py-3 ">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full  flex items-center justify-center">
                <Filter className="h-4 w-4 text-slate-700" />
              </div>
              <h3 className="font-medium text-sm">Bộ lọc</h3>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 text-slate-700 hover:text-slate-700 hover:bg-slate-500/10 transition duration-300"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Xóa
              </Button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-3 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>Sản phẩm phù hợp:</span>
                <span className="font-medium text-foreground">
                  {filteredProducts.length}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full  overflow-hidden">
                <div
                  className="h-full  rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(
                      100,
                      (filteredProducts.length / products.length) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Popular Filters */}
        <div className="px-4 py-3 border-b border-border/40">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            </div>
            <span className="text-sm font-semibold">Bộ lọc phổ biến</span>
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {popularFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                className={`h-9 text-xs justify-between border-slate-200/20 hover:bg-slate-200/5 shadow-sm transition-colors duration-200 relative ${
                  filters.tags.includes(filter.name)
                    ? "bg-slate-700/10 border-slate-700/30 text-slate-700"
                    : ""
                }`}
                onClick={() => handleTagChange(filter.name)}
              >
                <span>{filter.name}</span>
                <AdvancedColorfulBadges
                  color="green"
                  className="ml-1 h-5 text-[10px] rounded-full absolute -top-1 -right-1"
                >
                  {filter.count}
                </AdvancedColorfulBadges>
              </Button>
            ))}
          </div>
        </div>

        <Accordion
          type="multiple"
          defaultValue={[
            "categories",
            "tags",
            "packageTypes",
            "priceRange",
            "weightRange",
          ]}
          className="border-b border-border/40"
        >
          {/* Categories */}

          <AccordionItem
            value="categories"
            className="border-b border-border/40"
          >
            <SidebarGroup className="py-0 bg-white">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shadow-sm">
                    <CircleCheck className="h-3.5 w-3.5 text-sky-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm font-semibold">Danh mục</span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down transition-all duration-300 ease-in-out">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2 group hoverAnimate"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={filters.categories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                          className="data-[state=checked]:bg-sky-700 data-[state=checked]:border-sky-700"
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className={`flex-1 cursor-pointer group-hover:text-primary transition-colors ${
                            filters.categories.includes(category)
                              ? "font-medium text-primary"
                              : ""
                          }`}
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Tags */}

          <AccordionItem value="tags" className="border-b border-border/40">
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm">
                    <Tag className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-semibold">Tags</span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <AdvancedColorfulBadges
                        key={tag}
                        color={filters.tags.includes(tag) ? "violet" : "silver"}
                        // variant={
                        //   filters.tags.includes(tag) ? "default" : "outline"
                        // }

                        className="cursor-pointer transition-all duration-200 rounded-3xl"
                        // className={`cursor-pointer transition-all duration-200 ${
                        //   filters.tags.includes(tag)
                        //     ? "bg-primary text-primary-foreground scale-105"
                        //     : "hover:bg-primary/10"
                        // }`}
                        onClick={() => handleTagChange(tag)}
                      >
                        {tag}
                      </AdvancedColorfulBadges>
                    ))}
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Package Types */}
          <AccordionItem
            value="packageTypes"
            className="border-b border-border/40"
          >
            <SidebarGroup className="py-0 bg-white">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm">
                    <Package className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm font-semibold">Loại đóng gói</span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-2">
                    {packageTypes.map((packageType) => (
                      <div
                        key={packageType}
                        className="flex items-center space-x-2 group hoverAnimate"
                      >
                        <Checkbox
                          id={`package-${packageType}`}
                          checked={filters.packageTypes.includes(packageType)}
                          onCheckedChange={() =>
                            handlePackageTypeChange(packageType)
                          }
                          className="data-[state=checked]:bg-sky-700 data-[state=checked]:border-sky-700"
                        />
                        <Label
                          htmlFor={`package-${packageType}`}
                          className={`flex-1 cursor-pointer text-sm group-hover:text-primary transition-colors ${
                            filters.packageTypes.includes(packageType)
                              ? "font-medium text-slate-700"
                              : ""
                          }`}
                        >
                          {packageType}
                        </Label>
                      </div>
                    ))}
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem
            value="priceRange"
            className="border-b border-border/40"
          >
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-sm">
                    <DollarSign className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-sm font-semibold">Khoảng giá</span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-6">
                    <div className="pt-2">
                      <DualRangeSlider
                        // value={[priceRange.min, priceRange.max]}
                        value={filters.priceRange}
                        min={priceRange.min}
                        max={priceRange.max}
                        defaultValue={[priceRange.min, priceRange.max]}
                        className="pt-4"
                        onValueChange={handlePriceRangeChange}
                        step={1}
                        locales="vi-VN"
                        format={{ style: "currency", currency: " vi-VN" }}
                        label={() => <>đ</>}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-md border border-input px-3 py-1.5 text-sm bg-background">
                        {filters.priceRange[0].toLocaleString()}đ
                      </div>
                      <div className="text-sm text-muted-foreground">-</div>
                      <div className="rounded-md border border-input px-3 py-1.5 text-sm bg-background">
                        {filters.priceRange[1].toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Weight Range */}
          <AccordionItem
            value="weightRange"
            className="border-b border-border/40"
          >
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shadow-sm">
                    <Weight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <span className="text-sm font-semibold">Trọng lượng</span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-6">
                    <div className="pt-4">
                      <DualRangeSlider
                        value={filters.weightRange}
                        min={weightRange.min}
                        max={weightRange.max}
                        className="pt-4"
                        onValueChange={handleWeightRangeChange}
                        step={1}
                        id="weight-range"
                        label={() => <>g</>}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-md border border-input px-3 py-1.5 text-sm bg-background">
                        {filters.weightRange[0]}g
                      </div>
                      <div className="text-sm text-muted-foreground">-</div>
                      <div className="rounded-md border border-input px-3 py-1.5 text-sm bg-background">
                        {filters.weightRange[1]}g
                      </div>
                    </div>
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>

          {/* Nutrition Facts */}

          <AccordionItem
            value="nutrition"
            className="border-b border-border/40"
          >
            <SidebarGroup className="py-0">
              <AccordionTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
                <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                  <div className="h-6 w-6 rounded-md bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center shadow-sm">
                    <Apple className="h-3.5 w-3.5 text-lime-600 dark:text-lime-400" />
                  </div>
                  <span className="text-sm font-semibold">Dinh dưỡng</span>
                </SidebarGroupLabel>
              </AccordionTrigger>
              <AccordionContent className="animate-accordion-down">
                <SidebarGroupContent className="px-4 py-2">
                  <div className="space-y-8">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-semibold">
                          Calories
                        </Label>
                        <span className="text-base text-slate-700">
                          {filters?.nutritionRange?.calories?.[0] || 0} -{" "}
                          {filters?.nutritionRange?.calories?.[1] || 0} kcal
                        </span>
                      </div>

                      <DualRangeSlider
                        value={filters.nutritionRange.calories}
                        min={0}
                        max={200}
                        defaultValue={[0, 200]}
                        className="pt-4 font-semibold text-xs"
                        onValueChange={(value) =>
                          handleNutritionRangeChange("calories", value)
                        }
                        step={10}
                        id="calories"
                        label={() => <>kcal</>}
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-semibold">
                          Protein
                        </Label>
                        <span className="text-base text-slate-700">
                          {filters?.nutritionRange?.protein?.[0] || 0} -{" "}
                          {filters?.nutritionRange?.protein?.[1] || 0} g
                        </span>
                      </div>

                      <DualRangeSlider
                        value={filters.nutritionRange?.protein}
                        min={0}
                        max={5}
                        step={0.5}
                        defaultValue={[0, 5]}
                        className="pt-4 font-semibold text-xs"
                        onValueChange={(value) =>
                          handleNutritionRangeChange("protein", value)
                        }
                        id="protein"
                        label={() => <>g</>}
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-base font-semibold">Carbs</Label>
                        <span className="text-base text-slate-700">
                          {filters.nutritionRange?.carbs?.[0] || 0} -{" "}
                          {filters.nutritionRange?.carbs?.[1] || 0} g
                        </span>
                      </div>

                      <DualRangeSlider
                        value={filters.nutritionRange?.carbs}
                        min={0}
                        max={40}
                        step={1}
                        defaultValue={[0, 40]}
                        className="pt-4 font-semibold text-xs"
                        onValueChange={(value) =>
                          handleNutritionRangeChange("carbs", value)
                        }
                        id="carbs"
                        label={() => <>g</>}
                      />
                    </div>
                  </div>
                </SidebarGroupContent>
              </AccordionContent>
            </SidebarGroup>
          </AccordionItem>
        </Accordion>

        {/* Other Filters */}
        <SidebarGroup className="border-b border-border/40 py-3">
          <SidebarGroupLabel className="px-4 font-medium flex items-center gap-1.5">
            <div className="h-5 w-5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Settings className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
            </div>
            Lọc thêm
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4 py-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="has-promotion"
                  className={`cursor-pointer flex items-center gap-1.5 ${
                    filters.hasPromotion ? "font-medium text-primary" : ""
                  }`}
                >
                  <Percent className="h-3.5 w-3.5" />
                  Có khuyến mãi
                </Label>
                <Switch
                  id="has-promotion"
                  checked={filters.hasPromotion}
                  onCheckedChange={handlePromotionChange}
                  className="data-[state=checked]:bg-sky-700"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="in-stock"
                  className={`cursor-pointer flex items-center gap-1.5 ${
                    filters.inStock ? "font-medium text-primary" : ""
                  }`}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Còn hàng
                </Label>
                <Switch
                  id="in-stock"
                  checked={filters.inStock}
                  onCheckedChange={handleInStockChange}
                  className="data-[state=checked]:bg-sky-700"
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Compare Products Section */}
        {compareList.length > 0 && (
          <div className="border-b border-border/40 py-3 ">
            <h4 className="px-4 font-medium mb-2 flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-primary" />
              So sánh sản phẩm ({compareList.length}/3)
            </h4>
            <div className="px-4">
              <div className="flex flex-col gap-2">
                {compareList.map((id) => {
                  const product = products.find((p) => p.id === id);
                  if (!product) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 p-2 rounded-md bg-background/50 border border-border/30 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/30">
                        <Image
                          src={
                            product.mainImageUrl ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate">
                          {product.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {(
                            product.variant?.[0]?.promotion?.price ||
                            product.variant?.[0]?.price
                          ).toLocaleString()}
                          đ
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => toggleCompare(product.id)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  );
                })}
                {compareList.length >= 2 && (
                  <Button size="sm" className="w-full mt-1">
                    So sánh ngay
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <div className="border-b border-border/40 py-3">
            <h4 className="px-4 font-medium mb-2 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-primary" />
              Đã xem gần đây
            </h4>
            <ScrollArea className="h-[120px]">
              <div className="px-4 space-y-2">
                {recentlyViewed.map((product) => {
                  if (!product) return null;

                  return (
                    <div
                      key={product.variant.productVariantId}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/30">
                        <Image
                          src={
                            product.mainImageUrl ||
                            "/placeholder.svg?height=40&width=40"
                          }
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate">
                          {product.name}
                        </h5>
                        <span className="text-xs text-muted-foreground">
                          {formatVND(
                            product.variant.promotion?.price ||
                              product.variant.price
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </SidebarContent>
    </ScrollArea>
  );
};

// Logo component (placeholder)

export default memo(FilterSidebar);
