"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  BookmarkPlus,
  ChevronDown,
  ChevronRight,
  Eye,
  Filter,
  Grid3X3,
  Heart,
  LayoutList,
  Mic,
  Moon,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  X,
  CircleCheck,
  Tag,
  Palette,
  Package,
  DollarSign,
  Weight,
  Apple,
  Settings,
  Percent,
  CheckCircle,
  History,
  HelpCircle,
  MessageCircle,
  Sun,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import {
  CategoryTypes,
  Product,
  ProductVariant,
  Promotion,
} from "@/hooks/use-cart-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CardProduct,
  CardProductProps,
} from "@/components/global-components/card/card-product";
import ProductPage from "@/app/(admin)/admin/product/page";
import { formatVND } from "@/lib/format-currency";
import { Logo } from "@/components/global-components/logo";
import FilterSidebar from "./filter-sidebar";
import { toLowerCaseNonAccentVietnamese } from "@/utils/non-accent";

// Sample data from the provided JSON
const products: Product[] = [
  {
    id: "0852ee33-dd35-4d70-b4aa-8b95249e17c9",
    name: "Việt quất sấy",
    mainImageUrl:
      "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1013%20Dried%20Blueberri-rJ2FbX6b-medium.jpg",
    description: "Việt quất sấy khô, giàu chất dinh dưỡng và thơm ngon.",
    categories: [
      {
        id: "9d3c7f1e-6b2a-49a8-9f7e-8d2c5b3f7e2a",
        name: "Việt quất sấy",
        thumbnail:
          "https://nuts.com/images/auto/228x152fill/assets/77894c411a1003e8.jpg",
      },
    ],
    variant: [
      {
        productVariantId: "5fe709ab-489a-4031-b890-ea4d8caf71d9",
        packageType: "Bao gói đơn giản cho trái cây sấy ăn liền",
        netWeight: 16,
        price: 17000,
        stockQuantity: 40,
        promotion: {
          startDate: "2025-03-24T17:00:00+00:00",
          endDate: "2025-04-05T16:59:59.999999+00:00",
          percentage: 50,
          price: 8500,
        },
      },
      {
        productVariantId: "652ade05-15d4-47f7-aadc-7d6b2ed77fc6",
        packageType: "Túi hút chân không cho trái cây sấy số lượng lớn",
        netWeight: 95,
        price: 13000,
        stockQuantity: 22,
        promotion: {
          startDate: "2025-03-24T17:00:00+00:00",
          endDate: "2025-04-05T16:59:59.999999+00:00",
          percentage: 50,
          price: 6500,
        },
      },
    ],
    rating: 4.5,
    quantitySold: 120,

    tags: ["Organic", "Superfood", "High Antioxidants"],
    nutritionFacts: {
      calories: 140,
      protein: 1.5,
      carbs: 33,
      fat: 0.5,
    },
  },
  {
    id: "0d7b2ed4-c4fb-4405-a64e-c60ad014e337",
    name: "Dâu tây sấy",
    mainImageUrl:
      "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1601%20Freeze-Dried%20St-dtpWnCzl-medium.jpg",
    description: "Dâu tây sấy khô, chua ngọt và giàu chất chống oxy hóa.",
    categories: [
      {
        id: "5b7a9c2d-3e8f-49a6-9f7e-1d2c3b7e2a5f",
        name: "Dâu tây sấy",
        thumbnail:
          "https://nuts.com/images/auto/228x152fill/assets/d41ddae774335f0c.jpg",
      },
    ],
    variant: [
      {
        productVariantId: "6d064bb4-7066-4b08-b927-5c23e05d5a3c",
        packageType: "Lon thiếc trái cây sấy khô bảo quản lâu",
        netWeight: 15,
        price: 16000,
        stockQuantity: 90,
        promotion: {
          startDate: "2025-03-24T17:00:00+00:00",
          endDate: "2025-04-05T16:59:59.999999+00:00",
          percentage: 50,
          price: 8000,
        },
      },
    ],
    rating: 4.8,
    quantitySold: 250,

    tags: ["No Added Sugar", "Vitamin C", "Freeze-Dried"],
    colors: ["red"],
    nutritionFacts: {
      calories: 120,
      protein: 1,
      carbs: 28,
      fat: 0.3,
    },
  },
  {
    id: "0f49d10d-2b07-4fdf-8f2b-4d58def6c3a3",
    name: "Dưa sấy",
    mainImageUrl:
      "https://nuts.com/images/rackcdn/ed910ae2d60f0d25bcb8-80550f96b5feb12604f4f720bfefb46d.ssl.cf1.rackcdn.com/38e178e7f2d03e60-zQZ7LPfZ-medium.jpg",
    description: "Dưa sấy khô, ngọt và thơm tự nhiên.",
    categories: [
      {
        id: "1d2c3b7e-4a5f-49a6-9f7e-8d2b9a7e2c5f",
        name: "Trái cây hỗn hợp",
        thumbnail:
          "https://nuts.com/images/auto/228x152fill/assets/ae16c735a6a560b8.jpg",
      },
    ],
    variant: [
      {
        productVariantId: "0a426dba-d093-4328-b7f9-ffedbd87832e",
        packageType: "Vỉ nhựa đựng trái cây sấy dẻo dạng viên",
        netWeight: 14,
        price: 15000,
        stockQuantity: 77,
        promotion: {
          startDate: "2025-03-24T17:00:00+00:00",
          endDate: "2025-04-05T16:59:59.999999+00:00",
          percentage: 50,
          price: 7500,
        },
      },
    ],
    rating: 4.2,
    quantitySold: 180,

    tags: ["Sweet", "Kids Favorite", "Chewy"],
    colors: ["green"],
    nutritionFacts: {
      calories: 150,
      protein: 0.5,
      carbs: 38,
      fat: 0.1,
    },
  },
  {
    id: "1eb8fd3f-0c65-49d5-8e44-ea4535f3a87b",
    name: "Nho khô",
    mainImageUrl:
      "https://nuts.com/images/ct/images.cdn.us-central1.gcp.commercetools.com/fe6ef66f-361c-4adb-b11f-d4aa8f13c79c/1512_OrganicRaisins_-_XhBXhsi-medium.jpg",
    description: "Nho khô ngọt dịu, thích hợp làm món ăn vặt.",
    categories: [
      {
        id: "4a5c3b7e-2f8d-49a6-9f7e-1d2b9a7e2c5f",
        name: "Nho khô",
        thumbnail:
          "https://nuts.com/images/auto/228x152fill/assets/1a32a457e3a247aa.jpg",
      },
    ],
    variant: [
      {
        productVariantId: "01c27ae5-2af6-4514-91dc-ded50377b351",
        packageType: "Túi đứng zipper cho trái cây sấy khô cao cấp",
        netWeight: 12,
        price: 14500,
        stockQuantity: 78,
        promotion: null,
      },
    ],
    rating: 4.7,
    quantitySold: 320,

    tags: ["Natural", "No Preservatives", "Iron Rich"],
    colors: ["purple"],
    nutritionFacts: {
      calories: 130,
      protein: 1.2,
      carbs: 31,
      fat: 0.2,
    },
  },
];

