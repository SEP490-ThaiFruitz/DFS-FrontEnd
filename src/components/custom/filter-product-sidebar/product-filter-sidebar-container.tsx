"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import ProductSkeletonWithSidebar from "@/components/global-components/custom-skeleton/side-bar-skeleton";
import { EmptyState } from "@/components/global-components/empty-state";
import { Product } from "@/hooks/use-cart-store";
import { ApiResponse, PageResult } from "@/types/types";
import { StickyNote } from "lucide-react";
import { ProductFilterSidebar } from "./product-filter-sidebar";
import { COMBO_KEY } from "@/app/key/comm-key";
import { ComboProduct } from "@/components/global-components/card/card-combo";

export const ProductFilterSidebarContainer = () => {
  const {
    data: products,
    isLoading,
    refetch,
  } = useFetch<ApiResponse<PageResult<Product>>>("/Products", ["products"]);
  const {
    data: combos,
    isLoading: isComboLoading,
    refetch: comboRefetch,
  } = useFetch<ApiResponse<PageResult<ComboProduct>>>("/Combos", [
    COMBO_KEY.COMBOS,
  ]);

  if (isLoading || isComboLoading) {
    return <ProductSkeletonWithSidebar />;
  }

  if (products?.value?.items.length === 0) {
    return (
      <EmptyState
        icons={[StickyNote]}
        title="Chưa có sản phẩm"
        description="Có vẻ như chưa có sản phảm nào hãy tải lại trang"
        className="min-w-full flex flex-col"
        action={{
          label: "Tải lại",
          onClick: () => refetch(),
        }}
      />
    );
  }

  const safeProducts: Product[] = products?.value?.items ?? [];

  const safeCombos: ComboProduct[] = combos?.value?.items ?? [];

  return (
    <div className="p-4">
      <ProductFilterSidebar
        products={safeProducts as Product[]}
        combos={safeCombos}
        comboRefetch={comboRefetch}
      />
    </div>
  );

  // products.
};
