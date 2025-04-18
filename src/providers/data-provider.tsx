"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ProductKey } from "@/app/key/product-key";
import { ApiResponse, PageResult } from "@/types/types";
import { createContext, useContext } from "react";

import Cookies from "js-cookie";
import { cookies } from "next/headers";
import { CART_KEY } from "@/app/key/comm-key";
import { AddressTypes } from "@/types/address.types";
import { Product } from "@/hooks/use-cart-store";
import { UseQueryResult } from "@tanstack/react-query";
import { USER_KEY } from "@/app/key/user-key";
import { CustomComboProduct } from "@/components/global-components/card/custom-combo/card-combo-custom-item";

export type DataContextType = {
  products: UseQueryResult<ProductTransformType, Error>;

  addresses: UseQueryResult<ApiResponse<PageResult<AddressTypes>>, Error>;
  customCombo: UseQueryResult<ApiResponse<CustomComboProduct[]>, Error>;
};

export type ProductTransformType = Omit<PageResult<Product>, "items"> & {
  value: { items: Product[] };
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

  const products = useFetch<ProductTransformType>("/Products", [
    ProductKey.PRODUCTS,
  ]);

  // console.log(productList);

  const addresses = useFetch<ApiResponse<PageResult<AddressTypes>>>(
    "/Addresses",
    [USER_KEY.ADDRESS]
  );

  const customCombo = useFetch<ApiResponse<CustomComboProduct[]>>(
    "/Combos/user",
    [USER_KEY.CUSTOM_COMBO]
  );

  // console.log({ productList });
  // console.log({ carts });
  // if (isLoading) {
  //   return null;
  // }

  // console.log({ addressesDelivery });

  return (
    <DataContext.Provider
      value={{
        products,
        addresses,
        customCombo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
