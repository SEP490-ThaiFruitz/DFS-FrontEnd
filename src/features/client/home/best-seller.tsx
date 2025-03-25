"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiResponse, Favorite, PageResult } from "@/types/types";
import React from "react";
import { CardProduct } from "@/components/global-components/card/card-product";
import { Product, useCartStore } from "@/hooks/use-cart-store";
import { toast } from "sonner";
import { EmptyState } from "@/components/global-components/empty-state";
import { ShoppingCart, StickyNote } from "lucide-react";
import AnimatedLoadingSkeleton from "@/components/global-components/custom-skeleton/animated-loading-skeleton";

interface BestSellterProps {
  favorites: Favorite[] | undefined;
}

const BestSellter = ({ favorites }: Readonly<BestSellterProps>) => {
  const { data: products, isLoading } = useFetch<
    ApiResponse<PageResult<Product>>
  >("/Products", ["products"]);

  const addOrder = useCartStore((state) => state.addOrder);

  // const handleAddToCart = (e: React.MouseEvent, product: Product) => {
  //   e.stopPropagation();
  //   toast.success("Thêm sản phẩm vào giỏ hàng thành công");

  //   addOrder(product);
  // };

  return (
    <div className="p-10 sm:p-20">
      <div className="font-bold text-2xl mb-5">Danh sách sản phẩm bán chạy</div>

      {!isLoading ? (
        products?.value?.items?.length ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-10">
            {products?.value?.items?.map((product: Product) => {
              const variant = product.variant;

              return product.variant.map((variantItem) => {
                return (
                  <CardProduct
                    key={variantItem.productVariantId}
                    productId={product.id}
                    description={product.description}
                    name={product.name}
                    mainImageUrl={product.mainImageUrl}
                    quantitySold={product.quantitySold}
                    categories={product.categories}
                    rating={product.rating}
                    variant={variantItem}
                  />
                );
              });
            })}
          </div>
        ) : (
          <EmptyState
            icons={[StickyNote]}
            title="Chưa có sản phẩm"
            description="Có vẻ như chưa có sản phảm nào hãy tải lại trang"
            className="min-w-full flex flex-col"
          />
        )
      ) : (
        <AnimatedLoadingSkeleton className="min-w-full" />
      )}
    </div>
  );
};

export default BestSellter;
