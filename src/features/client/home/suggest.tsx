"use client";
import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ApiResponse, Favorite, PageResult } from "@/types/types";
import React from "react";
import { CardProduct } from "@/components/global-components/card/card-product";
import { Product } from "@/hooks/use-cart-store";

interface SuggestProps {
  favorites: Favorite[] | undefined;
}

const Suggest = ({ favorites }: Readonly<SuggestProps>) => {
  const { data: products, isLoading: isLoadingProducts } = useFetch<
    ApiResponse<PageResult<Product>>
  >("/Products", ["products"]);

  console.log({ products });
  return (
    <div className="p-10 sm:p-20">
      <div className="font-bold text-2xl mb-5">Sản phẩm đề xuất</div>
      <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-10">
        {/* {products?.value?.items?.slice(0, 6).map((product: Product) => (
          <CardProduct />
        ))} */}
      </div>
    </div>
  );
};

export default Suggest;
