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
  return (
    <ScrollArea className="h-full">
      <SidebarHeader>
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-2 pt-3 px-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-shrink-0">
              <Logo height={40} width={40} />
            </div>
            {/* <h2 className="text-lg font-semibold">Bộ lọc sản phẩm</h2> */}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-9 h-10 border-primary/20 focus-visible:ring-primary bg-background/80 backdrop-blur-sm"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        {/* Filter Summary */}
        <div className="px-4 py-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <Filter className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-medium">Bộ lọc</h3>
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
                className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Xóa
              </Button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Sản phẩm phù hợp:</span>
                <span className="font-medium text-foreground">
                  {filteredProducts.length}
                </span>
              </div>
              <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
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

        {/* Saved Filters */}
        <div className="px-4 py-3 border-b border-border/40">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <BookmarkPlus className="h-3.5 w-3.5 text-primary" />
              </div>
              <span>Bộ lọc đã lưu</span>
            </h4>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs bg-background/80 border-primary/20 hover:bg-primary/5 hover:text-primary"
              onClick={saveCurrentFilter}
              disabled={activeFiltersCount === 0}
            >
              <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
              Lưu
            </Button>
          </div>
          <ScrollArea className="h-[80px] w-full whitespace-nowrap">
            <div className="flex gap-2 pb-2 pt-1">
              {savedFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-primary/20 hover:bg-primary/5 relative group shadow-sm"
                  onClick={() => applySavedFilter(filter)}
                >
                  {filter.name}
                  <span className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedFilters((prev) =>
                          prev.filter((f) => f.id !== filter.id)
                        );
                      }}
                    >
                      <X className="h-2 w-2" />
                    </Button>
                  </span>
                </Button>
              ))}
              {savedFilters.length === 0 && (
                <div className="flex items-center justify-center w-full h-full text-xs text-muted-foreground italic">
                  Lưu bộ lọc để truy cập nhanh
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Popular Filters */}
        <div className="px-4 py-3 border-b border-border/40">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            </div>
            <span>Bộ lọc phổ biến</span>
          </h4>
          <div className="grid grid-cols-2 gap-2.5">
            {popularFilters.map((filter) => (
              <Button
                key={filter.id}
                variant="outline"
                size="sm"
                className={`h-9 text-xs justify-between border-primary/20 hover:bg-primary/5 shadow-sm transition-colors duration-200 ${
                  filters.tags.includes(filter.name)
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : ""
                }`}
                onClick={() => handleTagChange(filter.name)}
              >
                <span>{filter.name}</span>
                <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <Collapsible
          defaultOpen
          className="border-b border-border/40 transition-all duration-300 ease-in-out"
        >
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                  <CircleCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm">Danh mục</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down transition-all duration-300 ease-in-out">
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center space-x-2 group"
                    >
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Tags */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm">
                  <Tag className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm">Tags</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down">
              <SidebarGroupContent className="px-4 py-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        filters.tags.includes(tag) ? "default" : "outline"
                      }
                      className={`cursor-pointer transition-all duration-200 ${
                        filters.tags.includes(tag)
                          ? "bg-primary text-primary-foreground scale-105"
                          : "hover:bg-primary/10"
                      }`}
                      onClick={() => handleTagChange(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Package Types */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm">
                  <Package className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm">Loại đóng gói</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down">
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-2">
                  {packageTypes.map((packageType) => (
                    <div
                      key={packageType}
                      className="flex items-center space-x-2 group"
                    >
                      <Checkbox
                        id={`package-${packageType}`}
                        checked={filters.packageTypes.includes(packageType)}
                        onCheckedChange={() =>
                          handlePackageTypeChange(packageType)
                        }
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor={`package-${packageType}`}
                        className={`flex-1 cursor-pointer text-sm group-hover:text-primary transition-colors ${
                          filters.packageTypes.includes(packageType)
                            ? "font-medium text-primary"
                            : ""
                        }`}
                      >
                        {packageType}
                      </Label>
                    </div>
                  ))}
                </div>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Price Range */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-sm">
                  <DollarSign className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm">Khoảng giá</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down">
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-6">
                  <div className="pt-2">
                    <Slider
                      defaultValue={[priceRange.min, priceRange.max]}
                      min={priceRange.min}
                      max={priceRange.max}
                      step={500}
                      value={filters.priceRange}
                      onValueChange={handlePriceRangeChange}
                      className="[&>span]:bg-primary"
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Weight Range */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shadow-sm">
                  <Weight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-sm">Trọng lượng</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down">
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-6">
                  <div className="pt-2">
                    <Slider
                      defaultValue={[weightRange.min, weightRange.max]}
                      min={weightRange.min}
                      max={weightRange.max}
                      step={1}
                      value={filters.weightRange}
                      onValueChange={handleWeightRangeChange}
                      className="[&>span]:bg-primary"
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Nutrition Facts */}
        <Collapsible className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center shadow-sm">
                  <Apple className="h-3.5 w-3.5 text-lime-600 dark:text-lime-400" />
                </div>
                <span className="text-sm">Dinh dưỡng</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down">
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Calories</Label>
                      <span className="text-xs text-muted-foreground">
                        {filters?.nutritionRange?.calories?.[0] || 0} -{" "}
                        {filters?.nutritionRange?.calories?.[1] || 0} kcal
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 200]}
                      min={0}
                      max={200}
                      step={10}
                      value={filters.nutritionRange.calories}
                      onValueChange={(value) =>
                        handleNutritionRangeChange("calories", value)
                      }
                      className="[&>span]:bg-primary"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Protein</Label>
                      <span className="text-xs text-muted-foreground">
                        {filters?.nutritionRange?.protein?.[0] || 0} -{" "}
                        {filters?.nutritionRange?.protein?.[1] || 0} g
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 5]}
                      min={0}
                      max={5}
                      step={0.5}
                      value={filters.nutritionRange?.protein}
                      onValueChange={(value) =>
                        handleNutritionRangeChange("protein", value)
                      }
                      className="[&>span]:bg-primary"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Carbs</Label>
                      <span className="text-xs text-muted-foreground">
                        {filters.nutritionRange?.carbs?.[0] || 0} -{" "}
                        {filters.nutritionRange?.carbs?.[1] || 0} g
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 40]}
                      min={0}
                      max={40}
                      step={2}
                      value={filters.nutritionRange?.carbs}
                      onValueChange={(value) =>
                        handleNutritionRangeChange("carbs", value)
                      }
                      className="[&>span]:bg-primary"
                    />
                  </div>
                </div>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

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
                  className="data-[state=checked]:bg-primary"
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
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Compare Products Section */}
        {compareList.length > 0 && (
          <div className="border-b border-border/40 py-3 bg-muted/10">
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
