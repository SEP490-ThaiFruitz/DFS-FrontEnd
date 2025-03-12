import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductVariant {
  productVariantId: string;
  netWeight: number;
  price: number;
  discountPrice?: number;
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

  quantity?: number;

  quantityOrder?: number;
}
interface State {
  orders: Product[];
  totalPrice: number;
  totalItems: number;
}

interface Actions {
  addOrder: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  decreaseQuantity: (product: Product) => void;
  clearCart: () => void;
}

const INITIAL_STATE: State = {
  orders: [],
  totalPrice: 0,
  totalItems: 0,
};

export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      orders: INITIAL_STATE.orders,
      totalPrice: INITIAL_STATE.totalPrice,
      totalItems: INITIAL_STATE.totalItems,
      clearCart: () => set({ orders: [], totalPrice: 0, totalItems: 0 }),
      addOrder: (product: Product) => {
        const cartOrders = get().orders;

        const cartOrdersItems = cartOrders.find(
          (order) => order.id === product.id
        );

        const discountPriceCondition = Number(product?.variant?.discountPrice!);

        if (cartOrdersItems) {
          const updatedCartOrders = cartOrders.map((cart) => {
            return cart.id === product.id
              ? { ...cart, quantityOrder: cart.quantityOrder! + 1 }
              : cart;
          });

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems + 1,
            totalPrice:
              state.totalPrice + discountPriceCondition ??
              Number(product.variant.price),
          }));
        } else {
          const updatedCartOrders = [
            ...cartOrders,
            { ...product, quantityOrder: 1 },
          ];

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems + 1,
            totalPrice:
              state.totalPrice + discountPriceCondition ??
              Number(product.variant.price),
          }));
        }
      },

      removeFromCart: (product: Product) => {
        const cartOrders = get().orders;
        const discountPriceCondition = Number(product?.variant.price!);

        set((state) => ({
          orders: state.orders.filter((order) => order.id !== product.id),
          totalItems: state.totalItems - 1,
          totalPrice:
            state.totalPrice - discountPriceCondition ??
            Number(product.variant.price),
        }));
      },

      decreaseQuantity: (product: Product) => {
        const cartOrders = get().orders;

        const cartOrderItems = cartOrders.find(
          (order) => order.id === product.id
        );

        const discountPriceCondition = Number(product?.variant.discountPrice!);

        if (cartOrderItems) {
          const updatedCartOrders = cartOrders.map((cart) =>
            cart.id === product.id
              ? { ...cart, quantityOrder: cart?.quantityOrder! - 1 }
              : cart
          );

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems - 1,
            totalPrice:
              state.totalPrice - discountPriceCondition ??
              product.variant.price,
          }));
        } else {
          const updatedCartOrders = cartOrders.filter(
            (order) => order.id !== product.id
          );

          set((state) => ({
            orders: updatedCartOrders,
            totalItems: state.totalItems - 1,
            totalPrice:
              state.totalPrice - discountPriceCondition ??
              product.variant.price,
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
