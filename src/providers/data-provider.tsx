"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { ProductKey } from "@/app/key/product-key";
import { ApiResponse, PageResult } from "@/types/types";
import { createContext, useContext } from "react";

import Cookies from "js-cookie";
import { BLOG_KEY, COMBO_KEY } from "@/app/key/comm-key";
import { AddressTypes } from "@/types/address.types";
import { Product } from "@/hooks/use-cart-store";
import { UseQueryResult } from "@tanstack/react-query";
import { USER_KEY } from "@/app/key/user-key";
import { CustomComboProduct } from "@/components/global-components/card/custom-combo/card-combo-custom-item";
import { BlogPost } from "@/types/blogs.types";
import { DiscountRulesTypes } from "@/components/global-components/card/custom-combo/combo-discount-info";
import { ComboProduct } from "@/components/global-components/card/card-combo";

export type DataContextType = {
  products: UseQueryResult<ApiResponse<PageResult<Product>>, Error>;

  addresses: UseQueryResult<ApiResponse<PageResult<AddressTypes>>, Error>;
  customCombo: UseQueryResult<ApiResponse<CustomComboProduct[]>, Error>;

  blogs: UseQueryResult<ApiResponse<PageResult<BlogPost>>, Error>;

  discountRules: UseQueryResult<ApiResponse<DiscountRulesTypes[]>, Error>;

  combos: UseQueryResult<ApiResponse<PageResult<ComboProduct>>, Error>;
};

// export type ProductTransformType = Omit<PageResult<Product>, "items"> & {
//   value: { items: Product[] };
// };

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

  const products = useFetch<ApiResponse<PageResult<Product>>>("/Products", [
    ProductKey.PRODUCTS,
  ]);
  const blogs = useFetch<ApiResponse<PageResult<BlogPost>>>("/Blogs", [
    BLOG_KEY.BLOGS,
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

  const combos = useFetch<ApiResponse<PageResult<ComboProduct>>>("/Combos", [
    COMBO_KEY.COMBOS,
  ]);

  const discountRules = useFetch<ApiResponse<DiscountRulesTypes[]>>(
    "/Settings/setting-anonymous",
    [USER_KEY.DISCOUNT_RULES]
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
        blogs,
        discountRules,
        combos,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