// Extract unique categories, package types, etc. from the data
const extractUniqueValues = () => {
  const categories = new Set<string>();
  const packageTypes = new Set<string>();
  const tags = new Set<string>();
  const colors = new Set();
  let minPrice = Number.POSITIVE_INFINITY;
  let maxPrice = 0;
  let minWeight = Number.POSITIVE_INFINITY;
  let maxWeight = 0;

  products.forEach((product) => {
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

const { categories, packageTypes, tags, colors, priceRange, weightRange } =
  extractUniqueValues();

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

export function ProductFilterSidebar() {
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
      // calories: [0, 200],
      protein: [0, 5],
      carbs: [0, 40],
      fat: [0, 5],
    },
  });

  const [sortBy, setSortBy] = useState("popular");
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState<Product[] | []>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [wishlist, setWishlist] = useState<string[] | []>([]);
  const [compareList, setCompareList] = useState<string[] | []>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [recentlyViewed, setRecentlyViewed] = useState<CardProductProps[] | []>(
    []
  );
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
  }, []);

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
    setActiveFiltersCount(count);
  }, [filters]);

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

      // Filter by colors
      if (filters.colors.length > 0) {
        if (
          !product.colors ||
          !filters.colors.some((color) => product.colors.includes(color))
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

      // Filter by nutrition facts
      // if (product.nutritionFacts) {
      //   const {
      //     calories = 0,
      //     protein = 0,
      //     carbs = 0,
      //     fat = 0,
      //   } = product.nutritionFacts;
      //   const { nutritionRange } = filters;

      //   if (
      //     calories < nutritionRange.calories[0] ||
      //     calories > nutritionRange.calories[1]
      //   ) {
      //     return false;
      //   }

      //   if (
      //     protein < nutritionRange.protein[0] ||
      //     protein > nutritionRange.protein[1]
      //   ) {
      //     return false;
      //   }

      //   if (
      //     carbs < nutritionRange.carbs[0] ||
      //     carbs > nutritionRange.carbs[1]
      //   ) {
      //     return false;
      //   }

      //   if (fat < nutritionRange.fat[0] || fat > nutritionRange.fat[1]) {
      //     return false;
      //   }
      // }

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

        const { nutritionRange } = filters;

        if (
          parsedCalories < nutritionRange.calories?.[0] ||
          parsedCalories > nutritionRange.calories?.[1]
        ) {
          return false;
        }

        if (
          parsedProtein < nutritionRange.protein?.[0] ||
          parsedProtein > nutritionRange.protein?.[1]
        ) {
          return false;
        }

        if (
          parsedCarbs < nutritionRange.carbs?.[0] ||
          parsedCarbs > nutritionRange.carbs?.[1]
        ) {
          return false;
        }

        if (
          parsedFat < nutritionRange.fat?.[0] ||
          parsedFat > nutritionRange.fat?.[1]
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
  }, [filters, sortBy, isLoading]);

  // Toggle dark mode
  // React.useEffect(() => {
  //   if (isDarkMode) {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [isDarkMode]);

  const handleCategoryChange = (category: string) => {
    setFilters((prev: FilterTypes) => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category];

      return { ...prev, categories: newCategories };
    });
  };

  // const handleCategoryChange = (category: CategoryTypes) => {
  //   setSelectedCategories(
  //     (prev) =>
  //       prev.some((c) => c.name === category.name)
  //         ? prev.filter((c) => c.name !== category.name) // Loại bỏ nếu đã tồn tại
  //         : [...prev, category] // Thêm mới nếu chưa tồn tại
  //   );

  //   setFilters((prev) => ({
  //     ...prev,
  //     categories: prev.categories.includes(category.name)
  //       ? prev.categories.filter((c) => c !== category.name)
  //       : [...prev.categories, category.name],
  //   }));
  // };

  // const handlePackageTypeChange = (packageType: string) => {
  //   setFilters((prev) => {
  //     const newPackageTypes = prev.packageTypes.includes(packageType)
  //       ? prev.packageTypes.filter((p) => p !== packageType)
  //       : [...prev.packageTypes, packageType];

  //     return { ...prev, packageTypes: newPackageTypes };
  //   });
  // };

  console.log(filteredProducts);

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
  }, []);

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

  // const viewProduct = (
  //   variant: ProductVariant,
  //   productId: string,
  //   description: string,
  //   name: string,
  //   mainImageUrl: string,
  //   quantitySold: number,
  //   rating: number,
  //   categories: CategoryTypes[]
  // ) => {
  //   setQuickViewProduct({
  //     variant,
  //     productId,
  //     description,
  //     name,
  //     mainImageUrl,
  //     quantitySold,
  //     rating,
  //     categories,
  //   });
  //   if (!recentlyViewed.includes(variant.productVariantId)) {
  //     setRecentlyViewed((prev: CardProductProps[]) =>
  //       [variant.productVariantId, ...prev].slice(0, 4)
  //     );
  //   }
  // };

  // const viewProduct = (
  //   // variant: ProductVariant,
  //   // productId: string,
  //   // description: string,
  //   // name: string,
  //   // mainImageUrl: string,
  //   // quantitySold: number,
  //   // rating: number,
  //   // categories: CategoryTypes[]
  //   product: Product
  // ) => {
  //   // Set quick view product
  //   // setQuickViewProduct({
  //   //   variant,
  //   //   productId,
  //   //   description,
  //   //   name,
  //   //   mainImageUrl,
  //   //   quantitySold,
  //   //   rating,
  //   //   categories,
  //   // });

  //   setQuickViewProduct(product);

  //   // Check if the product is already in recently viewed
  //   if (!recentlyViewed.some((item) => item.productId === productId)) {
  //     const newRecentlyViewedItem: CardProductProps = {
  //       variant,
  //       productId,
  //       description,
  //       name,
  //       mainImageUrl,
  //       quantitySold,
  //       rating,
  //       categories,
  //     };

  //     // Update recently viewed list
  //     setRecentlyViewed((prev: CardProductProps[]) =>
  //       [newRecentlyViewedItem, ...prev].slice(0, 4)
  //     );
  //   }
  // };

  const viewProduct = (product: Product, selectedVariantIndex: number = 0) => {
    const {
      variant,
      id,
      description,
      name,
      mainImageUrl,
      quantitySold,
      rating,
      categories,
    } = product;

    // Chọn variant cụ thể dựa trên index
    const selectedVariant = variant[selectedVariantIndex];

    if (!selectedVariant) {
      console.error("Không tìm thấy variant cho sản phẩm này.");
      return;
    }

    // Set quick view product
    setQuickViewProduct(product);

    // Check if the product is already in recently viewed
    if (!recentlyViewed.some((item) => item.productId === id)) {
      const newRecentlyViewedItem: CardProductProps = {
        variant: selectedVariant,
        productId: id,
        description,
        name,
        mainImageUrl,
        quantitySold,
        rating,
        categories,
      };

      // Update recently viewed list
      setRecentlyViewed((prev: CardProductProps[]) =>
        [newRecentlyViewedItem, ...prev].slice(0, 4)
      );
    }
  };

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
        <span className="ml-1 text-xs text-slate-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // const renderColorSwatch = (color: string) => {
  //   return (
  //     <div
  //       className={`w-6 h-6 rounded-full ${
  //         colorMap[color] || "bg-gray-500"
  //       } cursor-pointer
  //         ${
  //           filters.colors.includes(color)
  //             ? "ring-2 ring-primary ring-offset-2"
  //             : "ring-1 ring-border"
  //         }`}
  //     />
  //   );
  // };

  const FilterSidebar1 = () => (
    <ScrollArea className="h-full">
      <SidebarHeader>
        <div className="sticky top-0 z-10">
          <div className="">
            <Logo height={50} width={50} />

            <div className="relative ">
              <Search className=" left-3 top-2.5 h-4 w-4 text-slate-800" />
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                className="pl-9 pr-10 h-10 border-primary/20 focus-visible:ring-primary bg-background/80 backdrop-blur-sm"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-0">
        {/* Enhanced Header with Brand */}

        {/* Filter Summary */}
        <div className=" px-5 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full  flex items-center justify-center">
                <Filter className="h-3.5 w-3.5 text-slate-700" />
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
                className="h-8 px-2 text-primary hover:text-primary"
              >
                <X className="mr-1 h-3 w-3" />
                Xóa
              </Button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-2.5 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>Sản phẩm phù hợp:</span>
                <span className="font-medium text-foreground">
                  {filteredProducts.length}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full overflow-hidden">
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

        {/* Saved Filters with Enhanced UI */}
        <div className="px-5 py-3.5  ">
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
              className="h-7 px-2.5 text-xs bg-background/80"
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
                <div className="flex items-center justify-center w-full h-full text-xs text-slate-700 italic">
                  Lưu bộ lọc để truy cập nhanh
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Popular Filters with Enhanced UI */}
        <div className="px-5 py-3.5">
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
                    ? "bg-primary/10 border-primary/30"
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

        {/* Categories with Enhanced UI */}
        <Collapsible
          defaultOpen
          className="border-b border-border/40 transition-all duration-300 ease-in-out"
        >
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                  <CircleCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm">Danh mục</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-slate-700 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
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

        {/* Tags with Enhanced UI */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm">
                  <Tag className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm">Tags</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-slate-700  group-data-[state=open]:rotate-180 transition-transform duration-200" />
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

        {/* Package Types with Enhanced UI */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shadow-sm">
                  <Package className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-sm">Loại đóng gói</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-slate-700 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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

        {/* Price Range with Enhanced UI */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-sm">
                  <DollarSign className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm">Khoảng giá</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-slate-700 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
                    <div className="rounded-md border border-input px-3 py-1 text-sm ">
                      {filters.priceRange[0].toLocaleString()}đ
                    </div>
                    <div className="text-sm text-slate-700">-</div>
                    <div className="rounded-md border border-input px-3 py-1 text-sm bg-background">
                      {filters.priceRange[1].toLocaleString()}đ
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Weight Range with Enhanced UI */}
        <Collapsible defaultOpen className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center shadow-sm">
                  <Weight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <span className="text-sm">Trọng lượng</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-slate-700 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
                    <div className="rounded-md border border-input px-3 py-1 text-sm bg-background">
                      {filters.weightRange[0]}g
                    </div>
                    <div className="text-sm text-slate-700">-</div>
                    <div className="rounded-md border border-input px-3 py-1 text-sm bg-background">
                      {filters.weightRange[1]}g
                    </div>
                  </div>
                </div>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Nutrition Facts with Enhanced UI */}
        <Collapsible className="border-b border-border/40">
          <SidebarGroup className="py-0">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-3.5 hover:bg-muted/50 group transition-colors duration-200 ease-in-out">
              <SidebarGroupLabel className="flex-1 text-left font-medium flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center shadow-sm">
                  <Apple className="h-3.5 w-3.5 text-lime-600 dark:text-lime-400" />
                </div>
                <span className="text-sm">Dinh dưỡng</span>
              </SidebarGroupLabel>
              <ChevronDown className="h-4 w-4 text-slate-700 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="animate-accordion-down">
              <SidebarGroupContent className="px-4 py-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs">Calories</Label>
                      <span className="text-xs text-slate-700">
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
                      <span className="text-xs text-slate-700">
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
                      <span className="text-xs text-slate-700">
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

        {/* Other Filters with Enhanced UI */}
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
                      className="flex items-center gap-2 p-2 rounded-md bg-background/50 border border-border/30"
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/30">
                        <Image
                          src={product.mainImageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate">
                          {product.name}
                        </h5>
                        <p className="text-xs text-slate-700">
                          {(
                            product.variant[0].promotion?.price ||
                            product.variant[0].price
                          ).toLocaleString()}
                          đ
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-700 hover:text-destructive"
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

        {/* Recently Viewed with Enhanced UI */}
        {recentlyViewed.length > 0 && (
          <div className="border-b border-border/40 py-3">
            <h4 className="px-4 font-medium mb-2 flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-primary" />
              Đã xem gần đây
            </h4>
            <ScrollArea className="h-[120px]">
              <div className="px-4 space-y-2">
                {recentlyViewed.map((product) => {
                  const productFind = products.find(
                    (p) => p.id === product.productId
                  );
                  if (!product) return null;

                  return (
                    <div
                      key={product.variant.productVariantId}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                      // onClick={() =>
                      //   viewProduct(
                      //     product.variant,
                      //     product.productId,
                      //     product.description,
                      //     product.name,
                      //     product.mainImageUrl,
                      //     product.quantitySold,
                      //     product.rating,
                      //     product.categories
                      //   )
                      // }
                    >
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted/30">
                        <Image
                          src={product.mainImageUrl || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-medium truncate">
                          {product.name}
                        </h5>
                        <span className="text-xs text-slate-700">
                          {formatVND(
                            product.variant.promotion?.price ||
                              product.variant.price
                          )}
                          đ
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
        <div className={`flex flex-col ${viewMode === "grid" ? "" : "flex-1"}`}>
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

  return (
    <div className="bg-white min-h-screen p-4">
      <SidebarProvider className="bg-white">
        {/* <div className="mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Trái cây sấy khô</h1>
            <span className="text-slate-700 mt-1">
              Trái cây sấy khô tự nhiên, giàu dinh dưỡng và thơm ngon
            </span>
          </div> */}

        {/* <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6"> */}
        {/* <div className="flex flex-row"> */}
        {/* Desktop Sidebar */}
        <Sidebar
          className="hidden md:flex h-[calc(100vh-2rem)] sticky top-4   shadow-sidebar overflow-hidden "
          variant="inset"
        >
          {/* <FilterSidebar1 /> */}

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
            filteredProducts={filteredProducts}
            // viewProduct={viewProduct}
          />
        </Sidebar>

        <SidebarInset className="overflow-hidden">
          <div className="space-y-6 w-full">
            {/* Mobile Filter Button */}
            <div className="md:hidden sticky top-0 z-10  pb-4">
              <Button
                variant="outline"
                className="w-full flex items-center justify-between border-primary/20"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <div className="flex items-center">
                  <SlidersHorizontal className="mr-2 h-4 w-4 text-primary" />
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
                  Lọc sản phẩm ({filteredProducts.length})
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="text-sm text-slate-700">
                    Đang áp dụng {activeFiltersCount} bộ lọc
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center border rounded-md p-1 ">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setViewMode("list")}
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
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
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.categories.length > 0 &&
                  filters.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="flex items-center gap-1 "
                    >
                      {category}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleCategoryChange(category)}
                      />
                    </Badge>
                  ))}
                {filters.packageTypes.length > 0 &&
                  filters.packageTypes.map((packageType) => (
                    <Badge
                      key={packageType}
                      variant="outline"
                      className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
                    >
                      {packageType}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handlePackageTypeChange(packageType)}
                      />
                    </Badge>
                  ))}
                {filters.tags.length > 0 &&
                  filters.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
                    >
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleTagChange(tag)}
                      />
                    </Badge>
                  ))}
                {(filters.priceRange[0] > priceRange.min ||
                  filters.priceRange[1] < priceRange.max) && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
                  >
                    Giá: {filters.priceRange[0].toLocaleString()}đ -{" "}
                    {filters.priceRange[1].toLocaleString()}đ
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [priceRange.min, priceRange.max],
                        }))
                      }
                    />
                  </Badge>
                )}
                {filters.hasPromotion && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
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
                  </Badge>
                )}
                {filters.inStock && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-primary/5 hover:bg-primary/10"
                  >
                    Còn hàng
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, inStock: false }))
                      }
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-primary hover:text-primary hover:bg-primary/5"
                >
                  Xóa tất cả
                </Button>
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <div
                className={`grid grid-cols-1 ${
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
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-muted/20 rounded-lg">
                <div className="bg-muted/30 p-4 rounded-full">
                  <Search className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-slate-700">
                  Không tìm thấy sản phẩm phù hợp
                </h3>
                <p className="mt-2 text-slate-700 text-center max-w-md">
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Hãy
                  thử điều chỉnh lại bộ lọc.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={resetFilters}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 ${
                  viewMode === "grid"
                    ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    : ""
                } gap-6`}
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => {
                    return product.variant.map((variantItem) => {
                      return (
                        <CardProduct
                          key={variantItem.productVariantId}
                          categories={product.categories}
                          description={product.description}
                          productId={product.id}
                          name={product.name}
                          mainImageUrl={product.mainImageUrl}
                          quantitySold={product.quantitySold}
                          rating={product.rating}
                          variant={variantItem}
                        />
                      );
                    });
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </SidebarInset>
        {/* </div> */}
        {/* </div> */}

        {/* Mobile Filter Sidebar */}
        {/* <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 right-0 w-[90%] max-w-[320px] z-50  md:hidden flex flex-col shadow-sidebar"
              >
                <div className="flex items-center justify-between border-b px-5 py-3.5">
                  <h2 className="font-semibold flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <Filter className="h-4 w-4 text-primary" />
                    </div>
                    <span>Bộ lọc</span>
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-auto">
                  <FilterSidebar />
                </div>
                <div className="border-t p-4">
                  <Button
                    className="w-full h-10 shadow-sm"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Xem {filteredProducts.length} sản phẩm
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence> */}
      </SidebarProvider>
    </div>
  );
}
