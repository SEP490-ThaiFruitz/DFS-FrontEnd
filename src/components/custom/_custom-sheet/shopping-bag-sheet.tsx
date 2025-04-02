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
import { CartData, Product, useCartStore } from "@/hooks/use-cart-store";

import { AnimatePresence, motion } from "framer-motion";

//

export const ShoppingBagSheet = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const token = Cookies.get("accessToken");

  // console.log({ token });

  // const {
  //   isLoading,
  //   isFetching,
  //   data: productCart,
  //   error,
  // } = useFetch<{ value: { items: CartProductTypes[] } }>("/Carts/", [
  //   CART_KEY.CARTS,
  // ]);

  const cart = useFromStore(useCartStore, (state) => state.orders);

  const cartCondition = (cart?.length || 0) > 0;

  let total = 0;

  if (cart) {
    total = cart.reduce(
      (acc, product) =>
        acc +
        (Number(product?.variant.discountPrice) > 0
          ? Number(product?.variant.discountPrice) *
            (product.quantityOrder as number)
          : Number(product.variant.discountPrice) *
            (product.quantityOrder as number)),
      0
    );
  }

  const increaseQuantity = useCartStore((state) => state.addOrder);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const handleDecreaseQuantity = (product: CartData) => {
    if (product.quantityOrder! > 1) {
      decreaseQuantity(product);
    }
  };

  const close = () => {
    setIsOpen(false);
  };

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

      <SheetContent className="min-w-full md:min-w-[600px] lg:min-w-[50%] rounded-2xl mr-2">
        <SheetHeader>
          <SheetTitle>
            <div className="text-center">
              <Logo height={100} width={100} />
            </div>
          </SheetTitle>
          <SheetDescription className="text-center text-sm text-slate-500">
            Cảm ơn bạn đã ghé thăm cửa hàng của chúng tôi. Hãy cùng khám phá
            những sản phẩm tuyệt vời mà chúng tôi đã chuẩn bị cho bạn!
          </SheetDescription>
        </SheetHeader>

        <div>
          <div className="w-full overflow-hidden">
            {cart?.length ? (
              <div className="container mx-auto p-4 md:p-6 w-full">
                <>
                  <h1 className="text-2xl font-semibold">
                    Giỏ hàng ({cart?.length})
                  </h1>
                  <ScrollArea className="w-full h-[200px] md:h-[250px] lg:h-[400px]">
                    {cart?.map((product) => (
                      <ViewCardProductActions
                        key={product.variant.productVariantId}
                        // cartItemId=
                        decreaseQuantity={(): void =>
                          handleDecreaseQuantity(product)
                        }
                        increaseQuantity={(): void => increaseQuantity(product)}
                        removeFromCart={(): void => removeFromCart(product)}
                        product={product}
                        className="m-4"
                      />
                    ))}
                  </ScrollArea>

                  <div className=" mt-14 w-full">
                    <CartSummary cart={cart as CartData[]} close={close} />
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
            )}
          </div>
        </div>
        {/* </SheetHeader> */}

        {/* <div className="flex items-center justify-center">
          <div className="flex justify-center">
            <div>Add some items</div>
          </div>
        </div> */}
      </SheetContent>
    </Sheet>
  );
};
