"use client";

import { CarouselCustomized } from "@/components/custom/carousel-customized";
import { CardProduct } from "@/components/global-components/card/card-product";
import AnimatedLoadingSkeleton from "@/components/global-components/custom-skeleton/animated-loading-skeleton";
import ProductSkeletonWithSidebar from "@/components/global-components/custom-skeleton/side-bar-skeleton";
import { EmptyState } from "@/components/global-components/empty-state";
import { CarouselItem } from "@/components/ui/carousel";
import { useData } from "@/providers/data-provider";
import { Star, StickyNote } from "lucide-react";
import { memo } from "react";

export const RelatedProduct = memo(() => {
  const { products } = useData();

  if (products.data?.value?.items.length === 0) {
    return (
      <EmptyState
        icons={[StickyNote]}
        title="Chưa có sản phẩm"
        description="Có vẻ như chưa có sản phảm nào hãy tải lại trang"
        className="min-w-full flex flex-col"
        action={{
          label: "Tải lại",
          onClick: () => products.refetch(),
        }}
      />
    );
  }

  const safeProducts = products?.data?.value?.items ?? [];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 p-6 lg:p-8 cardStyle w-full">
      <CarouselCustomized
        title="Sản phẩm liên quan"
        delay={3000}
        stopOnInteraction
      >
        {!products.isLoading ? (
          safeProducts.map((product) => {
            return product.variant.map((variantItem) => {
              return (
                <CarouselItem
                  key={variantItem.productVariantId}
                  className="md:basis-1/2 lg:basis-1/3 pl-4"
                >
                  <CardProduct
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
                </CarouselItem>
              );
            });
          })
        ) : (
          <AnimatedLoadingSkeleton className="w-full" />
        )}
      </CarouselCustomized>
    </div>
  );
});

RelatedProduct.displayName = "RelatedProduct";
