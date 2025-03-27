"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import ProductSkeletonWithSidebar from "@/components/global-components/custom-skeleton/side-bar-skeleton";
import { EmptyState } from "@/components/global-components/empty-state";
import { Product } from "@/hooks/use-cart-store";
import { ApiResponse, PageResult } from "@/types/types";
import { StickyNote } from "lucide-react";
import { ProductFilterSidebar } from "./product-filter-sidebar";

export const ProductFilterSidebarContainer = () => {
  const { data: products, isLoading } = useFetch<
    ApiResponse<PageResult<Product>>
  >("/Products", ["products"]);

  if (isLoading) {
    return <ProductSkeletonWithSidebar />;
  }

  if (products?.value?.items.length === 0) {
    return (
      <EmptyState
        icons={[StickyNote]}
        title="Chưa có sản phẩm"
        description="Có vẻ như chưa có sản phảm nào hãy tải lại trang"
        className="min-w-full flex flex-col"
      />
    );
  }

  const safeProducts: Product[] = products?.value?.items ?? [];

  return (
    <div>
      <ProductFilterSidebar products={safeProducts as Product[]} />
    </div>
  );

  // products.
};
