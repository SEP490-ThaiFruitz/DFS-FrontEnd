"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { FormValues } from "@/components/global-components/form/form-values";
import { CardProduct } from "@/components/global-components/card/card-product";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import AnimatedLoadingSkeleton from "@/components/global-components/custom-skeleton/animated-loading-skeleton";
import { getFavoriteProducts } from "@/actions/favorite";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, Favorite, PageResult } from "@/types/types";

const FormSchema = z.object({
  categories: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one category.",
  }),
  priceRange: z.array(z.number()).default([0, 1000000]),
  minRating: z.number().min(0).max(5).default(0),
});

const categories = [
  { id: "dried-fruit", label: "Dried Fruit" },
  { id: "nuts", label: "Nuts" },
  { id: "snacks", label: "Snacks" },
  { id: "other", label: "Other" },
] as const;

interface ProductVariant {
  productVariantId: string;
  netWeight: number;
  price: number;
  stockQuantity: number;
  promotion?: Promotion;
}

interface Promotion {
  startDate: string;
  endDate: string;
  percentage: number;
}

export interface Product {
  id: string;
  name: string;
  mainImageUrl: string;
  variant: ProductVariant;
  categoryId?: string;
  quantitySold: number;
  rating: number;
}

export function SidebarFilter() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories: ["dried-fruit"],
      priceRange: [0, 1000000],
      minRating: 0,
    },
  });

  const { data: products, isLoading: isLoadingProducts } = useFetch<ApiResponse<PageResult<Product>>>(
    "/Products",
    ["products"]
  );
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await getFavoriteProducts();
      if (!res?.isSuccess) throw new Error("Error fetching favorites");
      const data: ApiResponse<PageResult<Favorite>> = res.data;
      return data.value?.items || [];
    },
  });

  const isLoading = isLoadingProducts || isLoadingFavorites;


  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast.success("Filters applied: " + JSON.stringify(data));
  };

  return (
    <div className="flex flex-col lg:flex-row p-4 gap-20">
      {/* Mobile Filter Toggle */}
      <Button
        className="lg:hidden mb-4"
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
      >
        {isMobileFiltersOpen ? "Hide Filters" : "Show Filters"}
      </Button>

      {/* Sidebar/Filters */}
      <div className={`
        w-full md:w-64 
        ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}
        md:sticky md:top-4 
        h-fit md:h-full
      `}>
        <FormValues form={form} classNameForm="space-y-6" onSubmit={onSubmit}>
          {/* Categories */}
          <FormField
            control={form.control}
            name="categories"
            render={() => (
              <FormItem>
                <FormLabel className="text-base">Categories</FormLabel>
                <FormDescription>Select product categories</FormDescription>
                {categories.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, item.id]
                                : field.value?.filter((value) => value !== item.id);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">{item.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price Range */}
          <FormField
            control={form.control}
            name="priceRange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price Range (VND)</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={1000000}
                    step={10000}
                    value={field.value}
                    onValueChange={field.onChange}
                    className="mt-2"
                  />
                </FormControl>
                <FormDescription>
                  {field.value[0].toLocaleString()} - {field.value[1].toLocaleString()}
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Minimum Rating */}
          <FormField
            control={form.control}
            name="minRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Rating</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="mt-2"
                  />
                </FormControl>
                <FormDescription>{field.value} stars & up</FormDescription>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">Apply Filters</Button>
        </FormValues>
      </div>

      {/* Product Grid */}
      {!isLoading ? <>
        {(products?.value?.items?.length ?? 0) > 0 ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-10">
            {products?.value?.items?.map((product: Product) => (
              <CardProduct
                key={product.id}
                isFavorite={
                  Array.isArray(favorites)
                    ? !!favorites.find(x => x.productId === product.id)
                    : false
                }
                {...product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">No products match your filters</div>
        )}
      </> : (
        <AnimatedLoadingSkeleton className="w-full" />
      )}
    </div>
  );
}