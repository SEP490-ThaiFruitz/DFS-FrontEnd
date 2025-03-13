"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ProductKey } from "@/app/key/product-key";
import { ApiResponse, PageResult } from "@/types/types";
import { createContext, useContext } from "react";

import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { CART_KEY } from "@/app/key/comm-key";
import { AddressTypes } from "@/types/address.types";

export type DataContextType = {
  productList: ProductTransformType | undefined;

  addressData: {
    isAddressPending: boolean;
    addresses: AddressTypes[] | undefined;
  };
};

export interface ProductTypes {
  id: string;
  name: string;
  description: string;
  origin: string;
  mainImageUrl: string;

  productVariantSummaryResponse: {
    productVariantId: string;
    sku: string;
    netWeight: number;
    price: number;
    discountPrice: number | null;
    stockQuantity: number;
  };
}

export type ProductTransformType = Omit<PageResult<ProductTypes>, "items"> & {
  value: { items: ProductTypes[] };
};

export const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within an DataProvider");
  }
  return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  // const { token } = useAuth();

  const cookieToken = Cookies.get("accessToken");

  const {
    isLoading,
    data: productList,
    error,
    isError,
  } = useFetch<ProductTransformType>("/Products", [ProductKey.PRODUCTS]);

  const {
    isLoading: isLoadingCart,
    data: carts,
    error: errorCart,
    isError: isErrorCart,
  } = useFetch<ProductTransformType>("/Carts", [CART_KEY.CARTS]);

  const {
    isLoading: isAddressLoading,
    data: addressesDelivery,
    error: errorAddress,
    isError: isErrorAddress,
  } = useFetch<ApiResponse<PageResult<AddressTypes>>>("/Addresses", [
    "address",
  ]);

  // console.log({ productList });
  // console.log({ carts });
  // if (isLoading) {
  //   return null;
  // }

  // console.log({ addressesDelivery });

  return (
    <DataContext.Provider
      value={{
        productList,
        addressData: {
          isAddressPending: isAddressLoading,
          addresses: addressesDelivery?.value?.items! || [],
        },
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
