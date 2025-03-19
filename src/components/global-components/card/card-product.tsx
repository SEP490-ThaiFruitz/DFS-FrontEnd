"use client";

import StatusButton from "@/components/custom/_custom-button/status-button";
import { formatNumberWithUnit, formatVND } from "@/lib/format-currency";
import { truncate } from "lodash";
import Image from "next/image";
import { AdvancedColorfulBadges } from "../badge/advanced-badge";

import { toast } from "sonner";

import { Product, useCartStore } from "@/hooks/use-cart-store";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export const CardProduct = ({ ...props }: Product) => {
  const addOrder = useCartStore((state) => state.addOrder);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    toast.success("Thêm sản phẩm vào giỏ hàng thành công");

    addOrder(product);
  };

  let variant = props.variant;

  return (
    <CardContainer
      className="inter-var cursor-pointer w-96 lg:w-[450px] motion-preset-pop hover:shadow-xl flex items-center justify-center hover:scale-105  rounded-3xl transition duration-300
    "
      containerClassName="py-0"
    >
      <CardBody className="relative bg-slate-50/80 border-slate-500 rounded-3xl group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[30rem] h-auto p-6 border transition duration-300">
        {variant.discountPrice && (
          <AdvancedColorfulBadges
            className="absolute top-0 right-0 z-50"
            color="blush"
            size="lg"
          >
            {variant.discountPrice}% OFF
          </AdvancedColorfulBadges>
        )}

        {/* <AdvancedColorfulBadges
          className="absolute top-0 right-0 z-50"
          color="blush"
          size="lg"
        >
          1% OFF
        </AdvancedColorfulBadges> */}

        {/* <CardBody className="relative bg-gray-50 group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto max-h-[350px] rounded-xl p-6 border transition duration-300"> */}
        <CardItem
          translateY={6}
          translateZ={6}
          // className="flex items-center justify-center"
          className="z-10 w-full"
        >
          <Image
            // src="/images/third-background.png"
            src={props.mainImageUrl}
            alt={`Image of ${name}`}
            height="1000"
            width="1000"
            className="h-60 w-full object-cover rounded-xl z-40  group-hover/card:scale-105  cursor-pointer transition duration-300"
          />
        </CardItem>

        <CardItem
          translateX={10}
          translateY={10}
          className="text-violet-700/75 text-lg font-semibold mt-2 dark:text-neutral-300 h-12 w-full"
          as="h1"
        >
          {truncate(props.name, { length: 60 })}
        </CardItem>

        <CardItem
          translateX={10}
          translateY={15}
          className="text-neutral-500 mt-2 h-14 dark:text-neutral-300"
          as="h1"
        >
          {truncate(props.description, { length: 80 })}
        </CardItem>

        <div className="flex items-center justify-between w-full">
          <CardItem
            translateY={10}
            translateZ={20}
            className="flex items-center gap-x-2 w-full"
          >
            <CardItem translateY={10} translateZ={10} as="del">
              {formatVND(variant?.discountPrice ?? 0)}
            </CardItem>
            <CardItem
              translateY={10}
              translateZ={10}
              as="h2"
              className="text-lg font-bold text-sky-500/70 group-hover/card:text-xl 2xl:group-hover/card:text-2xl transition-all duration-150"
            >
              {formatVND(variant.price)}
            </CardItem>
          </CardItem>

          <CardItem translateY={10} translateZ={10} as="h4">
            {/* <StatusButton handleAddToCart={() => {}} /> */}
            <StatusButton
              // handleAddToCart={() => {
              //   cartActions.addToCart({
              //     itemType: "single",
              //     referenceId: variant.productVariantId,
              //     quantity: 1,
              //   });
              //   queryClient.invalidateQueries({ queryKey: [CART_KEY.CARTS] });
              // }}
              handleAddToCart={(e) =>
                addOrder({
                  // id,
                  // name,
                  // mainImageUrl,
                  // variant,
                  // rating,
                  // quantitySold,
                  ...props,
                })
              }
            />
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};
