import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ProductVariant {
  productVariantId: string;
  netWeight: number;
  price: number;
  packageType: string;

  discountPrice?: number;
  stockQuantity: number;
  promotion?: Promotion | null;
}

export interface Promotion {
  startDate: string;
  endDate: string;
  percentage: number;
  price: number;
}

export interface CategoryTypes {
  id: string;
  name: string;
  thumbnail: string;
}

export interface Product {
  id: string;
  name: string;
  mainImageUrl: string;

  categories: CategoryTypes[];
  description: string;
  variant: ProductVariant[];

  tags?: string[];

  nutritionFacts?: Record<string, string | number>;
  // categoryId?: string;
  quantitySold: number;
  rating: number;

  quantity?: number;

  quantityOrder?: number;

  type?: "single" | "combo" | "custom";

  [key: string]: any;
}

// type Product = {
//   id: string;
//   name: string;
//   mainImageUrl: string;
//   description: string;
//   categories: {
//     id: string;
//     name: string;
//     thumbnail: string;
//   }[];
//   variant: {
//     productVariantId: string;
//     packageType: string;
//     netWeight: number;
//     price: number;
//     stockQuantity: number;
//     promotion: string | null;
//   };
//   rating: number;
//   quantitySold: number;
// };
interface State {
  orders: CartData[];
  totalPrice: number;
  totalItems: number;
}

interface Actions {
  addOrder: (product: CartData) => void;
  removeFromCart: (product: CartData) => void;
  decreaseQuantity: (product: CartData) => void;
  clearCart: () => void;
}

const INITIAL_STATE: State = {
  orders: [],
  totalPrice: 0,
  totalItems: 0,
};

export type CartData = {
  id: string;
  name: string;
  mainImageUrl: string;
  description: string;
  categories: {
    id: string;
    name: string;
    thumbnail: string;
  }[];
  variant: ProductVariant;
  quantitySold: number;
  rating: number;

  type: string; // combo | single | custom

  quantityOrder?: number;
};

export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      orders: INITIAL_STATE.orders,
      totalPrice: INITIAL_STATE.totalPrice,
      totalItems: INITIAL_STATE.totalItems,
      clearCart: () => set({ orders: [], totalPrice: 0, totalItems: 0 }),
      addOrder: (product: CartData) => {
        const cartOrders = get().orders;

        const cartOrdersItems = cartOrders.find(
          (order) =>
            order.variant.productVariantId === product.variant.productVariantId
        );

        const discountPriceCondition = Number(
          product.variant?.promotion?.price
        );

        if (cartOrdersItems) {
          const updatedCartOrders = cartOrders.map((cart) => {
            return cart.variant.productVariantId ===
              product.variant.productVariantId
              ? { ...cart, quantityOrder: cart.quantityOrder! + 1 }
              : cart;
          });

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems + 1,
            // totalPrice:
            //   state.totalPrice + discountPriceCondition ??
            //   Number(product.variant.price),
            totalPrice:
              state.totalPrice +
              (discountPriceCondition || Number(product.variant.price)),
          }));
        } else {
          const updatedCartOrders = [
            ...cartOrders,
            { ...product, quantityOrder: 1 },
          ];

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems + 1,
            // totalPrice:
            //   state.totalPrice + discountPriceCondition ??
            //   Number(product.variant.price),
            totalPrice:
              state.totalPrice +
              (discountPriceCondition || Number(product.variant.price)),
          }));
        }
      },

      removeFromCart: (product: CartData) => {
        const cartOrders = get().orders;
        const discountPriceCondition = Number(
          product?.variant?.promotion?.price
        );

        set((state) => ({
          orders: state.orders.filter(
            (order) =>
              order.variant.productVariantId !==
              product.variant.productVariantId
          ),
          totalItems: state.totalItems - 1,
          totalPrice:
            state.totalPrice -
            (discountPriceCondition || Number(product.variant.price)),
        }));
      },

      decreaseQuantity: (product: CartData) => {
        const cartOrders = get().orders;

        const cartOrderItems = cartOrders.find(
          (order) =>
            order.variant.productVariantId === product.variant.productVariantId
        );

        const discountPriceCondition = Number(
          product.variant?.promotion?.price
        );

        if (cartOrderItems) {
          const updatedCartOrders = cartOrders.map((cart) =>
            cart.variant.productVariantId === product.variant.productVariantId
              ? { ...cart, quantityOrder: (cart?.quantityOrder as number) - 1 }
              : cart
          );

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems - 1,
            totalPrice:
              state.totalPrice -
              (discountPriceCondition || Number(product.variant.price)),
          }));
        } else {
          const updatedCartOrders = cartOrders.filter(
            (order) => order.id !== product.id
          );

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems - 1,
            totalPrice:
              state.totalPrice -
              (discountPriceCondition || Number(product.variant.price)),
          }));
        }
      },
    }),
    {
      name: "thai-fruiz-cart",
      version: 1,
      migrate: (persistedState: any, version) => {
        // console.log({persistedState, version});
        if (version === 0) {
          persistedState.totalProducts = persistedState.totalItems;

          delete persistedState.totalItems;
        }

        return persistedState as State & Actions;
      },
    }
  )
);
