"use client";

import { useFetch } from "@/actions/tanstack/use-tanstack-actions";
import { CartSummary } from "@/components/global-components/card/card-summary";
import {
  CartItem,
  Product,
  ViewCardProductActions,
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
import { ShoppingBagIcon, ShoppingBasket, ShoppingCart } from "lucide-react";
import React, { useState } from "react";

export const products: Product[] = [
  {
    id: "1",
    name: "Áo Thun Unisex Cotton Form Rộng",
    price: 199000,
    originalPrice: 299000,
    image: "/images/forth-background.png",
    variant: {
      color: "Trắng",
      size: "L",
    },
    stock: 50,
  },
  {
    id: "2",
    name: "Quần Jean Nam Ống Suông Form Regular",
    price: 450000,
    originalPrice: 599000,
    image: "/images/forth-background.png",

    variant: {
      size: "32",
    },
    stock: 20,
  },
  {
    id: "3",
    name: "Giày Sneaker Unisex Classic",
    price: 850000,
    originalPrice: 1200000,
    image: "/images/forth-background.png",

    variant: {
      color: "Đen",
      size: "42",
    },
    stock: 15,
  },
];

export const ShoppingBagSheet = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { isLoading, data, error } = useFetch("Carts/", ["carts"]);

  // console.log({ data });

  const [items, setItems] = useState<CartItem[]>(
    products.map((product) => ({
      ...product,
      quantity: 1,
    }))
  );

  const handleQuantityChange = (id: string, quantity: number) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
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
              0
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
            <div className="w-full">
              <div className="container mx-auto p-4 md:p-6">
                <h1 className="text-2xl font-semibold">
                  Giỏ hàng ({items.length})
                </h1>
                <ScrollArea className="w-full h-[500px]">
                  {items.map((item) => (
                    <ViewCardProductActions
                      key={item.id}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      className="m-4"
                    />
                  ))}
                </ScrollArea>

                <div className=" mt-14 w-full">
                  <CartSummary items={items} />
                </div>
              </div>

              {/* <div className="flex items-center justify-center h-full pt-10">
                <EmptyState
                  icons={[ShoppingCart, ShoppingBagIcon, ShoppingBasket]}
                  title="Giỏ hàng của bạn"
                  description="Có vẻ như giỏ hàng của bạn đang trống"
                  action={{
                    label: "Mua ngay nào",
                    onClick: () => setIsOpen(false),
                  }}
                />
              </div> */}

              {/* <ViewCardProductActions
                productImage="/images/second-background.png"
                productName="test"
                productPrice={12}
                productQuantity={1}
                className="123"
              /> */}
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
