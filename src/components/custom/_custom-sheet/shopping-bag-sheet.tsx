"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { CartSummary } from "@/components/global-components/card/card-summary";
import {
  // CartItem,
  ViewCardProductActions,
  ViewCardProductActionsSkeleton,
} from "@/components/global-components/card/view-card-product-actions";
import { EmptyState } from "@/components/global-components/empty-state";
import { Logo } from "@/components/global-components/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartProductTypes } from "@/types/cart.types";
import { ShoppingBagIcon, ShoppingBasket, ShoppingCart } from "lucide-react";
import React, { useState } from "react";

import Cookies from "js-cookie";
import { CART_KEY } from "@/app/key/comm-key";
import { useFromStore } from "@/hooks/use-from-store";
import { Product, useCartStore } from "@/hooks/use-cart-store";

import { AnimatePresence, motion } from "framer-motion";

//

interface Cart {
  cartItemId: string;
  productId: string;
  name: string;
  productVariant: {
    productVariantId: string;
    image: string;
    weight: number;
    type: string;
    unitPrice: number;
    stock: number;
    discount: {
      startDate: string;
      endDate: string;
      percentage: number;
    };
  };
  quantity: string;
}

export const ShoppingBagSheet = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const token = Cookies.get("accessToken");

  // console.log({ token });

  const {
    isLoading,
    isFetching,
    data: productCart,
    error,
  } = useFetch<{ value: { items: CartProductTypes[] } }>("/Carts/", [
    CART_KEY.CARTS,
  ]);

  const cart = useFromStore(useCartStore, (state) => state.orders);

  const cartCondition = cart?.length! > 0;

  // console.log({ isLoading, isFetching });

  // console.log(productCart);

  let total = 0;

  if (cart) {
    total = cart.reduce(
      (acc, product) =>
        acc +
        (Number(product?.variant.discountPrice!) > 0
          ? Number(product?.variant.discountPrice) *
            (product.quantityOrder as number)
          : Number(product.variant.discountPrice) *
            (product.quantityOrder as number)),
      0
    );
  }

  // console.log(cart);

  const increaseQuantity = useCartStore((state) => state.addOrder);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const handleDecreaseQuantity = (product: Product) => {
    if (product.quantityOrder! > 1) {
      decreaseQuantity(product);
    }
  };

  // const discountPriceCondition = Number(product.variant) > 0;
  // const discountPercentageToNumber = Number(product?.discountPercentage);
  // const discountPriceToNumber = Number(product?.discountPrice);
  // const MAX_LENGTH = 10;

  // const [items, setItems] = useState<CartItem[]>(
  //   products.map((product) => ({
  //     ...product,
  //     quantity: 1,
  //   }))
  // );

  // const handleQuantityChange = (id: string, quantity: number) => {
  //   setItems(
  //     items.map((item) => (item.id === id ? { ...item, quantity } : item))
  //   );
  // };

  // const handleRemove = (id: string) => {
  //   setItems(items.filter((item) => item.id !== id));
  // };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative inline-flex text-sm h-11 w-10 tracking-tight items-center justify-center text-neutral-800 dark:text-neutral-300 before:absolute before:inset-0  before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px] cursor-pointer">
          <div className="relative">
            <ShoppingBagIcon className="size-4 mr-1 relative" />
            <span
              className="
            absolute
            -top-2.5
            -right-2.5
            w-4
            h-4
            bg-primary-500
            text-slate-900
            rounded-full
            flex items-center justify-center
            "
            >
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={cart?.length} // Cập nhật animation mỗi khi cart.length thay đổi
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="font-semibold"
                >
                  {cart?.length}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </div>
      </SheetTrigger>

      <SheetContent className="min-w-full md:min-w-[600px] lg:min-w-[50%] rounded-2xl">
        <SheetHeader>
          <SheetTitle>
            <div className="text-center">
              <Logo />
            </div>
          </SheetTitle>
          <SheetDescription>
            <div className="w-full overflow-hidden">
              {!isLoading || !isFetching ? (
                cart?.length ? (
                  <div className="container mx-auto p-4 md:p-6 w-full">
                    <>
                      <h1 className="text-2xl font-semibold">
                        Giỏ hàng ({cart?.length})
                      </h1>
                      <ScrollArea className="w-full h-[200px] md:h-[250px] lg:h-[400px] ">
                        {cart.map((product) => (
                          <ViewCardProductActions
                            key={product.id}
                            // cartItemId=
                            decreaseQuantity={(): void =>
                              handleDecreaseQuantity(product)
                            }
                            increaseQuantity={(): void =>
                              increaseQuantity(product)
                            }
                            removeFromCart={(): void => removeFromCart(product)}
                            product={product}
                            className="m-4"
                          />
                        ))}
                      </ScrollArea>

                      <div className=" mt-14 w-full">
                        <CartSummary cart={cart} />
                      </div>
                    </>
                  </div>
                ) : (
                  <EmptyState
                    icons={[ShoppingCart, ShoppingBagIcon, ShoppingBasket]}
                    title="Giỏ hàng của bạn"
                    description="Có vẻ như giỏ hàng của bạn đang trống"
                    action={{
                      label: "Mua ngay nào",
                      onClick: () => setIsOpen(false),
                    }}
                    className="min-w-full flex flex-col"
                  />
                )
              ) : (
                Array.from({ length: 3 }).map((_, index) => {
                  return (
                    <ViewCardProductActionsSkeleton
                      key={index}
                      className="m-4"
                    />
                  );
                })
              )}
            </div>
          </SheetDescription>
        </SheetHeader>

        {/* <div className="flex items-center justify-center">
          <div className="flex justify-center">
            <div>Add some items</div>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
};
