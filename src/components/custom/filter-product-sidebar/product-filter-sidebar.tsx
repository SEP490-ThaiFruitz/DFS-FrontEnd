"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Grid3X3,
  Search,
  SlidersHorizontal,
  Star,
  X,
  Box,
  StickyNote,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { Product } from "@/hooks/use-cart-store";
import { memo, useCallback, useEffect, useState } from "react";
import {
  CardProduct,
  CardProductProps,
} from "@/components/global-components/card/card-product";
import FilterSidebar from "./filter-sidebar";
import { toLowerCaseNonAccentVietnamese } from "@/utils/non-accent";
import { AdvancedColorfulBadges } from "@/components/global-components/badge/advanced-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComboProductCard, {
  ComboProduct,
} from "@/components/global-components/card/card-combo";
import { EmptyState } from "@/components/global-components/empty-state";

// Extract unique categories, package types, etc. from the data
const extractUniqueValues = (products: Product[] | []) => {
  const categories = new Set<string>();
  const packageTypes = new Set<string>();
  const tags = new Set<string>();
  const colors = new Set();
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = 0;
  let minWeight = Number.POSITIVE_INFINITY;
  let maxWeight = 0;

  products?.forEach((product) => {
    product.categories.forEach((category) => {
      categories.add(category.name);
    });

    product.tags?.forEach((tag: string) => {
      tags.add(tag);
    });

    product.variant.forEach((variant) => {
      packageTypes.add(variant.packageType);
      minPrice = Math.min(minPrice, variant.price);
      maxPrice = Math.max(maxPrice, variant.price);
      minWeight = Math.min(minWeight, variant.netWeight);
      maxWeight = Math.max(maxWeight, variant.netWeight);
    });

    // add more options
  });

  return {
    categories: Array.from(categories),
    packageTypes: Array.from(packageTypes),
    tags: Array.from(tags),
    colors: Array.from(colors),
    priceRange: { min: minPrice, max: maxPrice },
    weightRange: { min: minWeight, max: maxWeight },
  };
};

// Sort options
const sortOptions = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "newest", label: "Mới nhất" },
  { value: "priceAsc", label: "Giá: Thấp đến cao" },
  { value: "priceDesc", label: "Giá: Cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "bestSelling", label: "Bán chạy nhất" },
];

// Popular filters
const popularFilters = [
  { id: "organic", name: "Hữu cơ", count: 24 },
  { id: "no-sugar", name: "Không đường", count: 18 },
  { id: "high-protein", name: "Chất đạm", count: 12 },
  { id: "gluten-free", name: "Gluten Free", count: 32 },
];

export type FilterTypes = {
  // categories: CategoryTypes[];
  categories: string[];
  packageTypes: string[];
  tags: string[];
  colors: string[];
  priceRange: number[];
  weightRange: number[];
  hasPromotion: boolean;
  inStock: boolean;
  searchQuery: string;

  nutritionRange: Record<string, number[]>;
  // nutritionRange: {
  //   calories: number[];
  //   protein: number[];
  //   carbs: number[];
  //   fat: number[];
  // };
};

interface ProductFilterSidebarProps {
  products: Product[] | [];

  combos: ComboProduct[] | [];

  comboRefetch: () => void;
}

export const ProductFilterSidebar = memo(
  ({ products, combos, comboRefetch }: ProductFilterSidebarProps) => {
    const { categories, packageTypes, tags, colors, priceRange, weightRange } =
      extractUniqueValues(products);

    const [filters, setFilters] = useState<FilterTypes>({
      categories: [],
      packageTypes: [],
      tags: [],
      colors: [],
      priceRange: [priceRange.min, priceRange.max],
      weightRange: [weightRange.min, weightRange.max],
      hasPromotion: false,
      inStock: false,
      searchQuery: "",
      nutritionRange: {
        calories: [0, 200],
        protein: [0, 5],
        carbs: [0, 40],
        fat: [0, 5],
      },
    });

    const [sortBy, setSortBy] = useState("popular");
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const [filteredProducts, setFilteredProducts] = useState<Product[] | []>(
      []
    );
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [wishlist, setWishlist] = useState<string[] | []>([]);
    const [compareList, setCompareList] = useState<string[] | []>([]);

    const [recentlyViewed, setRecentlyViewed] = useState<
      CardProductProps[] | []
    >([]);
    const [savedFilters, setSavedFilters] = useState([
      {
        id: 1,
        name: "Organic Only",
        filters: { categories: [], tags: ["Organic"], hasPromotion: false },
      },
      {
        id: 2,
        name: "Promotion Items",
        filters: { categories: [], hasPromotion: true },
      },
    ]);

    const [searchQuery, setSearchQuery] = useState("");

    // Simulate loading
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
        setFilteredProducts(products);
      }, 1500);

      return () => clearTimeout(timer);
    }, [products]);

    // Update active filters count
    useEffect(() => {
      let count = 0;
      if (filters.categories.length > 0) count++;
      if (filters.packageTypes.length > 0) count++;
      if (filters.tags.length > 0) count++;
      if (filters.colors.length > 0) count++;
      if (
        filters.priceRange[0] > priceRange.min ||
        filters.priceRange[1] < priceRange.max
      )
        count++;
      if (
        filters.weightRange[0] > weightRange.min ||
        filters.weightRange[1] < weightRange.max
      )
        count++;
      if (filters.hasPromotion) count++;
      if (filters.inStock) count++;
      if (filters.searchQuery) count++;

      if (
        filters.nutritionRange.protein[0] > 0 ||
        filters.nutritionRange.protein[1] < 5
      )
        count++;
      if (
        filters.nutritionRange.carbs[0] > 0 ||
        filters.nutritionRange.carbs[1] < 40
      )
        count++;

      setActiveFiltersCount(count);
    }, [filters, priceRange, weightRange]);

    // Apply filters to products
    useEffect(() => {
      if (isLoading) return;

      const filtered = products.filter((product) => {
        // Filter by search query

        const matchesSearch =
          filters.searchQuery &&
          !toLowerCaseNonAccentVietnamese(product.name).includes(
            toLowerCaseNonAccentVietnamese(filters.searchQuery)
          ) &&
          !product.variant.some((variantItem) =>
            toLowerCaseNonAccentVietnamese(variantItem.packageType)
              .toLowerCase()
              .includes(toLowerCaseNonAccentVietnamese(filters.searchQuery))
          );

        if (matchesSearch) return false;

        // Filter by categories
        if (filters.categories.length > 0) {
          const productCategories = product.categories.map((c) => c.name);
          if (
            !filters.categories.some((cat) => productCategories.includes(cat))
          ) {
            return false;
          }
        }

        // Filter by tags
        if (filters.tags.length > 0) {
          if (
            !product.tags ||
            !filters.tags.some(
              (tag: string) => product.tags && product?.tags.includes(tag)
            )
          ) {
            return false;
          }
        }

        // Check variants for other filters
        const hasMatchingVariant = product.variant.some((variant) => {
          // Filter by package type
          if (
            filters.packageTypes.length > 0 &&
            !filters.packageTypes.includes(variant.packageType)
          ) {
            return false;
          }

          // Filter by price range
          if (
            variant.price < filters.priceRange[0] ||
            variant.price > filters.priceRange[1]
          ) {
            return false;
          }

          // Filter by weight range
          if (
            variant.netWeight < filters.weightRange[0] ||
            variant.netWeight > filters.weightRange[1]
          ) {
            return false;
          }

          // Filter by promotion
          if (filters.hasPromotion && !variant.promotion) {
            return false;
          }

          // Filter by stock
          if (filters.inStock && variant.stockQuantity <= 0) {
            return false;
          }

          return true;
        });

        const parseNumber = (value: string | number): number => {
          return typeof value === "string" ? parseFloat(value) : value;
        };

        if (product.nutritionFacts) {
          const {
            calories = 0,
            protein = 0,
            carbs = 0,
            fat = 0,
          } = product.nutritionFacts;

          const parsedCalories = parseNumber(calories);
          const parsedProtein = parseNumber(protein);
          const parsedCarbs = parseNumber(carbs);
          const parsedFat = parseNumber(fat);

          console.log(parsedCalories, parsedProtein);

          const { nutritionRange } = filters;

          if (
            parsedCalories > (nutritionRange.calories?.[0] ?? 0) ||
            parsedCalories < (nutritionRange.calories?.[1] ?? 200)
          ) {
            return false;
          }

          if (
            parsedProtein > (nutritionRange.protein?.[0] ?? 0) ||
            parsedProtein < (nutritionRange.protein?.[1] ?? 5)
          ) {
            return false;
          }

          if (
            parsedCarbs > (nutritionRange.carbs?.[0] ?? 0) ||
            parsedCarbs < (nutritionRange.carbs?.[1] ?? 40)
          ) {
            return false;
          }

          if (
            parsedFat > (nutritionRange.fat?.[0] ?? 0) ||
            parsedFat < (nutritionRange.fat?.[1] ?? 5)
          ) {
            return false;
          }
        }

        return hasMatchingVariant;
      });

      // Sort products
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return b.quantitySold - a.quantitySold;
          case "newest":
            return 0; // Assuming no date field in the sample data
          case "priceAsc":
            return (
              (a.variant[0].promotion?.price || a.variant[0].price) -
              (b.variant[0].promotion?.price || b.variant[0].price)
            );
          case "priceDesc":
            return (
              (b.variant[0].promotion?.price || b.variant[0].price) -
              (a.variant[0].promotion?.price || a.variant[0].price)
            );
          case "rating":
            return b.rating - a.rating;
          case "bestSelling":
            return b.quantitySold - a.quantitySold;
          default:
            return 0;
        }
      });

      setFilteredProducts(sorted);
    }, [filters, sortBy, isLoading, products]);

    const handleCategoryChange = (category: string) => {
      setFilters((prev: FilterTypes) => {
        const newCategories = prev.categories.includes(category)
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category];

        return { ...prev, categories: newCategories };
      });
    };

    const handlePackageTypeChange = useCallback(
      (packageType: string) => {
        setFilters((prev) => ({
          ...prev,
          packageTypes: prev.packageTypes.includes(packageType)
            ? prev.packageTypes.filter((p) => p !== packageType)
            : [...prev.packageTypes, packageType],
        }));
      },
      [setFilters]
    );

    const handleTagChange = useCallback(
      (tag: string) => {
        setFilters((prev) => {
          const newTags = prev.tags.includes(tag)
            ? prev.tags.filter((t) => t !== tag)
            : [...prev.tags, tag];

          return { ...prev, tags: newTags };
        });
      },
      [setFilters]
    );

    const handlePriceRangeChange = useCallback(
      (value: number[]) => {
        setFilters((prev) => ({ ...prev, priceRange: value }));
      },
      [setFilters]
    );

    const handleWeightRangeChange = useCallback(
      (value: number[]) => {
        setFilters((prev) => ({ ...prev, weightRange: value }));
      },
      [setFilters]
    );

    const handlePromotionChange = useCallback(
      (checked: boolean) => {
        setFilters((prev) => ({ ...prev, hasPromotion: checked }));
      },
      [setFilters]
    );

    const handleInStockChange = useCallback((checked: boolean) => {
      setFilters((prev) => ({ ...prev, inStock: checked }));
    }, []);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value.toString().toLowerCase());

        // setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
      },
      [setSearchQuery]
    );

    useEffect(() => {
      const timer = setTimeout(() => {
        setFilters((prev) => ({ ...prev, searchQuery }));
      }, 200);

      return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleNutritionRangeChange = (
      nutrient: keyof typeof filters.nutritionRange,
      // value: [number, number]
      value: number[]
    ) => {
      setFilters((prev) => ({
        ...prev,
        nutritionRange: {
          ...prev.nutritionRange,
          [nutrient]: value,
        },
      }));
    };

    const resetFilters = useCallback(() => {
      setFilters({
        categories: [],
        packageTypes: [],
        tags: [],
        colors: [],
        priceRange: [priceRange.min, priceRange.max],
        weightRange: [weightRange.min, weightRange.max],
        hasPromotion: false,
        inStock: false,
        searchQuery: "",
        nutritionRange: {
          calories: [0, 200],
          protein: [0, 5],
          carbs: [0, 40],
          fat: [0, 5],
        },
      });
    }, [setFilters, priceRange, weightRange]);

    const toggleWishlist = (productVariantId: string) => {
      setWishlist((prev: string[]) =>
        prev.includes(productVariantId)
          ? prev.filter((id: string) => id !== productVariantId)
          : [...prev, productVariantId]
      );
    };

    const toggleCompare = useCallback(
      (productVariantId: string) => {
        setCompareList((prev: string[]) =>
          prev.includes(productVariantId)
            ? prev.filter((id) => id !== productVariantId)
            : prev.length < 3
            ? [...prev, productVariantId]
            : prev
        );
      },
      [setCompareList]
    );

    const applySavedFilter = useCallback(
      (savedFilter: any) => {
        setFilters((prev) => ({
          ...prev,
          ...savedFilter.filters,
        }));
      },
      [setFilters]
    );

    const saveCurrentFilter = useCallback(() => {
      const newFilter = {
        id: Date.now(),
        name: `Filter ${savedFilters.length + 1}`,
        filters: {
          categories: filters.categories,
          packageTypes: filters.packageTypes,
          tags: filters.tags,
          colors: filters.colors,
          hasPromotion: filters.hasPromotion,
          inStock: filters.inStock,
        },
      };
      setSavedFilters((prev: any) => [...prev, newFilter]);
    }, [setSavedFilters]);

    const renderStarRating = (rating: number) => {
      return (
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3 w-3 ${
                star <= Math.round(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-slate-700">
            {rating.toFixed(1)}
          </span>
        </div>
      );
    };

    const renderProductSkeleton = () => (
      <div className={viewMode === "grid" ? "" : "col-span-full"}>
        <Card
          className={`overflow-hidden h-full flex ${
            viewMode === "grid" ? "flex-col" : "flex-row"
          }`}
        >
          <div
            className={`${
              viewMode === "grid" ? "aspect-square" : "w-1/4 min-w-[200px]"
            } bg-muted/30`}
          >
            <Skeleton className="h-full w-full" />
          </div>
          <div
            className={`flex flex-col ${viewMode === "grid" ? "" : "flex-1"}`}
          >
            <CardContent
              className={`flex-1 ${viewMode === "grid" ? "p-4" : "p-5"}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardContent>
            <CardFooter
              className={`${
                viewMode === "grid" ? "p-4 pt-0" : "p-5 pt-0"
              } flex items-center justify-between`}
            >
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-9 w-32 rounded-md" />
            </CardFooter>
          </div>
        </Card>
      </div>
    );

    const [tab, setTab] = useState("tab-1");

    return (
      // <div className="bg-white min-h-screen p-4">
      <SidebarProvider className="p-4 has-[[data-variant=inset]]:bg-white">
        <Sidebar
          className="hidden md:flex h-[calc(100vh-2rem)] sticky top-4 overflow-hidden  "
          variant="inset"
        >
          <FilterSidebar
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            activeFiltersCount={activeFiltersCount}
            resetFilters={resetFilters}
            saveCurrentFilter={saveCurrentFilter}
            applySavedFilter={applySavedFilter}
            savedFilters={savedFilters}
            popularFilters={popularFilters}
            handleTagChange={handleTagChange}
            handleCategoryChange={handleCategoryChange}
            handlePackageTypeChange={handlePackageTypeChange}
            handlePriceRangeChange={handlePriceRangeChange}
            weightRange={weightRange}
            handleWeightRangeChange={handleWeightRangeChange}
            handlePromotionChange={handlePromotionChange}
            handleInStockChange={handleInStockChange}
            handleNutritionRangeChange={handleNutritionRangeChange}
            toggleCompare={toggleCompare}
            compareList={compareList}
            recentlyViewed={recentlyViewed}
            products={products}
            filters={filters}
            tags={tags}
            priceRange={priceRange}
            packageTypes={packageTypes}
            categories={categories}
            filteredProducts={filteredProducts || []}
          />
        </Sidebar>

        <SidebarInset className="overflow-hidden bg-white cardStyle">
          <div className="space-y-6 w-full cardStyle">
            {/* Mobile Filter Button */}
            <div className="md:hidden sticky top-0 z-10  pb-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-slate-700/20"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4 text-slate-700" />
                  <span>Bộ lọc</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort and Results Count */}
            <div className="flex flex-col min-w-full sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg">
              <div>
                <h2 className="font-medium text-slate-700">
                  Lọc sản phẩm ({filteredProducts?.length})
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="text-sm text-slate-700">
                    Đang áp dụng {activeFiltersCount} bộ lọc
                  </span>
                )}
              </div>

              <Tabs
                defaultValue="tab-1"
                value={tab}
                onValueChange={setTab}
                className="flex items-center gap-4"
              >
                <TabsList
                  className="mx-auto flex max-w-xs bg-transparent transition-all"
                  // onChange={setTab}
                >
                  <TabsTrigger
                    value="tab-1"
                    className="group flex-1 flex-col p-3 text-xs data-[state=active]:bg-muted data-[state=active]:rounded-3xl data-[state=active]:border data-[state=active]:border-slate-500 data-[state=active]:shadow-none transition-all"
                  >
                    <Grid3X3
                      className="mb-1.5 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Tất cả sản phẩm
                  </TabsTrigger>
                  <TabsTrigger
                    value="tab-2"
                    className="group flex-1 flex-col p-3 text-xs data-[state=active]:bg-muted data-[state=active]:rounded-3xl data-[state=active]:border data-[state=active]:border-slate-500 data-[state=active]:shadow-none  transition-all"
                    // className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                  >
                    <Box
                      className="mb-1.5 opacity-60"
                      size={16}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Combo sản phẩm
                  </TabsTrigger>
                </TabsList>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Tabs>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.categories.length > 0 &&
                  filters.categories.map((category) => (
                    <AdvancedColorfulBadges
                      key={category}
                      color="violet"
                      className="flex items-center gap-1 rounded-3xl"
                    >
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleCategoryChange(category)}
                      />
                    </AdvancedColorfulBadges>
                  ))}
                {filters.packageTypes.length > 0 &&
                  filters.packageTypes.map((packageType) => (
                    <AdvancedColorfulBadges
                      key={packageType}
                      color="violet"
                      className="flex items-center gap-1 rounded-3xl"
                    >
                      {packageType}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handlePackageTypeChange(packageType)}
                      />
                    </AdvancedColorfulBadges>
                  ))}
                {filters.tags.length > 0 &&
                  filters.tags.map((tag) => (
                    <AdvancedColorfulBadges
                      key={tag}
                      color="violet"
                      className="flex items-center gap-1 rounded-3xl"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleTagChange(tag)}
                      />
                    </AdvancedColorfulBadges>
                  ))}
                {(filters.priceRange?.[0] > priceRange.min ||
                  filters.priceRange?.[1] < priceRange.max) && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Giá: {filters.priceRange?.[0].toLocaleString()}đ -{" "}
                    {filters.priceRange?.[1].toLocaleString()}đ
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [priceRange.min, priceRange.max],
                        }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}

                {(filters.weightRange?.[0] > weightRange.min ||
                  filters.weightRange?.[1] < weightRange.max) && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Trọng lượng: {filters.weightRange[0]} -{" "}
                    {filters.weightRange[1]}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          weightRange: [weightRange.min, weightRange.max],
                        }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}

                {(filters.nutritionRange?.calories?.[0] > 0 ||
                  filters.nutritionRange?.calories?.[1] < 200) && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Calories: {filters.nutritionRange?.calories?.[0]}kcal -{" "}
                    {filters.nutritionRange?.calories?.[1]}kcal
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          nutritionRange: {
                            ...(prev.nutritionRange || {}),
                            calories: [0, 200],
                          },
                        }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}

                {(filters?.nutritionRange?.protein?.[0] > 0 ||
                  filters?.nutritionRange?.protein?.[1] < 5) && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Protein: {filters.nutritionRange?.protein?.[0]}g -{" "}
                    {filters.nutritionRange?.protein?.[1]}g
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          nutritionRange: {
                            ...(prev.nutritionRange || {}),
                            protein: [0, 5],
                          },
                        }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}
                {(filters?.nutritionRange?.carbs?.[0] > 0 ||
                  filters?.nutritionRange?.carbs?.[1] < 40) && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Carbs: {filters?.nutritionRange?.carbs?.[0]}g -{" "}
                    {filters?.nutritionRange?.carbs?.[1]}g
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          nutritionRange: {
                            ...(prev.nutritionRange || {}),
                            carbs: [0, 40],
                          },
                        }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}

                {filters.hasPromotion && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Có khuyến mãi
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          hasPromotion: false,
                        }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}
                {filters.inStock && (
                  <AdvancedColorfulBadges
                    color="violet"
                    className="flex items-center gap-1 rounded-3xl"
                  >
                    Còn hàng
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, inStock: false }))
                      }
                    />
                  </AdvancedColorfulBadges>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-slate-700 hover:text-slate-80 transition duration-300"
                >
                  Xóa tất cả
                </Button>
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <div
                className={`grid grid-cols-1 w-full ${
                  viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""
                } gap-6`}
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    {renderProductSkeleton()}
                  </motion.div>
                ))}
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 rounded-lg">
                <div className=" p-4 rounded-full">
                  <Search className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-700">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <span className="mt-2 text-slate-700 text-center max-w-md">
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Hãy
                  thử điều chỉnh lại bộ lọc.
                </span>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={resetFilters}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            ) : tab === "tab-1" ? (
              <div
                className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 p-4 gap-4 `}
              >
                <AnimatePresence>
                  {filteredProducts?.map((product) => {
                    return product.variant.map((variantItem) => {
                      return (
                        <CardProduct
                          key={variantItem.productVariantId}
                          categories={product.categories}
                          description={product.description}
                          productId={product.id}
                          name={product.name}
                          mainImageUrl={
                            variantItem?.imageVariant || product.mainImageUrl
                          }
                          quantitySold={product.quantitySold}
                          rating={product.rating}
                          variant={variantItem}
                          type="single"
                        />
                      );
                    });
                  })}
                </AnimatePresence>
              </div>
            ) : combos.length ? (
              <div
                className={`w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 p-4 `}
              >
                {combos.map((combo) => {
                  return (
                    <ComboProductCard
                      key={combo.id}
                      product={{ ...combo, type: "combo" }}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icons={[StickyNote]}
                title="Chưa có Combo sản phẩm nào!"
                description="Có vẻ như chưa có  Combo sản phẩm nào hãy tải lại trang"
                className="min-w-full flex flex-col"
                action={{
                  label: "Tải lại",
                  onClick: () => comboRefetch(),
                }}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
);

ProductFilterSidebar.displayName = "ProductFilterSidebar";
